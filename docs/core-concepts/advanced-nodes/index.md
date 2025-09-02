---
title: Advanced Node Types
description: Explore advanced node types for complex data transformations and pipeline control, including aggregation, time-windowed joins, and branch nodes.
sidebar_position: 1
slug: /core-concepts/advanced-nodes
---

# Advanced Node Types

Beyond the basic source, transform, and sink nodes, NPipeline offers a suite of advanced node types designed to handle more complex data processing patterns. These nodes enable sophisticated operations like aggregating data, joining streams based on time windows, and duplicating data paths for branching logic or monitoring.

This section delves into the specialized functionalities of these advanced nodes, providing detailed explanations and practical examples to help you leverage their full potential in building robust and efficient data pipelines.

## Topics in this Section

* **[Aggregation Nodes](aggregation.md)**: Learn how to perform various aggregation operations on data streams.
* **[Batching Nodes](batching.md)**: Understand how to batch data for improved processing efficiency.
* **[Join Nodes](join.md)**: Explore different types of join operations for combining data streams.
* **[Lookup Nodes](lookup.md)**: Learn how to enrich data by looking up values from external sources.
* **[Time-Windowed Join Nodes](time-windowed-join.md)**: Discover how to join data streams based on defined time windows.
* **[Branch Nodes](branch.md)**: Understand how to duplicate data streams for parallel processing.
* **[Tap Nodes](tap.md)**: Learn about non-intrusive monitoring and side-channel processing.
* **[Type Conversion Nodes](type-conversion.md)**: Learn how to convert data types within your pipeline.
* **[ValueTask Transforms](valuetask-transforms.md)**: Optimize synchronous transforms by avoiding Task allocation overhead.

## Understanding When to Use Batching vs. Aggregation

The core concepts section includes a [comparison of batching and aggregation strategies](/core-concepts#understanding-grouping-strategies-batching-vs-aggregation) to help you choose the right approach based on your use case. Review that section if you need to decide between these two powerful grouping patterns.
