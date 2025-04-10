import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Dimensions, ScrollView, useColorScheme, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { BarChart } from "react-native-gifted-charts";
import { darkTheme, lightTheme } from "../../theme/theme";
import { useExam } from "../../ExamContext";
import { StackedBarChart } from "react-native-chart-kit";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const options = [
    { label: 'Last 30 Days', value: 1 },
    { label: 'Last 2 Months', value: 2 },
];

const WeeklyPerformance = ({ examResults,performanceSubOptions, selectedPerformanceType, dateRange, setSelectedPerformanceType, totalExamCount }) => {
    const [selectedValue, setSelectedValue] = useState(1);
    const [loading, setLoading] = useState(true);
       const { selectedExam, setSelectedExam } = useExam();
    const [chartData, setChartData] = useState([]);
    const [stackData, setStackData] = useState([]);
    const colorScheme = useColorScheme();
    const theme = darkTheme ;
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [isCustomSubjectMode, setIsCustomSubjectMode] = useState(false);
const [subjectLabels, setSubjectLabels] = useState([])// Update with your subject names
const subjectColors = ['#F5E1C8', '#8A6BBE', '#C5E6C3'];
    const colors = ['#F5E1C8', '#8A6BBE', '#ADD8E6'];
console.log(performanceSubOptions, "examResults")

const formattedChartData = examResults.map((entry) => {
    const date = entry.date;
    const subjectData = { date };

    // Loop through all subjects in this exam result
    entry.subjects?.forEach((subject) => {
        const name = subject.subject_name?.toLowerCase();
        const value = selectedPerformanceType === "score"
            ? Number(subject.obtained_marks) || 0
            : Number(subject.average_time_spent) || 0;

        if (selectedSubject === "all" || selectedSubject.toLowerCase() === name) {
            if (!subjectData[name]) subjectData[name] = 0;
            subjectData[name] += value;
        }
    });

    return subjectData;
});
 
console.log(chartData,examResults,performanceSubOptions, selectedPerformanceType, dateRange, setSelectedPerformanceType, totalExamCount, "examResultssdfedwe")

useEffect(() => {
    setLoading(true);

    if (!examResults || !Array.isArray(examResults)) {
        setLoading(false);
        return;
    }

    const formattedChartData = examResults.map((entry) => {
        let first = 0, second = 0, third = 0;

        entry.subjects?.forEach((subject, index) => {
            const value = selectedPerformanceType === "score"
                ? Number(subject.obtained_marks) || 0
                : Number(subject.average_time_spent) || 0;
console.log(entry.subjects, "entrySubs")
            if (index === 0) first += value;
            else if (index === 1) second += value;
            else if (index === 2) third += value;
        });

        return {
            first,
            second,
            third,
            total: first + second + third,
            date: entry.date,
        };
    });

    setChartData(formattedChartData);
    setLoading(false);
    
}, [selectedExam, examResults, selectedPerformanceType]);

useEffect(() => {
    setSubjectLabels(performanceSubOptions.map((item) => item.label));
},[]);

useEffect(() => {
    if (!chartData.length) return;

    const newStackData = chartData.map((item) => {
        const label = item.date;
        const stacks = [];

        const keys = Object.keys(item).filter(
            (key) => key !== "date" && key !== "total"
        );

        keys.forEach((key, i) => {
            const value = item[key] || 0;

            stacks.push({
                value,
                color: subjectColors[i % subjectColors.length],
                label: String(value), // Simple label text
                labelTextStyle: {
                    color: 'black',
                    fontSize: 10,
                },
                // Optional: if you want custom label component
                /*
                labelComponent: () => (
                    <View style={{ position: 'absolute', top: -20 }}>
                        <Text style={{ color: 'white', fontSize: 10 }}>
                            {value}
                        </Text>
                    </View>
                ),
                */
            });
        });


        return { label, stacks };
    });

    setStackData(newStackData);
}, [chartData]);



// when selecting a subject manually
const handleChangeSubject = (item) => {
console.log(examResults, item, "weidj")
    setSelectedSubject(item);
    setIsCustomSubjectMode(true);
    setLoading(true);
  
    const formatted = examResults.map((entry) => {
      let subjectValues = {};
  
      entry.subjects?.forEach((subject) => {
        const subjectName = subject.subject_name?.toLowerCase();
        const value = selectedPerformanceType === "score"
          ? Number(subject.obtained_marks) || 0
          : Number(subject.average_time_spent) || 0;
  
        if (item === "all" || subjectName === item.toLowerCase()) {
          if (!subjectValues[subjectName]) subjectValues[subjectName] = 0;
          subjectValues[subjectName] += value;
        }
      });
  
      return {
        ...subjectValues,
        total: Object.values(subjectValues).reduce((sum, v) => sum + v, 0),
        date: entry.date,
      };
    });
  
    setChartData(formatted);
    setLoading(false);
  };
  
  
  
 
    console.log(stackData, "stackData");
    return (
        <View style={{ backgroundColor: theme.conbk, padding: 10, borderRadius: 10 }}>
            {loading ? (
                <ActivityIndicator size="large" color={theme.tx1} style={{ marginTop: 20 }} />
            ) : chartData.length > 0 ? (
                <>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: theme.textColor }}>Weekly Performance</Text>
                            <Text style={{ fontSize: 14, color: theme.textColor }}>Total tests taken current week</Text>
                            <Text style={{ fontSize: 24, fontWeight: "bold", color: theme.textColor }}>{totalExamCount || 0}</Text>
                        </View>
                        <View>
                            <Text style={{ color: theme.textColor }}>{dateRange}</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setSelectedValue(value)}
                                items={options}
                                value={selectedValue}
                                style={{ inputAndroid: { color: "#ffffff" }, inputIOS: { color: "#ffffff" } }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <TouchableOpacity
                            style={{ padding: 8, borderBottomWidth: selectedPerformanceType === "score" ? 2 : 0, borderBottomColor: selectedPerformanceType === "score" ? theme.tx1 : "transparent" }}
                            onPress={() => setSelectedPerformanceType("score")}
                        >
                            <Text style={{ color: selectedPerformanceType === "score" ? theme.tx1 : theme.textColor }}>Scoring </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ padding: 8, marginLeft: 10, borderBottomWidth: selectedPerformanceType === "avgtime" ? 2 : 0, borderBottomColor: selectedPerformanceType === "avgtime" ? theme.tx1 : "transparent" }}
                            onPress={() => setSelectedPerformanceType("avgtime")}
                        >
                            <Text style={{ color: selectedPerformanceType === "avgtime" ? theme.tx1 : theme.textColor }}>Avg Time Spent </Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <StackedBarChart
  data={{
    labels: stackData.map(item => item.label), // X-axis labels (dates)
    // legend: subjectLabels, // Legend items (subject names)
    data: stackData.map(item => 
      item.stacks.map(stack => stack.value) // Values for each stack
    ),
    barColors: subjectColors, // Colors for each stack
  }}
  width={chartData.length * 60 + 100} // Dynamic width
  height={250}
  chartConfig={{
    backgroundColor: theme.conbk,
    backgroundGradientFrom: theme.conbk,
    backgroundGradientTo: theme.conbk,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 10,
    },
  }}
  style={{
    marginVertical: 8,
    borderRadius: 16,
  }}
  withCustomBarColorFromData={true}
  flatColor={true}
  showValuesOnTopOfBars={true} // This shows labels on top of bars
/>

</ScrollView>
<View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 }}>
    {performanceSubOptions.slice(1).map((label, index) => {
        const isSelected = selectedSubject.toLowerCase() === label.label.toLowerCase();
        return (
            <TouchableOpacity
                key={index}
                onPress={() => handleChangeSubject(isSelected ? "all" : label.label)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: 10,
                    marginBottom: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 16,
                    backgroundColor: isSelected ? subjectColors[index] : theme.conbk,
                    borderWidth: 1,
                    borderColor: subjectColors[index]
                }}
            >
                <View style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: subjectColors[index],
                    marginRight: 6
                }} />
                <Text style={{ color: "#ffff" }}>{label.label} </Text>
            </TouchableOpacity>
        );
    })}
</View>
                </>
            ) : (
                <View>
                    <Image source={require("../../images/2.jpg")} style={{ width: windowWidth * 0.85, height: windowHeight * 0.20, resizeMode: "contain" }} />
                </View>
            )}
        </View>
    );
};

export default WeeklyPerformance;