import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Employee } from '../types';
import { useNavigate } from 'react-router-dom';

interface VirtualizedListProps {
  data: Employee[];
  rowHeight?: number;
  buffer?: number;
}

const VirtualizedList: React.FC<VirtualizedListProps> = ({ 
  data, 
  rowHeight = 50, 
  buffer = 5 
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // INTENTIONAL BUG: Stale closure in scroll handler
  // The rowHeight variable is captured at the time of scroll handler creation
  // If rowHeight changes (e.g., via prop update), the scroll calculations become incorrect
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, clientHeight } = containerRef.current;
    const start = Math.floor(scrollTop / rowHeight);
    const end = Math.min(
      data.length - 1,
      Math.floor((scrollTop + clientHeight) / rowHeight)
    );
    
    setVisibleRange({
      start: Math.max(0, start - buffer),
      end: Math.min(data.length - 1, end + buffer)
    });
  }, [data.length, buffer, rowHeight]); // rowHeight is captured here - if it changes, a new handler is created

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial calculation
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const totalHeight = data.length * rowHeight;
  const offsetY = visibleRange.start * rowHeight;

  const visibleData = data.slice(visibleRange.start, visibleRange.end + 1);

  const handleRowClick = (id: number) => {
    navigate(`/details/${id}`);
  };

  return (
    <div
      ref={containerRef}
      className="h-[600px] overflow-auto border border-gray-200 rounded-lg"
      style={{ position: 'relative' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${offsetY}px)`
          }}
        >
          {visibleData.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleRowClick(item.id)}
              className="flex items-center px-4 py-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              style={{ height: rowHeight }}
            >
              <div className="flex-1">{item.name}</div>
              <div className="flex-1">{item.position}</div>
              <div className="flex-1">${item.salary.toLocaleString()}</div>
              <div className="flex-1">{item.city}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedList;
