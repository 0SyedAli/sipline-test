'use client';

import { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Select } from '@chakra-ui/react';
import SpinnerLoading from './SpinnerLoading';

const CardLineChart = () => {
  const [chartData, setChartData] = useState([{
    id: 'revenue',
    color: '#fdb71a',
    data: []
  }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const monthlyRevenue = [
    {
      "totalGrandTotal": 1800,
      "year": 2025,
      "month": 1
    },
    {
      "totalGrandTotal": 900,
      "year": 2025,
      "month": 2
    },
    {
      "totalGrandTotal": 400,
      "year": 2025,
      "month": 3
    },
    {
      "totalGrandTotal": 1300,
      "year": 2025,
      "month": 4
    },
    {
      "totalGrandTotal": 1600,
      "year": 2025,
      "month": 5
    },
    {
      "totalGrandTotal": 1200,
      "year": 2025,
      "month": 6
    },
    {
      "totalGrandTotal": 285,
      "year": 2025,
      "month": 7
    },
    {
      "totalGrandTotal": 1700,
      "year": 2025,
      "month": 8
    },
    {
      "totalGrandTotal": 1400,
      "year": 2025,
      "month": 9
    },
    {
      "totalGrandTotal": 1200,
      "year": 2025,
      "month": 10
    },
    {
      "totalGrandTotal": 1300,
      "year": 2025,
      "month": 11
    },
    {
      "totalGrandTotal": 900,
      "year": 2025,
      "month": 12
    }
  ]
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}admin/getVendorStats?adminId=681948c5b687fdc2f5145680`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          // Transform API data to match chart format
          const transformedData = transformApiData(monthlyRevenue);
          setChartData(transformedData);
        } else {
          throw new Error(data.msg || 'Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  // Function to transform API data to chart format
  const transformApiData = (monthlyRevenue) => {
    if (!monthlyRevenue || !Array.isArray(monthlyRevenue) || monthlyRevenue.length === 0) {
      // Return empty data structure if no data
      return [{
        id: 'revenue',
        color: '#fdb71a',
        data: []
      }];
    }

    // Sort data by year and month
    const sortedData = [...monthlyRevenue].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    // Map to chart data format
    const chartDataPoints = sortedData.map(item => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        x: `${monthNames[item.month - 1]}`,
        y: item.totalGrandTotal
      };
    });

    return [
      {
        id: 'revenue',
        color: '#fdb71a',
        data: chartDataPoints
      }
    ];
  };

  // Get max value for y-scale
  const getMaxYValue = () => {
    if (!chartData.length || !chartData[0].data.length) return 1000;

    const maxValue = Math.max(...chartData[0].data.map(item => item.y));
    // Add some padding (20%) to the max value
    return Math.ceil(maxValue * 1.2);
  };

  if (loading) {
    return (
      <div style={{ height: "450px", width: "100%" }} className="dash_chart1">
        <div className="chart_head px-4">
          <h2>Overview</h2>
          <div className="chart_head_filter">
            <h5>Revenue</h5>
            <Select placeholder="Monthly" className="abc">
              <option value="monthly">Monthly</option>
            </Select>
          </div>
        </div>
        <div className='dash_chart1' style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '450px'
        }}>
          <SpinnerLoading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: "450px", width: "100%" }} className="dash_chart1">
        <div className="chart_head px-4">
          <h2>Overview</h2>
          <div className="chart_head_filter">
            <h5>Revenue</h5>
            <Select placeholder="Monthly" className="abc">
              <option value="monthly">Monthly</option>
            </Select>
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '250px',
          color: 'red'
        }}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "450px", width: "100%" }} className="dash_chart1">
      <div className="chart_head">
        <h2>Revenue Overview</h2>
        {/* <div className="chart_head_filter">
          <h5>Revenue</h5>
          <Select
            placeholder="Monthly"
            className="abc"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </Select>
        </div> */}
      </div>
      {chartData[0].data.length > 0 ? (
        <ResponsiveLine
          data={chartData}
          margin={{ top: 50, right: 15, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: 0,
            max: getMaxYValue(),
            stacked: false,
            reverse: false,
          }}
          yFormat={(value) => `$${value}`}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "",
            tickValues: 5,
            legendOffset: -40,
            legendPosition: "middle",
            format: (value) => {
              if (value >= 1000) {
                return `$${(value / 1000).toFixed(0)}k`;
              } else {
                return `$${value}`;
              }
            },
          }}
          enableGridY={false}
          enablePoints={true}
          pointSize={6}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabel="y"
          pointLabelYOffset={-12}
          enableArea={true}
          areaOpacity={0.1}
          enableTouchCrosshair={true}
          useMesh={true}
          colors={['#fdb71a']}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: '#9ca3af'
                }
              }
            },
            grid: {
              line: {
                stroke: '#374151',
                strokeWidth: 1
              }
            }
          }}
          legends={[]}
        />
      ) : (
        <div className='dash_chart1' style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '450px'
        }}>
          <p>No revenue data available</p>
        </div>
      )}
    </div>
  );
};

export default CardLineChart;