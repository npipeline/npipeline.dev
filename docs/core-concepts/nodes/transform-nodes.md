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

## Performance Considerations: `Task<T>` vs `ValueTask<T>`

### Critical Performance Insight: ValueTask Optimization for High-Volume Scenarios

**`ValueTask<T>` is critical for transformer nodes in high-volume pipelines.** In scenarios where your transforms can complete synchronously (cache lookups, in-memory calculations, fast-path operations), switching from `Task<T>` to `ValueTask<T>` can **eliminate up to 90% of garbage collection pressure** compared to standard task-based implementations.

Why? `Task<T>` always allocates on the heap, even when the result is immediately available. In pipelines processing millions of items per second, where many transforms have synchronous fast paths, this creates millions of unnecessary heap allocations per second. `ValueTask<T>`, being a struct, eliminates these allocations on the synchronous path.

**Example impact:** A pipeline processing 1,000,000 items per second with 90% synchronous cache hits using `ValueTask<T>` instead of `Task<T>` eliminates ~900,000 allocations per second—a 90% reduction in GC pressure for that operation.

For a detailed guide on implementing this pattern correctly, including code examples and constraints, see **[Synchronous Fast Paths and ValueTask Optimization](../advanced-topics/synchronous-fast-paths.md)**.

---

For **synchronous transforms** (work that completes immediately, such as cache lookups, simple mappings, or calculations), using `ValueTask<T>` instead of `Task<T>` can significantly improve performance in high-throughput scenarios.

**Why?** `Task<T>` is a reference type that always allocates on the heap, even when the result is available immediately. In high-volume ETL pipelines processing millions of items per second, this creates constant pressure on the garbage collector. `ValueTask<T>` is a struct that avoids heap allocation when the work is synchronous.

### Example: Cache-Based Transform with Synchronous Fast Path

This example shows a transformer that checks a cache first (synchronous fast path) and falls back to a database query if needed (asynchronous slow path):

```csharp
using NPipeline;
using NPipeline.Nodes;
using NPipeline.Pipeline;
using System.Collections.Concurrent;

public sealed class CachedLookupTransform : ITransformNode<string, UserData>
{
    private readonly ConcurrentDictionary<string, UserData> _cache = new();
    private readonly Func<string, Task<UserData>> _fetchFromDatabaseAsync;

    public CachedLookupTransform(Func<string, Task<UserData>> fetchFromDatabaseAsync)
    {
        _fetchFromDatabaseAsync = fetchFromDatabaseAsync;
    }

    /// <summary>
    /// Returns ValueTask instead of Task to avoid heap allocation in the common
    /// case where the value is found in cache (fast path).
    /// 
    /// Performance Impact: In a pipeline with 90% cache hit rates processing 10,000 items per second,
    /// using ValueTask eliminates approximately 9,000 heap allocations per second compared to Task<T>.
    /// This translates to ~90% reduction in GC pressure for high-hit-rate scenarios.
    /// </summary>
    public ValueTask<UserData> ExecuteAsync(string userId, PipelineContext context, CancellationToken cancellationToken)
    {
        // Fast path: Cache hit - no Task allocation needed
        if (_cache.TryGetValue(userId, out var cachedUser))
        {
            return new ValueTask<UserData>(cachedUser);
        }

        // Slow path: Asynchronous database fetch
        return new ValueTask<UserData>(FetchAndCacheAsync(userId, cancellationToken));
    }

    private async Task<UserData> FetchAndCacheAsync(string userId, CancellationToken cancellationToken)
    {
        var userData = await _fetchFromDatabaseAsync(userId);
        _cache.TryAdd(userId, userData);
        return userData;
    }
}

public record UserData(string Id, string Name, string Email);
```

**Performance Impact:** Using `ValueTask<T>` instead of `Task<T>` for cache-hit scenarios eliminates heap allocations on the fast path. For example, in a pipeline processing 10,000 cache lookups per second with 90% cache hits, you eliminate 9,000 unnecessary allocations per second, reducing garbage collection pressure by approximately 90%. This is not a minor optimization—it's the difference between a smooth, high-throughput pipeline and one that suffers from continuous GC pauses.

### Example: Simple Synchronous Transform

For transforms that are always synchronous (like simple mappings or calculations), you can return `ValueTask` directly without ever going async:

```csharp
using NPipeline;
using NPipeline.Nodes;
using NPipeline.Pipeline;

public sealed class PerformanceOptimizedTransform : ITransformNode<int, int>
{
    /// <summary>
    /// Pure synchronous work: use ValueTask to avoid heap allocation.
    /// This is ideal for high-volume transforms on synchronous hot paths.
    /// </summary>
    public ValueTask<int> ExecuteAsync(int item, PipelineContext context, CancellationToken cancellationToken)
    {
        // No async work at all - return the result directly as a ValueTask
        int result = item * item;
        return new ValueTask<int>(result);
    }
}
```

### When to Use `Task<T>` vs `ValueTask<T>`

| Scenario | Recommendation | Reason |
|----------|---|---|
| **Always asynchronous** (e.g., always calls async APIs) | Use `Task<T>` | No benefit from `ValueTask<T>`, and `Task<T>` is simpler |
| **Often synchronous, sometimes async** (e.g., cache check + fallback) | Use `ValueTask<T>` | Avoids allocation on the common synchronous path; can reduce allocations by 50-90% depending on cache hit rates |
| **Always synchronous** (e.g., in-memory calculations, simple mappings) | Use `ValueTask<T>` | Eliminates unnecessary heap allocations entirely |
| **Public API, contract stability matters** | Consider `Task<T>` | `ValueTask<T>` has constraints (can't await multiple times, no `ConfigureAwait`) |

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
* **[Performance Hygiene](../advanced-topics/performance-hygiene.md)**: Dive deeper into optimization techniques
* **[Synchronous Fast Paths](../advanced-topics/synchronous-fast-paths.md)**: Master the `ValueTask<T>` pattern in detail
