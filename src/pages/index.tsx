import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import clsx from 'clsx';

import styles from './index.module.css';

function HeroSection() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroContainer}>
        <Heading as="h1" className={styles.heroTitle}>
          High-performance, graph-based streaming data pipelines for .NET
        </Heading>
        <p className={styles.heroSubtitle}>
          Build robust workflows engineered for speed and zero-allocation overhead. 
          Achieve up to 90% reduction in GC pressure with a framework that enforces safety at compile-time.
        </p>
        <div className={styles.heroButtons}>
          <Link className={clsx('button', 'button--primary', 'button--lg')} to="/docs/getting-started/installation">
            dotnet add package NPipeline
          </Link>
          <Link className={clsx('button', 'button--secondary', 'button--lg')} to="/docs/advanced-topics/performance-hygiene">
            View Performance Benchmarks
          </Link>
        </div>
      </div>
    </header>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Built for production workloads
        </Heading>
        <p className={styles.sectionSubtitle}>
          NPipeline isn't just another data processing library. It's architected from the ground up for enterprise-grade performance.
        </p>
        
        <div className={styles.featureGrid}>
          <div className="card">
            <div className="card__header">
              <h3>Zero-allocation fast paths</h3>
            </div>
            <div className="card__body">
              <p>
                Utilizing <code>ValueTask&lt;T&gt;</code> for cache hits means zero GC pressure. 
                In high-cache scenarios, eliminate tens of thousands of allocations per second.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h3>Compile-time safety</h3>
            </div>
            <div className="card__body">
              <p>
                Roslyn analyzers catch configuration errors, blocking operations, and data loss patterns 
                before they reach production.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h3>Streaming-first architecture</h3>
            </div>
            <div className="card__body">
              <p>
                Process millions of records with constant memory usage. Only active items stay in memory, 
                not your entire dataset.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h3>Intelligent parallelism</h3>
            </div>
            <div className="card__body">
              <p>
                Configurable parallel execution with automatic backpressure. Scale CPU-bound and I/O-bound 
                operations independently.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h3>Built-in resilience</h3>
            </div>
            <div className="card__body">
              <p>
                Automatic retries, circuit breakers, and node restart capabilities. 
                Keep your pipelines running through transient failures.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h3>Graph-based composition</h3>
            </div>
            <div className="card__body">
              <p>
                Build complex workflows as directed acyclic graphs. Compose, reuse, and test 
                pipeline components independently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PerformanceSection() {
  return (
    <section className={styles.performance}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Engineered for throughput: The zero-allocation advantage
        </Heading>
        <p className={styles.sectionSubtitle}>
          We don't just wrap System.Threading.Channels. We optimized the hot path.
        </p>
        
        <div className={styles.performanceGrid}>
          <div className="card card--full-height">
            <div className="card__body text--center">
              <div className={styles.performanceMetric}>90%</div>
              <div className={styles.performanceLabel}>Less garbage</div>
              <p className={styles.performanceDetail}>
                Utilizing <code>ValueTask&lt;T&gt;</code>, transforms use a two-path pattern. 
                In high-cache-hit scenarios, this eliminates tens of thousands of Task allocations per second
              </p>
            </div>
          </div>

          <div className="card card--full-height">
            <div className="card__body text--center">
              <div className={styles.performanceMetric}>O(k)</div>
              <div className={styles.performanceLabel}>Streaming-first design</div>
              <p className={styles.performanceDetail}>
                Using <code>IAsyncEnumerable&lt;T&gt;</code> means only active items are in memory. 
                Process datasets far larger than your available RAM with predictable, low-latency execution
              </p>
            </div>
          </div>

          <div className="card card--full-height">
            <div className="card__body text--center">
              <div className={styles.performanceMetric}>Zero</div>
              <div className={styles.performanceLabel}>Per-item branching</div>
              <p className={styles.performanceDetail}>
                Execution plans are compiled once. We eliminate per-item branching and reflection 
                during steady-state processing, optimizing CPU cache hits
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeExampleSection() {
  return (
    <section className={styles.codeExample}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Fluent, type-safe, and graph-based
        </Heading>
        <p className={styles.sectionSubtitle}>
          Define your data flow using a clear builder pattern that handles connection logic and 
          ensures type compatibility at compile time.
        </p>
        
        <div className={styles.codeBlock}>
          <pre><code>{`public void Define(PipelineBuilder builder, PipelineContext context)
{
    // 1. Define Nodes: Source -> Transform -> Sink
    var source = builder.AddSource<KafkaSource, Order>("orders_topic");
    var enricher = builder.AddTransform<CustomerEnricher, Order, EnrichedOrder>("enrich");
    var dbSink = builder.AddSink<DatabaseSink, EnrichedOrder>("sql_store");

    // 2. Connect the Graph (DAG) - Type checked at compile time
    builder.Connect(source, enricher);
    builder.Connect(enricher, dbSink);

    // 3. Configure Resilience
    builder.WithRetryOptions(new PipelineRetryOptions(
        MaxItemRetries: 3, 
        MaxNodeRestartAttempts: 2
    ));
}`}</code></pre>
        </div>

        <div className={styles.codeFeatures}>
          <div className="card shadow--tl">
            <div className="card__body">
              <div className={styles.codeFeature}>
                <div className={styles.codeFeatureIcon}>✓</div>
                <span>Visual clarity with DAG approach</span>
              </div>
            </div>
          </div>
          <div className="card shadow--tl">
            <div className="card__body">
              <div className={styles.codeFeature}>
                <div className={styles.codeFeatureIcon}>✓</div>
                <span>Type-safe connections at compile-time</span>
              </div>
            </div>
          </div>
          <div className="card shadow--tl">
            <div className="card__body">
              <div className={styles.codeFeature}>
                <div className={styles.codeFeatureIcon}>✓</div>
                <span>Full async/await support</span>
              </div>
            </div>
          </div>
          <div className="card shadow--tl">
            <div className="card__body">
              <div className={styles.codeFeature}>
                <div className={styles.codeFeatureIcon}>✓</div>
                <span>Built-in resilience configuration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalyzersSection() {
  return (
    <section className={styles.analyzers}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Your compiler is your safety net
        </Heading>
        <p className={styles.sectionSubtitle}>
          Most pipelines fail silently at runtime. NPipeline catches issues before you commit.
        </p>

        <div className={styles.problemSolution}>
          <div className={clsx('alert', 'alert--danger')}>
            <div className={styles.alertContent}>
              <strong>The Problem:</strong> In complex async pipelines, missing a buffer configuration or blocking a thread can cause 
              silent data loss or deadlocks in production. These issues manifest as intermittent failures 
              that are nearly impossible to debug.
            </div>
          </div>
          
          <div className={clsx('alert', 'alert--success')}>
            <div className={styles.alertContent}>
              <strong>The Solution: NPL 9000 Series Analyzers:</strong> Included out-of-the-box, these Roslyn analyzers act as proactive guardrails, catching 
              configuration errors at build time. Think of them as automated code review by experts who 
              understand how high-performance streaming systems should work.
            </div>
          </div>
        </div>

        <div className={styles.analyzerList}>
          <div className="card shadow--lw">
            <div className="card__body">
              <div className={styles.analyzerItem}>
                <div className={styles.analyzerCode}>NP90XX</div>
                <div className={styles.analyzerContent}>
                  <h4>Resilience Checks</h4>
                  <p>Detects if you've requested a node restart but forgot the mandatory materialization buffers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow--lw">
            <div className="card__body">
              <div className={styles.analyzerItem}>
                <div className={styles.analyzerCode}>NP91XX</div>
                <div className={styles.analyzerContent}>
                  <h4>Performance Hygiene</h4>
                  <p>Flags blocking operations (.Result, .Wait()) inside async nodes that starve the thread pool</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow--lw">
            <div className="card__body">
              <div className={styles.analyzerItem}>
                <div className={styles.analyzerCode}>NP93XX</div>
                <div className={styles.analyzerContent}>
                  <h4>Data Integrity</h4>
                  <p>Ensures sink nodes actually consume their input, preventing silent data drops</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResilienceSection() {
  return (
    <section className={styles.resilience}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Resilience is not an afterthought
        </Heading>
        <p className={styles.sectionSubtitle}>
          Recover from failures without system breakdown using configurable, granular strategies.
        </p>

        <div className={styles.resilienceGrid}>
          <div className="card">
            <div className="card__header">
              <h3>Node-level recovery</h3>
            </div>
            <div className="card__body">
              <p>
                Handle individual item failures with precision. Configure policies to <strong>Retry</strong> transient 
                network blips, <strong>Skip</strong> malformed data, or route to a <strong>Dead-Letter Queue</strong> for 
                later analysis.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h3>Circuit breakers</h3>
            </div>
            <div className="card__body">
              <p>
                Prevent cascading failures with intelligent circuit breakers. If a dependent service goes down, 
                the pipeline can pause or fail gracefully rather than overwhelming the system.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card__header">
              <h3>Restarts with state</h3>
            </div>
            <div className="card__body">
              <p>
                The <code>ResilientExecutionStrategy</code> allows specific nodes to restart while buffering 
                upstream data, ensuring self-healing pipelines without manual intervention.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EcosystemSection() {
  return (
    <section className={styles.ecosystem}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Batteries included
        </Heading>
        <p className={styles.sectionSubtitle}>
          A mature ecosystem, not just a single class library.
        </p>

        <div className={styles.ecosystemGrid}>
          <div className="card card--full-height">
            <div className="card__header">
              <h3>Connectors</h3>
            </div>
            <div className="card__body">
              <p>
                Integrate quickly with pre-built nodes for CSV, Filesystem, and Cloud Storage via 
                the <code>IStorageProvider</code> abstraction.
              </p>
            </div>
          </div>

          <div className="card card--full-height">
            <div className="card__header">
              <h3>Dependency injection</h3>
            </div>
            <div className="card__body">
              <p>
                Seamless integration with <code>Microsoft.Extensions.DependencyInjection</code> for 
                clean constructor injection in your nodes.
              </p>
            </div>
          </div>

          <div className="card card--full-height">
            <div className="card__header">
              <h3>Parallelism</h3>
            </div>
            <div className="card__body">
              <p>
                Need more speed? Enable <code>ParallelExecutionStrategy</code> to process nodes 
                concurrently with configurable degrees of parallelism.
              </p>
            </div>
          </div>

          <div className="card card--full-height">
            <div className="card__header">
              <h3>Testing utilities</h3>
            </div>
            <div className="card__body">
              <p>
                Comprehensive testing utilities including in-memory sources/sinks and assertion 
                libraries (FluentAssertions / AwesomeAssertions).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaContainer}>
        <Heading as="h2" className={styles.ctaTitle}>
          Ready to build better pipelines?
        </Heading>
        <p className={styles.ctaSubtitle}>
          Stop writing boilerplate retry logic and fighting memory leaks.
        </p>
        <div className={styles.ctaButtons}>
          <Link className={clsx('button', 'button--primary', 'button--lg')} to="/docs/getting-started/installation">
            Get the NuGet Package
          </Link>
          <Link className={clsx('button', 'button--secondary', 'button--lg')} to="/docs/getting-started/quick-start">
            Read the Quick Start Guide
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="High-performance, graph-based streaming data pipelines for .NET">
      <HeroSection />
      <AnalyzersSection />
      <PerformanceSection />
      <ResilienceSection />
      <CodeExampleSection />
      <FeaturesSection />
      <EcosystemSection />
      <CTASection />
    </Layout>
  );
}
