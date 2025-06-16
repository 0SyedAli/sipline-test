"use client";
// Import necessary dependencies
import { ResponsiveLine } from "@nivo/line";
import { Select } from "@chakra-ui/react";
// Define data
const data = [
  {
    id: "japan",
    color: "hsl(99, 70%, 50%)",
    data: [
      { x: "Jan", y: 10000 },
      { x: "Feb", y: 20000 },
      { x: "Mar", y: 25000 },
      { x: "Apr", y: 28000 },
      { x: "May", y: 20000 },
      { x: "Jun", y: 15000 },
      { x: "Jul", y: 5000 },
      { x: "Aug", y: 45000 },
      { x: "Sep", y: 55000 },
      { x: "Oct", y: 25000 },
    ],
  },
  {
    id: "france",
    color: "hsl(196, 70%, 50%)",
    data: [
      { x: "Jan", y: 10000 },
      { x: "Feb", y: 20000 },
      { x: "Mar", y: 25000 },
      { x: "Apr", y: 28000 },
      { x: "May", y: 20000 },
      { x: "Jun", y: 15000 },
      { x: "Jul", y: 20000 },
      { x: "Aug", y: 10000 },
      { x: "Sep", y: 15000 },
      { x: "Oct", y: 25000 },
    ],
  },
];

// Define CardLineChart component
const CardLineChart = () => (
  <div style={{ height: "340px", width: "70%" }}>
    <div className="chart_head px-4">
      <h2>Overview</h2>
      <div className="chart_head_filter">
        <h5>Case</h5>
        <h5>Marketing</h5>
        <Select placeholder="Monthly">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>
      </div>
    </div>
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 15, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: 0,
        max: 80000,
        stacked: true,
        reverse: false,
      }}
      yFormat={(value) => `${(value / 1000).toFixed(0)}k`}
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
        legendOffset: -29,
        legendPosition: "middle",
        tickFormat: (value) => {
          if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k`;
          } else {
            return value;
          }
        },
      }}
      enableGridY={false}
      enablePoints={false}
      pointSize={10}
      lineWidth={3}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabel="data.yFormatted"
      pointLabelYOffset={-12}
      enableTouchCrosshair={true}
      useMesh={true}
      legends={[]}
    />
  </div>
);

export default CardLineChart;
