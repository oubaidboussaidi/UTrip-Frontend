import React from 'react';

import { ChartsHeader, LineChart } from '../../components';

const Line = () => (
  <div className="bg-white dark:bg-secondary-dark-bg rounded-3xl p-6 shadow-sm">
    <ChartsHeader category="Line" title="Inflation Rate" />
    <div className="w-full">
      <LineChart />
    </div>
  </div>
);

export default Line;
