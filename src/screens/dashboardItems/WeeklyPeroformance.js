import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, useColorScheme, FlatList, ActivityIndicator, ScrollView, RefreshControl, Alert, Modal, Pressable } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { AreaChart, Grid, XAxis, YAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { LineChart } from "react-native-chart-kit";
import { darkTheme, lightTheme } from "../../theme/theme";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const options = [
    { label: 'Last 30 Days', value: 1 },
    { label: 'Last 2 Months', value: 2 },
  ];
const WeeklyPerformance = ({examResults, selectedPerformanceType,dateRange, setSelectedPerformanceType, totalExamCount }) => {
    const [selectedValue, setSelectedValue] = useState(1);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
      const colorScheme = useColorScheme();
    const [xLabels, setXLabels] = useState([]);
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    useEffect(() => {
      setLoading(true);
  
      if (!examResults || !Array.isArray(examResults)) {
        setLoading(false);
        return;
      }
  
      const periods = examResults || [];
      const allSubjects = [...new Set(periods.flatMap((period) => period.subjects?.map((s) => s.subject_name) || []))];
      const uniqueDates = [...new Set(periods.map((period) => period.date))];
  
      const formattedChartData = allSubjects.map((subject) => ({
        name: subject,
        data: periods.map((period) => {
          const subjectData = period.subjects?.find((s) => s.subject_name === subject);
          return subjectData
            ? selectedPerformanceType === "score"
              ? Number(subjectData.obtained_marks) || 0
              : Number(subjectData.average_time_spent) || 0
            : 0;
        }),
      }));
  
      setChartData(formattedChartData);
      setXLabels(uniqueDates);
      setLoading(false);
    }, [examResults, selectedPerformanceType]);
  
    const subjectColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF"];

    return (
      <View style={{ backgroundColor: theme.conbk, padding: 10, borderRadius: 10 }}>
        {
      //   loading ? (
      //   <ActivityIndicator size="large" color={theme.tx1} style={{ marginTop: 20 }} />
      // ) : 
          chartData?.length > 0 ? (
          <React.Fragment>
             <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: theme.textColor }}>Weekly Performance</Text>
            <Text style={{ fontSize: 14, color: theme.textColor }}>Total tests taken current week</Text>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: theme.textColor }}>
              {totalExamCount ? totalExamCount : 0}
            </Text>
          </View>

          <View>
            <Text style={{ color: theme.textColor }}>{dateRange}</Text>
            <RNPickerSelect
              onValueChange={(value) => setSelectedValue(value)}
              items={options}
              value={selectedValue}
              style={{
                inputAndroid: { color: theme.textColor },
                inputIOS: { color: theme.textColor },
              }}
            />
          </View>
          </View>

<View style={{ flexDirection: "row", marginTop: 10 }}>
  <TouchableOpacity
    style={{
      padding: 8,
      borderBottomWidth: selectedPerformanceType === "score" ? 2 : 0,
      borderBottomColor: selectedPerformanceType === "score" ? theme.tx1 : "transparent",
    }}
    onPress={() => setSelectedPerformanceType("score")}
  >
    <Text style={{ color: selectedPerformanceType === "score" ? theme.tx1 : theme.textColor }}>Scoring</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={{
      padding: 8,
      marginLeft: 10,
      borderBottomWidth: selectedPerformanceType === "avgtime" ? 2 : 0,
      borderBottomColor: selectedPerformanceType === "avgtime" ? theme.tx1 : "transparent",
    }}
    onPress={() => setSelectedPerformanceType("avgtime")}
  >
    <Text style={{ color: selectedPerformanceType === "avgtime" ? theme.tx1 : theme.textColor }}>
      Avg Time Spent
    </Text>
  </TouchableOpacity>
</View>

{/* Line Chart */}
{chartData && chartData.length > 0 && xLabels && xLabels.length > 0 ? (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <LineChart
      data={{
        labels: xLabels,
        datasets: chartData.map((subject, index) => ({
          data: subject.data || [],
          color: () => subjectColors[index % subjectColors.length],
          strokeWidth: 2,
        })),
      }}
      width={chartData.length >5 ? chartData.length* 0.8 : windowWidth*0.85}
      height={250}
      yAxisLabel=""
      chartConfig={{
        backgroundColor: theme.conbk,
        backgroundGradientFrom: theme.white,
        backgroundGradientTo: theme.white,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        propsForDots: {
          r: "4",
          strokeWidth: "2",
          stroke: "#ffa726",
        },
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 10,
      }}
    />
  </ScrollView>
) : (
  <Text style={{ color: theme.textColor }}>No data available</Text>
)}
{/* Subject Legends */}
<View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
  {chartData.map((subject, index) => (
    <View key={index} style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
      <View
        style={{
          width: 10,
          height: 10,
          backgroundColor: subjectColors[index % subjectColors.length],
          marginRight: 5,
        }}
      />
      <Text style={{ color: theme.textColor }}>{subject.name}</Text>
    </View>
  ))}
</View>
          </React.Fragment>
          ) : (
           <View>
             <Image source={{ uri: "https://mocktest.rizee.in/static/media/take-the-test1.e09ad0cac0e111c3b6d7.png" }} style={{ width: windowWidth*0.85, height: windowHeight*0.20, resizeMode: "contain" }} />
           </View>
          )}
       
      </View>
    );
  };

  export default WeeklyPerformance;

const styles = StyleSheet.create({
    // Other styles...
});