import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ScrollView, useColorScheme, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { YAxis } from 'react-native-svg-charts';
import Svg, { Rect, G, Text as SVGText, Line } from 'react-native-svg';
import { darkTheme, lightTheme } from "../../theme/theme";
import { useSelector } from "react-redux";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const options = [
    { label: '30 Days', value: 1 },
    { label: '2 Months', value: 2 },
];

const WeeklyPerformance = ({ examResults, selectedValue, setSelectedValue, performanceSubOptions, selectedPerformanceType, dateRange, setSelectedPerformanceType, totalExamCount }) => {
    const [loading, setLoading] = useState(true);
    const selectedExam = useSelector((state) => state.header.selectedExam);
    const [chartData, setChartData] = useState([]);
    const [stackData, setStackData] = useState([]);
    const colorScheme = useColorScheme();
    const theme = darkTheme;
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [yMax, setYMax] = useState(550);
    const [yMin, setYMin] = useState(0);
    const [subjectColors, setSubjectColors] = useState({});
    const subjectColorss = [
       { overall: 'transparent'},
       { physics: '#ffdac1'},
       { chemistry: '#C5E6C3'},
       { mathematics: '#BFD7EA'},
       { biology: '#BFD7EA'},
       { botany: '#58b3d3'},
       { zoology: '#8ef6e4'},
       
        // total: '#b888d7',
    ]
    // Generate colors dynamically based on subjects
    const generateSubjectColors = (subjects) => {
        const subjectColors = {
          overall: 'transparent',
          physics: '#ffdac1',
          chemistry: '#C5E6C3',
          mathematics: '#BFD7EA',
          biology: '#BFD7EA',
          botany: '#58b3d3',
          zoology: '#8ef6e4',
        };
      
        const colors = {};
      
        subjects.forEach((subject) => {
          const key = subject.label.toLowerCase();
          colors[key] = subjectColors[key] || 'gray'; // fallback if subject is unknown
        });
      
        return colors;
      };
      
    useEffect(() => {
        setLoading(true);

        if (!examResults || !Array.isArray(examResults)) {
            setLoading(false);
            return;
        }

        // Generate colors based on available subjects
        const colors = generateSubjectColors(performanceSubOptions);
        setSubjectColors(colors);

        // Process dynamic data
        const formattedChartData = examResults.map((entry) => {
            const dataItem = { date: entry.date };
        
            performanceSubOptions
                .filter((item) => item.label.toLowerCase() !== 'overall')
                .forEach((subject) => {
                    const subjectKey = subject.label.toLowerCase();
                    dataItem[subjectKey] = 0;
                });
        
            entry.subjects?.forEach((subject) => {
                const subjectName = subject.subject_name?.toLowerCase();
                const value = selectedPerformanceType === "score"
                    ? Number(subject.marks) || 0
                    : Number(subject.average_time_spent) || 0;
        
                if (subjectName !== "overall" && (selectedSubject === "all" || selectedSubject.toLowerCase() === subjectName)) {
                    dataItem[subjectName] = value;
                }
            });
        
            return dataItem;
        });

        // Calculate Y-axis range
        const allValues = formattedChartData.flatMap(item => 
            Object.values(item).filter(val => typeof val === 'number')
        );
        
        const maxValue = Math.max(...allValues, 0);
        const minValue = Math.min(...allValues, 0);
        
        // Set Y-axis with some padding

        const maxTotal = formattedChartData.reduce((max, item) => {
            const sum = Object.entries(item)
              .filter(([key, value]) => typeof value === 'number') // only numeric values
              .reduce((s, [, value]) => s + value, 0);
          
            return Math.max(max, sum);
          }, 0);
          
          // Set Y-axis max with padding and rounding to nearest 50
          setYMax(Math.ceil((maxTotal * 1.2) / 50) * 50 || 550);
          
        setYMin(Math.floor(minValue * 1.2 / 50) * 50);
        
        setChartData(formattedChartData);
        setLoading(false);
    }, [examResults, selectedExam, selectedPerformanceType, selectedSubject, performanceSubOptions]);

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

    const formatDateLabel = (value, index) => {
        console.log(index, "indexes")
        const date = chartData[index]?.date;
        return date?.length > 6 ? date.substring(0, 5) : date || '';
    };

    const calculateZeroPosition = (chartHeight) => {
        const totalRange = yMax - yMin;
        return (yMax / totalRange) * chartHeight;
    };

    const generateTicks = () => {
        const ticks = [];
        const step = Math.ceil((yMax - yMin) / 6);
        
        for (let i = yMin; i <= yMax; i += step) {
            ticks.push(i);
        }
        
        return ticks;
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
                            <Text style={{ color: "#fff" }}>{dateRange}</Text>
                            <RNPickerSelect
                                onValueChange={(value) => setSelectedValue(value)}
                                items={options}
                                value={selectedValue}
                                style={{ 
                                    inputAndroid: { color:"#fff" }, 
                                    inputIOS: { color: "#fff" } 
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
                        {/* Y-Axis */}
                        <YAxis
                            style={{ width: 40, height: 270 }}
                            contentInset={{ top: 20, bottom: 20 }}
                            svg={{ fill: theme.textColor, fontSize: 10 }}
                            data={generateTicks()}
                            formatLabel={(value) => `${value}`}
                            min={yMin}
                            max={yMax}
                        />

                        {/* Scrollable Chart Area */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ width: Math.max(chartData.length * 50, windowWidth - 50) }}>
                                <Svg height={250} width={Math.max(chartData.length * 50, windowWidth - 50)}>
                                    {/* Zero line */}
                                    <Line
                                        x1={0}
                                        x2={Math.max(chartData.length * 50, windowWidth - 50)}
                                        y1={calculateZeroPosition(250)}
                                        y2={calculateZeroPosition(250)}
                                        stroke={theme.textColor}
                                        strokeWidth="1"
                                    />

                                    {/* Grid lines */}
                                    {generateTicks().map((value, index) => {
                                        const yPos = 250 - ((value - yMin) / (yMax - yMin)) * 250;
                                        return (
                                            <Line
                                                key={`grid-${index}`}
                                                x1={0}
                                                x2={Math.max(chartData.length * 50, windowWidth - 50)}
                                                y1={yPos}
                                                y2={yPos}
                                                stroke="#888"
                                                strokeWidth="1"
                                                strokeDasharray={[3, 3]}
                                            />
                                        );
                                    })}

                                    {/* Bars */}
                                    {stackData.map((item, index) => {
                                        const total = Object.values(item).reduce((sum, num) => sum + num, 0);
                                        const barX = index * 50 + 20;
                                        const zeroY = calculateZeroPosition(250);
                                        
                                        // Separate positive and negative values
                                        const positiveValues = performanceSubOptions
                                            .map(subject => ({
                                                value: item[subject.label.toLowerCase()] || 0,
                                                color: subjectColors[subject.label.toLowerCase()] || '#CCCCCC',
                                                
                                                label: subject.label
                                            }))
                                            .filter(segment => segment.value > 0);
                                        
                                        const negativeValues = performanceSubOptions
                                            .map(subject => ({
                                                value: item[subject.label.toLowerCase()] || 0,
                                                color: subjectColors[subject.label.toLowerCase()] || '#CCCCCC',
                                                label: subject.label
                                            }))
                                            .filter(segment => segment.value < 0);

                                        let positiveCumulative = 0;
                                        let negativeCumulative = 0;

                                        return (
                                            <G key={`bar-group-${index}`}>
                                                {/* Total Label */}
                                                {total !== 0 && (
                                                    <SVGText
                                                        x={barX + 15}
                                                        y={total > 0 
                                                            ? zeroY - (Math.abs(total)/(yMax-yMin))*250 - 5 
                                                            : zeroY + (Math.abs(total)/(yMax-yMin))*250 + 15}
                                                        fill="#b888d7"
                                                        fontSize="12"
                                                        fontWeight="bold"
                                                        textAnchor="middle"
                                                    >
                                                        {Math.round(total)}
                                                    </SVGText>
                                                )}

                                                {/* Positive segments */}
                                                {positiveValues.map((segment, i) => {
                                                    const segmentHeight = (segment.value / (yMax - yMin)) * 250;
                                                    const y = zeroY - positiveCumulative - segmentHeight;
                                                    positiveCumulative += segmentHeight;
                                                    
                                                    return (
                                                        <G key={`pos-${index}-${i}`}>
                                                            <Rect
                                                                x={barX}
                                                                y={y}
                                                                width={30}
                                                                height={segmentHeight}
                                                                fill={segment.color}
                                                            />
                                                            {segmentHeight > 10 && (
                                                                <SVGText
                                                                    x={barX + 15}
                                                                    y={y + segmentHeight/2}
                                                                    fill="#000"
                                                                    fontSize="10"
                                                                    alignmentBaseline="middle"
                                                                    textAnchor="middle"
                                                                >
                                                                    {Math.round(segment.value)}
                                                                </SVGText>
                                                            )}
                                                        </G>
                                                    );
                                                })}

                                                {/* Negative segments */}
                                                {negativeValues.map((segment, i) => {
                                                    const segmentHeight = (Math.abs(segment.value) / (yMax - yMin)) * 250;
                                                    const y = zeroY + negativeCumulative;
                                                    negativeCumulative += segmentHeight;
                                                    
                                                    return (
                                                        <G key={`neg-${index}-${i}`}>
                                                            <Rect
                                                                x={barX}
                                                                y={y}
                                                                width={30}
                                                                height={segmentHeight}
                                                                fill={segment.color}
                                                            />
                                                            {segmentHeight > 10 && (
                                                                <SVGText
                                                                    x={barX + 15}
                                                                    y={y + segmentHeight/2}
                                                                    fill="#000"
                                                                    fontSize="10"
                                                                    alignmentBaseline="middle"
                                                                    textAnchor="middle"
                                                                >
                                                                    {Math.round(segment.value)}
                                                                </SVGText>
                                                            )}
                                                        </G>
                                                    );
                                                })}
                                            </G>
                                        );
                                    })}
                                </Svg>

                                {/* X Axis Labels */}
                                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                    {chartData.map((item, index) => (
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

                    {/* Legend */}
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