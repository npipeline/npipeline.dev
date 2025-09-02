---
title: Node-level Error Handling
description: Learn how to implement node-level error handling in NPipeline using INodeErrorHandler to manage errors that occur during individual item processing.
sidebar_position: 5
---

# Node-level Error Handling

Node-level error handling in NPipeline allows you to manage errors that occur while processing individual items within a specific node. This granular approach enables you to define what happens to each problematic item without affecting the entire pipeline.

## Overview

When an error occurs during the processing of an individual item in a node, NPipeline's error handling mechanism invokes the appropriate `INodeErrorHandler` to determine how to proceed. This allows you to implement strategies like retrying the item, skipping it, or redirecting it to a dead-letter queue.

## INodeErrorHandler Interface

To handle errors within a specific node, you implement [`INodeErrorHandler<in TNode, in TData>`](../../../src/NPipeline/Abstractions/ErrorHandling/INodeErrorHandler.cs) interface.

```csharp
public interface INodeErrorHandler
{
}

/// <summary>
///     Defines the contract for handling errors that occur within a specific node.
/// </summary>
/// <typeparam name="TNode">The type of node where the error occurred.</typeparam>
/// <typeparam name="TData">The type of the data item that failed.</typeparam>
public interface INodeErrorHandler<in TNode, in TData> : INodeErrorHandler where TNode : INode
{
    /// <summary>
    ///     Handles an error that occurred during node execution.
    /// </summary>
    /// <param name="node">The instance of node that failed.</param>
    /// <param name="failedItem">The data item that caused the error.</param>
    /// <param name="error">The exception that was thrown.</param>
    /// <param name="context">The current pipeline context.</param>
    /// <param name="cancellationToken">A token to observe for cancellation requests.</param>
    /// <returns>A <see cref="NodeErrorDecision" /> indicating how to proceed.</returns>
    Task<NodeErrorDecision> HandleAsync(
        TNode node,
        TData failedItem,
        Exception error,
        PipelineContext context,
        CancellationToken cancellationToken);
}
```

* **`INodeErrorHandler`**: Marker interface for dependency injection registration of node error handlers.
* **`INodeErrorHandler<in TNode, in TData>`**: Generic interface that inherits from the marker interface and defines the actual error handling logic.
* **`TNode`**: The type of node where the error occurred.
* **`TData`**: The type of the data item that caused the error.
* **`HandleAsync`**: This method is called when an error occurs. It receives the failing node, item, exception, and pipeline context. It must return a `NodeErrorDecision`.

## NodeErrorDecision

This enum dictates how the pipeline should proceed after a node-level error:

* **`Skip`**: The failed item is discarded, and the pipeline continues processing subsequent items.
* **`Retry`**: The pipeline attempts to re-process the failed item. The number of retries is configured via `PipelineRetryOptions`.
* **`DeadLetter`**: The failed item is sent to a configured dead-letter sink, and the pipeline continues.
* **`Fail`**: The pipeline immediately terminates with an exception.

## Implementing a Custom Node Error Handler

```csharp
using NPipeline;
using NPipeline.ErrorHandling;
using NPipeline.Nodes;
using NPipeline.Pipeline;

public sealed class MyNodeErrorHandler : INodeErrorHandler<ITransformNode<string, string>, string>
{
    private readonly ILogger _logger;

    public MyNodeErrorHandler(ILogger logger)
    {
        _logger = logger;
    }

    public Task<NodeErrorDecision> HandleAsync(
        ITransformNode<string, string> node,
        string failedItem,
        Exception error,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        _logger.LogError(error, "Error in node '{NodeName}' processing '{FailedItem}': {ErrorMessage}",
            node.Name, failedItem, error.Message);

        // Example logic:
        // - If it's a specific transient error, maybe retry.
        // - If it's a data validation error, skip or redirect.
        if (error is FormatException)
        {
            _logger.LogWarning("Data format error, redirecting to dead-letter.");
            return Task.FromResult(NodeErrorDecision.DeadLetter);
        }
        else if (failedItem.Contains("retry"))
        {
            _logger.LogInformation("Item marked for retry.");
            return Task.FromResult(NodeErrorDecision.Retry);
        }
        else
        {
            _logger.LogWarning("Skipping item due to unexpected error.");
            return Task.FromResult(NodeErrorDecision.Skip);
        }
    }
}
```

## Registering a Node Error Handler

You register a node error handler for a specific node using the `WithErrorHandler` method on `PipelineBuilder`:

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
    }
}

public static class Program
{
    public static async Task Main(string[] args)
    {
        var runner = new PipelineRunner();
        var context = PipelineContext.Default;

        var pipeline = PipelineBuilder.Create<ErrorHandlingPipelineDefinition>();

        await runner.RunAsync<ErrorHandlingPipelineDefinition>(context);
    }
}
```

You also need to register your custom error handler with your DI container:

```csharp
services.AddSingleton<INodeErrorHandler<ITransformNode<string, string>, string>, MyNodeErrorHandler>();
```

The marker interface `INodeErrorHandler` (non-generic version) is used for dependency injection registration purposes, allowing the DI container to discover all node error handler implementations.

## Basic Error Handling in Nodes

Nodes that implement `TransformNode<TInput, TOutput>` or `SinkNode<TInput>` can incorporate error handling logic directly within their `ExecuteAsync` or `ExecuteAsync` methods. This typically involves `try-catch` blocks to capture exceptions and decide on an appropriate response.

### Example: Basic Error Handling in a Transform Node

Consider a transform node that attempts to parse a string into an integer. If the string is not a valid number, a `FormatException` would occur.

```csharp
using NPipeline;

public sealed record StringData(string Value);
public sealed record IntData(int Value);
public sealed record ErrorData(string OriginalValue, string ErrorMessage);

public sealed class ParsingTransform : TransformNode<StringData, IntData>
{
    public override Task<IntData> ExecuteAsync(
        StringData item,
        PipelineContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            int parsedValue = int.Parse(item.Value);
            return Task.FromResult(new IntData(parsedValue));
        }
        catch (FormatException ex)
        {
            // Log the error and handle it
            Console.WriteLine($"Error parsing '{item.Value}': {ex.Message}");
            // Re-throw to let the pipeline's error handling mechanism process it
            throw;
        }
    }
}

// Example usage (simplified for brevity)
public sealed class ErrorHandlingPipeline : IPipelineDefinition
{
    public void Define(PipelineBuilder builder, PipelineContext context)
    {
        var stringData = new[]
        {
            new StringData("1"),
            new StringData("abc"), // This will cause an error
            new StringData("2")
        };

        var sourceHandle = builder.AddSource<TestStringSource, StringData>();
        var transformHandle = builder.AddTransform<ParsingTransform, StringData, IntData>();
        var sinkHandle = builder.AddSink<TestIntSink, IntData>();

        builder.Connect(sourceHandle, transformHandle);
        builder.Connect(transformHandle, sinkHandle);
    }
}

public sealed class TestStringSource : SourceNode<StringData>
{
    public IDataPipe<StringData> ExecuteAsync(
        PipelineContext context,
        CancellationToken cancellationToken = default)
    {
        static IAsyncEnumerable<StringData> Stream()
        {
            return Generate();

            async IAsyncEnumerable<StringData> Generate()
            {
                var data = new[]
                {
                    new StringData("1"),
                    new StringData("abc"), // This will cause an error
                    new StringData("2")
                };

                foreach (var item in data)
                {
                    yield return item;
                }
            }
        }

        return new StreamingDataPipe<StringData>(Stream());
    }
}

public sealed class TestIntSink : SinkNode<IntData>
{
    public async Task ExecuteAsync(
        IDataPipe<IntData> input,
        PipelineContext context,
        CancellationToken cancellationToken = default)
    {
        await foreach (var item in input.WithCancellation(cancellationToken))
        {
            Console.WriteLine($"Successfully parsed: {item.Value}");
        }
    }
}

// To run the pipeline:
public static class Program
{
    public static async Task Main(string[] args)
    {
        Console.WriteLine("Starting pipeline with error handling...");
        var runner = new PipelineRunner();
        try
        {
            await runner.RunAsync<ErrorHandlingPipeline>();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Pipeline failed with error: {ex.Message}");
        }
        Console.WriteLine("Pipeline finished.");
    }
}
```

## Common Node Error Handling Scenarios

### Scenario 1: Handling Transient Network Errors

```csharp
public class NetworkErrorHandler : INodeErrorHandler<IApiTransformNode, string>
{
    private readonly ILogger _logger;
    private int _retryCount = 0;

    public NetworkErrorHandler(ILogger logger)
    {
        _logger = logger;
    }

    public Task<NodeErrorDecision> HandleAsync(
        IApiTransformNode node,
        string failedItem,
        Exception error,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        if (error is HttpRequestException httpEx)
        {
            _retryCount++;
            _logger.LogWarning("Network error (attempt {RetryCount}): {ErrorMessage}", _retryCount, httpEx.Message);

            // Retry up to 3 times for network errors
            if (_retryCount <= 3)
            {
                return Task.FromResult(NodeErrorDecision.Retry);
            }
            else
            {
                _retryCount = 0; // Reset for next item
                return Task.FromResult(NodeErrorDecision.DeadLetter);
            }
        }

        return Task.FromResult(NodeErrorDecision.Skip);
    }
}
```

### Scenario 2: Data Validation Errors

```csharp
public class ValidationErrorHandler : INodeErrorHandler<IValidatorNode, string>
{
    private readonly ILogger _logger;

    public ValidationErrorHandler(ILogger logger)
    {
        _logger = logger;
    }

    public Task<NodeErrorDecision> HandleAsync(
        IValidatorNode node,
        string failedItem,
        Exception error,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        if (error is ValidationException validationEx)
        {
            _logger.LogWarning("Validation failed for item: {Item}. Error: {Error}", failedItem, validationEx.Message);

            // For validation errors, redirect to dead-letter queue for manual review
            return Task.FromResult(NodeErrorDecision.DeadLetter);
        }

        // For other types of errors, skip the item
        return Task.FromResult(NodeErrorDecision.Skip);
    }
}
```

## :white_check_mark: Best Practices

1. **Be specific about error types**: Different error types should be handled differently. Transient errors (like network issues) might be worth retrying, while data validation errors should probably be redirected.

2. **Implement retry limits**: Always limit the number of retries to prevent infinite loops and resource exhaustion.

3. **Log detailed error information**: Include sufficient context in your error logs to help with troubleshooting.

4. **Use dead-letter queues for problematic items**: Items that consistently fail should be redirected to a dead-letter queue for later analysis.

5. **Consider performance implications**: Error handling logic adds overhead to normal processing, so keep it efficient.

## :link: Related Topics

* **[Pipeline-level Error Handling](pipeline-error-handling.md)**: Learn about handling errors that affect entire node streams.
* **[Retry Configuration](retry-configuration.md)**: Configure retry behavior for items and node restarts.
* **[Circuit Breaker Configuration](circuit-breaker-configuration.md)**: Configure circuit breaker patterns.
* **[Dead-Letter Queues](dead-letter-queues.md)**: Implement dead-letter queues for problematic items.
* **[Error Handling Overview](error-handling.md)**: Return to the error handling overview.

