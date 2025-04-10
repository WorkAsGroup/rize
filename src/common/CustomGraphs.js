import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  LineChart,
  XAxis,
  YAxis,
  Grid
} from "react-native-svg-charts";
import { Circle, G, Text as SvgText } from "react-native-svg";
import * as shape from "d3-shape";

const CustomLineChart = ({
  chartData = [],
  labels = [],
  colors = ['#8B51FE', '#FFB6C1', '#C5E6C3'],
  yAxisFormatter = (val) => `${val}`,
  labelFormatter = (val) => val,
  width = 300,
  height = 250,
  yMin, // 👈 new
  yMax, // 👈 new
}) => {
  const contentInset = { top: 20, bottom: 20 };

  // Calculate dynamic max if not provided
  const allDataPoints = chartData.flat();
  const calculatedYMax = Math.ceil(Math.max(...allDataPoints));

  const calculatedYMin = Math.min(...allDataPoints) > 0 ? 0 : Math.min(...allDataPoints);

  const finalYMax = yMax ?? calculatedYMax;
  const finalYMin = yMin ?? calculatedYMin;

  const Decorators = ({ x, y, data, color, lineIndex }) => (
    <G>
      {data.map((value, index) => (
        <G key={`${lineIndex}-${index}`}>
          <Circle
            cx={x(index)}
            cy={y(value)}
            r={4}
            fill={color}
          />
          <SvgText
            x={x(index)}
            y={y(value) - 12}
            fontSize={10}
            fill="white"
            textAnchor="middle"
          >
            {labelFormatter(value, lineIndex)}
          </SvgText>
        </G>
      ))}
    </G>
  );

  return (
    <ScrollView horizontal>
      <View style={{ flexDirection: "row", padding: 10 }}>
        <YAxis
          data={allDataPoints}
          contentInset={contentInset}
          svg={{ fill: "white", fontSize: 10 }}
          numberOfTicks={5}
          min={finalYMin} // 👈 set min
          max={finalYMax} // 👈 set max
          formatLabel={yAxisFormatter}
        />
        <View>
          <View style={{ height, width: labels.length * 60 }}>
          {chartData.map((dataset, i) => {
  const localMax = yMax ?? Math.max(...dataset);
  const localMin = yMin ?? Math.min(...dataset, 0);
  return (
    <LineChart
      key={i}
      style={StyleSheet.absoluteFill}
      data={dataset}
      svg={{ stroke: colors[i] || "white", strokeWidth: 2 }}
      contentInset={{ top: 20, bottom: 20, left: 20, right: 20 }}
      curve={shape.curveMonotoneX}
      yMin={localMin}
      yMax={localMax}
    >
      <Grid />
      <Decorators
        data={dataset}
        color={colors[i] || "white"}
        lineIndex={i}
      />
    </LineChart>
  );
})}

          </View>
          <XAxis
            style={{ height: 30, marginTop: 5 }}
            data={labels}
            formatLabel={(value, index) => labels[index]}
            contentInset={{ left: 30, right: 30 }}
            svg={{ fill: "white", fontSize: 10 }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default CustomLineChart;
