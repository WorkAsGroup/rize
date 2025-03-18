import React, { useEffect, useState } from 'react';
import { View, Text, Modal, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { getAchievementBadges } from '../../core/CommonService';

const AchievementsModal = ({ visible, onClose }) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBadges = async () => {
    try {
      const res = await getAchievementBadges();
      setAchievements(res.data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) getBadges();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Achievements</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Image source={require('../../images/delete.png')} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#F8B84E" style={styles.loader} />
          ) : achievements.length === 0 ? (
            <Text style={styles.noDataText}>No Achievements Found</Text>
          ) : (
            <FlatList
              data={achievements}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.achievementItem}>
                  <Image source={{ uri: item.badge_logo }} style={styles.image} />
                  <View>
                    <Text style={styles.text}>{item.badge_name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                  </View>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 10 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    maxHeight: '80%', // Prevents modal from overflowing
    borderRadius: 10,
    padding: 20,
    elevation: 10,
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
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
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
