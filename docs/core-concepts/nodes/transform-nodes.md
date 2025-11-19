---
title: Transform Nodes
description: Learn how to implement transform nodes and optimize for high performance using ValueTask<T>.
sidebar_position: 2
---

# Transform Nodes (`ITransformNode<TIn, TOut>`)

Transform nodes take an input stream of `TInput` items, perform some operation on them, and then produce an output stream of `TOutput` items. They are the workhorses of data manipulation within a pipeline.

## Interface Definition

```csharp
public interface ITransformNode<TIn, TOut> : INode
{
    Task<TOut> ExecuteAsync(TIn item, PipelineContext context, CancellationToken cancellationToken);
}
```

## Implementation Example

A transform that squares each incoming number:

```csharp
using NPipeline;
using NPipeline.Nodes;
using NPipeline.Pipeline;

public sealed class SquareTransform : ITransformNode<int, int>
{
    public Task<int> ExecuteAsync(int item, PipelineContext context, CancellationToken cancellationToken)
    {
        return Task.FromResult(item * item);
    }
}
```

## Performance Considerations

Transform nodes support both `Task<T>` and `ValueTask<T>` return types. For high-throughput 
scenarios where transforms often complete synchronously (cache hits, simple calculations), 
`ValueTask<T>` can eliminate up to 90% of garbage collection pressure.

**See:** [Synchronous Fast Paths and ValueTask Optimization](../../advanced-topics/synchronous-fast-paths.md) 
for complete implementation guide.

## Common Transform Patterns

### Data Enrichment

```csharp
public sealed class EnrichmentTransform : ITransformNode<Order, EnrichedOrder>
{
    private readonly ILookupService _lookupService;

    public EnrichmentTransform(ILookupService lookupService)
    {
        _lookupService = lookupService;
    }

    public async Task<EnrichedOrder> ExecuteAsync(Order order, PipelineContext context, CancellationToken cancellationToken)
    {
        var customerInfo = await _lookupService.GetCustomerAsync(order.CustomerId, cancellationToken);
        return new EnrichedOrder
        {
            OrderId = order.OrderId,
            CustomerId = order.CustomerId,
            CustomerName = customerInfo.Name,
            Total = order.Total
        };
    }
}
```

### Validation and Filtering

```csharp
public sealed class ValidationTransform : ITransformNode<RawData, ValidatedData>
{
    public ValueTask<ValidatedData> ExecuteAsync(RawData item, PipelineContext context, CancellationToken cancellationToken)
    {
        // Synchronous validation - use ValueTask to avoid allocation
        if (string.IsNullOrWhiteSpace(item.Value))
        {
            throw new InvalidOperationException("Value cannot be empty");
        }

        var validated = new ValidatedData
        {
            Id = item.Id,
            Value = item.Value.Trim()
        };

        return new ValueTask<ValidatedData>(validated);
    }
}
```

### Type Conversion

```csharp
public sealed class ConversionTransform : ITransformNode<string, int>
{
    public ValueTask<int> ExecuteAsync(string item, PipelineContext context, CancellationToken cancellationToken)
    {
        if (int.TryParse(item, out var result))
        {
            return new ValueTask<int>(result);
        }

        throw new FormatException($"Cannot convert '{item}' to int");
    }
}
```

## :arrow_right: Next Steps

* **[Sink Nodes](sink-nodes.md)**: Learn how to consume and finalize data at the end of your pipeline
* **[Performance Hygiene](../../advanced-topics/performance-hygiene.md)**: Dive deeper into optimization techniques
* **[Synchronous Fast Paths](../../advanced-topics/synchronous-fast-paths.md)**: Master the `ValueTask<T>` pattern in detail
