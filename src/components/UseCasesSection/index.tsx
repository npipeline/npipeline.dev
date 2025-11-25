import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type UseCaseItem = {
  title: string;
  description: string;
  icon: string;
};

const UseCaseList: UseCaseItem[] = [
  {
    title: 'ETL Pipelines',
    icon: '🔄',
    description: 'Extract data from databases, APIs, or files; transform it; load it into data warehouses',
  },
  {
    title: 'Data Migration',
    icon: '📦',
    description: 'Move and transform data between systems with validation and error handling',
  },
  {
    title: 'Real-time Processing',
    icon: '⚡',
    description: 'Process streaming data from message queues, IoT devices, or APIs',
  },
  {
    title: 'File Processing',
    icon: '📄',
    description: 'Parse, validate, and transform large CSV, JSON, or XML files',
  },
  {
    title: 'API Integration',
    icon: '🔌',
    description: 'Fetch data from multiple APIs, combine results, and sync to your systems',
  },
  {
    title: 'Data Validation',
    icon: '✅',
    description: 'Clean and validate data with complex business rules and error reporting',
  },
  {
    title: 'Report Generation',
    icon: '📊',
    description: 'Aggregate data from multiple sources and generate reports or exports',
  },
  {
    title: 'Batch Processing',
    icon: '⚙️',
    description: 'Process large datasets efficiently with parallel execution and state management',
  },
];

function UseCase({ title, description, icon }: UseCaseItem) {
  return (
    <div className={styles.useCaseCard}>
      <div className={styles.useCaseIcon}>{icon}</div>
      <div className={styles.useCaseContent}>
        <Heading as="h3" className={styles.useCaseTitle}>{title}</Heading>
        <p className={styles.useCaseDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function UseCasesSection(): React.ReactElement {
  return (
    <section className={styles.useCases}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Common Use Cases
        </Heading>
        <p className={styles.sectionSubtitle}>
          NPipeline excels in scenarios where you need to process data efficiently and reliably
        </p>
        
        <div className={styles.useCaseGrid}>
          {UseCaseList.map((props, idx) => (
            <UseCase key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}