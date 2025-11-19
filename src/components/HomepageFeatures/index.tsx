import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
  icon: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Zero-Allocation Fast Paths',
    icon: '⚡',
    description: (
      <>
        Eliminate heap allocations in high-throughput scenarios using <code>ValueTask&lt;T&gt;</code>. 
        Reduce garbage collection pressure by up to 90% in typical cache-hit patterns, processing millions 
        of items per second with minimal GC overhead.
      </>
    ),
  },
  {
    title: 'Graph-Based Architecture',
    icon: '🔗',
    description: (
      <>
        Define complex data pipelines as intuitive directed acyclic graphs (DAGs). 
        Clear visualization of data flow makes pipelines easier to understand, debug, and maintain.
      </>
    ),
  },
  {
    title: 'High-Performance Streaming',
    icon: '🚀',
    description: (
      <>
        Built for demanding workloads with optimized asynchronous processing, 
        minimal memory allocations, and high concurrency support. 
        Achieve high throughput and low latency for real-time data processing.
      </>
    ),
  },
  {
    title: 'Flexible & Extensible',
    icon: '🔧',
    description: (
      <>
        Modular architecture supports sources, transforms, and sinks. 
        Easily integrate custom logic, connect to various data sources, and extend functionality 
        to fit your unique requirements.
      </>
    ),
  },
  {
    title: 'Built for Testability',
    icon: '✅',
    description: (
      <>
        Designed from the ground up with testing in mind. 
        Create reliable, maintainable pipelines with comprehensive error handling and robust 
        resilience patterns for fault-tolerant systems.
      </>
    ),
  },
  {
    title: 'Modern .NET',
    icon: '💻',
    description: (
      <>
        Leverages the latest C# features and async/await patterns. 
        Idiomatic code that integrates seamlessly with your .NET ecosystem using dependency injection 
        and contemporary best practices.
      </>
    ),
  },
];

function Feature({title, description, icon}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-bottom--md">
        <div className={styles.featureIcon}>{icon}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
