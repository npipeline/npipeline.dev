---
title: PipelineBuilder
description: Learn how to use the PipelineBuilder to fluently define and construct your pipeline.
sidebar_position: 5
slug: /core-concepts/pipelinebuilder
---

# PipelineBuilder

The `PipelineBuilder` is a fluent API that provides a simple and expressive way to define the structure of your data pipeline. It is the primary tool for adding nodes, connecting them, and compiling the final, runnable `IPipeline` instance.

## The Core Workflow

Building a pipeline with `PipelineBuilder` involves three main steps:

1. **Add Nodes**: Use methods like `AddSource`, `AddTransform`, and `AddSink` to register the processing units of your pipeline.
2. **Connect Nodes**: Use the `Connect` method to define the flow of data between the nodes you have added.
3. **Build the Pipeline**: Call the `Build` method to validate your configuration and create an executable `IPipeline` instance.

## Step 1: Adding Nodes

You start by creating a `PipelineBuilder` instance and then adding your nodes. Each `Add` method returns a `Handle` object, which is a lightweight reference to the node that you will use in the next step to create connections.

* `AddSource<TNode, TOut>(name)`: Adds a source node.
* `AddTransform<TNode, TIn, TOut>(name)`: Adds a transform node.
* `AddSink<TNode, TIn>(name)`: Adds a sink node.

Each method takes the node's class type as a generic parameter and an optional unique name.

### Example

```csharp
using NPipeline;
using NPipeline.DataFlow;
using NPipeline.Nodes;
using NPipeline.Pipeline;

public static class Program
{
    public static async Task Main(string[] args)
    {
        var builder = new PipelineBuilder();

        // Add nodes and store their handles
        var sourceHandle = builder.AddSource<HelloWorldSource, string>();
        var transformHandle = builder.AddTransform<UppercaseTransform, string, string>();
        var sinkHandle = builder.AddSink<ConsoleSink, string>();

        // Connect the source to the transform
        builder.Connect(sourceHandle, transformHandle);

        // Connect the transform to the sink
        builder.Connect(transformHandle, sinkHandle);

        var pipeline = builder.Build();
        var runner = new PipelineRunner();
        await runner.RunAsync(pipeline);
    }
}
```

## Step 2: Connecting Nodes

After adding your nodes, you define the data flow by calling the `Connect` method. This method takes the handles of the source and target nodes as arguments.

```csharp
// Connect the source to the transform
builder.Connect(sourceHandle, transformHandle);

// Connect the transform to the sink
builder.Connect(transformHandle, sinkHandle);
```

The builder ensures that the output type of the source node matches the input type of the target node, providing compile-time safety.

## Step 3: Building the Pipeline

Once all nodes are added and connected, you call the `Build()` method. This method performs several crucial actions:

* It validates the graph to ensure it is a valid, runnable pipeline (e.g., no cycles, no disconnected nodes).
* It compiles the node definitions and connections into an optimized, executable `Pipeline` instance.

```csharp
Pipeline pipeline = builder.Build();
```

## Putting It All Together

Here is a complete example that demonstrates the fluent nature of the PipelineBuilder:

```csharp
using NPipeline;
using NPipeline.DataFlow;
using NPipeline.Nodes;
using NPipeline.Pipeline;

public static class Program
{
    public static async Task Main(string[] args)
    {
        // Step 1: Create builder
        var builder = new PipelineBuilder();

        // Step 2: Add Nodes (and get handles)
        var sourceHandle = builder.AddSource<HelloWorldSource, string>();
        var transformHandle = builder.AddTransform<UppercaseTransform, string, string>();
        var sinkHandle = builder.AddSink<ConsoleSink, string>();

        // Step 3: Connect Nodes
        builder.Connect(sourceHandle, transformHandle);
        builder.Connect(transformHandle, sinkHandle);

        // Step 4: Build and run
        var pipeline = builder.Build();
        var runner = new PipelineRunner();
        await runner.RunAsync(() => pipeline);
    }
}
```

## :arrow_right: Next Steps

* Learn about the final component, the **[PipelineContext](pipeline-context.md)**, which carries state across your pipeline.
* Review the different types of **[INode](inode.md)** you can add to the builder.
