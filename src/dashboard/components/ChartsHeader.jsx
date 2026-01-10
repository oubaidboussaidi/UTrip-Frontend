import React from 'react';
import { useStateContext } from '../contexts/ContextProvider';

const ChartsHeader = ({ category, title }) => {
  const { currentMode } = useStateContext();

  return (
    <div className="mb-10">
      <div>
        <p className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em] text-xs mb-1">
          {category}
        </p>
        <p
          className="text-3xl font-black tracking-tight"
          style={{ color: currentMode === 'Dark' ? '#FFFFFF' : '#111827' }}
        >
          Chart Analysis
        </p>
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-bold text-lg mt-2">
        {title}
      </p>
      <div className="h-1.5 w-12 bg-blue-600 rounded-full mt-3 opacity-80" />
    </div>
  );
};

export default ChartsHeader;
