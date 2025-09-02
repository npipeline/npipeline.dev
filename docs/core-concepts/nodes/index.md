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

## Core Node Types

The three core node types handle the fundamental data flow in a pipeline:

- **[Source Nodes](source-nodes.md)**: Learn how to generate the initial data stream that enters your pipeline
- **[Transform Nodes](transform-nodes.md)**: Discover how to process and manipulate data, including critical performance patterns like `ValueTask<T>` optimization
- **[Sink Nodes](sink-nodes.md)**: Understand how to consume data and perform final operations in your pipeline

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
