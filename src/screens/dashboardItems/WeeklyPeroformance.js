import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView, useColorScheme, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { StackedBarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import Svg, { Rect, G, Text as SVGText, Line } from 'react-native-svg';
import { darkTheme, lightTheme } from "../../theme/theme";
import { useSelector } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const options = [
    { label: '30 Days', value: 1 },
    { label: '2 Months', value: 2 },
];

// Subject-specific colors
const subjectColors = {
    overall: 'transparent',
    physics: '#ffdac1',
    chemistry: '#C5E6C3',
    mathematics: '#BFD7EA',
    biology: '#BFD7EA',
    botany: '#58b3d3',
    zoology: '#8ef6e4',
   
    // total: '#b888d7',
};

const WeeklyPerformance = ({ examResults,selectedValue, setSelectedValue,performanceSubOptions, selectedPerformanceType, dateRange, setSelectedPerformanceType, totalExamCount }) => {

    const [loading, setLoading] = useState(true);
    const selectedExam = useSelector((state) => state.header.selectedExam);
    const [chartData, setChartData] = useState([]);
    const [stackData, setStackData] = useState([]);
    const colorScheme = useColorScheme();
    const theme = darkTheme;
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [yMax, setYMax] = useState(100);
    const [yMin, setYMin] = useState(0);
    

    useEffect(() => {
        setLoading(true);

        if (!examResults || !Array.isArray(examResults)) {
            setLoading(false);
            return;
        }

        const formattedChartData = examResults.map((entry) => {
            const dataItem = { date: entry.date };
        
            // Initialize subject keys, excluding 'overall'
            performanceSubOptions
                .filter((item) => item.label.toLowerCase() !== 'overall')  // Filter out 'overall'
                .forEach((subject) => {
                    const subjectKey = subject.label.toLowerCase();  // Assuming `subject.label` contains the name
                    dataItem[subjectKey] = 0;  // Initialize each subject with 0
                });
        
            // Assign values to subject keys, excluding "overall"
            entry.subjects?.forEach((subject) => {
                const subjectName = subject.subject_name?.toLowerCase();
                const value = selectedPerformanceType === "score"
                    ? Number(subject.marks) || 0
                    : Number(subject.average_time_spent) || 0;
        
                // Fill the data item for subjects excluding "overall"
                if (subjectName !== "overall" && (selectedSubject === "all" || selectedSubject.toLowerCase() === subjectName)) {
                    dataItem[subjectName] = value;
                }
            });
        
            return dataItem;  // Return dataItem without "overall"
        });
        
        
        
console.log(formattedChartData, "chartData")        

        const allValues = formattedChartData.flatMap(item => {
            const { overall, ...rest } = item;
        
            return [
                ...Object.values(rest).filter(val => typeof val === 'number'),
                ...(typeof overall === 'number' ? [overall] : [])
            ];
        });
        console.log(allValues, "ajndekjfwekjbf")
        
        const maxValue = Math.max(...allValues);
        const minValue = Math.min(...allValues);
        
        const calculateYMax = (maxValue) => {
            if (maxValue === undefined || maxValue === null) {
                console.log("Max value is undefined or null, defaulting to 100.");
                return 100;
            }
            
            // Scale by 15% for better top padding (instead of 10%)
            const scaledValue = maxValue * 1.15;
            
            // Calculate appropriate rounding interval
            const magnitude = Math.pow(10, Math.floor(Math.log10(scaledValue)));
            let interval;
            
            if (scaledValue / magnitude < 2) {
                interval = magnitude / 2;
            } else if (scaledValue / magnitude < 5) {
                interval = magnitude;
            } else {
                interval = magnitude * 2;
            }
            
            return Math.ceil(scaledValue / interval) * interval;
        };
        
        // Calculate Y-axis ticks
        // const calculateYTicks = (yMax) => {
        //     const numberOfTicks = 5;
        //     const tickInterval = yMax / numberOfTicks;
            
        //     return Array.from({ length: numberOfTicks + 1 }, (_, i) => 
        //         Math.round(i * tickInterval * 10) / 10
        //     );
        // };
        
        // In your useEffect:
        const stackTotals = formattedChartData.map(item => {
            const { date, ...rest } = item;
            return Object.values(rest).reduce((sum, val) => sum + (val || 0), 0);
        });
        
        const maxStackTotal = Math.max(...stackTotals, 1);
        const yMax = calculateYMax(maxStackTotal);
        setYMax(yMax);
        // setYTicks(calculateYTicks(yMax));
          

        setChartData(formattedChartData);
        setLoading(false);
    }, [selectedExam, examResults, selectedPerformanceType, selectedSubject, performanceSubOptions]);

    useEffect(() => {
        if (!chartData.length || !performanceSubOptions.length) return;

        const newStackData = chartData.map(item => {
            const stackItem = {};
            performanceSubOptions.forEach((subject) => {
                const key = subject.label.toLowerCase();
                stackItem[key] = item[key] || 0;
            });
            return stackItem;
        });

        setStackData(newStackData);
    }, [chartData, performanceSubOptions]);

    const handleChangeSubject = (item) => {
        setSelectedSubject(item === selectedSubject ? "all" : item);
    };
    const BarLabels = ({ x, y, bandwidth, data }) => {
        console.log()
        return (
            <G>
                {data.map((item, index) => {
                    let cumulative = 0;
                    const segments = [];

    
                    // Add other subjects next
                    performanceSubOptions.forEach((subject) => {
                        const key = subject.label.toLowerCase();
                        const value = item[key] || 0;
    
                        if (Math.abs(value) > 0) {
                            segments.push({
                                value,
                                color: subjectColors[key] || '#CCCCCC',
                                cumulativeBefore: cumulative,
                                cumulativeAfter: cumulative + value,
                            });
                            cumulative += value;
                        }
                    });
    
                    // Render segments (labels)
                    return segments.map((segment, segmentIndex) => {
                        const middleY = y(segment.cumulativeAfter) + 
                                        (y(segment.cumulativeBefore) - y(segment.cumulativeAfter)) / 2;
                        
                        const showLabel = Math.abs(y(segment.cumulativeAfter) - y(segment.cumulativeBefore)) > 15;
    
                        return (
                            <SVGText
                                key={`${index}-${segmentIndex}`}
                                x={x(index) + bandwidth / 2}
                                y={middleY}
                                fontSize={10}
                                fill={segment.value < 0 ? '#FFFFFF' : '#000000'}
                                alignmentBaseline="middle"
                                textAnchor="middle"
                            >
                                {showLabel ? segment.value : ''}
                            </SVGText>
                        );
                    });
                })}
            </G>
        );
    };
    

    const getColorsForChart = () => {
        return performanceSubOptions.map(subject => 
            subjectColors[subject.label.toLowerCase()] || '#CCCCCC'
        );
    };

    const formatDateLabel = (value, index) => {
        console.log(index, "indexes")
        const date = chartData[index]?.date;
        return date?.length > 6 ? date.substring(0, 5) : date || '';
    };

    return (
        <View style={{ backgroundColor: theme.conbk, padding: 10, borderRadius: 10 }}>
            {loading ? (
                <ActivityIndicator size="large" color={theme.tx1} style={{ marginTop: 20 }} />
            ) : chartData.length > 0 ? (
                <>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View>
                            <Text style={{ fontSize: 18, fontWeight: "bold", color: theme.textColor }}>Weekly Performance</Text>
                            <Text style={{ fontSize: 14, color: theme.textColor }}>Total tests taken current week </Text>
                            <Text style={{ fontSize: 24, fontWeight: "bold", color: theme.textColor }}>{totalExamCount || 0}</Text>
                        </View>
                        <View>
                            <Text style={{ color: theme.textColor }}>{dateRange}</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setSelectedValue(value)}
                                items={options}
                                value={selectedValue}
                                style={{ 
                                    inputAndroid: { color: theme.textColor }, 
                                    inputIOS: { color: theme.textColor } 
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <TouchableOpacity
                            style={{ 
                                padding: 8, 
                                borderBottomWidth: selectedPerformanceType === "score" ? 2 : 0, 
                                borderBottomColor: selectedPerformanceType === "score" ? theme.tx1 : "transparent" 
                            }}
                            onPress={() => setSelectedPerformanceType("score")}
                        >
                            <Text style={{ color: selectedPerformanceType === "score" ? theme.tx1 : theme.textColor }}>Scoring </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ 
                                padding: 8, 
                                marginLeft: 10, 
                                borderBottomWidth: selectedPerformanceType === "avgtime" ? 2 : 0, 
                                borderBottomColor: selectedPerformanceType === "avgtime" ? theme.tx1 : "transparent" 
                            }}
                            onPress={() => setSelectedPerformanceType("avgtime")}
                        >
                            <Text style={{ color: selectedPerformanceType === "avgtime" ? theme.tx1 : theme.textColor }}>Avg Time Spent </Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{ height: 380, marginTop: 10, flexDirection: 'row' }}>
  {/* Fixed Y-Axis */}
  <YAxis
    data={[yMin, yMax / 2, yMax]}
    style={{ width: 40, height: 270 }}
    contentInset={{ top: 20, bottom: 20 }}
    svg={{ fill: theme.textColor, fontSize: 10 }}
    numberOfTicks={5}
    formatLabel={(value) => `${value}`}
    min={yMin}
    max={yMax}
  />

  {/* Scrollable Bars + X Axis */}
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <View style={{ width: Math.max(chartData.length * 50, windowWidth - 50) }}>
      <Svg height={250} width={Math.max(chartData.length * 50, windowWidth - 50)}>
        {/* Horizontal Grid Lines */}
        {Array.from({ length: 5 + 1 }, (_, index) => {
          const y = (250 / 5) * index;
          return (
            <Line
              key={`grid-line-${index}`}
              x1={0}
              x2={Math.max(chartData.length * 50, windowWidth - 50)}
              y1={y}
              y2={y}
              stroke="#555"
              strokeDasharray="4"
            />
          );
        })}

        {/* Bars + Labels */}
        {stackData.map((item, index) => {
          const total = Object.values(item).reduce((sum, num) => sum + num, 0);
          let cumulative = 0;
          const barX = index * 50 + 20;

          return (
            <G key={index}>
              {/* Overall Label at the top */}
              <SVGText
                x={barX + 15}
                y={(250 - (total / yMax) * 250) - 5}
                fill="#b888d7"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
              >
                {total}
              </SVGText>

              {performanceSubOptions.map((subject, subjectIndex) => {
                const value = item[subject.label.toLowerCase()];
                const barHeight = (value / yMax) * 250;
                const y = 250 - (cumulative + barHeight);
                cumulative += barHeight;

                if (value === 0) return null;

                return (
                  <G key={`${index}-${subjectIndex}`}>
                    <Rect
                      x={barX}
                      y={y}
                      width={30}
                      height={barHeight}
                      fill={getColorsForChart()[subjectIndex]}
                    />
                    <SVGText
                      x={barX + 15}
                      y={y + barHeight / 2}
                      fill="#000"
                      fontSize="10"
                      alignmentBaseline="middle"
                      textAnchor="middle"
                    >
                      {value}
                    </SVGText>
                  </G>
                );
              })}
            </G>
          );
        })}
      </Svg>

      {/* X Axis Labels */}
      <View style={{ flexDirection: 'row', marginTop: 4 }}>
        {chartData&&chartData.length>0&&chartData.map((item, index) => (
          <Text
            key={index}
            style={{
              color: theme.textColor,
              width: 50,
              textAlign: 'center',
              fontSize: 10,
            }}
          >
            {formatDateLabel(item, index)}
          </Text>
        ))}
      </View>
    </View>
  </ScrollView>
</View>



                    <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: -90 }}>
                        {performanceSubOptions.slice(1).map((label, index) => {
                            const isSelected = selectedSubject.toLowerCase() === label.label.toLowerCase();
                            const color = subjectColors[label.label.toLowerCase()] || '#CCCCCC';
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleChangeSubject(label.label)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginRight: 10,
                                        marginBottom: 8,
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 16,
                                        backgroundColor: isSelected ? color : theme.conbk,
                                        borderWidth: 1,
                                        borderColor: color
                                    }}
                                >
                                    <View style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: color,
                                        marginRight: 6
                                    }} />
                                    <Text style={{ color: theme.textColor }}>{label.label} </Text>
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