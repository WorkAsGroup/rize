import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Dimensions, ActivityIndicator, useColorScheme, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { darkTheme, lightTheme } from "../theme/theme";
import { Dropdown } from "react-native-element-dropdown";
import CustomLineChart from "../common/CustomGraphs";

const PerformanceStatusGraph = ({performanceSubOptions,  data,weekData, chaperWiseData,  type }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [weekChartData, setWeekChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const[chapData, setChapData] = useState(chaperWiseData);
  const [yourTime, setYourTime] = useState({ labels: [], datasets: [] })
  console.log(chapData, 'errrr');

  const [overallScorePercent, setOverallScorePercent] = useState("")
  const defaultValue = chapData.length > 0 ? { label: chapData[0].subject_name, value: chapData[0].subject_id } : null;
  const [chapValue, setChapValue] = useState(defaultValue)
  const [showUserAvgTime, setShowUserAvgTime] = useState(true);
  const [showCommunityAvgTime, setShowCommunityAvgTime] = useState(true);
  const [showYourAvgTime, setShowYourAvgTime] = useState(true);
  const [showYourCommunityAvgTime, setShowYourCommunityAvgTime] = useState(true);
  const [showWeekAvgTime, setShowWeekAvgTime] = useState(true);
  const [showCommunityWeekAvgTime, setShowCommunityWeekAvgTime] = useState(true);
  // const []
  const colorScheme = useColorScheme();
  const theme =  darkTheme ;
  console.log(performanceSubOptions, "oiefowieh")

  useEffect(() => {
   setChapData(chaperWiseData);
  },[chaperWiseData])

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
          label: 'Me',
          data: userScores,
          color: () => '#F5E1C8',
          strokeWidth: 2,
        },
        {
          label: 'Community',
          data: communityScores,
          color: () => '#8A6BBE',
          strokeWidth: 2,
        }
  
      ],
    });

    setTimeout(() => setLoading(false), 1000);
  }, [weekData]);

  // console.log(weekChartData, "yooov")
  const handleChangeSubject = (item) => {
    setChapValue(item)
  }


  const findAvgTime = (data, type) => {
  // setLoading(true);
  console.log(data, "datasefwe")
  const labels = data?.periods.map((item) => item.day);
  const updatedData = performanceSubOptions.map(item => ({
    ...item,
    label: item.label.toLowerCase()
}));
const selectedSubjectLabel = updatedData.find((sub) => sub.value === type)?.label;
// console.log(selectedSubjectLabel, performanceCategories, "apidjpeiipewfwepi")
    const studentData = data.periods.map((entry) => {
      const subjectData = entry.subjects?.find(
        (sub) => sub.subject_name?.toLowerCase() === selectedSubjectLabel
      );
      console.log(subjectData, "subjectData")
      return  Number(subjectData?.student_obtained_marks_avg || 0)
      // subjectData
      //   ? type == 1
      //     ? Number(subjectData?.community_obtained_marks_avg || 0)
      //     : Number(subjectData?.student_obtained_marks_avg || 0)
      //   : 0;
    });
  

    const communityData = data.periods.map((entry) => {
      const subjectData = entry.subjects?.find(
        (sub) => sub.subject_name?.toLowerCase() === selectedSubjectLabel
      );
      return  Number(subjectData?.community_obtained_marks_avg || 0)
      // subjectData
      // ? type === 1
      //   ? Number(subjectData.community_obtained_marks_avg || 0)
      //   : Number(subjectData?.community_obtained_marks_avg || 0)
      // : 0;
    });

    console.log(studentData, communityData, "studentDatasfw")
    setChartData({
    labels: labels,
    datasets: [
      {
        label: 'Me',
        data: studentData,
        color: () => '#F5E1C8',
        strokeWidth: 2,
      },
      {
        label: 'Community',
        data: communityData,
        color: () => '#8A6BBE',
        strokeWidth: 2,
      }
    ]
  });
  }


  const findYourAvgtime = (data, type) => {
    // setLoading(true);
    console.log(data, "datasefwe")
    const labels = data?.periods.map((item) => item.day);
    const updatedData = performanceSubOptions.map(item => ({
      ...item,
      label: item.label.toLowerCase()
  }));

    const performanceCategories = data.periods.map((entry) => entry.day || "N/A");
    const selectedSubjectLabel = updatedData.find((sub) => sub.value === type)?.label;
// console.log(selectedSubjectLabel, performanceCategories, "apidjpeiipewfwepi")
    const studentData = data.periods.map((entry) => {
      const subjectData = entry.subjects?.find(
        (sub) => sub.subject_name?.toLowerCase() === selectedSubjectLabel
      );
      console.log(data.periods, "subjectData")
      return Number(subjectData.student_average_time_spent || 0)
      //  subjectData
      //   ? type === 1
      //     ? Number(subjectData.community_average_time_spent || 0)
      //     : Number(subjectData.student_average_time_spent || 0)
      //   : 0;
    });
    

    const communityData = data.periods.map((entry) => {
      const subjectData = entry.subjects?.find(
        (sub) => sub.subject_name?.toLowerCase() === selectedSubjectLabel
      );
      return Number(subjectData.community_average_time_spent || 0)
      // subjectData
      // ? type === 1
      // ? Number(subjectData.community_average_time_spent || 0)
      // : Number(subjectData.student_average_time_spent || 0)
      // : 0;
    });

    setYourTime({
      labels: performanceCategories,
      datasets: [
        {
          label: 'Me',
          data: studentData,
          color: () => '#F5E1C8',
          strokeWidth: 2,
        },
        {
          label: 'Community',
          data: communityData,
          color: () => '#8A6BBE',
          strokeWidth: 2,
        }
      ]
    });
    
    const filteredData = data?.overall?.filter((item) =>
      item.subject_name?.toLowerCase() === selectedSubjectLabel
    ) || [];
    
    setOverallScorePercent(filteredData);
console.log(studentData, communityData, "studentData")
  }



  useEffect(() => {
if(data&&type) {
  findAvgTime(data, type);
  findYourAvgtime(data, type);
}

  },[data, type])

  const filteredDatasets = chartData.datasets.filter(ds => {
    if (ds.label === 'Me' && !showUserAvgTime) return false;
    if (ds.label === 'Community' && !showCommunityAvgTime) return false;
    return true;
  });
  const yourTimeDatasets = yourTime.datasets.filter(ds => {
    if (ds.label === 'Me' && !showYourAvgTime) return false;
    if (ds.label === 'Community' && !showYourCommunityAvgTime) return false;
    return true;
  });

  const weekDatasets = weekChartData.datasets.filter(ds => {
    if (ds.label === 'Me' && !showWeekAvgTime) return false;
    if (ds.label === 'Community' && !showCommunityWeekAvgTime) return false;
    return true;
  });

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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: "#000" }}>
<CustomLineChart
  chartData={filteredDatasets.map(ds => ds.data)}
  labels={chartData.labels}
  colors={filteredDatasets.map(ds => ds.color())}
  yAxisFormatter={(val) => `${val}`}
  labelFormatter={(val) => `${val}`}
  width={chartData.labels.length * 60}
  yMin={0}           // 👈 Force Y-axis min
  yMax={100}         // 👈 Force Y-axis max
/>

        </ScrollView>
        
        
        )}

<View style={{ flexDirection: "row", alignItems: "center", gap: 12 ,padding: 15 }}>
  {/* User's Toggle */}
  <TouchableOpacity onPress={() => setShowUserAvgTime(prev => !prev)}>
    <View style={{ flexDirection: "row", alignItems: "center", opacity: showUserAvgTime ? 1 : 0.4 }}>
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: "#8B51FE",
          marginRight: 6,
        }}
      />
      <Text style={{ color: "#fff" }}>Your's </Text>
    </View>
  </TouchableOpacity>

  {/* Community's Toggle */}
  <TouchableOpacity onPress={() => setShowCommunityAvgTime(prev => !prev)}>
    <View style={{ flexDirection: "row", alignItems: "center", opacity: showCommunityAvgTime ? 1 : 0.4 }}>
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: "#FFB6C1",
          marginRight: 6,
        }}
      />
      <Text style={{ color: "#fff" }}>Community's </Text>
    </View>
  </TouchableOpacity>
</View>


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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: "#000" }}>
  <CustomLineChart
  chartData={yourTimeDatasets.map(ds => ds.data)}
  colors={yourTimeDatasets.map(ds => ds.color())}
  labels={yourTime.labels}
  yAxisFormatter={(val) => `${val} Sec`}
  yMin={0}
  yMax={100}
  labelFormatter={(val) => `${val}`}
  width={yourTime.labels.length * 60}

/>


          </ScrollView> 
          
        )}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 ,padding: 15 }}>
  {/* User's Toggle */}
  <TouchableOpacity onPress={() => setShowYourAvgTime(prev => !prev)}>
    <View style={{ flexDirection: "row", alignItems: "center", opacity: showYourAvgTime ? 1 : 0.4 }}>
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: "#8B51FE",
          marginRight: 6,
        }}
      />
      <Text style={{ color: "#fff" }}>Your's </Text>
    </View>
  </TouchableOpacity>

  {/* Community's Toggle */}
  <TouchableOpacity onPress={() => setShowYourCommunityAvgTime(prev => !prev)}>
    <View style={{ flexDirection: "row", alignItems: "center", opacity: showYourCommunityAvgTime ? 1 : 0.4 }}>
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: "#FFB6C1",
          marginRight: 6,
        }}
      />
      <Text style={{ color: "#fff" }}>Community's </Text>
    </View>
  </TouchableOpacity>
</View>
   <View style={{marginTop: 50}}>
   <View>
       
        <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "left",color: theme.textColor, marginTop: 2 , marginBottom: 10}}>Weekly Test Activity vs. Community

</Text>


{loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20, height: 200 }} />
      ) : !weekChartData.datasets.length || weekChartData.datasets[0].data.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 10, color: "red" }}>No data available</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: "#000" }}>
        <CustomLineChart
  chartData={weekDatasets.map(ds => ds.data)}
  labels={weekChartData.labels}
  // colors={['#8B51FE', '#FFB6C1']} // Me and Community
  colors={weekDatasets.map(ds => ds.color())}
  yAxisFormatter={(val) => `${val}`}
  labelFormatter={(val) => `${val}`}
  width={weekChartData.labels.length * 60}
  yMax={120}
/>


        </ScrollView>
      )}
    
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 ,padding: 15 }}>
  {/* User's Toggle */}
  <TouchableOpacity onPress={() => setShowWeekAvgTime(prev => !prev)}>
    <View style={{ flexDirection: "row", alignItems: "center", opacity: showWeekAvgTime ? 1 : 0.4 }}>
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: "#8B51FE",
          marginRight: 6,
        }}
      />
      <Text style={{ color: "#fff" }}>Your's </Text>
    </View>
  </TouchableOpacity>

  {/* Community's Toggle */}
  <TouchableOpacity onPress={() => setShowCommunityWeekAvgTime(prev => !prev)}>
    <View style={{ flexDirection: "row", alignItems: "center", opacity: showCommunityWeekAvgTime ? 1 : 0.4 }}>
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: "#FFB6C1",
          marginRight: 6,
        }}
      />
      <Text style={{ color: "#fff" }}>Community's </Text>
    </View>
  </TouchableOpacity>
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
    data={chapData&&chapData.map((item) => ({ label: item.subject_name, value: item.subject_id }))}  
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
          {chapter.chapter_name}
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
    chapterText: { fontSize: 12, fontWeight: '500', color: '#000',flexWrap: 'wrap'  },
    noDataText: { textAlign: 'center', fontSize: 16 }
});
export default PerformanceStatusGraph;
