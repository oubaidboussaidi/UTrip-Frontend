import React from 'react';

const pieChartData = [];
import { ChartsHeader, Pie as PieChart } from '../../components';

const Pie = () => (
  <div className="bg-white dark:bg-secondary-dark-bg rounded-3xl p-6 shadow-sm">
    <ChartsHeader category="Pie" title="Project Cost Breakdown" />
    <div className="w-full">
      <PieChart id="chart-pie" data={pieChartData} legendVisiblity height="full" />
    </div>
  </div>
);

export default Pie;
