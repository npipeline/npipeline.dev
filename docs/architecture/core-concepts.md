---
title: Core Concepts
description: Fundamental architectural concepts in NPipeline - graphs, nodes, and streaming data.
sidebar_position: 1
---

# Core Concepts

NPipeline's architecture is built on three fundamental concepts: graph-based data representation, distinct node types, and a streaming data model.

## Graph-Based Architecture

NPipeline represents pipelines as **directed acyclic graphs (DAGs)** where:

- **Nodes** are processing units (sources, transforms, sinks)
- **Edges** are connections between nodes representing data flow
- **Data flows** through the graph from sources to sinks

```text
Source Node
    ↓
Transform Node 1
    ↓
Transform Node 2
    ↓
Sink Node
```

This approach provides several advantages:

- **Clarity**: Visual representation of data flow
- **Flexibility**: Easy to add, remove, or reroute nodes
- **Type Safety**: Compile-time validation of connections
- **Composability**: Nodes can be tested and reused independently

## Node Types

### `SourceNode<T>`

**Purpose:** Produce the initial data stream

**Characteristics:**
- Produces data of type `T`
- No inputs (generates data from external sources)
- Returns `IDataPipe<T>` for downstream consumption

**Usage:** File readers, database queries, API calls, message queue consumers

### `TransformNode<TIn, TOut>`

**Purpose:** Process and transform data items

**Characteristics:**
- Consumes `IDataPipe<TIn>`
- Produces `IDataPipe<TOut>`
- Can transform, filter, or enrich data
- May change data type
- Processes one item at a time

**Usage:** Data validation, enrichment, aggregation, type conversion, business logic

### `SinkNode<T>`

**Purpose:** Consume data and perform final operations

**Characteristics:**
- Consumes `IDataPipe<T>` (the entire stream)
- Produces no output (terminal node)
- Responsible for side effects (save, send, display)

**Usage:** Database writes, file output, API submissions, logging

## Streaming Data Model

NPipeline uses `IAsyncEnumerable<T>` for **lazy, streaming data flow**:

```csharp
public interface IDataPipe<T> : IAsyncEnumerable<T>
{
    // IDataPipe<T> implements IAsyncEnumerable<T> directly
    // Iterate using: await foreach (var item in dataPipe)
}
```

### Key Characteristics

**Lazy Evaluation**
- Data is only produced when consumed
- If pipeline is cancelled, source never reads unused data

**Memory Efficient**
- Only active items are in memory at any time
- No need to load entire datasets upfront

**Responsive**
- Processing begins immediately upon pipeline start
- Results are available as soon as items flow through

**Composable**
- Each transform creates a new data pipe
- Pipes can be layered and composed

### Example: How Streaming Works

```csharp
// Step 1: Source creates pipe (but doesn't read yet)
var sourcePipe = await sourceNode.ExecuteAsync(context, cancellationToken);

// Step 2: Transform wraps pipe (but doesn't process yet)
var transformPipe = new TransformPipe(sourcePipe, transformNode);

// Step 3: Sink actually triggers execution
await foreach (var item in transformPipe.WithCancellation(cancellationToken))
{
    // Data is produced, transformed, and consumed
    // Only ONE item is in memory at a time
}
```

## Benefits of This Design

✅ **Memory Efficient** - Only active items in memory
✅ **Responsive** - Processing starts immediately
✅ **Cancellable** - Can stop at any time
✅ **Type Safe** - Compile-time validation of node connections
✅ **Testable** - Each node can be tested in isolation

## :arrow_right: Next Steps

* **[Component Architecture](component-architecture.md)** - Learn about the major system components
* **[Execution Flow](execution-flow.md)** - Understand how data flows through pipelines
