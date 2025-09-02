---
title: Pipeline-level Error Handling
description: Learn how to implement pipeline-level error handling in NPipeline using IPipelineErrorHandler to manage errors that affect entire node streams.
sidebar_position: 6
---

# Pipeline-level Error Handling

Pipeline-level error handling in NPipeline is designed to manage errors that affect an entire node's stream rather than individual items. These are typically more severe errors that might impact the entire pipeline execution flow, such as infrastructure failures or external service outages.

## Overview

When an error occurs that affects an entire node's stream (e.g., an external service going down), NPipeline's `ResilientExecutionStrategy` consults the configured `IPipelineErrorHandler` to determine how to react to such failures. This allows you to implement strategies like restarting a failing node, continuing without it, or failing the entire pipeline.

## IPipelineErrorHandler Interface

For errors that affect an entire node's stream, you implement [`IPipelineErrorHandler`](../../../src/NPipeline/Abstractions/ErrorHandling/IPipelineErrorHandler.cs) interface.

```csharp
public interface IPipelineErrorHandler
{
    Task<PipelineErrorDecision> HandleNodeFailureAsync(
        string nodeId,
        Exception error,
        PipelineContext context,
        CancellationToken cancellationToken);
}
```

## PipelineErrorDecision

This enum defines the decision when a node stream fails:

* **`RestartNode`**: The node's entire input stream will be re-processed from the beginning (requires the input stream to be replayable, e.g., if materialized by `ResilientExecutionStrategy`).
* **`ContinueWithoutNode`**: The failing node is effectively removed from the pipeline, and its output stream will be empty. The pipeline continues without it.
* **`FailPipeline`**: The entire pipeline execution terminates.

## Implementing a Custom Pipeline Error Handler

```csharp
using NPipeline;
using NPipeline.ErrorHandling;
using NPipeline.Pipeline;

public sealed class MyPipelineErrorHandler : IPipelineErrorHandler
{
    private readonly ILogger _logger;
    private readonly Dictionary<string, int> _nodeRestartAttempts = new();

    public MyPipelineErrorHandler(ILogger logger)
    {
        _logger = logger;
    }

    public Task<PipelineErrorDecision> HandleNodeFailureAsync(
        string nodeId,
        Exception error,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        _nodeRestartAttempts.TryGetValue(nodeId, out var attempts);
        attempts++;
        _nodeRestartAttempts[nodeId] = attempts;

        _logger.LogError(error, "Pipeline-level error in node '{NodeId}': {ErrorMessage}",
            nodeId, error.Message);

        // Example logic:
        // - Allow a few restarts for transient node failures.
        // - If persistent, fail the pipeline.
        if (attempts < 3)
        {
            _logger.LogInformation("Attempting to restart node '{NodeId}'. Attempt: {Attempt}",
                nodeId, attempts);
            return Task.FromResult(PipelineErrorDecision.RestartNode);
        }
        else
        {
            _logger.LogError("Node '{NodeId}' failed too many times, failing pipeline.", nodeId);
            return Task.FromResult(PipelineErrorDecision.FailPipeline);
        }
    }
}
```

## Registering a Pipeline Error Handler

You register a pipeline error handler using the `AddPipelineErrorHandler` method on `PipelineBuilder`:

```csharp
using NPipeline;
using NPipeline.ErrorHandling;
using NPipeline.Pipeline;

public sealed class ErrorHandlingPipelineDefinition : IPipelineDefinition
{
    public void Define(PipelineBuilder builder, PipelineContext context)
    {
        var sourceHandle = builder.AddSource<DataSource, string>();
        var transformHandle = builder.AddTransform<DataTransform, string, string>();
        var sinkHandle = builder.AddSink<DataSink, string>();

        builder.Connect(sourceHandle, transformHandle);
        builder.Connect(transformHandle, sinkHandle);

        // Configure retry options
        builder.WithRetryOptions(new PipelineRetryOptions(
            MaxItemRetries: 3,
            MaxNodeRestartAttempts: 2,
            MaxSequentialNodeAttempts: 5
        ));

        // Register the pipeline error handler
        builder.AddPipelineErrorHandler<MyPipelineErrorHandler>();
    }
}

public static class Program
{
    public static async Task Main(string[] args)
    {
        var runner = new PipelineRunner();

        // Configure retry options at context level
        var retryOptions = new PipelineRetryOptions(
            MaxItemRetries: 3,
            MaxNodeRestartAttempts: 2,
            MaxSequentialNodeAttempts: 5
        );

        var context = new PipelineContextBuilder()
            .WithRetryOptions(retryOptions)
            .Build();

        var pipeline = PipelineBuilder.Create<ErrorHandlingPipelineDefinition>();

        await runner.RunAsync<ErrorHandlingPipelineDefinition>(context);
    }
}
```

You also need to register your custom error handler with your DI container:

```csharp
services.AddSingleton<IPipelineErrorHandler, MyPipelineErrorHandler>();
```

## Common Pipeline Error Handling Scenarios

### Scenario 1: Resource Exhaustion Handling

```csharp
public class ResourceExhaustionHandler : IPipelineErrorHandler
{
    private readonly ILogger _logger;
    private readonly Dictionary<string, int> _nodeFailureCounts = new();

    public ResourceExhaustionHandler(ILogger logger)
    {
        _logger = logger;
    }

    public Task<PipelineErrorDecision> HandleNodeFailureAsync(
        string nodeId,
        Exception error,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        _nodeFailureCounts.TryGetValue(nodeId, out var count);
        _nodeFailureCounts[nodeId] = count + 1;

        if (error is OutOfMemoryException or InsufficientMemoryException)
        {
            _logger.LogCritical("Resource exhaustion in node '{NodeId}': {Error}", nodeId, error.Message);
            return Task.FromResult(PipelineErrorDecision.FailPipeline);
        }

        // For other errors, allow up to 3 restarts per node
        if (_nodeFailureCounts[nodeId] <= 3)
        {
            _logger.LogWarning("Restarting node '{NodeId}' (attempt {Attempt})", nodeId, _nodeFailureCounts[nodeId]);
            return Task.FromResult(PipelineErrorDecision.RestartNode);
        }

        _logger.LogError("Node '{NodeId}' failed too many times, continuing without it", nodeId);
        return Task.FromResult(PipelineErrorDecision.ContinueWithoutNode);
    }
}
```

### Scenario 2: External Service Dependency Handling

```csharp
public class ExternalServiceErrorHandler : IPipelineErrorHandler
{
    private readonly ILogger _logger;
    private readonly Dictionary<string, DateTime> _lastFailureTime = new();
    private readonly Dictionary<string, int> _failureCounts = new();

    public ExternalServiceErrorHandler(ILogger logger)
    {
        _logger = logger;
    }

    public Task<PipelineErrorDecision> HandleNodeFailureAsync(
        string nodeId,
        Exception error,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        _failureCounts.TryGetValue(nodeId, out var count);
        _failureCounts[nodeId] = count + 1;

        var now = DateTime.UtcNow;
        _lastFailureTime.TryGetValue(nodeId, out var lastFailure);

        // If the same node failed recently, it might be a persistent issue
        if (lastFailure != null && (now - lastFailure).TotalMinutes < 5)
        {
            _logger.LogWarning("Node '{NodeId}' failed again recently ({Minutes} minutes ago). Total failures: {Count}",
                nodeId, (now - lastFailure).TotalMinutes, _failureCounts[nodeId]);

            // After multiple recent failures, continue without the node
            if (_failureCounts[nodeId] >= 3)
            {
                _logger.LogError("Node '{NodeId}' has failed multiple times recently, continuing without it", nodeId);
                return Task.FromResult(PipelineErrorDecision.ContinueWithoutNode);
            }
        }

        _lastFailureTime[nodeId] = now;

        // For external service errors, try restarting the node
        if (error is HttpRequestException or TimeoutException)
        {
            _logger.LogWarning("External service error in node '{NodeId}': {Error}. Restarting node.", nodeId, error.Message);
            return Task.FromResult(PipelineErrorDecision.RestartNode);
        }

        // For other types of errors, fail the pipeline
        _logger.LogError("Unexpected error in node '{NodeId}': {Error}. Failing pipeline.", nodeId, error.Message);
        return Task.FromResult(PipelineErrorDecision.FailPipeline);
    }
}
```

### Scenario 3: Circuit Breaker Pattern Implementation

```csharp
public class CircuitBreakerErrorHandler : IPipelineErrorHandler
{
    private readonly ILogger _logger;
    private readonly Dictionary<string, CircuitBreakerState> _circuitBreakers = new();
    private readonly TimeSpan _openDuration = TimeSpan.FromMinutes(5);
    private readonly int _failureThreshold = 5;

    private class CircuitBreakerState
    {
        public int FailureCount { get; set; }
        public DateTime? LastFailureTime { get; set; }
        public bool IsOpen { get; set; }
    }

    public CircuitBreakerErrorHandler(ILogger logger)
    {
        _logger = logger;
    }

    public Task<PipelineErrorDecision> HandleNodeFailureAsync(
        string nodeId,
        Exception error,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        if (!_circuitBreakers.TryGetValue(nodeId, out var state))
        {
            state = new CircuitBreakerState();
            _circuitBreakers[nodeId] = state;
        }

        state.FailureCount++;
        state.LastFailureTime = DateTime.UtcNow;

        // If circuit is open, check if it should be half-open
        if (state.IsOpen)
        {
            var timeSinceOpen = DateTime.UtcNow - state.LastFailureTime.Value;
            if (timeSinceOpen > _openDuration)
            {
                state.IsOpen = false;
                state.FailureCount = 0;
                _logger.LogInformation("Circuit breaker for node '{NodeId}' is now half-open", nodeId);
            }
            else
            {
                _logger.LogWarning("Circuit breaker for node '{NodeId}' is open. Failing pipeline.", nodeId);
                return Task.FromResult(PipelineErrorDecision.FailPipeline);
            }
        }

        // Check if failure threshold is reached
        if (state.FailureCount >= _failureThreshold)
        {
            state.IsOpen = true;
            _logger.LogError("Circuit breaker for node '{NodeId}' opened after {FailureCount} failures", nodeId, state.FailureCount);
            return Task.FromResult(PipelineErrorDecision.FailPipeline);
        }

        // For normal failures, restart the node
        _logger.LogWarning("Node '{NodeId}' failed (attempt {FailureCount}/{Threshold}). Restarting node.",
            nodeId, state.FailureCount, _failureThreshold);
        return Task.FromResult(PipelineErrorDecision.RestartNode);
    }
}
```

## Production-Ready Pipeline Error Handler

Here's a comprehensive example that combines multiple strategies:

```csharp
using NPipeline;
using NPipeline.ErrorHandling;
using NPipeline.Pipeline;

public class ProductionPipelineErrorHandler : IPipelineErrorHandler
{
    private readonly ILogger _logger;
    private readonly IMetrics _metrics;
    private readonly Dictionary<string, FailureInfo> _nodeFailures = new();
    private readonly TimeSpan _failureWindow = TimeSpan.FromMinutes(10);
    private readonly int _maxFailuresPerWindow = 5;
    private readonly int _maxTotalFailures = 20;

    private class FailureInfo
    {
        public int TotalFailures { get; set; }
        public List<DateTime> RecentFailures { get; set; } = new();
        public DateTime? LastFailureTime { get; set; }
    }

    public ProductionPipelineErrorHandler(ILogger logger, IMetrics metrics)
    {
        _logger = logger;
        _metrics = metrics;
    }

    public Task<PipelineErrorDecision> HandleNodeFailureAsync(
        string nodeId,
        Exception error,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        if (!_nodeFailures.TryGetValue(nodeId, out var failureInfo))
        {
            failureInfo = new FailureInfo();
            _nodeFailures[nodeId] = failureInfo;
        }

        failureInfo.TotalFailures++;
        failureInfo.LastFailureTime = DateTime.UtcNow;

        // Clean up old failures outside the window
        var now = DateTime.UtcNow;
        failureInfo.RecentFailures.RemoveAll(time => now - time > _failureWindow);
        failureInfo.RecentFailures.Add(now);

        // Record metrics
        _metrics.Increment("pipeline_node_failures", new[]
        {
            new KeyValuePair<string, object>("node_id", nodeId),
            new KeyValuePair<string, object>("error_type", error.GetType().Name)
        });

        _logger.LogError(error, "Node {NodeId} failed (total: {TotalFailures}, recent: {RecentFailures})",
            nodeId, failureInfo.TotalFailures, failureInfo.RecentFailures.Count);

        // Check for critical errors that should fail the pipeline immediately
        if (IsCriticalError(error))
        {
            _logger.LogCritical("Critical error in node '{NodeId}': {ErrorType}. Failing pipeline.",
                nodeId, error.GetType().Name);
            return Task.FromResult(PipelineErrorDecision.FailPipeline);
        }

        // Check if we've exceeded the total failure limit
        if (failureInfo.TotalFailures >= _maxTotalFailures)
        {
            _logger.LogError("Node '{NodeId}' has exceeded maximum total failures ({MaxFailures}). Continuing without node.",
                nodeId, _maxTotalFailures);
            return Task.FromResult(PipelineErrorDecision.ContinueWithoutNode);
        }

        // Check if we've exceeded the failure window limit
        if (failureInfo.RecentFailures.Count >= _maxFailuresPerWindow)
        {
            _logger.LogError("Node '{NodeId}' has exceeded failure rate ({RecentFailures} in {Window} minutes). Continuing without node.",
                nodeId, failureInfo.RecentFailures.Count, _failureWindow.TotalMinutes);
            return Task.FromResult(PipelineErrorDecision.ContinueWithoutNode);
        }

        // For transient errors, restart the node
        if (IsTransientError(error))
        {
            _logger.LogWarning("Transient error in node '{NodeId}': {ErrorType}. Restarting node.",
                nodeId, error.GetType().Name);
            return Task.FromResult(PipelineErrorDecision.RestartNode);
        }

        // For other errors, continue without the node
        _logger.LogWarning("Non-transient error in node '{NodeId}': {ErrorType}. Continuing without node.",
            nodeId, error.GetType().Name);
        return Task.FromResult(PipelineErrorDecision.ContinueWithoutNode);
    }

    private static bool IsCriticalError(Exception error)
    {
        return error is OutOfMemoryException or StackOverflowException or AccessViolationException;
    }

    private static bool IsTransientError(Exception error)
    {
        return error is TimeoutException or HttpRequestException or OperationCanceledException;
    }
}
```

## :white_check_mark: Best Practices

1. **Track failure patterns**: Keep track of when and how often nodes fail to detect persistent issues.

2. **Implement circuit breaker patterns**: Prevent cascading failures by temporarily stopping attempts to failing nodes.

3. **Differentiate between error types**: Critical errors should fail the pipeline immediately, while transient errors might be worth retrying.

4. **Set reasonable limits**: Prevent infinite restarts by setting limits on the number of restart attempts.

5. **Monitor and alert**: Implement proper monitoring and alerting for pipeline failures.

6. **Consider graceful degradation**: Design your pipeline to continue functioning even when some nodes fail.

## :link: Related Topics

* **[Node-level Error Handling](node-error-handling.md)**: Learn about handling errors for individual items.
* **[Retry Configuration](retry-configuration.md)**: Configure retry behavior for node restarts.
* **[Circuit Breaker Configuration](circuit-breaker-configuration.md)**: Configure circuit breaker patterns.
* **[Dead-Letter Queues](dead-letter-queues.md)**: Implement dead-letter queues for problematic items.
* **[Error Handling Overview](error-handling.md)**: Return to the error handling overview.

