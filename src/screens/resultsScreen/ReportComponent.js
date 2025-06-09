import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
// import { getExamResultLoading } from "../resultSelectors";
import celebrateIcon from "../../images/congratsLogo.png";
import UserUtils from "../../common/UserUtils";

const ReportComponent = ({ reportData }) => {
  const [subjectId, setSubjectId] = useState(0);
  const [chapterAnalysis, setChapterAnalysis] = useState([]);
  const [loading, setLoading] = useState(false);
  const reportDetails = reportData ? reportData[0] : {};
  const difficultyDetails = reportDetails?.difficulty || [];
  const subjectWiseDetails = reportDetails?.subjectWiseData || [];
  console.log(reportData, "as;foiefowief");
  useEffect(() => {
    setChapterAnalysis(
      subjectWiseDetails.length ? subjectWiseDetails[0]?.chapterAanalysis : []
    );
  }, [reportData]);

  const handleSubjectClick = (data, index) => {
    setSubjectId(index);
    setChapterAnalysis(data.chapterAanalysis);
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6A11CB" />
      ) : reportData && reportData.length > 0 ? (
        <>
          <View style={styles.cardContainer}>
            <View style={styles.row}>
              <Image source={celebrateIcon} style={styles.icon} />
              <View style={{ width: "80%" }}>
                <Text style={styles.congratsText}>
                  🎉 Congratulations on completing your text! 📝{" "}
                </Text>

                <Text style={styles.messageText}>
                  ✨ Your hard work and dedication have paid off! 🚀 Keep up the
                  great work, and may this be the start of many more successful
                  writings! 👏📖🥳
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.sectionTitle}>Overall Score </Text>
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {reportDetails.total_marks}
                </Text>
                <Text style={styles.statLabel}>Total Marks </Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{reportDetails.score}</Text>
                <Text style={styles.statLabel}>Your Score </Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{reportDetails.accuracy}%</Text>
                <Text style={styles.statLabel}>Accuracy </Text>
              </View>
            </View>
            <View style={[styles.statsRow, { marginTop: 10 }]}>
              {/* <View style={styles.statBox}><Text style={styles.statValue}></Text><Text style={styles.statLabel}></Text></View> */}
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {reportDetails.averageTimePerQuestion} Sec
                </Text>
                <Text style={styles.statLabel}>Avg time per question </Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {`${reportDetails.subjectWiseOverAllTime % 60}`} Sec
                </Text>
                <Text style={styles.statLabel}>Avg time per subject </Text>
              </View>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.sectionTitle}>Difficulty Breakdown</Text>
            <View style={styles.statsRow}>
              {difficultyDetails.map((item, index) => (
                <View key={index} style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {item.questionsAnswered}/{item.total_questions}
                  </Text>
                  <Text style={styles.statLabel}>{item.type} </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.cardContainer}>
            <Text style={styles.sectionTitle}>
              Chapter wise strength vs weakness
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.subjectList}
            >
              {subjectWiseDetails.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.subjectCard,
                    subjectId === index && styles.selectedSubject,
                  ]}
                  onPress={() => handleSubjectClick(item, index)}
                >
                  <Text style={styles.subjectName}>{item.subject_name}</Text>
                  <Text style={styles.subjectScore}>
                    {item.subject_score}/{item.total_marks}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.chapterGrid}>
              {chapterAnalysis.map((chapter, index) => (
                <View
                  key={index}
                  style={[
                    styles.chapterBox,
                    { backgroundColor: chapter.color_code },
                  ]}
                >
                  <Text style={styles.chapterText}>{chapter.chapter_name}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>No data found</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#fff" },
  cardContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  row: { flexDirection: "row", alignItems: "center" },
  icon: { width: 50, height: 50, marginRight: 10 },
  congratsText: { fontSize: 16, fontWeight: "bold" },
  messageText: { fontSize: 12, color: "#585A5A" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statBox: { alignItems: "center" },
  statValue: { fontSize: 24, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#585A5A" },
  subjectList: { flexDirection: "row", marginTop: 10 },
  subjectCard: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
  },
  selectedSubject: { backgroundColor: "rgba(106, 17, 203, 0.1)" },
  subjectName: { fontSize: 14, fontWeight: "500" },
  subjectScore: { fontSize: 16, fontWeight: "600" },
  chapterGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 15 },
  chapterBox: {
    width: "45%",
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  chapterText: {
    display: "flex",
    fontSize: 12,
    fontWeight: "500",
    color: "#000",
    flexWrap: "wrap",
  },
  noDataText: { textAlign: "center", fontSize: 16 },
});

export default ReportComponent;
