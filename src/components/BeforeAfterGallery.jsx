import React, { useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, GripVertical, Eye } from 'lucide-react';

function BeforeAfterSlider({ item }) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);

    const onMouseMove = (e) => updatePosition(e.clientX);
    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [updatePosition]);

  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);

    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX);
      }
    };
    const onTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);
  }, [updatePosition]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Slider Area */}
      <div
        ref={containerRef}
        className="relative h-[250px] overflow-hidden cursor-col-resize select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Before Side (full background) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: item.beforeColor || '#94a3b8' }}
        >
          <span className="text-white font-semibold text-lg drop-shadow-md pointer-events-none">
            {item.beforeLabel || 'BEFORE'}
          </span>
        </div>

        {/* After Side (clipped overlay) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundColor: item.afterColor || '#3b82f6',
            clipPath: `inset(0 0 0 ${position}%)`,
          }}
        >
          <span className="text-white font-semibold text-lg drop-shadow-md pointer-events-none">
            {item.afterLabel || 'AFTER'}
          </span>
        </div>

        {/* BEFORE label (top-left) */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="bg-black/40 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            Before
          </span>
        </div>

        {/* AFTER label (top-right) */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="bg-black/40 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
            After
          </span>
        </div>

        {/* Divider Line */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-0.5 h-full bg-white shadow-lg" />
        </div>

        {/* Draggable Handle */}
        <div
          className="absolute top-1/2 z-30 flex items-center justify-center"
          style={{
            left: `${position}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className={`w-10 h-10 rounded-full bg-white shadow-lg border-2 border-gray-300 flex items-center justify-center transition-transform ${
              isDragging ? 'scale-110' : ''
            }`}
          >
            <GripVertical className="w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Arrow Indicators */}
        <div
          className="absolute top-1/2 z-20 flex items-center gap-16 pointer-events-none"
          style={{
            left: `${position}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <ChevronLeft className="w-5 h-5 text-white/70" />
          <ChevronRight className="w-5 h-5 text-white/70" />
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
            {item.description && (
              <p className="text-xs text-gray-500 mt-1">{item.description}</p>
            )}
          </div>
          <Eye className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
        </div>
        <div className="flex items-center gap-2 mt-3">
          {item.service && (
            <span className="inline-block bg-blue-100 text-blue-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
              {item.service}
            </span>
          )}
          {item.date && (
            <span className="text-[10px] text-gray-400">{item.date}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfterGallery({ items = [] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No before/after items to display</p>
      </div>
    );
  }

  return (
    <div
      className={
        items.length > 1
          ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
          : 'max-w-lg mx-auto'
      }
    >
      {items.map((item, index) => (
        <BeforeAfterSlider key={index} item={item} />
      ))}
    </div>
  );
}
