import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function PerformanceHeroSection() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroTagline}>
          {siteConfig.tagline}
        </p>
        <p className={styles.heroDescription}>
          High-performance, zero-allocation data pipelines built for .NET developers. 
          Process millions of records per second with minimal GC pressure using modern async patterns 
          and fluent APIs that integrate seamlessly with your existing .NET ecosystem.
          Compatible with .NET 8, 9, and 10.
        </p>
        <div className={styles.heroButtons}>
          <Link className={styles.primaryButton} to="/docs/introduction">
            Introduction
          </Link>
          <Link className={styles.secondaryButton} to="/docs/getting-started/quick-start">
            Quick Start
          </Link>
        </div>
      </div>
    </section>
  );
}

function NetPerformanceProblemSection() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          The .NET Performance Challenge
        </Heading>
        <p className={styles.sectionSubtitle}>
          Traditional data processing in .NET faces fundamental performance barriers
        </p>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>GC Pressure & Allocations</h3>
            <p className={styles.featureDescription}>
              Conventional pipelines allocate objects at every stage, triggering frequent garbage collection 
              that introduces latency spikes and unpredictable performance in high-throughput scenarios.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Blocking I/O Patterns</h3>
            <p className={styles.featureDescription}>
              Synchronous processing blocks threads, limiting scalability. Modern .NET async/await patterns 
              are often poorly implemented in data processing libraries, squandering the benefits of async I/O.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Reflection Overhead</h3>
            <p className={styles.featureDescription}>
              Many frameworks rely on runtime reflection for type conversion and serialization, adding 
              significant CPU overhead that becomes critical when processing millions of records.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Memory Bloat</h3>
            <p className={styles.featureDescription}>
              Eager loading and buffering strategies consume excessive memory, forcing trade-offs between 
              performance and resource utilization in production environments.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Complex Error Propagation</h3>
            <p className={styles.featureDescription}>
              Traditional approaches struggle with async error handling, making resilience patterns difficult 
              to implement correctly and leading to fragile production systems.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureTitle}>Testing Complexity</h3>
            <p className={styles.featureDescription}>
              Tightly coupled components and hidden dependencies make unit testing challenging, reducing 
              code quality and making refactoring risky in complex data processing scenarios.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ZeroAllocationSolutionSection() {
  return (
    <section className={styles.imageSection}>
      <div className="container">
        <div className={styles.imageSectionContent}>
          <div className={styles.imageSectionText}>
            <h2>Zero-Allocation Architecture</h2>
            <p>
              NPipeline eliminates runtime allocations through pre-compiled delegates and memory pooling strategies. 
              Our pre-compiled execution plans create optimized code paths at initialization time, eliminating reflection overhead during execution. Combined with ValueTask optimization for synchronous operations, this reduces garbage collection pressure by up to 95% in high-throughput scenarios.
            </p>
            <p>
              Process millions of records with predictable latency patterns. The streaming design processes data 
              as it flows without materializing entire datasets in memory, making it ideal for high-throughput 
              scenarios where performance matters.
            </p>
            <Link className={styles.primaryButton} to="/docs/advanced-topics/performance-hygiene">
              Explore Performance Techniques
            </Link>
          </div>
          <div className={styles.imageSectionImage}>
            <img src="/img/performance-comparison.svg" alt="Performance comparison between NPipeline and traditional approaches" className={styles.visualizationImage} />
          </div>
        </div>
      </div>
    </section>
  );
}

function GraphBasedArchitectureSection() {
  return (
    <section className={styles.benefitsSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Graph-Based Architecture
        </Heading>
        <p className={styles.sectionSubtitle}>
          Visual, maintainable pipelines that scale with complexity
        </p>
        
        <div className={styles.benefitsGrid}>
          <div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitNumber}>1</div>
              <div className={styles.benefitLabel}>Declarative Pipeline Definition</div>
              <p className={styles.benefitDescription}>
                Express complex data flows with a fluent, intuitive API. Each node represents a discrete 
                operation that can be developed, tested, and optimized independently.
              </p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitNumber}>2</div>
              <div className={styles.benefitLabel}>Dependency Injection Integration</div>
              <p className={styles.benefitDescription}>
                Seamless integration with Microsoft.Extensions.DependencyInjection. Register pipeline components 
                as services and leverage .NET's built-in DI container for clean, testable code.
              </p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitNumber}>3</div>
              <div className={styles.benefitLabel}>Compile-Time Validation</div>
              <p className={styles.benefitDescription}>
                Source generators analyze your pipeline at build time, catching configuration errors before 
                they reach production. No more runtime surprises from misconfigured connections.
              </p>
            </div>
          </div>
          
          <div className={styles.imagePlaceholder}>
            <img src="/img/graph-architecture.svg" alt="Graph-based architecture showing node connections in NPipeline" className={styles.visualizationImage} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ResilienceSection() {
  const resilienceFeatures = [
    {
      title: 'Circuit Breaker Pattern',
      description: 'Automatically failing fast when downstream systems are unavailable, with configurable recovery strategies.',
    },
    {
      title: 'Retry Policies',
      description: 'Exponential backoff and jitter algorithms for handling transient failures in external dependencies.',
    },
    {
      title: 'Dead Letter Queues',
      description: 'Automatic isolation of problematic records for later analysis without stopping pipeline execution.',
    },
    {
      title: 'Graceful Degradation',
      description: 'Continue processing with reduced functionality when non-critical components fail.',
    },
    {
      title: 'Timeout Management',
      description: 'Configurable timeouts at the node level to prevent cascading failures.',
    },
    {
      title: 'Health Monitoring',
      description: 'Built-in health checks and metrics for integration with ASP.NET Core health endpoints.',
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Resilience Without Compromise
        </Heading>
        <p className={styles.sectionSubtitle}>
          Production-grade resilience patterns built into the framework
        </p>
        
        <div className={styles.resilienceVisualizationContainer}>
          <img src="/img/resilience-patterns.svg" alt="Resilience patterns in NPipeline" className={styles.visualizationImage} />
        </div>
        
        <div className={styles.featuresGrid}>
          {resilienceFeatures.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCasesByPersonaSection() {
  const personas = [
    {
      title: 'For Backend Engineers',
      description: 'Build high-throughput APIs and services that process data streams efficiently. Integrate with Entity Framework Core and other ORMs without performance penalties.',
      details: 'Create responsive APIs that handle thousands of concurrent requests with minimal resource usage. Process real-time data feeds, implement caching strategies, and build scalable microservices that maintain low latency even under heavy load.',
    },
    {
      title: 'For Data Engineers',
      description: 'Create ETL pipelines that process millions of records without memory bloat. Perfect for data warehousing, migration, and transformation tasks.',
      details: 'Design data transformation workflows that handle massive datasets efficiently. Implement complex data validation, enrichment, and aggregation operations. Build reliable data pipelines that can process both batch and streaming workloads with minimal operational overhead.',
    },
    {
      title: 'For Microservice Developers',
      description: 'Implement event-driven architectures with reliable message processing. Handle async workflows across service boundaries with confidence.',
      details: 'Build robust event-driven systems with guaranteed message delivery. Implement saga patterns for distributed transactions, create event sourcing solutions, and design message routing topologies that maintain consistency across microservice boundaries.',
    },
    {
      title: 'For Performance Engineers',
      description: 'Optimize critical paths with zero-allocation processing. Monitor and tune performance with built-in metrics and diagnostics.',
      details: 'Fine-tune pipeline performance with detailed observability features. Implement custom memory pooling strategies, optimize throughput with parallel processing, and leverage built-in performance counters to identify and eliminate bottlenecks in high-throughput scenarios.',
    },
  ];

  return (
    <section className={styles.useCasesSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Built For Your Role
        </Heading>
        <p className={styles.sectionSubtitle}>
          Tailored patterns and examples for every .NET developer persona
        </p>
        <div className={styles.useCasesGrid}>
          {personas.map((persona, idx) => (
            <div key={idx} className={styles.useCaseCard}>
              <h3 className={styles.useCaseTitle}>{persona.title}</h3>
              <p className={styles.useCaseDescription}>{persona.description}</p>
              <p className={styles.useCaseDetails}>{persona.details}</p>
              <Link className={styles.useCaseLink} to="/docs/samples-guide">
                View Full Examples →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImplementationQuickStartSection() {
  return (
    <section className={styles.imageSection} style={{backgroundColor: '#f0f6f7'}}>
      <div className="container">
        <div className={styles.imageSectionContent}>
          <div className={styles.imageSectionImage}>
            <img src="/img/data-pipeline-flow.svg" alt="Data pipeline flow showing zero-allocation processing in NPipeline" className={styles.visualizationImage} />
          </div>
          <div className={styles.imageSectionText}>
            <h2>Implementation Quick Start</h2>
            <p>
              Get NPipeline running in minutes with our streamlined installation process. 
              Built as a set of NuGet packages that integrate seamlessly with your existing .NET projects.
              Supports .NET 8, 9, and 10 for the latest features and performance improvements.
            </p>
            <p>
              Start with our pre-built components for common scenarios, then extend with custom nodes 
              as your requirements evolve. Our comprehensive documentation and sample projects accelerate 
              development from prototype to production.
            </p>
            <Link className={styles.primaryButton} to="/docs/getting-started/quick-start">
              5-Minute Quick Start Guide
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="High-performance, zero-allocation data pipelines for .NET. Build ETL workflows, real-time data processing, and event-driven systems with modern async patterns and production-grade resilience.">
      <PerformanceHeroSection />
      <NetPerformanceProblemSection />
      <ZeroAllocationSolutionSection />
      <GraphBasedArchitectureSection />
      <ResilienceSection />
      <UseCasesByPersonaSection />
      <ImplementationQuickStartSection />
    </Layout>
  );
}
