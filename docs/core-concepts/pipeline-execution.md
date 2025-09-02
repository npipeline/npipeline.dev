---
title: Pipeline Execution
description: Learn how to execute your NPipeline definitions and manage their lifecycle.
sidebar_position: 6
---

# Pipeline Execution

Once you have defined your pipeline using `IPipelineDefinition`, the next step is to execute it. In NPipeline, pipeline execution is managed by the `PipelineRunner` class.

For a detailed understanding of how pipeline execution works under the hood, see the [Architecture: Component Architecture](../architecture/component-architecture.md#4-pipeline-runner) section.

## Quick Reference: PipelineRunner Overloads

The `PipelineRunner` class provides three overload patterns for convenience:

```csharp
// Overload 1: With PipelineContext only
public Task RunAsync<TDefinition>(PipelineContext context) 
    where TDefinition : IPipelineDefinition, new();

// Overload 2: With CancellationToken only (uses default context)
public Task RunAsync<TDefinition>(CancellationToken cancellationToken = default) 
    where TDefinition : IPipelineDefinition, new();

// Overload 3: With both PipelineContext and CancellationToken
public Task RunAsync<TDefinition>(PipelineContext context, CancellationToken cancellationToken) 
    where TDefinition : IPipelineDefinition, new();
```

## Basic Execution

### Simple Execution Example

```csharp
var runner = new PipelineRunner();
await runner.RunAsync<MyPipelineDefinition>();
```

### With Pipeline Context

```csharp
var context = new PipelineContext(PipelineContextConfiguration.WithCancellation(cancellationToken));
context.Items["key"] = "value"; // Pass state to nodes

var runner = new PipelineRunner();
await runner.RunAsync<MyPipelineDefinition>(context);
```

## Cancellation

NPipeline supports cancellation through `CancellationToken` propagation. Pass a cancellation token to `RunAsync` to enable graceful shutdown:

```csharp
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));

var runner = new PipelineRunner();
try
{
    await runner.RunAsync<MyPipelineDefinition>(cts.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine("Pipeline was cancelled.");
}
```

The cancellation token is propagated to all nodes, allowing them to clean up resources gracefully. See [Cancellation Model](../architecture/cancellation-model.md) for more details.

## :arrow_right: Next Steps

- **[Pipeline Context](pipeline-context.md)** - Learn how to pass state and configuration to your pipeline
- **[Architecture: Execution Flow](../architecture/execution-flow.md)** - Deep dive into sequential and parallel execution
- **[Architecture: Cancellation Model](../architecture/cancellation-model.md)** - Understand cancellation propagation
- **[Error Handling](pipeline-execution/error-handling.md)** - Learn about error handling strategies

