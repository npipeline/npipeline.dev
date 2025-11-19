---
title: Nodes (Source, Transform, Sink)
description: Explore the fundamental building blocks of any NPipeline – Source, Transform, and Sink nodes.
sidebar_position: 4
---

# Nodes: Source, Transform, and Sink

Nodes are the fundamental building blocks of any NPipeline. They encapsulate the logic for producing, transforming, or consuming data items as they flow through your pipeline. NPipeline defines three primary types of nodes, each with a distinct role:

* **Source Nodes (`ISourceNode<TOut>`):** Initiate the data flow by producing items.
* **Transform Nodes (`ITransformNode<TIn, TOut>`):** Process and transform data items.
* **Sink Nodes (`ISinkNode<TIn>`):** Consume data items, typically as the final step in a pipeline.

All nodes implement the `INode` interface, which provides a common base for all processing units within NPipeline.

## The Node Hierarchy

The `INode` interface is the common root for all pipeline nodes. It is a simple marker interface that also implements `IAsyncDisposable` to allow for proper resource cleanup.

```csharp
public interface INode : IAsyncDisposable { }
```

There are three specialized types of nodes, each with a distinct role in the pipeline:

1. **`ISourceNode<TOut>`**: Produces data to start a pipeline.
2. **`ITransformNode<TIn, TOut>`**: Processes data from an upstream node and passes it to a downstream node.
3. **`ISinkNode<TIn>`**: Consumes data, typically at the end of a pipeline.

## Core Node Types

The three core node types handle the fundamental data flow in a pipeline:

### ISourceNode&lt;TOut&gt;

A source node is the starting point of a pipeline. It is responsible for generating or fetching the initial data that will be processed. A pipeline must have at least one source node.

#### Definition

```csharp
public interface ISourceNode<out TOut> : INode
{
    IDataPipe<TOut> ExecuteAsync(PipelineContext context, CancellationToken cancellationToken);
}
```

* **`TOut`**: The type of data that the source node produces (covariant).
* **`ExecuteAsync`**: This method is called by the pipeline runner to start data production. It returns an `IDataPipe<TOut>` synchronously, which is a channel through which data flows to the next node.

#### Key Design Pattern: Synchronous Pipe Creation + Asynchronous Iteration

NPipeline separates concerns into two distinct phases:

**Phase 1 (Synchronous):** Pipe Creation

* `ExecuteAsync()` creates and returns the pipe immediately (synchronously)
* No `await` needed when calling this method
* The pipeline reference is established without blocking

**Phase 2 (Asynchronous):** Data Consumption

* The returned pipe is an `IAsyncEnumerable<T>`
* Data flows asynchronously when downstream nodes enumerate it
* `await foreach` is used when consuming data items

**Mental Model - File I/O Analogy:**

```csharp
// File I/O pattern:
var stream = File.OpenRead(path);           // Sync - open stream immediately
var bytes = await stream.ReadAsync(...);    // Async - read from stream

// NPipeline pattern:
var pipe = source.ExecuteAsync(...);        // Sync - create pipe immediately  
var item = await pipe.FirstAsync();         // Async - read item from pipe
```

**Why This Design?**

* ✅ **Clearer Intent:** "ExecuteAsync" signals you're in the async execution system, but the pipe creation itself is fast and synchronous
* ✅ **Type Safety:** Covariant `IDataPipe<T>` (not invariant `Task<IDataPipe<T>>`) enables better type compatibility
* ✅ **Performance:** No unnecessary `Task` allocations for pipe creation
* ✅ **Consistency:** Uniform pattern across all source nodes

#### Example

Here is an example of a simple source node that produces a sequence of numbers:

```csharp
public sealed class NumberSource : SourceNode<int>
{
    public override IDataPipe<int> ExecuteAsync(PipelineContext context, CancellationToken cancellationToken)
    {
        return new StreamingDataPipe<int>(Stream());

        static async IAsyncEnumerable<int> Stream()
        {
            for (int i = 1; i <= 10; i++)
            {
                yield return i;
                await Task.Delay(100); // Simulate work
            }
        }
    }
}
```

### ITransformNode&lt;TIn, TOut&gt;

A transform node sits between a source and a sink (or between other transforms). It receives data, performs an operation on it, and then outputs the modified data.

#### Definition

```csharp
public interface ITransformNode : INode
{
    IExecutionStrategy ExecutionStrategy { get; set; }
    INodeErrorHandler? ErrorHandler { get; set; }
}

public interface ITransformNode<in TIn, TOut> : ITransformNode
{
    Task<TOut> ExecuteAsync(TIn item, PipelineContext context, CancellationToken cancellationToken);
}
```

* **`TIn`**: The type of data the node receives.
* **`TOut`**: The type of data the node outputs.
* **`ExecuteAsync`**: This method is called for each individual item that flows into the node.
* **`ExecutionStrategy`**: Gets or sets the execution strategy for this node.
* **`ErrorHandler`**: Gets or sets the error handler for this node.

#### Example

This transform takes an integer, squares it, and returns the result as a string.

```csharp
public sealed class SquareAndStringifyTransform : ITransformNode<int, string>
{
    public IExecutionStrategy ExecutionStrategy { get; set; } = new SequentialExecutionStrategy();
    public INodeErrorHandler? ErrorHandler { get; set; }

    public Task<string> ExecuteAsync(int item, PipelineContext context, CancellationToken cancellationToken)
    {
        int squared = item * item;
        return Task.FromResult($"The square is {squared}");
    }
}
```

### ISinkNode&lt;TIn&gt;

A sink node is a terminal point in a pipeline. It receives data but does not produce any output for other nodes. Its purpose is to perform a final action, such as writing to a database, logging to the console, or sending data to an external API.

#### Definition

```csharp
public interface ISinkNode<in TIn> : INode
{
    Task ExecuteAsync(IDataPipe<TIn> input, PipelineContext context, CancellationToken cancellationToken);
}
```

* **`TIn`**: The type of data the node receives (contravariant).
* **`ExecuteAsync`**: This method receives the `IDataPipe<TIn>` containing all the data from the upstream node and is responsible for consuming it.

#### Example

This sink node simply prints the incoming strings to the console.

```csharp
public sealed class ConsoleSink : ISinkNode<string>
{
    public async Task ExecuteAsync(IDataPipe<string> input, PipelineContext context, CancellationToken cancellationToken)
    {
        await foreach (var item in input.WithCancellation(cancellationToken))
        {
            Console.WriteLine(item);
        }
    }
}
```

## Node Connectivity

Nodes are connected using `PipelineBuilder`. The output type of an upstream node must match the input type of a downstream node. NPipeline ensures type compatibility during pipeline construction.

```csharp
using NPipeline;
using NPipeline.DataFlow;
using NPipeline.Execution;
using NPipeline.Nodes;
using NPipeline.Pipeline;

public sealed class NumberPipelineDefinition : IPipelineDefinition
{
    public void Define(PipelineBuilder builder, PipelineContext context)
    {
        var sourceHandle = builder.AddSource<NumberSource, int>();
        var transformHandle = builder.AddTransform<SquareTransform, int, int>();
        var sinkHandle = builder.AddSink<ConsoleSink<int>, int>();

        builder.Connect(sourceHandle, transformHandle);
        builder.Connect(transformHandle, sinkHandle);
    }
}

public static class Program
{
    public static async Task Main(string[] args)
    {
        var runner = new PipelineRunner();
        await runner.RunAsync<NumberPipelineDefinition>();
    }
}
```

## Beyond Basic Nodes: Advanced Node Types

Beyond the three core node types, NPipeline offers sophisticated advanced node types for complex data processing patterns:

- **[Advanced Node Types Overview](../advanced-nodes/index.md)**: Explore aggregation, batching, joins, lookups, and more
  - **[Batching Nodes](../advanced-nodes/batching.md)**: Group items for efficient bulk operations
  - **[Aggregation Nodes](../advanced-nodes/aggregation.md)**: Perform windowed aggregations with event-time semantics
  - **[Join Nodes](../advanced-nodes/join.md)**: Combine multiple streams of data
  - **[Lookup Nodes](../advanced-nodes/lookup.md)**: Enrich data with external information
  - **[Time-Windowed Join Nodes](../advanced-nodes/time-windowed-join.md)**: Join streams based on time windows
  - **[Branch Nodes](../advanced-nodes/branch.md)**: Duplicate data streams for parallel processing
  - **[Type Conversion Nodes](../advanced-nodes/type-conversion.md)**: Convert between data types

## :arrow_right: Next Steps

* Learn how to connect these nodes together using the **[PipelineBuilder](../pipelinebuilder.md)**.
* See how to create a runnable **[Pipeline](../ipipeline.md)** instance.
