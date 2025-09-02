---
title: Pipeline Execution
description: Understand how NPipeline executes data flows and manages pipeline lifecycle.
sidebar_position: 1
slug: /core-concepts/pipeline-execution
---

# Pipeline Execution

Once a pipeline has been defined using the [`PipelineBuilder`](../../../src/NPipeline/Pipeline/PipelineBuilder.cs), the next crucial step is its execution. NPipeline provides a robust mechanism to run your defined data flows, managing the lifecycle of data items as they move through various nodes.

Pipeline execution involves several key aspects:

* **Starting and Stopping**: How to initiate and gracefully terminate a pipeline.
* **Concurrency**: How NPipeline handles parallel processing of data items.
* **Error Handling**: Mechanisms for dealing with errors that occur during execution.
* **Monitoring**: Observing the flow of data and the performance of your pipeline.

This section will guide you through the process of executing your NPipeline pipelines, focusing on the core interfaces and methods involved.

## Topics in this Section

* **[`IPipelineRunner`](ipipelinerunner.md)**: The primary interface for running pipelines.
* **[Execution Strategies](execution-strategies.md)**: Different strategies for executing your pipeline (Sequential vs. Resilient).
* **[Error Handling](error-handling.md)**: Comprehensive error handling mechanisms at both node and pipeline levels.
* **[Retry Configuration](retry-configuration.md)**: Configure how your pipeline should respond to transient failures.
* **[Circuit Breaker Configuration](circuit-breaker-configuration.md)**: Prevent cascading failures with circuit breaker patterns.
* **[Dead-Letter Queues](dead-letter-queues.md)**: Handle and store items that cannot be processed.

## :arrow_right: Next Steps

* **[IPipelineRunner](ipipelinerunner.md)**: The primary interface for running pipelines
* **[Execution Strategies](execution-strategies.md)**: Different strategies for executing your pipeline
* **[Error Handling](error-handling.md)**: Comprehensive error handling mechanisms
