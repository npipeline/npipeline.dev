# Pipeline Validation Extensions - Usage Guide

The `PipelineBuilderValidationExtensions` class provides fluent methods for validating and analyzing pipeline structures before building. This enables early error detection and helps with debugging complex pipelines.

## Available Methods

### 1. `Validate()` - Validate Pipeline Structure

Validates the current pipeline structure without building the complete pipeline.

```csharp
var builder = new PipelineBuilder()
    .AddSource<MySource, int>("source")
    .AddTransform<MyTransform, int, string>("transform")
    .AddSink<MySink, string>("sink");

builder.Connect("source", "transform");
builder.Connect("transform", "sink");

// Validate before building
var result = builder.Validate();
if (!result.IsValid)
{
    foreach (var error in result.Errors)
        Console.WriteLine($"Error: {error}");
}
else
{
    var pipeline = builder.Build(); // Safe to build
}
```

**Returns:** `PipelineValidationResult` containing:

- `IsValid`: Boolean indicating if all errors passed
- `Errors`: List of error messages
- `Warnings`: List of warning messages
- `Issues`: Complete list of validation issues with severity and category

### 2. `CanConnect<TData>()` - Pre-Check Connection Validity

Checks if a connection between two nodes is valid before adding it to the pipeline.

```csharp
var builder = new PipelineBuilder();
var source = builder.AddSource<MySource, int>("source");
var transform = builder.AddTransform<MyTransform, int, string>("transform");

// Check if connection is valid
if (builder.CanConnect(source, transform, out var reason))
{
    builder.Connect(source, transform);
}
else
{
    Console.WriteLine($"Cannot connect: {reason}");
}
```

**Checks:**

- Type compatibility between source output and target input
- Whether the connection would create a cycle
- Whether both nodes exist in the builder
- Self-loop detection

**Returns:** Boolean indicating validity, with optional reason string explaining why the connection is invalid.

### 3. `ToMermaidDiagram()` - Generate Visual Diagram

Generates a Mermaid flowchart diagram of the current pipeline structure.

```csharp
var builder = new PipelineBuilder()
    .AddSource<MySource, int>("source")
    .AddTransform<MyTransform, int, string>("transform")
    .AddSink<MySink, string>("sink");

builder.Connect("source", "transform");
builder.Connect("transform", "sink");

var mermaid = builder.ToMermaidDiagram();
Console.WriteLine(mermaid);

/* Output:
graph TD
    source["source : Source"]
    transform["transform : Transform"]
    sink["sink : Sink"]
    source --> transform
    transform --> sink
*/
```

**Use Cases:**

- Visualize complex pipelines in Mermaid Live Editor
- Generate documentation diagrams
- Debug pipeline structure visually
- Share pipeline designs in GitHub/documentation

### 4. `Describe()` - Get Text Description

Gets a human-readable textual description of the current pipeline structure.

```csharp
var builder = new PipelineBuilder()
    .AddSource<MySource, int>("source")
    .AddSink<MySink, string>("sink");

builder.Connect("source", "sink");

var description = builder.Describe();
Console.WriteLine(description);

/* Output:
Nodes:
  source | source | Source | MySource | In=-, Out=System.Int32
  sink | sink | Sink | MySink | In=System.String, Out=-

Edges:
  source --> sink
*/
```

**Use Cases:**

- Debugging and logging pipeline structures
- Text-based reports
- Console output for pipeline analysis

## Validation Results Structure

```csharp
public sealed record PipelineValidationResult(ImmutableList<ValidationIssue> Issues)
{
    // Built-in properties
    public bool IsValid => Issues.All(i => i.Severity != ValidationSeverity.Error);
    public ImmutableList<string> Errors => Issues
        .Where(i => i.Severity == ValidationSeverity.Error)
        .Select(i => i.Message)
        .ToImmutableList();
    public ImmutableList<string> Warnings => Issues
        .Where(i => i.Severity == ValidationSeverity.Warning)
        .Select(i => i.Message)
        .ToImmutableList();
}
```

## Validation Rules Overview

NPipeline includes comprehensive validation rules that run automatically during pipeline building and validation. Rules are categorized as **core** (always applied) and **extended** (enabled by default, opt-out via `WithoutExtendedValidation()`).

### Core Rules (Always Applied)

These rules prevent invalid pipeline construction and are always checked:

1. **UniqueNodeNameRule**
   - Ensures all node names within a pipeline are unique
   - Prevents confusion and naming conflicts
   - **Severity:** Error

2. **DuplicateNodeIdRule**
   - Prevents duplicate node IDs from being added to the same pipeline
   - Node IDs must be unique for proper graph traversal
   - **Severity:** Error

3. **EdgeReferenceRule**
   - Validates that all edges reference valid, existing nodes
   - Prevents dangling connections or references to non-existent nodes
   - **Severity:** Error

4. **SourceAndReachabilityRule**
   - Ensures at least one source node exists in the pipeline
   - Verifies all nodes are reachable from at least one source node
   - Prevents unreachable/orphaned nodes
   - **Severity:** Error

5. **CycleDetectionRule**
   - Enforces that the pipeline graph is acyclic (DAG - Directed Acyclic Graph)
   - Detects circular dependencies in pipeline topology
   - **Severity:** Error

### Extended Rules (Enabled by Default)

Extended rules are **enabled by default** to provide additional guidance on best practices and potential issues. Use `builder.WithoutExtendedValidation()` to disable them if maximum build performance is critical:

1. **MissingSinkRule**
   - Warns if the pipeline has no sink nodes
   - Sinks are typically needed to consume pipeline output
   - **Severity:** Warning
   - **When to Enable:** Development and testing to catch incomplete pipelines

2. **SelfLoopRule**
   - Detects when a node is connected to itself
   - Self-loops are rarely intentional and usually indicate errors
   - **Severity:** Warning

3. **DuplicateEdgeRule**
   - Prevents duplicate connections between the same pair of nodes
   - Multiple connections between two nodes serve no purpose
   - **Severity:** Warning

4. **MultiInboundNonJoinRule**
   - Warns if non-join nodes have multiple input connections
   - Only join nodes are designed to handle multiple inputs
   - Other node types expect a single input stream
   - **Severity:** Warning

5. **TypeCompatibilityRule**
   - Validates that output types from source nodes match input types of target nodes
   - Ensures data flows correctly through the pipeline without type mismatches
   - **Severity:** Error

6. **ResilienceConfigurationRule**
   - Validates that nodes using `ResilientExecutionStrategy` are properly configured for node restarts
   - Checks for error handlers, retry options, and materialization limits
   - **Severity:** Warning
   - **When to Enable:** When using resilience features for node restart capability
   - See [Resilience Configuration Rule Details](#resilience-configuration-rule-details) below for details

7. **ParallelConfigurationRule**
   - Validates that nodes using parallel execution have appropriate queue and parallelism settings
   - Detects potential memory issues and performance antipatterns
   - **Severity:** Warning
   - **When to Enable:** When using parallel execution for CPU-bound or I/O-bound workloads
   - See [Parallel Configuration Rule Details](#parallel-configuration-rule-details) below for details

### Resilience Configuration Rule Details

For nodes with `ResilientExecutionStrategy`, validates:

- **Error Handler** - `IPipelineErrorHandler` is registered (required for restart decisions)
- **Restart Attempts** - `MaxNodeRestartAttempts > 0` is configured
- **Materialization** - `MaxMaterializedItems` is positive (not null or zero) to prevent unbounded memory
- **Retry Configuration** - Retry options are set at graph or node level

**Quick Fix:** Configure error handling and retry options before enabling resilience (see [Extended Validation with Advanced Features](#extended-validation-with-advanced-features) example below).

### Parallel Configuration Rule Details

For nodes with parallel execution, validates:

- **Queue Limits** - No high parallelism (>4) without `MaxQueueLength` to prevent unbounded memory growth
- **Order Preservation** - Warns if high parallelism (>8) with `PreserveOrdering: true` causes buffering/latency
- **Drop Policies** - Detects `MaxQueueLength: null` with drop policies (policy would have no effect)
- **Thread Explosion** - Warns if parallelism exceeds `ProcessorCount * 4`

**Quick Fix:** Set appropriate `MaxQueueLength` and `PreserveOrdering` based on workload (see [Extended Validation with Advanced Features](#extended-validation-with-advanced-features) example below).

## Validation Workflow & Patterns

### Quick Reference: Validation Methods

Use these methods during pipeline construction and testing:

- **`CanConnect()`** - Check connection validity before adding it
- **`Validate()`** - Run all validation rules and get comprehensive results  
- **`ToMermaidDiagram()`** - Generate visual diagram for documentation
- **`Describe()`** - Get text description for logging/debugging
- **`Build()` / `TryBuild()`** - Create final pipeline after validation

## Complete Example

```csharp
public void BuildAndValidatePipeline()
{
    var builder = new PipelineBuilder();
    
    // Build pipeline
    var source = builder.AddSource<DataSource, int>("source");
    var transform = builder.AddTransform<Uppercase, int, string>("transform");
    var sink = builder.AddSink<ConsoleSink, string>("sink");
    
    // Validate before connecting
    if (!builder.CanConnect(source, transform, out var reason))
    {
        throw new InvalidOperationException($"Cannot connect: {reason}");
    }
    
    builder.Connect(source, transform);
    
    if (!builder.CanConnect(transform, sink, out reason))
    {
        throw new InvalidOperationException($"Cannot connect: {reason}");
    }
    
    builder.Connect(transform, sink);
    
    // Comprehensive validation
    var validationResult = builder.Validate();
    if (!validationResult.IsValid)
    {
        Console.WriteLine("Validation errors:");
        foreach (var error in validationResult.Errors)
            Console.WriteLine($"  - {error}");
        return;
    }
    
    // Generate visualization for documentation
    var diagram = builder.ToMermaidDiagram();
    File.WriteAllText("pipeline.mermaid", diagram);
    
    // Build and run
    var pipeline = builder.Build();
    // ... execute pipeline
}
```

### Extended Validation with Advanced Features

When working with resilience or parallel execution:

```csharp
public void BuildPipelineWithAdvancedFeatures()
{
    var builder = new PipelineBuilder();  // Extended validation enabled by default
    
    var source = builder.AddSource<DataSource, int>("source");
    var parallelTransform = builder.AddTransform<ParallelTransform, int, string>("transform");
    var resilientSink = builder.AddSink<ResilientSink, string>("sink");
    
    builder.Connect(source, parallelTransform);
    builder.Connect(parallelTransform, resilientSink);
    
    // Configure parallel execution
    var parallelOptions = new ParallelOptions(
        MaxDegreeOfParallelism: Environment.ProcessorCount * 2,
        MaxQueueLength: 100,
        QueuePolicy: BoundedQueuePolicy.Block,
        PreserveOrdering: false);
    builder.SetNodeExecutionOption(parallelTransform.Id, parallelOptions);
    
    // Configure resilience
    builder.AddPipelineErrorHandler<MyErrorHandler>();
    builder.WithRetryOptions(opts => opts.With(
        maxNodeRestartAttempts: 3,
        maxMaterializedItems: 1000));
    builder.WithResilience(resilientSink);
    
    // Validate - checks both core and extended rules
    var result = builder.Validate();
    if (!result.IsValid)
    {
        foreach (var error in result.Errors)
            Console.WriteLine($"Error: {error}");
        return;
    }
    
    // Display warnings from extended rules
    foreach (var warning in result.Warnings)
        Console.WriteLine($"Warning: {warning}");
    
    var pipeline = builder.Build();
}
```

## Error Handling Strategy

**Recommended Validation Pattern:**

1. **Build phase** - Use `CanConnect()` to validate each connection as you build
2. **Validation phase** - Call `Validate()` with appropriate rule scope (core or extended)
3. **Diagnostic phase** - Use `Describe()` or `ToMermaidDiagram()` to understand issues
4. **Build phase** - Call `Build()` or `TryBuild()` for final pipeline creation

**Core vs Extended Validation:**

- **Core rules** (always active) catch fundamental graph errors
- **Extended rules** (enabled by default) guide best practices for features like resilience and parallelism
- Extended validation is recommended for development, testing, and production
- Use `WithoutExtendedValidation()` only if maximum build performance is critical

**Validation Example with Error Handling:**

```csharp
public Pipeline BuildPipelineWithErrorHandling(bool skipExtendedValidation = false)
{
    var builder = new PipelineBuilder();
    if (skipExtendedValidation)
        builder = builder.WithoutExtendedValidation();
    
    try
    {
        // Step 1: Build with connection validation
        var source = builder.AddSource<MySource, int>("source");
        var transform = builder.AddTransform<MyTransform, int, string>("transform");
        var sink = builder.AddSink<MySink, string>("sink");
        
        if (!builder.CanConnect(source, transform, out var reason))
            throw new InvalidOperationException($"Invalid connection: {reason}");
        builder.Connect(source, transform);
        
        if (!builder.CanConnect(transform, sink, out reason))
            throw new InvalidOperationException($"Invalid connection: {reason}");
        builder.Connect(transform, sink);
        
        // Step 2: Comprehensive validation
        var validation = builder.Validate();
        if (!validation.IsValid)
        {
            Console.WriteLine("Validation errors:");
            foreach (var error in validation.Errors)
                Console.WriteLine($"  - {error}");
            throw new InvalidOperationException("Pipeline validation failed");
        }
        
        if (validation.Warnings.Count > 0)
        {
            Console.WriteLine("Validation warnings:");
            foreach (var warning in validation.Warnings)
                Console.WriteLine($"  - {warning}");
        }
        
        // Step 3: Safe to build
        return builder.Build();
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Pipeline creation failed: {ex.Message}");
        // Generate diagnostic report
        Console.Error.WriteLine("\nPipeline structure:");
        Console.Error.WriteLine(builder.Describe());
        throw;
    }
}
```

## Performance Notes

- `Validate()` and `Describe()` construct a temporary `PipelineGraph` for analysis
- No graph freezing occurs - builder state remains mutable
- `CanConnect()` uses depth-first search for cycle detection (O(V+E) complexity)
- Extended validation rules add minimal overhead (typically <1ms per build)
- Use `WithoutExtendedValidation()` only if you need maximum build performance in hot paths
- Consider caching validation results for repeated validations

## Integration with Build Validation

These extensions complement the standard `Build()` and `TryBuild()` methods:

- `Validate()` - Early, incremental validation
- `Build()` - Final validation with `GraphValidationMode` settings
- `TryBuild()` - Non-throwing validation wrapper

Use extensions during development; rely on `Build()` for final pipeline creation.
