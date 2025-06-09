import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";

const ForceUpdateScreen = () => {
  const playStoreLink =
    "https://play.google.com/store/apps/details?id=com.testonic&hl=en_IN";
  const appStoreLink = "itms-apps://itunes.apple.com/app/idYOUR_APP_ID";

  const openStore = () => {
    const url = Platform.OS === "ios" ? appStoreLink : playStoreLink;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Required</Text>
      <Text style={styles.message}>
        A new version of the app is available. Please update to continue.
      </Text>
      <TouchableOpacity style={styles.button} onPress={openStore}>
        <Text style={styles.buttonText}>Update Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForceUpdateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#12183A",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#F47B25",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
