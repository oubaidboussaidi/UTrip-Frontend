import React from 'react';
import { useStateContext } from '../contexts/ContextProvider';

const Header = ({ category, title }) => {
  const { currentMode } = useStateContext();

  return (
    <div className="mb-8">
      <p className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em] text-xs mb-1">
        {category}
      </p>
      <h2
        className="text-4xl font-black tracking-tight"
        style={{ color: currentMode === 'Dark' ? '#FFFFFF' : '#111827' }}
      >
        {title}
      </h2>
      <div className="h-1.5 w-12 bg-blue-600 rounded-full mt-3 opacity-80" />
    </div>
  );
};

export default Header;
