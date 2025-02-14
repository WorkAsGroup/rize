import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import { useNavigation } from '@react-navigation/native';

const DashboardContent = ({ route }) => {
  const navigation = useNavigation();
  const { onChangeAuth } = route.params;

  const handleLogout = async () => {
    onChangeAuth(null);
  };

  const [selectedExam, setSelectedExam] = useState('EAMCET');

  const handleExamTypePress = (examType) => {
    setSelectedExam(examType);
  };

  const data = [50, 70, 60, 90, 80];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828859.png' }} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>MockTest AI</Text>
        <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 'auto' }}>
          <Image source={require("../images/logout.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Exam Type Selection */}
      <View style={styles.examTypeContainer}>
        <TouchableOpacity
          style={[styles.examTypeButton, selectedExam === 'EAMCET' && styles.selectedExamButton]}
          onPress={() => handleExamTypePress('EAMCET')}
        >
          <Text style={[styles.examType, selectedExam === 'EAMCET' && styles.selectedExam]}>EAMCET</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.examTypeButton, selectedExam === 'JEE' && styles.selectedExamButton]}
          onPress={() => handleExamTypePress('JEE')}
        >
          <Text style={[styles.examType, selectedExam === 'JEE' && styles.selectedExam]}>JEE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.examTypeButton, selectedExam === 'KCET' && styles.selectedExamButton]}
          onPress={() => handleExamTypePress('KCET')}
        >
          <Text style={[styles.examType, selectedExam === 'KCET' && styles.selectedExam]}>KCET</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Message */}
      <Text style={styles.welcome}>Good morning 🔥</Text>
      <Text style={styles.username}>Welcome, Olive</Text>

      {/* Weekly Performance Section */}
      <View style={styles.performanceCard}>
        <Text style={styles.performanceTitle}>Weekly performance</Text>
        <Text style={styles.subText}>Total tests this week</Text>
        <Text style={styles.bigText}>02</Text>

        {/* Graph */}
        <LineChart
          style={styles.chart}
          data={data}
          svg={{ stroke: '#6A5ACD', strokeWidth: 2 }}
          contentInset={{ top: 20, bottom: 20 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between', // This will push the logout button to the right
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#6A5ACD', flex: 1, textAlign: 'center' }, // Center the title
  icon: { width: 25, height: 25, tintColor: 'black' },
  examTypeContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: '#E9EAEB',
    padding: 5,
    justifyContent: 'space-evenly',
    marginHorizontal: 15,
    borderRadius: 10,
  },
  examTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginRight: 10,
  },
  selectedExamButton: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 2,
    width: 100,
    alignItems: 'center',
  },
  examType: { fontSize: 16, color: 'gray' },
  selectedExam: { color: 'black', fontWeight: 'bold' },
  welcome: { marginTop: 10, fontSize: 16 },
  username: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  performanceCard: { backgroundColor: '#F8F9FD', padding: 20, borderRadius: 10 },
  performanceTitle: { fontSize: 18, fontWeight: 'bold' },
  subText: { color: 'gray' },
  bigText: { fontSize: 30, fontWeight: 'bold', marginTop: 5 },
  chart: { height: 150, marginTop: 10 },
});

export default DashboardContent;