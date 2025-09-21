import React, { useEffect, useState } from 'react';

const PerformanceMonitor = ({ enabled = false }) => {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0
  });

  useEffect(() => {
    if (!enabled) return;

    let renderCount = 0;
    let totalRenderTime = 0;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure' && entry.name.includes('React')) {
          renderCount++;
          totalRenderTime += entry.duration;
          
          setMetrics({
            renderCount,
            lastRenderTime: entry.duration,
            averageRenderTime: totalRenderTime / renderCount
          });
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        fontFamily: 'monospace'
      }}
    >
      <div>Renders: {metrics.renderCount}</div>
      <div>Last: {metrics.lastRenderTime.toFixed(2)}ms</div>
      <div>Avg: {metrics.averageRenderTime.toFixed(2)}ms</div>
    </div>
  );
};

export default PerformanceMonitor;
