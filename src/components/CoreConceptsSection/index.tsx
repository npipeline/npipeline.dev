import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type ConceptItem = {
  title: string;
  description: string;
  icon: string;
  subItems?: {
    title: string;
    description: string;
  }[];
};

const ConceptList: ConceptItem[] = [
  {
    title: 'Nodes',
    icon: '🔧',
    description: 'The building blocks of your pipeline that process data in different ways',
    subItems: [
      {
        title: 'Sources',
        description: 'Generate or fetch data (SourceNode<T>)'
      },
      {
        title: 'Transforms',
        description: 'Process data item by item (TransformNode<TIn, TOut>)'
      },
      {
        title: 'Sinks',
        description: 'Consume data and perform final operations (SinkNode<T>)'
      }
    ]
  },
  {
    title: 'Data Pipes',
    icon: '🚀',
    description: 'Transport data between nodes as strongly-typed async streams (IDataPipe<T>)'
  },
  {
    title: 'Pipeline Context',
    icon: '📋',
    description: 'Provides logging, cancellation, error handling, and shared state without carrying data payloads'
  },
  {
    title: 'Execution Strategies',
    icon: '⚡',
    description: 'Control how nodes process data: sequential, parallel, or batched processing'
  }
];

function Concept({ title, description, icon, subItems }: ConceptItem) {
  return (
    <div className={styles.conceptCard}>
      <div className={styles.conceptIcon}>{icon}</div>
      <div className={styles.conceptContent}>
        <Heading as="h3" className={styles.conceptTitle}>{title}</Heading>
        <p className={styles.conceptDescription}>{description}</p>
        
        {subItems && (
          <div className={styles.subItems}>
            {subItems.map((subItem, idx) => (
              <div key={idx} className={styles.subItem}>
                <div className={styles.subItemBullet}></div>
                <div className={styles.subItemContent}>
                  <h4 className={styles.subItemTitle}>{subItem.title}</h4>
                  <p className={styles.subItemDescription}>{subItem.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CoreConceptsSection(): React.ReactElement {
  return (
    <section className={styles.coreConcepts}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Core Concepts
        </Heading>
        <p className={styles.sectionSubtitle}>
          Understanding the fundamental building blocks of NPipeline
        </p>
        
        <div className={styles.conceptGrid}>
          {ConceptList.map((props, idx) => (
            <Concept key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}