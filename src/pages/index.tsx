import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className={styles.description}>
          Build complex, high-throughput data pipelines with a graph-based architecture. 
          Zero-allocation fast paths, robust resilience, and modern .NET—all designed for production workloads.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/introduction">
            Get Started - 5 min ⏱️
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/introduction/why-npipeline">
            Learn More
          </Link>
        </div>
      </div>
    </header>
  );
}

function UseCasesSection() {
  return (
    <section className={styles.useCasesSection}>
      <div className="container">
        <Heading as="h2" className={styles.useCasesTitle}>Perfect For</Heading>
        <div className="row">
          <div className={clsx('col col--6', styles.useCase)}>
            <h3>📦 ETL & Data Ingestion</h3>
            <p>Build reliable data extraction, transformation, and loading pipelines for data warehouses and lakes.</p>
          </div>
          <div className={clsx('col col--6', styles.useCase)}>
            <h3>⚡ Real-Time Processing</h3>
            <p>Handle streaming data from various sources with low latency and high throughput for immediate insights.</p>
          </div>
          <div className={clsx('col col--6', styles.useCase)}>
            <h3>✔️ Data Validation & Cleansing</h3>
            <p>Implement complex validation rules and data quality checks at scale.</p>
          </div>
          <div className={clsx('col col--6', styles.useCase)}>
            <h3>🔄 Event-Driven Architectures</h3>
            <p>Process events as they occur in a scalable, resilient manner across microservices.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyNPipelineSection() {
  return (
    <section className={styles.whySection}>
      <div className="container">
        <Heading as="h2">Why NPipeline?</Heading>
        <div className="row">
          <div className={clsx('col col--4', styles.whyItem)}>
            <h3>🎯 Performance First</h3>
            <p>
              Zero-allocation fast paths eliminate millions of heap allocations per second. 
              Reduce GC pressure by up to 90% in typical scenarios.
            </p>
          </div>
          <div className={clsx('col col--4', styles.whyItem)}>
            <h3>🏗️ Intuitive Design</h3>
            <p>
              Graph-based architecture makes complex data flows easy to understand, debug, and maintain. 
              Clear visibility into your data's journey.
            </p>
          </div>
          <div className={clsx('col col--4', styles.whyItem)}>
            <h3>🛡️ Resilient by Design</h3>
            <p>
              Comprehensive framework for building fault-tolerant pipelines with robust error handling, 
              retries, and recovery strategies.
            </p>
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
      description="High-performance, graph-based streaming data pipelines for .NET. Build complex ETL workflows, real-time data processing, and event-driven systems with zero-allocation fast paths and robust resilience.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <UseCasesSection />
        <WhyNPipelineSection />
      </main>
    </Layout>
  );
}
