import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

// Hero Section Component
const HeroSection: React.FC = () => {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', 'heroBanner')}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Build High-Performance, Type-Safe Data Pipelines in .NET
        </Heading>
        <p className="hero__subtitle">
          NPipeline is a powerful, flexible library designed for constructing robust, graph-based streaming data workflows. 
          By combining the type safety of C# with a directed acyclic graph (DAG) architecture, NPipeline empowers developers to build 
          complex ETL processes, real-time data streams, and event-driven architectures that are easy to test, debug, and maintain.
        </p>
        <p className="hero__subtitle">
          Stop writing spaghetti code for your data processing. Start building pipelines.
        </p>
        <div className={clsx('margin-top--lg')}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started/installation">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

// Why NPipeline Section Component
const WhyNPipelineSection: React.FC = () => {
  return (
    <section className={clsx('margin-vert--lg', 'padding-vert--lg')}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Why NPipeline?
        </Heading>
        <p className={clsx('text--center', 'margin-bottom--lg')}>
          Traditional data processing in .NET often devolves into unmanageable chains of nested loops or heavy dependencies on external ETL tools. 
          NPipeline bridges the gap, offering a code-first approach that prioritizes developer experience and execution efficiency.
        </p>
        <div className="row">
          <div className="col col--4">
            <div className="card padding--lg">
              <Heading as="h3" className="text--center margin-bottom--md">
                Graph-Based Architecture
              </Heading>
              <p>
                Visualize your data flow clearly. Pipelines are built as interconnected nodes (Sources, Transforms, Sinks), 
                ensuring visibility into the data's journey.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="card padding--lg">
              <Heading as="h3" className="text--center margin-bottom--md">
                Compile-Time Safety
              </Heading>
              <p>
                Connect nodes using a fluent, type-safe API. The compiler ensures that the output type of an upstream node 
                matches the input of the downstream node, eliminating runtime type errors.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="card padding--lg">
              <Heading as="h3" className="text--center margin-bottom--md">
                Async-First
              </Heading>
              <p>
                Built for modern .NET, leveraging asynchronous patterns and <code>IAsyncEnumerable&lt;T&gt;</code> for 
                non-blocking I/O and efficient resource usage.
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
    <section className={clsx('margin-vert--lg', 'padding-vert--lg', 'background--light')}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Use Cases
        </Heading>
        <p className={clsx('text--center', 'margin-bottom--lg')}>
          NPipeline is engineered to handle structured, high-throughput scenarios where reliability is paramount.
        </p>
        <div className="row">
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                ETL Workflows
              </Heading>
              <p>
                Build reliable ingestion pipelines that extract data, apply complex transformations, and load into storage.
              </p>
            </div>
          </div>
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Real-time Stream Processing
              </Heading>
              <p>
                Handle low-latency data streams from message queues or IoT devices.
              </p>
            </div>
          </div>
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Data Validation & Cleansing
              </Heading>
              <p>
                Implement rigorous quality checks and validation rules as discrete, testable steps.
              </p>
            </div>
          </div>
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Microservice Integration
              </Heading>
              <p>
                Facilitate structured data exchange and transformation between decoupled services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Engineered for Performance Section Component
const PerformanceSection: React.FC = () => {
  return (
    <section className={clsx('margin-vert--lg', 'padding-vert--lg')}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Engineered for Performance
        </Heading>
        <p className={clsx('text--center', 'margin-bottom--lg')}>
          Performance is not an afterthought; it is the cornerstone of NPipeline's design. The library is architected to 
          minimize garbage collection overhead and maximize throughput.
        </p>
        
        <div className="row margin-bottom--md">
          <div className="col col--12">
            <div className="card padding--lg">
              <Heading as="h3" className="margin-bottom--md">
                Zero-Allocation Fast Paths
              </Heading>
              <p className="margin-bottom--md">
                In high-throughput systems, every allocation counts. NPipeline utilizes <code>ValueTask&lt;T&gt;</code> to implement a "two-path" pattern.
              </p>
              <div className="row">
                <div className="col col--4">
                  <div className="alert alert--info margin-bottom--md">
                    <Heading as="h4">Fast Path (Synchronous)</Heading>
                    <p>
                      If a result is available immediately (e.g., cache hits, simple math), it allocates on the stack with 
                      <strong> zero GC pressure</strong>.
                    </p>
                  </div>
                </div>
                <div className="col col--4">
                  <div className="alert alert--info margin-bottom--md">
                    <Heading as="h4">Slow Path (Asynchronous)</Heading>
                    <p>
                      Seamlessly transitions to true async only when I/O or heavy computation is required.
                    </p>
                  </div>
                </div>
                <div className="col col--4">
                  <div className="alert alert--info margin-bottom--md">
                    <Heading as="h4">Impact</Heading>
                    <p>
                      In high-cache-hit scenarios, this can eliminate thousands of allocations per second, 
                      drastically reducing garbage collection pauses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col col--12">
            <div className="card padding--lg">
              <Heading as="h3" className="margin-bottom--md">
                Plan-Based Execution
              </Heading>
              <p>
                NPipeline separates the "planning" phase from the "execution" phase. The pipeline structure is compiled once, 
                meaning per-item processing avoids expensive reflection or routing logic during the steady state.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Resilience & Reliability Section Component
const ResilienceSection: React.FC = () => {
  return (
    <section className={clsx('margin-vert--lg', 'padding-vert--lg', 'background--light')}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Resilience & Reliability
        </Heading>
        <p className={clsx('text--center', 'margin-bottom--lg')}>
          Production pipelines fail—it's inevitable. NPipeline provides a comprehensive resilience framework to detect, 
          handle, and recover from failures without crashing your application.
        </p>
        
        <div className="row margin-bottom--md">
          <div className="col col--12">
            <div className="card padding--lg">
              <Heading as="h3" className="margin-bottom--md">
                Granular Error Handling
              </Heading>
              <div className="row">
                <div className="col col--6">
                  <div className="alert alert--warning margin-bottom--md">
                    <Heading as="h4">Node-Level</Heading>
                    <p>
                      Handle specific item failures (e.g., malformed JSON) by retrying, skipping, or routing to a Dead Letter Queue.
                    </p>
                  </div>
                </div>
                <div className="col col--6">
                  <div className="alert alert--warning margin-bottom--md">
                    <Heading as="h4">Pipeline-Level</Heading>
                    <p>
                      Manage stream-wide failures (e.g., database outages) with Circuit Breakers and automatic Node Restarts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col col--12">
            <div className="card padding--lg">
              <Heading as="h3" className="margin-bottom--md">
                Build-Time Analyzers
              </Heading>
              <p className="margin-bottom--md">
                Don't wait for a 3 AM page to find a configuration error. NPipeline includes Roslyn analyzers that enforce best practices at compile time.
              </p>
              <div className="row">
                <div className="col col--6">
                  <div className="alert alert--success margin-bottom--md">
                    <Heading as="h4">Prevents Silent Failures</Heading>
                    <p>
                      Detects missing prerequisites for node restarts (e.g., missing materialization buffers).
                    </p>
                  </div>
                </div>
                <div className="col col--6">
                  <div className="alert alert--success margin-bottom--md">
                    <Heading as="h4">Enforces Streaming Patterns</Heading>
                    <p>
                      Flags blocking operations or non-streaming patterns that could lead to memory exhaustion.
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

// Fluent API & Type Safety Section Component
const FluentAPISection: React.FC = () => {
  return (
    <section className={clsx('margin-vert--lg', 'padding-vert--lg')}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Fluent API & Type Safety
        </Heading>
        <p className={clsx('text--center', 'margin-bottom--lg')}>
          Constructing a pipeline is intuitive and readable. The builder pattern allows you to define sources, transforms, and sinks, and connect them logically.
        </p>
        
        <div className="card padding--md">
          <pre className="language-csharp">
            <code>
{`public void Define(PipelineBuilder builder, PipelineContext context) 
{
    // 1. Add Nodes
    var source = builder.AddSource<OrderSource, Order>();
    var filter = builder.AddTransform<FraudCheckTransform, Order, Order>();
    var sink = builder.AddSink<DatabaseSink, Order>();

    // 2. Connect the Graph
    // The compiler ensures type compatibility between nodes
    builder.Connect(source, filter);
    builder.Connect(filter, sink);
    
    // 3. Configure Resilience
    builder.WithRetryOptions(new PipelineRetryOptions(
        MaxItemRetries: 3, 
        MaxNodeRestartAttempts: 2
    ));
}`}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
};

// Ecosystem & Extensions Section Component
const EcosystemSection: React.FC = () => {
  return (
    <section className={clsx('margin-vert--lg', 'padding-vert--lg', 'background--light')}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Ecosystem & Extensions
        </Heading>
        <p className={clsx('text--center', 'margin-bottom--lg')}>
          NPipeline is modular by design. Keep the core lightweight and add capabilities as you need them.
        </p>
        
        <div className="row">
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Dependency Injection
              </Heading>
              <p>
                Seamlessly integrate with <code>Microsoft.Extensions.DependencyInjection</code> for robust service management.
              </p>
            </div>
          </div>
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Parallelism
              </Heading>
              <p>
                Utilize the <code>ParallelExecutionStrategy</code> to process nodes concurrently, increasing throughput for CPU-bound tasks.
              </p>
            </div>
          </div>
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Connectors
              </Heading>
              <p>
                Use pre-built Source and Sink connectors for common targets like CSV files, leveraging a unified storage abstraction.
              </p>
            </div>
          </div>
          <div className="col col--6">
            <div className="card padding--lg margin-bottom--lg">
              <Heading as="h3" className="margin-bottom--md">
                Testing
              </Heading>
              <p>
                Specialized libraries including integration with <em>FluentAssertions</em> and <em>AwesomeAssertions</em> to unit test your pipelines in memory.
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
    <section className={clsx('margin-vert--lg', 'padding-vert--lg')}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Get Started
        </Heading>
        <p className={clsx('text--center', 'margin-bottom--lg')}>
          Ready to build better pipelines?
        </p>
        
        <div className="row">
          <div className="col col--12">
            <div className="card padding-horiz--lg padding-top--lg">
              <Heading as="h3" className="margin-bottom--md">
                Install via NuGet:
              </Heading>
              <pre className="language-bash">
                <code>
{`dotnet add package NPipeline`}
                </code>
              </pre>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

// Main Homepage Component
const Home: React.FC = () => {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="High-performance, streaming data pipelines for .NET">
      <HeroSection />
      <main>
        <WhyNPipelineSection />
        <UseCasesSection />
        <PerformanceSection />
        <ResilienceSection />
        <FluentAPISection />
        <EcosystemSection />
        <GetStartedSection />
      </main>
    </Layout>
  );
};

export default Home;