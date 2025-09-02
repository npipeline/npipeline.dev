---
title: ValueTask Transforms
description: Optimize synchronous transform nodes using ValueTask to eliminate allocation overhead.
sidebar_position: 10
---

## Overview

NPipeline's `TransformNode<TIn, TOut>` base class supports an optional `ExecuteValueTaskAsync` override that enables high-performance, allocation-free execution for transforms that complete synchronously.

Execution strategies (sequential, parallel, and custom) automatically detect nodes implementing this optimization and avoid Task allocation overhead when the work completes synchronously.

## Why ValueTask?

When a transform operation **completes synchronously** (e.g., in-memory validation, simple calculations), the standard `Task<T>` approach creates allocations:

```csharp
// Standard approach - allocates Task<T> even when work is immediate
public override Task<int> ExecuteAsync(int item, PipelineContext context, CancellationToken cancellationToken)
{
    return Task.FromResult(item + 1); // Allocates even though it's synchronous
}
```

`ValueTask<T>` avoids this:

```csharp
// ValueTask approach - zero allocation when complete immediately
protected internal override ValueTask<int> ExecuteValueTaskAsync(int item, PipelineContext context, CancellationToken cancellationToken)
{
    return ValueTask.FromResult(item + 1); // No allocation
}
```

For pipelines processing millions of items through synchronous transforms, this can reduce garbage collection pressure and improve throughput.

## When to Use ValueTask Transforms

Use `ExecuteValueTaskAsync` when your transform:

- ✅ **Completes synchronously** (no I/O, no waiting)
- ✅ **Is in a hot path** (processes many items)
- ✅ **Has simple logic** (validation, transformation, mapping)

Don't use `ExecuteValueTaskAsync` if your transform:

- ❌ Always performs async operations (database calls, API requests, `await` operations)
- ❌ Is not performance-critical
- ❌ Would require complex branching based on sync/async conditions

## Basic Example

```csharp
using NPipeline.Nodes;
using NPipeline.Pipeline;

/// <summary>
/// Validates and transforms items synchronously.
/// Uses ExecuteValueTaskAsync to avoid Task allocations.
/// </summary>
public sealed class FastValidator : TransformNode<int, string>
{
    public override Task<string> ExecuteAsync(int item, PipelineContext context, CancellationToken cancellationToken)
    {
        // This is called by frameworks expecting Task<T>
        // It delegates to ExecuteValueTaskAsync and wraps the result
        return FromValueTask(ExecuteValueTaskAsync(item, context, cancellationToken));
    }

    protected internal override ValueTask<string> ExecuteValueTaskAsync(int item, PipelineContext context, CancellationToken cancellationToken)
    {
        // Fast, synchronous work - no allocation
        if (item < 0)
            throw new ArgumentException("Item must be non-negative");

        return ValueTask.FromResult($"Item-{item}");
    }
}
```

## Mixed Sync/Async Example

For transforms that are **mostly synchronous** but occasionally async:

```csharp
public sealed class CachedLookupTransform : TransformNode<string, string>
{
    private readonly Dictionary<string, string> _cache = new();
    private readonly Func<string, Task<string>> _lookupAsync;

    public CachedLookupTransform(Func<string, Task<string>> lookupAsync)
    {
        _lookupAsync = lookupAsync;
    }

    public override Task<string> ExecuteAsync(string item, PipelineContext context, CancellationToken cancellationToken)
    {
        return FromValueTask(ExecuteValueTaskAsync(item, context, cancellationToken));
    }

    protected internal override async ValueTask<string> ExecuteValueTaskAsync(string item, PipelineContext context, CancellationToken cancellationToken)
    {
        // Fast path: check cache first (synchronous)
        if (_cache.TryGetValue(item, out var cached))
            return cached;

        // Slow path: async lookup if not cached
        var result = await _lookupAsync(item);
        _cache[item] = result;
        return result;
    }
}
```

In this case:

- **Cache hits** return a `ValueTask` with no allocation
- **Cache misses** still perform async work but benefit from the ValueTask envelope

## Interaction with Execution Strategies

All execution strategies (sequential, parallel variants) automatically detect `ExecuteValueTaskAsync` and prefer it over `ExecuteAsync`:

### Sequential Strategy

```csharp
// No special configuration needed - it just works
var pipeline = new PipelineBuilder()
    .AddSource(/* ... */)
    .AddTransform<FastValidator, int, string>()  // Automatically uses ValueTask path
    .AddSink(/* ... */);
```

### Parallel Strategy

```csharp
// Parallel strategies also benefit from ValueTask optimization
var pipeline = new PipelineBuilder()
    .AddSource(/* ... */)
    .AddTransform<FastValidator, int, string>()
    .WithParallelism(Environment.ProcessorCount)  // Uses ValueTask path in worker threads
    .AddSink(/* ... */);
```

## Performance Implications

Benchmarks show typical improvements for synchronous transforms:

| Scenario | Improvement |
|----------|-------------|
| Simple validation (synchronous) | 10-15% throughput increase |
| Mapping operations (synchronous) | 5-10% throughput increase |
| Cache-heavy workloads | 20-30% throughput increase (when hit rate is high) |

Note: Improvements depend on workload and system load. Always profile your specific pipelines.

## Implementation Pattern

The recommended pattern for new transform nodes:

```csharp
public sealed class MyOptimizedTransform : TransformNode<TIn, TOut>
{
    // Step 1: Override ExecuteAsync to delegate to ExecuteValueTaskAsync
    public override Task<TOut> ExecuteAsync(TIn item, PipelineContext context, CancellationToken cancellationToken)
    {
        return FromValueTask(ExecuteValueTaskAsync(item, context, cancellationToken));
    }

    // Step 2: Implement the ValueTask version with your actual logic
    protected internal override ValueTask<TOut> ExecuteValueTaskAsync(TIn item, PipelineContext context, CancellationToken cancellationToken)
    {
        // Your synchronous (or mostly synchronous) work here
        var result = DoWork(item);
        return ValueTask.FromResult(result);
    }

    private TOut DoWork(TIn item)
    {
        // Implementation
        throw new NotImplementedException();
    }
}
```

## Error Handling

Error handling works transparently:

```csharp
public sealed class ValidatingTransform : TransformNode<Order, Order>
{
    public override Task<Order> ExecuteAsync(Order item, PipelineContext context, CancellationToken cancellationToken)
    {
        return FromValueTask(ExecuteValueTaskAsync(item, context, cancellationToken));
    }

    protected internal override ValueTask<Order> ExecuteValueTaskAsync(Order item, PipelineContext context, CancellationToken cancellationToken)
    {
        // Exceptions are handled by execution strategies just like in ExecuteAsync
        if (item.Total < 0)
            throw new ArgumentException("Order total must be non-negative");

        return ValueTask.FromResult(item);
    }
}
```

Both synchronous exceptions and async exceptions (if your ValueTask is faulted) are caught and handled by error handlers configured on the node.

## Testing ValueTask Transforms

Test ValueTask transforms the same way you test regular transforms:

```csharp
[Fact]
public async Task FastValidator_ValidatesCorrectly()
{
    // Arrange
    var transform = new FastValidator();
    var context = PipelineContext.Default;

    // Act
    var result = await transform.ExecuteAsync(42, context, CancellationToken.None);

    // Assert
    Assert.Equal("Item-42", result);
}

[Fact]
public async Task FastValidator_ThrowsOnInvalid()
{
    // Arrange
    var transform = new FastValidator();
    var context = PipelineContext.Default;

    // Act & Assert
    await Assert.ThrowsAsync<ArgumentException>(
        () => transform.ExecuteAsync(-1, context, CancellationToken.None));
}
```

The testing utilities handle both sync and async paths transparently.

## Opt-in Optimization

ValueTask transforms are entirely optional and transparent:

- Existing transforms without `ExecuteValueTaskAsync` override continue to work
- No configuration required—execution strategies handle detection automatically
- The optimization is transparent to pipeline authors

## Summary

Use `ExecuteValueTaskAsync` to optimize synchronous transforms:

| Aspect | Details |
|--------|---------|
| **When** | Synchronous, hot-path transforms |
| **How** | Override `ExecuteValueTaskAsync`, use `FromValueTask` helper |
| **Benefit** | Reduced allocations, improved throughput |
| **Adoption** | Opt-in, automatic detection by execution strategies |
| **Testing** | Same as regular transforms |
| **Strategies** | Works with sequential, parallel, and custom execution strategies |

## See Also

- [Transform Nodes](../nodes/transforms.md) - General transform node documentation
- [Best Practices](../best-practices.md) - General best practices including performance optimization
- [Execution Strategies](../../architecture/execution-flow.md) - How strategies interact with transforms
