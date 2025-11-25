import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type DifferentiatorItem = {
  title: string;
  description: string;
  icon: string;
  metric?: string;
  details: string[];
};

const DifferentiatorList: DifferentiatorItem[] = [
  {
    title: 'Streaming Architecture',
    icon: '🌊',
    metric: 'Low Memory',
    description: 'Minimizes memory allocations and GC pressure',
    details: [
      'Process data without loading entire datasets into memory',
      'Perfect for large files, database results, or real-time streams',
      'Efficient memory usage with IAsyncEnumerable<T>'
    ]
  },
  {
    title: 'Zero-Reflection Execution',
    icon: '⚡',
    metric: 'High Performance',
    description: 'Pre-compiled delegates for optimal performance',
    details: [
      'Eliminates runtime reflection overhead',
      'Pre-compiled execution paths',
      'Optimized for performance-critical applications'
    ]
  },
  {
    title: 'Efficient Async Patterns',
    icon: '🔄',
    metric: 'Minimal Overhead',
    description: 'Optimized async/await implementation',
    details: [
      'Reduced async overhead compared to traditional patterns',
      'Streamlined execution flow',
      'Built for high-throughput scenarios'
    ]
  },
  {
    title: 'High-Throughput Design',
    icon: '🚀',
    metric: 'Scalable',
    description: 'Optimized for performance-critical applications',
    details: [
      'Designed for large-scale data processing',
      'Handles high-volume data streams efficiently',
      'Maintains performance under heavy load'
    ]
  }
];

function Differentiator({ title, description, icon, metric, details }: DifferentiatorItem) {
  return (
    <div className={styles.differentiatorCard}>
      <div className={styles.differentiatorHeader}>
        <div className={styles.differentiatorIcon}>{icon}</div>
        <div className={styles.differentiatorTitleGroup}>
          <Heading as="h3" className={styles.differentiatorTitle}>{title}</Heading>
          {metric && <span className={styles.differentiatorMetric}>{metric}</span>}
        </div>
      </div>
      <p className={styles.differentiatorDescription}>{description}</p>
      
      <div className={styles.differentiatorDetails}>
        {details.map((detail, idx) => (
          <div key={idx} className={styles.detailItem}>
            <div className={styles.detailBullet}></div>
            <span className={styles.detailText}>{detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechnicalDifferentiatorsSection(): React.ReactElement {
  return (
    <section className={styles.technicalDifferentiators}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Technical Differentiators
        </Heading>
        <p className={styles.sectionSubtitle}>
          Advanced engineering that sets NPipeline apart from other data processing solutions
        </p>
        
        <div className={styles.differentiatorGrid}>
          {DifferentiatorList.map((props, idx) => (
            <Differentiator key={idx} {...props} />
          ))}
        </div>
        
        <div className={styles.performanceNote}>
          <div className={styles.noteIcon}>💡</div>
          <p>
            NPipeline's streaming architecture using <code>IAsyncEnumerable&lt;T&gt;</code> allows you to process 
            data efficiently without loading entire datasets into memory, making it perfect for handling 
            large files, database results, or real-time data streams.
          </p>
        </div>
      </div>
    </section>
  );
}