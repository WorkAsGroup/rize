import React, { useEffect, useState } from 'react';
import { View, Text, Modal, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { getAchievementBadges } from '../../core/CommonService';
import LinearGradient from 'react-native-linear-gradient';

const AchievementsModal = ({achived}) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBadges = async () => {
    try {
      setLoading(true)
      const res = await getAchievementBadges();
      const filteredData = res.data.filter(
        (item) => !achived.some((i) => item.badge_logo === i.badge_logo)
      );
      setAchievements(filteredData || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   getBadges();
  }, []);

  return (
 
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* <View style={styles.header}>
            <Text style={styles.title}>Achievements</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Image source={require('../../images/delete.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View> */}

          {loading ? (
            <ActivityIndicator size="large" color="#E614E1" style={styles.loader} />
          ) : achievements.length === 0 ? (
            <Text style={styles.noDataText}>No Achievements Found</Text>
          ) : (
            <FlatList
              data={achievements}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item , index}) => (
                 <LinearGradient
                                key={index}
                                colors={["rgba(106, 17, 203, 0.15)", "rgba(37, 117, 252, 0.15)"]}
                                style={{
                                  width: "100%", // 3 items per row
                                  marginBottom: 10,
                                  padding: 5,
                                  backgroundColor:  "#000",
                                  borderRadius: 15,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  maxHeight: 100,
                                }}
                              >
                                <Image source={{ uri: item.badge_logo }} style={{ height: 75, width: 70, resizeMode: "contain" }} />
                              </LinearGradient>
             
              )}
              contentContainerStyle={{padding: 10,justifyContent: "space-between", gap: 10, display: "flex", flexDirection: "row", flexWrap: "wrap" }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>

  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'transparent',
    width: '100%',
    maxHeight: '100%', // Prevents modal from overflowing
    borderRadius: 10,
    // padding: 20,
    // elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeIcon: {
    width: 25,
    height: 25,
  },
  loader: {
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  achievementItem: {
    flexDirection: 'row',
    // alignItems: 'center',
    // paddingVertical: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
  },
  image: {
    width: 70,
    height: 70,
    // borderRadius: 25,
    margin: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default AchievementsModal;
