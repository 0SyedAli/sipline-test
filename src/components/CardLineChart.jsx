'use client';

import { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import SpinnerLoading from './SpinnerLoading';

const CardLineChart = ({ TotalRevenueData, isLoading = false }) => {
  const [chartData, setChartData] = useState([
    { id: 'revenue', color: '#fdb71a', data: [] }
  ]);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (!TotalRevenueData || !Array.isArray(TotalRevenueData)) {
      setChartData([{ id: 'revenue', color: '#fdb71a', data: [] }]);
      setLocalLoading(false);
      return;
    }

    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const sortedData = [...TotalRevenueData].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    const transformed = sortedData.map(item => ({
      x: item?.month?.slice(0, 3) || 'N/A',
      y: Number(item?.netSales ?? 0)
    }));

    setChartData([{ id: 'revenue', color: '#fdb71a', data: transformed }]);
    setLocalLoading(false);
  }, [TotalRevenueData]);

  // ✅ Combine parent + internal loading
  const loading = isLoading || localLoading;

  const getMaxYValue = () => {
    if (!chartData?.length || !chartData[0]?.data?.length) return 100;
    const maxValue = Math.max(...chartData[0].data.map(item => item.y || 0));
    return Math.ceil(maxValue * 1.2);
  };

  if (loading) {
    return (
      <div
        style={{ height: '450px', width: '100%' }}
        className="dash_chart1 d-flex align-items-center justify-content-center"
      >
        <SpinnerLoading />
      </div>
    );
  }

  if (!chartData[0]?.data?.length) {
    return (
      <div
        style={{ height: '450px', width: '100%' }}
        className="dash_chart1 d-flex align-items-center justify-content-center"
      >
        <p>No revenue data available</p>
      </div>
    );
  }

  return (
    <div style={{ height: '450px', width: '100%' }} className="dash_chart1">
      <div className="chart_head">
        <h2>Revenue Overview</h2>
      </div>

      <ResponsiveLine
        data={chartData}
        margin={{ top: 50, right: 15, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 0,
          max: getMaxYValue(),
          stacked: false,
          reverse: false
        }}
        yFormat={value => `$${value}`}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: 36
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendOffset: -40,
          tickValues: 5,
          format: value =>
            value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`
        }}
        enableGridY={false}
        enablePoints={true}
        pointSize={6}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enableArea={true}
        areaOpacity={0.1}
        useMesh={true}
        colors={['#fdb71a']}
        theme={{
          axis: { ticks: { text: { fill: '#9ca3af' } } },
          grid: { line: { stroke: '#374151', strokeWidth: 1 } }
        }}
        legends={[]}
         tooltip={({ point }) => (
    <div
      style={{
        background: 'white',
        color: '#111',
        padding: '4px 8px',
        borderRadius: '5px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      }}
    >
      <strong>{point.data.yFormatted}</strong>
    </div>
  )}
      />
    </div>
  );
};

export default CardLineChart;
