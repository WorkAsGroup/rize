import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, useColorScheme, FlatList, ActivityIndicator, ScrollView, RefreshControl, Alert, Modal, Pressable } from 'react-native';
import { darkTheme, lightTheme } from "../../theme/theme";
import LinearGradient from "react-native-linear-gradient";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Achivements = ({ach, setAchivementShow}) => {
         const colorScheme = useColorScheme();
    
        const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    
    
    return (
      <View style={[styles.performanceCard, { backgroundColor: theme.conbk, marginTop: 20 }]}>
        {/* Header Section */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 10}}>
          <Text style={[styles.performanceTitle, { color: theme.textColor }]}>Achievements</Text>
          <TouchableOpacity onPress={() => setAchivementShow(true)}>
            <Image source={require("../../images/info.png")} style={{ height: 15, width: 15 }} />
          </TouchableOpacity>
        </View>
  
        {/* Make sure ScrollView is within a flexible container */}
        <ScrollView 
  nestedScrollEnabled={true} // ✅ Allows internal scrolling
  style={{ maxHeight: windowHeight * 0.4 }} 
  contentContainerStyle={{ 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between", 
    flexGrow: 1 
  }}
  showsVerticalScrollIndicator={false} 
>
          {ach.length > 0 ? (
            ach.map((item, index) => (
              <LinearGradient
                key={index}
                colors={["rgba(106, 17, 203, 0.15)", "rgba(37, 117, 252, 0.15)"]}
                style={{
                  width: "30%", // 3 items per row
                  marginBottom: 10,
                  padding: 5,
                  backgroundColor: theme.textColor1,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image source={{ uri: item.badge_logo }} style={{ height: 75, width: 50, resizeMode: "contain" }} />
              </LinearGradient>
            ))
          ) : (
            <Text style={{ alignSelf: "center", color: theme.textColor, padding: 15 }}>
              📝 Take a Test to Earn a Badge 🏅
            </Text>
          )}
        </ScrollView>
      </View>
    );
  };
  
export default Achivements

const styles = StyleSheet.create({
    performanceCard: { padding: 10, borderRadius: 10, elevation: 1 },
})