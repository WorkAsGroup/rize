import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Dimensions, ActivityIndicator, useColorScheme, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { darkTheme, lightTheme } from "../theme/theme";
import { Dropdown } from "react-native-element-dropdown";


const PerformanceStatusGraph = ({performanceSubOptions,  data,weekData, chaperWiseData,  type }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [weekChartData, setWeekChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const[chapData, setChapData] = useState(chaperWiseData)

  console.log(chapData, 'errrr')
  const [overallScorePercent, setOverallScorePercent] = useState("")
  const defaultValue = chapData.length > 0 ? { label: chapData[0].subject_name, value: chapData[0].subject_id } : null;
  const [chapValue, setChapValue] = useState(defaultValue)
  const subjects = [
    { label: "overall", value: 1 },
    { label: "botany", value: 2 },
    { label: "physics", value: 3 },
    { label: "chemistry", value: 4 },
    { label: "zoology", value: 5 },
  ];
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  console.log(performanceSubOptions, "oiefowieh")

  useEffect(() => {
   setChapData(chaperWiseData);
  },[chaperWiseData])

  useEffect(() => {
    setLoading(true);

    if (!data || !data.periods) {
      console.warn("No valid data received for chart.");
      setLoading(false);
      return;
    }
    const updatedData = performanceSubOptions.map(item => ({
      ...item,
      label: item.label.toLowerCase()
  }));

    const performanceCategories = data.periods.map((entry) => entry.day || "N/A");
    const selectedSubjectLabel = updatedData.find((sub) => sub.value === type)?.label;

    const studentData = data.periods.map((entry) => {
      const subjectData = entry.subjects?.find(
        (sub) => sub.subject_name?.toLowerCase() === selectedSubjectLabel
      );
      return subjectData
        ? type === 1
          ? Number(subjectData.student_obtained_marks_avg || 0)
          : Number(subjectData.student_average_time_spent || 0)
        : 0;
    });

    const communityData = data.periods.map((entry) => {
      const subjectData = entry.subjects?.find(
        (sub) => sub.subject_name?.toLowerCase() === selectedSubjectLabel
      );
      return subjectData
        ? type === selectedSubjectLabel
          ? Number(subjectData.community_obtained_marks_avg || 0)
          : Number(subjectData.community_average_time_spent || 0)
        : 0;
    });
    const filteredData = data?.overall?.filter((item) =>
        item.subject_name?.toLowerCase() === selectedSubjectLabel
    ) || [];

    setOverallScorePercent(filteredData)

    setChartData({
        labels: performanceCategories,
        datasets: [
          {
            label: "Overall Score",
            data: studentData.length ? studentData : [0], // Ensure it always has data
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Red
            strokeWidth: 2,
          },
          {
            label: "Community Score",
            data: communityData.length ? communityData : [0], // Ensure it always has data
            color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // Blue
            strokeWidth: 2,
          },
        ],
      });
      

    setTimeout(() => setLoading(false), 1000); // Simulate loading time
  }, [data, type]);

  useEffect(() => {

    if (!weekData || !weekData[0]?.periods) {
      console.warn("No valid weekly data available.");
      return;
    }
    console.log(weekData[0].periods, "wererpoer")
    setLoading(true);

    // Extract weeks and scores
    const weekLabels = weekData[0].periods.map((entry) => entry.period_name);
    const userScores = weekData[0].periods.map((entry) => 
      Number(entry.weekData[0]?.userAverage || 0)
    );
    const communityScores = weekData[0].periods.map((entry) =>  
      Number(entry.weekData[0]?.communityAverage || 0)
    );
    const top10Scores = weekData[0].periods.map((entry) => 
      Number(entry.weekData[0]?.top10Average || 0)
    );

    // console.log(weekLabels, userScores, communityScores, top10Scores, "anyonecando")
    setWeekChartData({
      labels: weekLabels,
      datasets: [
        {
          label: "User Score",
          data: userScores,
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Red
          strokeWidth: 2,
        },
        {
          label: "Community Score",
          data: communityScores,
          color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // Blue
          strokeWidth: 2,
        },
        {
          label: "Top 10 Score",
          data: top10Scores,
          color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // Green
          strokeWidth: 2,
        },
      ],
    });

    setTimeout(() => setLoading(false), 1000);
  }, [weekData]);

  // console.log(weekChartData, "yooov")
  const handleChangeSubject = (item) => {
    setChapValue(item)
  }


  return (

        <View style={[{display: "flex", flexDirection: "column", marginTop: 10 ,
         backgroundColor: theme.conbk , color: theme.textColor }]} >
        <View>
        <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "left",  color: theme.textColor  }}>
          Average Time Spent
        </Text>
<View>
  {overallScorePercent?.length > 0 &&
    overallScorePercent.map((item, index) => (
      <React.Fragment key={index}>
        <Text style={{ fontSize: 32, fontWeight: "400",color: theme.textColor  }}>
          {item.overall_user_marks_percentage}%
        </Text>
        <Text style={{ fontSize: 13, fontWeight: "400" ,color: theme.textColor}}>
          {item.overall_community_marks_percentage}% Score in community
        </Text>
      </React.Fragment>
    ))}
</View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{display: "flex", marginTop: 20, height: 200, justifyContent: "center", alignContent: "center"}} />
        ) : !chartData.datasets.length || chartData.datasets[0].data.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "red" }}>No data available</Text>
        ) : (
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width*0.8}
            height={250}
            yAxisSuffix={type === "score" ? " marks" : " sec"}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 10 },
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{ marginVertical: 10, borderRadius: 10 }}
          />
        )}
        <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "left",color: theme.textColor }}> Your Time</Text>
        <View>
  {overallScorePercent?.length > 0 &&
    overallScorePercent.map((item, index) => (
      <React.Fragment key={index}>
        <Text style={{ fontSize: 32, fontWeight: "400",color: theme.textColor }}>
          {item.overall_user_time}s
        </Text>
        <Text style={{ fontSize: 13, fontWeight: "400",color: theme.textColor }}>
          {item.overall_community_time}s avg time in community
        </Text>
      </React.Fragment>
    ))}
</View>
{loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={{display: "flex", marginTop: 20, height: 200, justifyContent: "center", alignContent: "center"}} />
        ) : !chartData.datasets.length || chartData.datasets[0].data.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "red" }}>No data available</Text>
        ) : (
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width *0.8}
            height={250}
            yAxisSuffix={type === "score" ? " marks" : " sec"}
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 10 },
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{ marginVertical: 10, borderRadius: 10 }}
          />
        )}
      </View>
   <View style={{marginTop: 50}}>
   <View>
       
        <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "left",color: theme.textColor }}>Weekly Test Activity vs. Community

</Text>


{loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20, height: 200 }} />
      ) : !weekChartData.datasets.length || weekChartData.datasets[0].data.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 10, color: "red" }}>No data available</Text>
      ) : (
        <LineChart
          data={weekChartData}
          width={Dimensions.get("window").width*0.8}
          height={250}
        //   yAxisSuffix=" marks"
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 10 },
            propsForDots: {
              r: "5",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
          style={{ marginVertical: 10, borderRadius: 10 }}
        />
      )}
    
      </View>
   </View>
   <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "left",color: theme.textColor }}>Chapter-Wise Performance: Weak vs. Strong</Text>
   <Dropdown 
    style={{
      backgroundColor: theme.background,
      borderColor: theme.tx1,
      borderWidth: 1,
      minHeight: 45,
      width: 250,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginTop: 10,

    }}
    containerStyle={{
      backgroundColor: theme.textColor1,
      borderColor: theme.brad,
      maxHeight: 150,
    }}
    placeholderStyle={{
      color: theme.textColor,
      fontSize: 12,
    }}
    selectedTextStyle={{
      color: theme.textColor,
      fontSize: 12,
    }}
    itemTextStyle={{
      fontSize: 11,
      color: theme.textColor,
    }}
    data={chapData.map((item) => ({ label: item.subject_name, value: item.subject_id }))}  
    labelField="label"
    valueField="value"
    value={chapValue || defaultValue}  // ✅ Sets the first item as default
    onChange={(item) => handleChangeSubject(item)}
    placeholder="Select"
   />
   <View style={styles.chapterGrid}>
  {chapData
    .filter((item) => item.subject_id === chapValue?.value) // Ensure chapValue is defined
    .flatMap((item) => item.chapterData || []) // Ensure chapterData exists
    .map((chapter, index) => (
      <View key={index} style={[styles.chapterBox, { backgroundColor: chapter.color_code }]}>
        <Text style={styles.chapterText}>
          {chapter.chapter_name.length > 20 ? `${chapter.chapter_name.slice(0, 15)}...` : chapter.chapter_name}
        </Text>
      </View>
    ))}
</View>

        </View>
      
     

  );
};

const styles = StyleSheet.create({
    container: { padding: 15, backgroundColor: '#fff' },
    cardContainer: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 15 },
    row: { flexDirection: 'row', alignItems: 'center' },
    icon: { width: 50, height: 50, marginRight: 10 },
    congratsText: { fontSize: 16, fontWeight: 'bold' },
    messageText: { fontSize: 12, color: '#585A5A' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    statBox: { alignItems: 'center' },
    statValue: { fontSize: 24, fontWeight: 'bold' },
    statLabel: { fontSize: 12, color: '#585A5A' },
    subjectList: { flexDirection: 'row', marginTop: 10 },
    subjectCard: { padding: 10, borderWidth: 1, borderRadius: 8, marginRight: 10 },
    selectedSubject: { backgroundColor: 'rgba(106, 17, 203, 0.1)' },
    subjectName: { fontSize: 14, fontWeight: '500' },
    subjectScore: { fontSize: 16, fontWeight: '600' },
    chapterGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 },
    chapterBox: { width: '45%', height: 75, justifyContent: 'center', alignItems: 'center', margin: 5 },
    chapterText: { fontSize: 12, fontWeight: '500', color: '#fff' },
    noDataText: { textAlign: 'center', fontSize: 16 }
});
export default PerformanceStatusGraph;
