import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HeroSection() {
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
          Build complex, high-throughput data pipelines with a graph-based architecture. 
          Eliminate allocation overhead with zero-allocation fast paths, architect resilient systems, 
          and ship production workloads with confidence.
        </p>
        <div className={styles.heroButtons}>
          <Link className={styles.primaryButton} to="/docs/introduction">
            Get Started in 5 Minutes
          </Link>
          <Link className={styles.secondaryButton} to="/docs/core-concepts">
            Explore the Docs
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: 'Graph-Based Architecture',
      description: 'Intuitive, visually clear data flows. Every node is a logical unit—transparent, understandable, maintainable.',
    },
    {
      title: 'Zero-Allocation Fast Paths',
      description: 'Reduce garbage collection pressure by up to 90%. Process millions of items per second with minimal overhead.',
    },
    {
      title: 'Streaming by Design',
      description: 'Process data as it flows without loading entire datasets into memory. Optimized for throughput and latency.',
    },
    {
      title: 'Resilience Built In',
      description: 'Comprehensive error handling, retry policies, and recovery strategies. Build systems you can trust.',
    },
    {
      title: 'Modern .NET',
      description: 'Leverages async/await and contemporary C# patterns. Integrates seamlessly with your .NET ecosystem.',
    },
    {
      title: 'Testability First',
      description: 'Modular design with dependency injection support. Write comprehensive tests with ease.',
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Core Capabilities
        </Heading>
        <p className={styles.sectionSubtitle}>
          NPipeline provides everything you need to build production-grade data pipelines
        </p>
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <div className={styles.featureIcon}>◆</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className={styles.benefitsSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Why Engineers Choose NPipeline
        </Heading>
        
        <div className={styles.benefitsGrid}>
          <div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitNumber}>1</div>
              <div className={styles.benefitLabel}>Accelerated Development</div>
              <p className={styles.benefitDescription}>
                Fluent API and builder pattern mean you spend less time on boilerplate and more time solving business problems.
              </p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitNumber}>2</div>
              <div className={styles.benefitLabel}>Exceptional Performance</div>
              <p className={styles.benefitDescription}>
                Optimized for throughput and latency. Handle high-volume data streams without sacrificing responsiveness.
              </p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitNumber}>3</div>
              <div className={styles.benefitLabel}>Production Ready</div>
              <p className={styles.benefitDescription}>
                Comprehensive resilience patterns, error handling, and observability hooks built into the framework.
              </p>
            </div>
          </div>
          
          <div className={styles.imagePlaceholder}>
            [Architecture Diagram Placeholder]
          </div>
        </div>
      </div>
    </section>
  );
}

function UseCasesSection() {
  const useCases = [
    {
      title: 'ETL & Data Ingestion',
      description: 'Build reliable extraction, transformation, and loading pipelines for data warehouses and lakes. Process structured and unstructured data at scale.',
    },
    {
      title: 'Real-Time Processing',
      description: 'Handle streaming data from IoT devices, APIs, and message queues with low latency. Process events as they arrive.',
    },
    {
      title: 'Data Validation & Quality',
      description: 'Implement sophisticated validation rules and quality checks. Catch data issues before they reach your systems.',
    },
    {
      title: 'Event-Driven Systems',
      description: 'Process events across microservices. Coordinate complex workflows with clear, transparent data flows.',
    },
  ];

  return (
    <section className={styles.useCasesSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Perfect For
        </Heading>
        <p className={styles.sectionSubtitle}>
          NPipeline excels in scenarios where throughput, reliability, and clarity matter
        </p>
        <div className={styles.useCasesGrid}>
          {useCases.map((useCase, idx) => (
            <div key={idx} className={styles.useCaseCard}>
              <h3 className={styles.useCaseTitle}>{useCase.title}</h3>
              <p className={styles.useCaseDescription}>{useCase.description}</p>
              <Link className={styles.useCaseLink} to="/docs/introduction">
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureHighlightSection() {
  return (
    <section className={styles.imageSection}>
      <div className="container">
        <div className={styles.imageSectionContent}>
          <div className={styles.imageSectionText}>
            <h2>Built for Architects</h2>
            <p>
              NPipeline's graph-based architecture provides clear visibility into data flows. 
              Every node is a logical unit of work—no hidden complexity, no magic.
            </p>
            <p>
              Design complex pipelines with confidence. Debug issues quickly. Optimize performance 
              systematically. Scale reliably from prototypes to production workloads.
            </p>
            <Link className={styles.primaryButton} to="/docs/architecture">
              Explore Architecture
            </Link>
          </div>
          <div className={styles.imageSectionImage}>
            [Architecture Diagram]
          </div>
        </div>
      </div>
    </section>
  );
}

function PerformanceHighlightSection() {
  return (
    <section className={styles.imageSection} style={{backgroundColor: '#f0f6f7'}}>
      <div className="container">
        <div className={styles.imageSectionContent}>
          <div className={styles.imageSectionImage}>
            [Performance Metrics]
          </div>
          <div className={styles.imageSectionText}>
            <h2>Performance That Scales</h2>
            <p>
              Every decision in NPipeline prioritizes performance. Zero-allocation fast paths 
              minimize garbage collection. Streaming architecture prevents memory bloat.
            </p>
            <p>
              Process millions of items per second with predictable latency. Monitor real-time 
              performance with built-in instrumentation. Profile and optimize systematically.
            </p>
            <Link className={styles.primaryButton} to="/docs/advanced-topics/performance-hygiene">
              Performance Guide
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const reasons = [
    {
      title: 'Intuitive API',
      description: 'Fluent builder pattern makes complex pipelines easy to express and understand. Self-documenting code that others can reason about.',
    },
    {
      title: 'Measurable Results',
      description: 'Designed for metrics from day one. Reduced GC pressure, lower latency, higher throughput—track what matters.',
    },
    {
      title: 'Enterprise Grade',
      description: 'Resilience patterns, error handling, and dependency injection out of the box. Build systems you can trust.',
    },
  ];

  return (
    <section className={styles.whySection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          What Sets NPipeline Apart
        </Heading>
        <div className={styles.whyGrid}>
          {reasons.map((reason, idx) => (
            <div key={idx} className={styles.whyCard}>
              <div className={styles.whyCardIcon}>✓</div>
              <h3 className={styles.whyCardTitle}>{reason.title}</h3>
              <p className={styles.whyCardDescription}>{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContent}>
        <Heading as="h2" className={styles.ctaTitle}>
          Ready to Build Better Pipelines?
        </Heading>
        <p className={styles.ctaDescription}>
          Get started in 5 minutes with our quick-start guide, then explore advanced patterns 
          and best practices as you level up.
        </p>
        <Link className={styles.ctaButton} to="/docs/getting-started/quick-start">
          Start Your First Pipeline
        </Link>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="High-performance, graph-based streaming data pipelines for .NET. Build ETL workflows, real-time data processing, and event-driven systems with zero-allocation optimization and robust resilience.">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <UseCasesSection />
      <ArchitectureHighlightSection />
      <PerformanceHighlightSection />
      <WhySection />
      <CTASection />
    </Layout>
  );
}
