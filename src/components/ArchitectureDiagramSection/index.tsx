import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export default function ArchitectureDiagramSection(): React.ReactElement {
  return (
    <section className={styles.architectureDiagram}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Visual Architecture
        </Heading>
        <p className={styles.sectionSubtitle}>
          NPipeline's graph-based architecture connects nodes in a logical flow for efficient data processing
        </p>
        
        <div className={styles.diagramContainer}>
          <div className={styles.diagramExplanation}>
            <p>
              NPipeline uses a directed acyclic graph (DAG) architecture where data flows from source nodes through transform nodes to sink nodes. Each node performs a specific function, and data pipes connect them in a strongly-typed, async stream.
            </p>
          </div>
          
          <div className={styles.diagram}>
            <svg
              width="100%"
              height="300"
              viewBox="0 0 800 300"
              className={styles.flowchart}
            >
              {/* Define arrow marker */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    fill="#666"
                  />
                </marker>
              </defs>
              
              {/* Source Node */}
              <g className={styles.nodeGroup}>
                <rect
                  x="50"
                  y="100"
                  width="180"
                  height="100"
                  rx="8"
                  fill="#e1f5fe"
                  stroke="#0288d1"
                  strokeWidth="2"
                  className={styles.sourceNode}
                />
                <text
                  x="140"
                  y="140"
                  textAnchor="middle"
                  className={styles.nodeTitle}
                >
                  Source Node
                </text>
                <text
                  x="140"
                  y="165"
                  textAnchor="middle"
                  className={styles.nodeDescription}
                >
                  Generates data stream
                </text>
              </g>
              
              {/* Arrow from Source to Transform */}
              <line
                x1="230"
                y1="150"
                x2="310"
                y2="150"
                stroke="#666"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                className={styles.arrow}
              />
              
              {/* Transform Node */}
              <g className={styles.nodeGroup}>
                <rect
                  x="310"
                  y="100"
                  width="180"
                  height="100"
                  rx="8"
                  fill="#f3e5f5"
                  stroke="#8e24aa"
                  strokeWidth="2"
                  className={styles.transformNode}
                />
                <text
                  x="400"
                  y="140"
                  textAnchor="middle"
                  className={styles.nodeTitle}
                >
                  Transform Node
                </text>
                <text
                  x="400"
                  y="165"
                  textAnchor="middle"
                  className={styles.nodeDescription}
                >
                  Processes data items
                </text>
              </g>
              
              {/* Arrow from Transform to Sink */}
              <line
                x1="490"
                y1="150"
                x2="570"
                y2="150"
                stroke="#666"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
                className={styles.arrow}
              />
              
              {/* Sink Node */}
              <g className={styles.nodeGroup}>
                <rect
                  x="570"
                  y="100"
                  width="180"
                  height="100"
                  rx="8"
                  fill="#e8f5e9"
                  stroke="#43a047"
                  strokeWidth="2"
                  className={styles.sinkNode}
                />
                <text
                  x="660"
                  y="140"
                  textAnchor="middle"
                  className={styles.nodeTitle}
                >
                  Sink Node
                </text>
                <text
                  x="660"
                  y="165"
                  textAnchor="middle"
                  className={styles.nodeDescription}
                >
                  Consumes and finalizes data
                </text>
              </g>
            </svg>
          </div>
          
          <div className={styles.nodeLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#e1f5fe' }}></div>
              <span>Source Nodes generate or fetch data from various sources</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#f3e5f5' }}></div>
              <span>Transform Nodes process, filter, or enrich data</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: '#e8f5e9' }}></div>
              <span>Sink Nodes consume data and perform final operations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}