---
title: Frequently Asked Questions
description: Answers to common questions about NPipeline.
sidebar_position: 10
---

# Frequently Asked Questions

## General Questions

### What is NPipeline?

NPipeline is a high-performance, graph-based streaming data pipeline library for .NET. It allows you to build complex data processing workflows by defining interconnected nodes (sources, transforms, and sinks) that process data efficiently without loading entire datasets into memory.

### When should I use NPipeline?

NPipeline is ideal for:

- ETL (Extract, Transform, Load) pipelines
- Real-time data processing
- Batch file processing (CSV, JSON, XML)
- Data validation and cleansing
- API data integration
- Any scenario requiring efficient data flow processing

### What makes NPipeline different from other pipeline libraries?

NPipeline offers:

- **Graph-based architecture** for clear data flow visualization
- **High performance** with minimal memory allocations
- **Type safety** with compile-time validation
- **Flexibility** to mix sequential and parallel execution
- **Production-ready** error handling and resilience
- **Testability** with built-in testing utilities

### Does NPipeline support streaming data?

Yes! NPipeline is designed around streaming data using `IAsyncEnumerable<T>`. Data flows through the pipeline without loading everything into memory at once.

## Installation & Setup

### Which version of .NET is supported?

NPipeline requires **.NET 8.0, 9.0, or 10.0**.

### Do I need to install all the extensions?

No. The core `NPipeline` package is all you need. Extensions are optional:

- **DependencyInjection** - For managing dependencies
- **Parallelism** - For parallel execution
- **Testing** - For unit testing pipelines
- **Connectors** - For pre-built source/sink nodes

### Can I use NPipeline with ASP.NET Core?

Yes! NPipeline integrates well with ASP.NET Core via dependency injection. See [Dependency Injection](../extensions/dependency-injection.md) for details.

### How do I set up logging?

Integrate with Microsoft.Extensions.Logging:

```csharp
services.AddLogging(builder => builder.AddConsole());
services.AddNPipeline(Assembly.GetExecutingAssembly());
```

Then inject `ILogger<T>` into your nodes.

## Architecture & Concepts

### What's the difference between IPipeline and IPipelineDefinition?

- **IPipelineDefinition** - A blueprint that defines your pipeline structure
- **IPipeline** - The compiled, runnable instance created from a definition
- You implement `IPipelineDefinition`, then `PipelineRunner` executes it

### Can a pipeline have multiple sources?

Yes. Multiple source nodes can connect to the same transform or separate transforms. See [Common Patterns](../core-concepts/common-patterns.md) for examples.

### What's the purpose of PipelineContext?

`PipelineContext` carries runtime information through the pipeline:

- Cancellation tokens
- Shared state between nodes
- Logging and observability services
- Custom application data

### How does data flow between nodes?

Data flows through `IDataPipe<T>` objects:

1. Source nodes produce an `IDataPipe<T>`
2. Transforms consume it and produce a new `IDataPipe<T>`
3. Sinks consume the final `IDataPipe<T>`

## Performance & Optimization

### How do I improve pipeline performance?

1. **Profile first** - Identify actual bottlenecks
2. **Use parallelism** - For CPU-bound operations
3. **Batch operations** - For I/O operations
4. **Stream efficiently** - Don't load all data at once
5. **Minimize allocations** - Reduce garbage collection pressure

### Should I use parallelism?

Use parallelism when:

- Operations are CPU-intensive
- Operations are independent
- You have available CPU cores

Don't use parallelism when:

- Operations are I/O-bound and sequential
- Order must be strictly preserved
- Resource contention occurs

### How do I handle large files?

Stream the data:

```csharp
public class LargeFileSource : SourceNode<Line>
{
    private readonly string _filePath;

    public override IDataPipe<Line> ExecuteAsync(PipelineContext context, CancellationToken cancellationToken)
    {
        static IAsyncEnumerable<Line> ReadLinesAsync(string path, CancellationToken ct)
        {
            return Read();

            async IAsyncEnumerable<Line> Read()
            {
                using var reader = new StreamReader(path);
                string? line;
                while ((line = await reader.ReadLineAsync(ct)) != null)
                {
                    yield return new Line(line);
                }
            }
        }

        return new StreamingDataPipe<Line>(ReadLinesAsync(_filePath, cancellationToken));
    }
}
```

### What's the memory footprint?

NPipeline has minimal memory overhead. Most memory usage is from your data. By streaming, you keep only a small window of data in memory at any time.

## Error Handling

### What happens if a transform throws an exception?

By default, the exception propagates up and stops the pipeline. Handle errors explicitly:

```csharp
try
{
    return await ProcessAsync(item);
}
catch (Exception ex)
{
    logger.LogError(ex, "Processing failed");
    throw; // or handle gracefully
}
```

### How do I implement retries?

NPipeline provides several built-in retry mechanisms:

**1. Item-level retries** - Retry individual items that fail:

```csharp
// Configure max retries per item
builder.WithRetryOptions(opt => opt.With(maxItemRetries: 3));

// In your error handler, return Retry for transient failures
public Task<NodeErrorDecision> HandleAsync(...)
{
    if (exception is TransientException)
        return Task.FromResult(NodeErrorDecision.Retry);

    return Task.FromResult(NodeErrorDecision.Skip);
}
```

**2. Node-level restarts** - Restart entire node streams on failure:

```csharp
// Enable resilience and configure restart limits
var myNode = builder
    .AddTransform<MyTransform, Input, Output>("myTransform")
    .WithResilience(builder)
    .WithRetryOptions(builder, opt => opt.With(
        maxNodeRestartAttempts: 3,
        maxMaterializedItems: 5000
    ));

// In your pipeline error handler, return RestartNode
public Task<PipelineErrorDecision> HandleNodeFailureAsync(...)
{
    if (exception is TimeoutException)
        return Task.FromResult(PipelineErrorDecision.RestartNode);

    return Task.FromResult(PipelineErrorDecision.FailPipeline);
}
```

**3. Circuit breaker** - Prevent cascading failures:

```csharp
// Configure circuit breaker through PipelineRetryOptions
var retryOptions = new PipelineRetryOptions(
    MaxItemRetries: 3,
    MaxNodeRestartAttempts: 2,
    MaxSequentialNodeAttempts: 5,
    CircuitBreakerOptions: new PipelineCircuitBreakerOptions(
        failureThreshold: 5,
        openDuration: TimeSpan.FromMinutes(1),
        samplingWindow: TimeSpan.FromMinutes(5),
        thresholdType: CircuitBreakerThresholdType.ConsecutiveFailures
    )
);
var context = PipelineContext.WithRetry(retryOptions);
```

For advanced patterns beyond simple retry counts, integrate external libraries like [Polly](https://github.com/App-vNext/Polly):

```csharp
// Exponential backoff with Polly
var policy = Policy
    .Handle<HttpRequestException>()
    .WaitAndRetryAsync(3, attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt)));

await policy.ExecuteAsync(async () => await CallServiceAsync());
```

See [Configuring Retries](../core-concepts/pipeline-execution/error-handling.md#configuring-retries) for detailed examples and best practices.

## Error Codes Reference

### What do the error codes like [NP0101] mean?

NPipeline uses standardized error codes (NP prefix) to help you quickly identify and resolve issues:

- **NP01xx** - Graph Validation Errors
- **NP02xx** - Type Mismatch and Conversion Errors  
- **NP03xx** - Execution Errors
- **NP04xx** - Configuration Errors
- **NP05xx** - Resource and Capacity Errors

See the [Error Codes Reference](../reference/error-codes.md) for a complete list of all error codes, their causes, and solutions.

### How do I handle invalid data?

Route invalid data to a separate error stream or log it:

```csharp
public override Task<Order> ExecuteAsync(Order item, PipelineContext context, CancellationToken cancellationToken)
{
    if (item.Price < 0)
    {
        logger.LogWarning($"Invalid price: {item.Price}");
        throw new ValidationException("Price cannot be negative");
    }
    return Task.FromResult(item);
}
```

## Testing

### How do I test a pipeline?

Use `InMemorySourceNode` and `InMemorySinkNode`:

```csharp
var context = new PipelineContext();
context.Items[typeof(InMemorySourceNode<int>).FullName!] = new[] { 1, 2, 3 };

var runner = new PipelineRunner();
await runner.RunAsync<TestPipeline>(context);

// Retrieve results
var sink = context.Items[typeof(InMemorySinkNode<int>).FullName!] as InMemorySinkNode<int>;
var results = await sink!.Completion;
```

See [Testing Pipelines](../extensions/testing/index.md) for details.

### Can I test individual nodes?

Yes. Call `ExecuteAsync` directly with test data:

```csharp
var transform = new MyTransform();
var context = new PipelineContext();
var result = await transform.ExecuteAsync(testData, context, CancellationToken.None);
Assert.Equal(expected, result);
```

### How do I mock external dependencies?

Use dependency injection with mock services:

```csharp
var mockService = new Mock<IMyService>();
var node = new MyNode(mockService.Object);
```

## Integration

### How do I use NPipeline with a database?

Implement custom source and sink nodes:

```csharp
public class DatabaseSource : SourceNode<Customer>
{
    private readonly string _connectionString;

    public override IDataPipe<Customer> ExecuteAsync(PipelineContext context, CancellationToken cancellationToken)
    {
        static IAsyncEnumerable<Customer> ReadAsync(string connStr, CancellationToken ct)
        {
            return Read();

            async IAsyncEnumerable<Customer> Read()
            {
                using var connection = new SqlConnection(connStr);
                await connection.OpenAsync(ct);
                // Read and yield customers
            }
        }

        return new StreamingDataPipe<Customer>(ReadAsync(_connectionString, cancellationToken));
    }
}
```

### How do I use NPipeline with Message Queues (like RabbitMQ)?

Implement a source node that reads from the queue:

```csharp
public class QueueSource : SourceNode<Message>
{
    private readonly IQueueClient _client;

    public override IDataPipe<Message> ExecuteAsync(PipelineContext context, CancellationToken cancellationToken)
    {
        static IAsyncEnumerable<Message> ReadAsync(IQueueClient client, CancellationToken ct)
        {
            return Read();

            async IAsyncEnumerable<Message> Read()
            {
                while (!ct.IsCancellationRequested)
                {
                    var message = await client.ReceiveAsync(ct);
                    if (message != null)
                    {
                        yield return message;
                    }
                }
            }
        }

        return new StreamingDataPipe<Message>(ReadAsync(_client, cancellationToken));
    }
}
```

### Can I use NPipeline with dependency injection containers?

Yes, with the `NPipeline.Extensions.DependencyInjection` package:

```csharp
services.AddNPipeline(Assembly.GetExecutingAssembly());
// Your nodes are automatically registered and resolved
```

## Troubleshooting

### My pipeline is running out of memory

**Cause:** Likely loading all data at once instead of streaming.

**Solution:** Use async enumerable:

```csharp
// BAD - loads all data
var allData = database.GetAllRecords().ToList(); // ❌
return Task.FromResult(new StreamingDataPipe<T>(allData.ToAsyncEnumerable()));

// GOOD - streams data
async IAsyncEnumerable<T> GetDataAsync()
{
    foreach (var record in database.GetAllRecords()) // ✅ Lazy enumeration
        yield return record;
}
return Task.FromResult(new StreamingDataPipe<T>(GetDataAsync()));
```

### Pipeline is slow

**Solution:** Profile to find the bottleneck:

1. Check which transform is slow
2. Consider parallelism if CPU-bound
3. Consider batching if I/O-bound
4. Minimize allocations

### Nodes aren't being registered with DI

**Cause:** Assembly not scanned.

**Solution:** Pass assembly to `AddNPipeline`:

```csharp
services.AddNPipeline(Assembly.GetExecutingAssembly()); // ✅
// NOT just: services.AddNPipeline(); ❌
```

### CancellationToken not working

**Cause:** Not checking the token in nodes.

**Solution:** Check and respect the token:

```csharp
public override async Task ExecuteAsync(IDataPipe<T> input, PipelineContext context, CancellationToken cancellationToken)
{
    await foreach (var item in input.WithCancellation(cancellationToken)) // ✅
    {
        cancellationToken.ThrowIfCancellationRequested(); // ✅
        // Process item
    }
}
```

## :arrow_right: Next Steps

- **[Getting Started](../getting-started.md)** - Installation and quick start
- **[Common Patterns](../core-concepts/common-patterns.md)** - See practical examples
- **[Best Practices](../core-concepts/best-practices.md)** - Design guidelines
- **[Troubleshooting](troubleshooting.md)** - Common issues and solutions
