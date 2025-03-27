import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { darkTheme, lightTheme } from "../theme/theme";

const SubmitTestModal = ({ isVisible, onClose, onLogin, onRegister }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose} // Handle back button press on Android
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.background[0] }]}>
          <Text style={[styles.modalText, { color: theme.textColor }]}>
            In order to get the results, please login or register.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonLogin, { borderWidth: 1, borderColor: theme.textColor }]}
              onPress={onLogin}
            >
              <Text style={[styles.textStyle, { color: theme.textColor }]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonRegister, {
                                          backgroundColor: theme.background[0],
                                        }]}
              onPress={onRegister}
            >
              <LinearGradient
                  colors={theme.background}
                  style={{ width: 100, height: 40, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 15 }} start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
              >
              <Text style={[styles.textStyle, { color: theme.textColor1 }]}>Register</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
    width: 100,
    alignItems: 'center',
  },
  buttonLogin: {
    backgroundColor: "transparent",
  },
  buttonRegister: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SubmitTestModal;