---
title: Synchronous Fast Paths and ValueTask Optimization
description: Deep-dive guide on optimizing transformer nodes for high-throughput scenarios using ValueTask to eliminate GC pressure.
sidebar_position: 2
---

# Synchronous Fast Paths and ValueTask Optimization

> :information_source: For general performance best practices, see [Performance Hygiene](performance-hygiene.md).

This is the **definitive guide** for understanding and implementing the `ValueTask<T>` pattern in transformer nodes. For a quick introduction, see [Performance Hygiene: Use ValueTask<T> for Fast Path Scenarios](performance-hygiene.md#use-valuetaskt-for-fast-path-scenarios).

## The Performance Paradox

A common performance pitfall in high-throughput ETL pipelines is the contradiction between advice and implementation:

> **The advice says:** "Minimize memory allocations to reduce GC pressure"
> **The code does:** Return `Task<T>` for all transformer nodes

This creates a subtle but critical performance problem: even when your transform work is **completely synchronous** (a cache hit, a simple calculation), you're still creating a heap-allocated `Task<T>` object to wrap the result.

In a pipeline processing **millions of items per second**, where many transforms are synchronous or have high synchronous fast-path rates, you can easily be creating **millions of tiny heap allocations per second**. This creates constant pressure on the garbage collector, causing pauses that directly undermine your throughput goals.

## The Solution: ValueTask

`ValueTask<T>` is a struct-based alternative to `Task<T>` that:

- **Allocates on the stack** (not the heap) when the result is available synchronously
- **Zero allocations** for the common case in cache-hit or synchronous scenarios
- **Seamlessly transitions** to true async work when needed

The tradeoff: You need to implement a two-path pattern—checking for the synchronous case first.

## The Pattern: Synchronous Fast Path + Asynchronous Slow Path

Here's the pattern that balances performance with practicality:

```csharp
public sealed class OptimizedTransform : ITransformNode<InputType, OutputType>
{
    private readonly ConcurrentDictionary<KeyType, OutputType> _cache = new();

    /// <summary>
    /// ValueTask enables zero-allocation returns when work is synchronous.
    /// </summary>
    public ValueTask<OutputType> ExecuteAsync(
        InputType item,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        // Fast path: Synchronous work (e.g., cache lookup, simple calculation)
        if (TryGetSynchronousResult(item, out var result))
        {
            // Return via ValueTask - no heap allocation!
            return new ValueTask<OutputType>(result);
        }

        // Slow path: Asynchronous work falls back to true async
        return new ValueTask<OutputType>(TransformAsync(item, context, cancellationToken));
    }

    private bool TryGetSynchronousResult(InputType item, out OutputType result)
    {
        // Example: Check cache
        return _cache.TryGetValue(ExtractKey(item), out result!);
    }

    private async Task<OutputType> TransformAsync(
        InputType item,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        var result = await ExpensiveOperationAsync(item, cancellationToken);
        return result;
    }

    private KeyType ExtractKey(InputType item) => /* ... */;
    private async Task<OutputType> ExpensiveOperationAsync(InputType item, CancellationToken ct) => /* ... */;
}
```

## Real-World Example: Cached Data Enrichment

Consider a typical ETL scenario where you enrich data by looking up additional information:

```csharp
public sealed class UserEnrichmentTransform : ITransformNode<UserId, EnrichedUser>
{
    private readonly ConcurrentDictionary<string, UserProfile> _profileCache = new();
    private readonly IUserDatabase _userDatabase;

    public UserEnrichmentTransform(IUserDatabase userDatabase)
    {
        _userDatabase = userDatabase;
    }

    /// <summary>
    /// For a pipeline processing 1 million user IDs per second with 90% cache hits,
    /// this eliminates 900,000 Task allocations per second.
    /// </summary>
    public ValueTask<EnrichedUser> ExecuteAsync(
        UserId userId,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        // Check cache first (usually succeeds)
        if (_profileCache.TryGetValue(userId.Value, out var cachedProfile))
        {
            // Fast path: Return immediately, zero heap allocation
            return new ValueTask<EnrichedUser>(
                new EnrichedUser(userId, cachedProfile)
            );
        }

        // Cache miss: Fall back to database lookup
        return new ValueTask<EnrichedUser>(
            FetchAndEnrichAsync(userId, context, cancellationToken)
        );
    }

    private async Task<EnrichedUser> FetchAndEnrichAsync(
        UserId userId,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        var profile = await _userDatabase.GetProfileAsync(userId.Value, cancellationToken);
        _profileCache.TryAdd(userId.Value, profile);
        return new EnrichedUser(userId, profile);
    }
}

public record UserId(string Value);
public record UserProfile(string Name, string Email, DateTime CreatedAt);
public record EnrichedUser(UserId Id, UserProfile Profile);
```

## Performance Impact

In a realistic high-volume ETL pipeline:

| Scenario | Items/Sec | Cache Hit Rate | Task Allocations/Sec | ValueTask Allocations/Sec | GC Pressure Reduction |
|----------|-----------|----------------|-------------------------|------------------------------|----------------------|
| Simple enrichment | 1,000,000 | 90% | 1,000,000 | 100,000 | **90%** |
| Lookup pipeline | 5,000,000 | 85% | 5,000,000 | 750,000 | **85%** |
| Stream transformation | 10,000,000 | 95% | 10,000,000 | 500,000 | **95%** |

**The compounding effect:** Reduced allocations → Less GC pressure → Fewer GC pauses → More throughput → Lower latency

## Practical Guidelines

### When to Use `ValueTask` for Transforms

✅ **Use `ValueTask` when:**

- The transform can complete synchronously in the common case
- You have a cache, in-memory lookup, or fast path
- The synchronous case is likely to happen frequently
- You're optimizing for throughput in high-volume scenarios

❌ **Use `Task` when:**

- The transform is almost always asynchronous (database queries, network calls every time)
- You want simpler code and the performance benefit is marginal
- You're building a library and want to keep the interface simple
- The pipeline volume is low enough that allocations don't matter

### Implementation Checklist

- [ ] **Identify the fast path:** Where can the transform return synchronously?
- [ ] **Measure the fast-path hit rate:** Is it worth optimizing? (Usually yes if > 50%)
- [ ] **Implement `TryGetSynchronousResult()`:** Extract the synchronous case
- [ ] **Benchmark it:** Use BenchmarkDotNet to measure allocation reduction
- [ ] **Document it:** Explain why `ValueTask<T>` is used and what the fast path is
- [ ] **Test both paths:** Ensure your code works when fast path returns and when it doesn't

## Code Examples

### Example 1: Simple Transformation (Always Synchronous)

If your transform is **always** synchronous, even simpler:

```csharp
public sealed class SimpleCalculationTransform : ITransformNode<int, int>
{
    /// <summary>
    /// Pure synchronous work: square each number.
    /// Using ValueTask eliminates Task allocation overhead.
    /// </summary>
    public ValueTask<int> ExecuteAsync(
        int item,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        // No async work at all
        return new ValueTask<int>(item * item);
    }
}
```

### Example 2: Format Transformation with Optional Fallback

```csharp
public sealed class DataFormatTransform : ITransformNode<RawData, FormattedData>
{
    private readonly IFormatterCache _formatterCache;
    private readonly INetworkFormatterService _networkFormatter;

    public ValueTask<FormattedData> ExecuteAsync(
        RawData item,
        PipelineContext context,
        CancellationToken cancellationToken)
    {
        // Try local cache (fast synchronous path)
        if (_formatterCache.TryFormat(item, out var formatted))
        {
            return new ValueTask<FormattedData>(formatted);
        }

        // Fall back to network service if needed (slow async path)
        return new ValueTask<FormattedData>(
            _networkFormatter.FormatAsync(item, cancellationToken)
        );
    }
}
```

## Critical Constraints: When NOT to Use ValueTask

While ValueTask is powerful, it comes with strict constraints. Understanding these is essential for correctness.

### Never Await More Than Once

**The Rule:** You can only `await` a `ValueTask<T>` exactly once. Multiple awaits on the same `ValueTask<T>` are undefined behavior and will cause exceptions or incorrect results.

```csharp
// INCORRECT - DO NOT DO THIS
var valueTask = GetValueAsync("key");
var result1 = await valueTask;  // First await - OK
var result2 = await valueTask;  // Second await - UNDEFINED BEHAVIOR (exception or wrong result)
```

**Why?** The struct-based nature of `ValueTask<T>` means its state is mutable. After the first await completes, the internal state is consumed. A second await has nowhere to go.

**Correct usage:**

```csharp
// CORRECT
var result1 = await GetValueAsync("key");
var result2 = await GetValueAsync("key"); // Call the method again
```

### Avoid When Always Asynchronous

If your method **always** performs async work—never returns synchronously—there's no benefit to `ValueTask<T>`. The wrapper adds complexity without any allocation savings.

```csharp
// WRONG - Always async, so no benefit
public ValueTask<int> ComputeExpensiveAsync()
{
    return new ValueTask<int>(ExpensiveComputationAsync());
}

// CORRECT - Use Task for always async operations
public Task<int> ComputeExpensiveAsync()
{
    return ExpensiveComputationAsync();
}
```

In this case, the synchronous fast path never exists, so you're just adding complexity.

### Consider Public APIs Carefully

If this is a public API that external callers will use, consider using `Task<T>` instead. Your callers need to understand the constraints of `ValueTask<T>` (single await, no ConfigureAwait) to use it correctly. If those constraints aren't explicitly documented and understood, you may create subtle bugs in calling code.

```csharp
// If this is internal or well-documented, ValueTask is fine
internal ValueTask<int> GetItemAsync(string key)
{
    // ...
}

// If this is public, consider whether ValueTask constraints are worth the performance gain
// or whether Task is the safer choice for API stability
public Task<int> GetItemAsync(string key)
{
    // Simpler contract, no surprise constraints
}
```

### ConfigureAwait Not Supported

`ValueTask<T>` does not support `ConfigureAwait()`. If your code requires `ConfigureAwait(false)` for library code or UI synchronization context handling, you cannot use `ValueTask<T>`.

```csharp
// WRONG - ConfigureAwait not supported on ValueTask
var result = await GetValueAsync().ConfigureAwait(false);

// CORRECT if you need ConfigureAwait
public Task<string> GetValueAsync()
{
    return FetchAsync().ConfigureAwait(false);
}
```

## See Also

- [Performance Hygiene](performance-hygiene.md) - Comprehensive performance best practices
- [Transform Nodes](../core-concepts/nodes/transform-nodes.md) - Node implementation details and ValueTask optimization patterns
- [Sample: High-Performance Transforms](../../samples/Sample_02_HighPerformanceTransform/) - Complete working example

## Benchmarking Template

Use BenchmarkDotNet to measure the impact:

```csharp
[MemoryDiagnoser]
public class TransformNodeBenchmarks
{
    private ITransformNode<InputType, OutputType> _taskVersion;
    private ITransformNode<InputType, OutputType> _valuetaskVersion;
    private InputType[] _testData;

    [GlobalSetup]
    public void Setup()
    {
        _testData = GenerateTestData(10000);
        // Initialize both implementations
    }

    [Benchmark]
    public async Task TaskVersion()
    {
        foreach (var item in _testData)
        {
            await _taskVersion.ExecuteAsync(item, null!, default);
        }
    }

    [Benchmark]
    public async Task ValueTaskVersion()
    {
        foreach (var item in _testData)
        {
            await _valuetaskVersion.ExecuteAsync(item, null!, default);
        }
    }
}
```

The `[MemoryDiagnoser]` attribute will show you the allocation difference between `Task<T>` and `ValueTask<T>` approaches.
