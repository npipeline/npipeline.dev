import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";

// Hero Section Component
const HeroSection: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", "heroBanner")}>
      <div className="container">
        <Heading as="h1" className="hero__title gradient-text">
          Build High-Performance, Type-Safe&nbsp;
          <span className="hide-on-mobile">
            <br />
          </span>
          Data Pipelines in .NET
        </Heading>
        <p className="hero__subtitle">
          NPipeline is a powerful, flexible library designed for constructing
          robust, graph-based streaming data workflows.
        </p>
        <p className="hero__subtitle">
          By combining the type safety of C# with a directed acyclic graph (DAG)
          architecture, NPipeline empowers developers to build complex ETL
          processes, real-time data streams, and event-driven architectures that
          are easy to test, debug, and maintain.
        </p>
        <div className="margin-top--lg">
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started/quick-start"
          >
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/why-npipeline"
          >
            Why NPipeline?
          </Link>
        </div>
      </div>
    </header>
  );
};

// The Problem Section Component
const ProblemSection: React.FC = () => {
  return (
    <section className="background--light">
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Data processing in .NET shouldn't feel like this
        </Heading>
        <div className="row">
          <div className="col col--4">
            <div className="card padding--lg">
              <Heading as="h3" className="text--center margin-bottom--md">
                Memory nightmares
              </Heading>
              <p>
                Your pipeline loads everything into memory, then crashes at 2 AM
                when someone uploads a file that's slightly larger than usual.
                You've added more RAM twice this year.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="card padding--lg">
              <Heading as="h3" className="text--center margin-bottom--md">
                Spaghetti transforms
              </Heading>
              <p>
                Your data processing logic started simple. Now it's 2,000 lines
                of nested loops and conditional statements that nobody wants to
                touch—or test.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="card padding--lg">
              <Heading as="h3" className="text--center margin-bottom--md">
                Silent failures
              </Heading>
              <p>
                One malformed record takes down your entire batch. You've
                wrapped everything in try-catch blocks, but errors still slip
                through to production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Solution Section Component
const SolutionSection: React.FC = () => {
  return (
    <section>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--md">
          A better way to process data
        </Heading>
        <p className={clsx("text--center", "margin-bottom--lg")}>
          NPipeline gives you a graph-based architecture where data flows
          through discrete, testable nodes. Each piece does one thing well.
          Complexity emerges from composition, not accumulation.
        </p>
        <div className="row">
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Sources
              </Heading>
              <p>
                Where data enters your pipeline. Read from files, databases,
                APIs, or message queues. Sources produce streams of typed items
                that flow downstream.
              </p>
            </div>
          </div>
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Transforms
              </Heading>
              <p>
                Where data gets processed. Validate, enrich, filter, aggregate,
                or reshape your data. Each transform is a focused,
                single-responsibility component.
              </p>
            </div>
          </div>
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Sinks
              </Heading>
              <p>
                Where data lands. Write to databases, send to APIs, or stream to
                files. Sinks consume the processed data and handle final
                delivery.
              </p>
            </div>
          </div>
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                The Graph
              </Heading>
              <p>
                Connect nodes to form a directed acyclic graph. See exactly how
                data flows through your system. Debug by tracing the path, not
                by hunting through nested loops.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Streaming Section Component
const StreamingSection: React.FC = () => {
  return (
    <section className="background--light">
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Process more data than fits in memory
        </Heading>
        <p className={clsx("text--center", "margin-bottom--lg")}>
          NPipeline is streaming-first. Data flows through your pipeline item by
          item, so memory usage stays constant regardless of dataset size.
          Process a million records or a billion—your memory footprint stays the
          same.
        </p>

        <div className="row margin-bottom--md">
          <div className="col col--12">
            <div className="card padding--lg">
              <Heading as="h3" className="margin-bottom--md">
                Real numbers, real impact
              </Heading>
              <div className="row">
                <div className="col col--4">
                  <div className="alert alert--info margin-bottom--md">
                    <Heading as="h4">1M records, 500 bytes each</Heading>
                    <p>
                      <strong>Eager loading:</strong> ~500 MB peak memory
                      <br />
                      <strong>NPipeline streaming:</strong> ~1-2 MB peak memory
                    </p>
                  </div>
                </div>
                <div className="col col--4">
                  <div className="alert alert--info margin-bottom--md">
                    <Heading as="h4">Sub-millisecond first item</Heading>
                    <p>
                      Start processing immediately. Don't wait for your entire
                      dataset to load before seeing results.
                    </p>
                  </div>
                </div>
                <div className="col col--4">
                  <div className="alert alert--info margin-bottom--md">
                    <Heading as="h4">Predictable GC behavior</Heading>
                    <p>
                      No surprise pauses. Memory usage scales with your
                      pipeline's complexity, not your data volume.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Performance Section Component
const PerformanceSection: React.FC = () => {
  return (
    <section>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Zero-allocation fast paths for high-throughput scenarios
        </Heading>
        <p className={clsx("text--center", "margin-bottom--lg")}>
          NPipeline uses <code>ValueTask&lt;T&gt;</code> to eliminate heap
          allocations for synchronous operations. Cache hits, validation checks,
          simple calculations—they all run without touching the heap.
        </p>

        <div className="row margin-bottom--md">
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                100,000 items/second, 90% cache hits
              </Heading>
              <p>
                That's <strong>90,000 Task allocations eliminated</strong> per
                second. Your GC pressure drops by up to 90%. Your P99 latency
                becomes predictable.
              </p>
            </div>
          </div>
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Plan-based execution
              </Heading>
              <p>
                NPipeline compiles your pipeline structure once. During
                execution, there's no reflection, no per-item routing
                decisions—just direct method dispatch.
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col col--12">
            <div className="card padding--lg">
              <div className="row">
                <div className="col col--4">
                  <div className="alert alert--success margin-bottom--md">
                    <Heading as="h4">Fast path</Heading>
                    <p>
                      Synchronous result available? Stack allocation, zero GC
                      pressure.
                    </p>
                  </div>
                </div>
                <div className="col col--4">
                  <div className="alert alert--success margin-bottom--md">
                    <Heading as="h4">Slow path</Heading>
                    <p>I/O required? Seamlessly transitions to true async.</p>
                  </div>
                </div>
                <div className="col col--4">
                  <div className="alert alert--success margin-bottom--md">
                    <Heading as="h4">Same code, both paths</Heading>
                    <p>Write it once. NPipeline handles the optimization.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Resilience Section Component
const ResilienceSection: React.FC = () => {
  return (
    <section className="background--light">
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Built for the real world, where things fail
        </Heading>
        <p className={clsx("text--center", "margin-bottom--lg")}>
          Production pipelines encounter bad data, network blips, and
          overwhelmed dependencies. NPipeline gives you the tools to handle
          failure gracefully—without bringing down your entire system.
        </p>

        <div className="row">
          <div className="col col--4">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Retry policies
              </Heading>
              <p>
                Transient failures get automatic retries with configurable
                backoff. Persistent failures trigger node restarts or route
                items to dead-letter queues.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Circuit breakers
              </Heading>
              <p>
                Protect downstream systems from cascading failures. When a
                dependency is struggling, stop hammering it and give it time to
                recover.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Granular error handling
              </Heading>
              <p>
                Handle errors at the item level or the stream level. One bad
                record doesn't have to poison your entire batch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Code Example Section Component
const CodeExampleSection: React.FC = () => {
  return (
    <section>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Code that reads like a diagram
        </Heading>
        <p className={clsx("text--center", "margin-bottom--lg")}>
          NPipeline's fluent API makes your pipeline structure visible in your
          code. The compiler enforces type safety between nodes—if it compiles,
          it connects.
        </p>

        <div className="card padding--md">
          <pre className="language-csharp">
            <code>
              {`public void Define(PipelineBuilder builder, PipelineContext context) 
{
    // Define your nodes
    var source = builder.AddSource<OrderSource, Order>();
    var validate = builder.AddTransform<ValidateOrder, Order, Order>();
    var enrich = builder.AddTransform<EnrichWithCustomer, Order, EnrichedOrder>();
    var sink = builder.AddSink<DatabaseSink, EnrichedOrder>();

    // Connect the graph — types must match
    builder.Connect(source, validate);
    builder.Connect(validate, enrich);
    builder.Connect(enrich, sink);
    
    // Add resilience
    builder.WithRetryOptions(new PipelineRetryOptions(
        MaxItemRetries: 3, 
        MaxNodeRestartAttempts: 2
    ));
}`}
            </code>
          </pre>
        </div>
        <p className="text--center margin-top--lg">
          Each node is a single class with a single responsibility. Test them in
          isolation. Compose them into complex workflows.
        </p>
      </div>
    </section>
  );
};

// Testability Section Component
const TestabilitySection: React.FC = () => {
  return (
    <section className="background--light">
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Designed for testing from day one
        </Heading>
        <p className={clsx("text--center", "margin-bottom--lg")}>
          Every node is a standalone class. Test your transforms with simple
          unit tests—no mocking of pipeline infrastructure required.
        </p>

        <div className="row">
          <div className="col col--4">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Isolated nodes
              </Heading>
              <p>
                Test each node independently. Pass in test data, assert on
                outputs. No pipeline ceremony required.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                In-memory testing
              </Heading>
              <p>
                Use the testing extensions to run entire pipelines in memory.
                Verify end-to-end behavior without external dependencies.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Assertion libraries
              </Heading>
              <p>
                First-class support for FluentAssertions and AwesomeAssertions.
                Write expressive tests that read like specifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Use Cases Section Component
const UseCasesSection: React.FC = () => {
  return (
    <section>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Built for these problems
        </Heading>
        <div className="row">
          <div className="col col--4">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                ETL workflows
              </Heading>
              <p>
                Extract from databases, APIs, and files. Transform with
                validation and enrichment. Load to your destination. All with
                clear, testable code.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Real-time streaming
              </Heading>
              <p>
                Process data as it arrives from message queues, webhooks, or IoT
                devices. Sub-millisecond latency to first item processed.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Data validation
              </Heading>
              <p>
                Implement complex validation rules as discrete, testable
                transforms. Route invalid items to review queues without
                stopping the pipeline.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Batch processing
              </Heading>
              <p>
                Process millions of historical records without running out of
                memory. Streaming architecture means predictable resource usage.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Event-driven systems
              </Heading>
              <p>
                React to events with complex processing logic. Fan out to
                multiple sinks. Handle backpressure gracefully.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Microservice integration
              </Heading>
              <p>
                Transform data between services with different schemas. Enrich
                with data from multiple sources. Maintain type safety across
                boundaries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Ecosystem Section Component
const EcosystemSection: React.FC = () => {
  return (
    <section className="background--light">
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Modular by design
        </Heading>
        <p className={clsx("text--center", "margin-bottom--lg")}>
          Start with the core library. Add extensions as you need them.
        </p>

        <div className="row">
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                NPipeline.DependencyInjection
              </Heading>
              <p>
                Full integration with Microsoft.Extensions.DependencyInjection.
                Constructor injection in nodes. Proper service lifetimes.
              </p>
            </div>
          </div>
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                NPipeline.Parallelism
              </Heading>
              <p>
                Parallel execution strategies for CPU-bound transforms.
                Configurable concurrency limits. Linear throughput scaling.
              </p>
            </div>
          </div>
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                NPipeline.Connectors
              </Heading>
              <p>
                Pre-built sources and sinks for common targets. CSV files,
                storage providers, and more. Unified abstraction layer.
              </p>
            </div>
          </div>
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                NPipeline.Testing
              </Heading>
              <p>
                In-memory test nodes. Assertion helpers for FluentAssertions and
                AwesomeAssertions. Test your pipelines without external deps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Get Started Section Component
const GetStartedSection: React.FC = () => {
  return (
    <section>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Ready to build better pipelines?
        </Heading>
        <p className={clsx("text--center", "margin-bottom--lg")}>
          Get started in minutes. Build your first pipeline in 15.
        </p>

        <div className="row">
          <div className="col col--12">
            <div className="card padding--lg text--center">
              <pre className="language-bash margin-bottom--md">
                <code>{`dotnet add package NPipeline`}</code>
              </pre>
              <div className="margin-top--lg">
                <Link
                  className="button button--primary button--lg"
                  to="/docs/getting-started/quick-start"
                >
                  Quick Start Guide
                </Link>
                <Link
                  className="button button--secondary button--lg"
                  to="/docs/core-concepts"
                >
                  Explore Core Concepts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main Homepage Component
const Home: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="High-performance, streaming data pipelines for .NET"
    >
      <HeroSection />
      <main>
        <ProblemSection />
        <SolutionSection />
        <StreamingSection />
        <PerformanceSection />
        <ResilienceSection />
        <CodeExampleSection />
        <TestabilitySection />
        <UseCasesSection />
        <EcosystemSection />
        <GetStartedSection />
      </main>
    </Layout>
  );
};

export default Home;
