import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  useColorScheme,
  Dimensions,
  Image,
  Platform,
  StatusBar, 
  TouchableWithoutFeedback, 
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { darkTheme, lightTheme } from "../theme/theme";
import DropDownPicker from 'react-native-dropdown-picker';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Intro({ navigation }) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const [open, setOpen] = useState(false);
  const [examType, setExamType] = useState('NEET');
  const [items, setItems] = useState([
    { label: 'NEET', value: 'NEET' },
    { label: 'JEE', value: 'JEE' },
    { label: 'AP-EAMCET-MPC', value: 'AP-EAMCET-MPC' },
    { label: 'AP-EAMCET-BiPC', value: 'AP-EAMCET-BiPC' },
    { label: 'TS-EAMCET-MPC', value: 'TS-EAMCET-MPC' },
    { label: 'TS-EAMCET-BiPC', value: 'TS-EAMCET-BiPC' },
    { label: 'KCET - PCMB', value: 'KCET - PCMB' },
    { label: 'KCET - PCM', value: 'KCET - PCM' },
    { label: 'KCET - PCB', value: 'KCET - PCB' },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const options = ['NEET', 'JEE', 'AP-EAMCET-MPC', 'AP-EAMCET-BiPC', 'TS-EAMCET-MPC','TS-EAMCET-BiPC','KCET - PCM','KCET - PCB','KCET - PCMB'];

  const toggleDropdown = () => {
    setIsOpen(true);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const { height } = Dimensions.get('window');

  const handleStartTest = () => {
    navigation.navigate("Instruction");
  };

  const renderItem = (() => (
    <View style={styles.itemContainer}>
      <View style={{ width: windowWidth / 1.2, marginTop: 20,marginBottom:10 }}>
        <Text style={[styles.feature, { color: theme.textColor }]}>Select Exam</Text>
      </View>

      <LinearGradient
        colors={theme.mcb}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={[styles.dropdownLinearGradient,{borderColor:theme.tx1,borderWidth:1}]}
      >
        <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
          <Text style={[styles.dropdownButtonText, { color: theme.textColor }]}>{selectedOption || 'Select an option'}</Text>
          <Image
                style={{ height: 20, width: 20, tintColor: theme.textColor, resizeMode: 'contain',}}
                source={require("../images/down.png")}
              />
        </TouchableOpacity>
        {isOpen && (
          <View style={[styles.dropdown, { top: 50, backgroundColor: theme.background,borderColor:theme.brad }]}>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.option,{backgroundColor: theme.textColor1}]}
                onPress={() => handleOptionSelect(option)}
              >
                <Text style={{color:theme.textColor}}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </LinearGradient>


      <View style={{ width: windowWidth / 1.2, marginTop: 20,marginBottom:10 }}>
        <Text style={[styles.feature, { color: theme.textColor, alignSelf:'center',fontSize:18 }]}>Mock Test</Text>
      </View>


      <View style={[styles.mockTestWrapper, { borderColor: theme.tx1, marginTop: 10 }]}>
        <View style={[styles.mockTestBorder, { borderColor: theme.brad }]} />
        <LinearGradient
          colors={theme.mcb}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={styles.mockTestContainer}
        >

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Exam Name:</Text>
              <Text style={[styles.tag, { color: theme.textColor }]}>N01</Text>
            </View>

            <View style={{ flexDirection: 'row', marginEnd: 10 }}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Marks:</Text>
              <Text style={[styles.tag, { color: theme.textColor }]}>720</Text>
            </View>

          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{ height: 20, width: 20, tintColor: theme.textColor, resizeMode: 'contain', marginTop: 12, marginLeft: 10 }}
                source={require("../images/clock.png")}
              />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>3 Hours 0 minutes</Text>
            </View>
          </View>

          <TouchableOpacity style={{ alignItems: 'center' }} activeOpacity={0.8} onPress={handleStartTest}>
            <LinearGradient
              colors={[theme.tx1, theme.tx2]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButtonGradient}
            >
              <Text style={[styles.startButtonText, { color: theme.textColor1, fontFamily: "CustomFont" }]}>Start Test</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={[styles.mockTestWrapper, { borderColor: theme.tx1, marginTop: 20 }]}>
        <View style={[styles.mockTestBorder, { borderColor: theme.brad }]} />
        <LinearGradient
          colors={theme.mcb}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={styles.mockTestContainer}
        >

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Exam Name:</Text>
              <Text style={[styles.tag, { color: theme.textColor }]}>N02</Text>
            </View>

            <View style={{ flexDirection: 'row', marginEnd: 10 }}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Marks:</Text>
              <Text style={[styles.tag, { color: theme.textColor }]}>720</Text>
            </View>

          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{ height: 20, width: 20, tintColor: theme.textColor, resizeMode: 'contain', marginTop: 12, marginLeft: 10 }}
                source={require("../images/clock.png")}
              />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>3 Hours 0 minutes</Text>
            </View>
          </View>

          <TouchableOpacity style={{ alignItems: 'center' }} activeOpacity={0.8} onPress={() => {
            navigation.navigate("Instruction")
          }}>
            <LinearGradient
              colors={[theme.tx1, theme.tx2]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButtonGradient}
            >
              <Text style={[styles.startButtonText, { color: theme.textColor1, fontFamily: "CustomFont" }]}>Start Test</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={[styles.mockTestWrapper, { borderColor: theme.tx1, marginTop: 20 }]}>
        <View style={[styles.mockTestBorder, { borderColor: theme.brad }]} />
        <LinearGradient
          colors={theme.mcb}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={styles.mockTestContainer}
        >

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Exam Name:</Text>
              <Text style={[styles.tag, { color: theme.textColor }]}>N03</Text>
            </View>

            <View style={{ flexDirection: 'row', marginEnd: 10 }}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Marks:</Text>
              <Text style={[styles.tag, { color: theme.textColor }]}>720</Text>
            </View>

          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{ height: 20, width: 20, tintColor: theme.textColor, resizeMode: 'contain', marginTop: 12, marginLeft: 10 }}
                source={require("../images/clock.png")}
              />
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>3 Hours 0 minutes</Text>
            </View>
          </View>

          <TouchableOpacity style={{ alignItems: 'center' }} activeOpacity={0.8} onPress={() => {
            navigation.navigate("Instruction")
          }}>
            <LinearGradient
              colors={[theme.tx1, theme.tx2]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              style={styles.startButtonGradient}
            >
              <Text style={[styles.startButtonText, { color: theme.textColor1, fontFamily: "CustomFont" }]}>Start Test</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  ));

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      alignItems: "center",
      paddingBottom: 20,
      width: Dimensions.get('window').width
    },
    headerContainer: {
      flexDirection: 'row',
      width: Dimensions.get('window').width,
      paddingLeft: 15,
      paddingRight: 15,
      marginTop: 10,
      justifyContent: 'space-between'
    },
    title: {
      fontSize: 40,
      fontWeight: "bold",
      color: "#7B1FA2",
      textAlign: "center",
    },
    feature: {
      fontSize: 16,
      marginTop: 5,
      color: "#333",
      fontWeight: 'bold',
      fontFamily: "CustomFont"
    },
    mockTestWrapper: {
      width: Dimensions.get('window').width * 0.9,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 30,
      marginBottom:10
    },
    mockTestWrappers: {
      width: 200,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      position: 'static',
      borderWidth: 1,
      borderRadius: 15,
      marginBottom: 20
    },

    mockTestBorder: {
      position: "absolute",
      borderRadius: 30,
      borderWidth: 2,
      zIndex: -1,
    },

    mockTestContainer: {
      borderRadius: 30,
      width: "100%",
      padding: 8,
    },

    gradientContainer: {
      flex: 1,
      borderRadius: 30,
      padding: 8,
      width: "100%",
    },
    mockTitle: {
      fontSize: 40,
      fontWeight: "bold",
      color: "#303F9F",
      marginTop: 10
    },
    mockSubtitle: {
      fontSize: 20,
      color: "#464646",
      fontWeight: 'bold',
      paddingStart: 10,
      fontFamily: "nun_sans"
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "500",
      marginTop: 10,
      paddingStart: 10,
    },
    tagsContainer: {
      flexDirection: "row",
      marginTop: 8,
      width: '100%',
      paddingStart: 8,
      alignItems: 'center',
      marginLeft: -6
    },
    tag: {
      marginTop: 12,
      marginLeft: 4
    },
    startButton: {
      backgroundColor: "#512DA8",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      marginTop: 15,
      width: Dimensions.get('window').width * .75,
      marginBottom: 20
    },
    startButtonText: {
      color: "#FFF",
      fontWeight: "bold",
      fontSize: 18,
      alignSelf: 'center',
    },
    footerText: {
      fontSize: 16,
      textAlign: "center",
      color: "#464646",
      padding: 20,
      marginBottom: 10
    },
    startButtonGradient: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
      width: Dimensions.get('window').width * 0.8,
      marginBottom: 20,
      marginTop: 15
    },
    startButtonGradients: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",

    },
    startButtonTexts: {
      color: "#FFF",
      fontWeight: "bold",
      fontSize: 14,
      alignSelf: 'center',
    },
    dropdownContainer: {
      width: Dimensions.get('window').width / 1.2,
      marginBottom: 10,
      marginTop: 10,
      overflow: 'hidden',
      zIndex: 1000,
    },
    dropdownStyle: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 0,
      borderRadius: 30,
      overflow: 'hidden',
       backgroundColor: 'transparent',
      color:theme.textColor
    },
    dropdownLinearGradient: {
      borderRadius: 15,
    },
    itemContainer: {
      width: Dimensions.get('window').width,
      alignItems: 'center',
      paddingBottom: 10
    },
      pickerIcon: {
        position: 'absolute',
        top: 10,
        right: 15,
        borderTopWidth: 10,
        borderTopColor: theme.textColor,
        borderLeftWidth: 5,
        borderLeftColor: 'transparent',
        borderRightWidth: 5,
        borderRightColor: 'transparent',
        width: 0,
        height: 0,
        backgroundColor: 'transparent', 
      },
     
      title: {
        fontSize: 18,
        marginBottom: 10,
      },
      dropdownButton: {
        padding: 10,
        borderColor: '#ccc',
        borderRadius: 5,
        width:200,
        flexDirection:'row',
        justifyContent:'space-between'
      },
      dropdownButtonText: {
        fontSize: 16,
      },
      dropdown: {
        position: 'absolute',
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        zIndex: 2,
      },
      option: {
        padding: 10,
        width:200,
      },
  }) );

  
  return (
    <LinearGradient
      colors={theme.bmc}
      style={styles.container}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
    >
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        data={[{},]}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Image
              style={{ height: 45, width: 180, justifyContent: 'flex-start', tintColor: theme.textColor, resizeMode: 'contain', marginRight: 20, }}
              source={require("../images/title.png")}
            />
            <View style={{ flexDirection: 'row', alignItems: "flex-end", justifyContent: 'flex-end' }}>
              <TouchableOpacity style={{ alignItems: 'center', marginRight: 10 }} activeOpacity={0.8} onPress={() => {
                navigation.navigate("Login")
              }}>
                <LinearGradient
                  colors={[theme.tx1, theme.tx2]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.startButtonGradients}
                >
                  <Text style={[styles.startButtonTexts, { color: theme.textColor1, fontFamily: "CustomFont" }]}>Login</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: 'center' }} activeOpacity={0.8} onPress={() => {
                navigation.navigate("Signup")
              }}>
                <LinearGradient
                  colors={[theme.tx1, theme.tx2]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.startButtonGradients}
                >
                  <Text style={[styles.startButtonTexts, { color: theme.textColor1, fontFamily: "CustomFont" }]}>Register</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 20,
    width: Dimensions.get('window').width
  },
  headerContainer: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 10,
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#7B1FA2",
    textAlign: "center",
  },
  feature: {
    fontSize: 16,
    marginTop: 5,
    color: "#333",
    fontWeight: 'bold',
    fontFamily: "CustomFont"
  },
  mockTestWrapper: {
    width: Dimensions.get('window').width * 0.9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 30,
    marginBottom:10
  },
  mockTestWrappers: {
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    position: 'static',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 20
  },

  mockTestBorder: {
    position: "absolute",
    borderRadius: 30,
    borderWidth: 2,
    zIndex: -1,
  },

  mockTestContainer: {
    borderRadius: 30,
    width: "100%",
    padding: 8,
  },

  gradientContainer: {
    flex: 1,
    borderRadius: 30,
    padding: 8,
    width: "100%",
  },
  mockTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#303F9F",
    marginTop: 10
  },
  mockSubtitle: {
    fontSize: 20,
    color: "#464646",
    fontWeight: 'bold',
    paddingStart: 10,
    fontFamily: "nun_sans"
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    paddingStart: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    marginTop: 8,
    width: '100%',
    paddingStart: 8,
    alignItems: 'center',
    marginLeft: -6
  },
  tag: {
    marginTop: 12,
    marginLeft: 4
  },
  startButton: {
    backgroundColor: "#512DA8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
    width: Dimensions.get('window').width * .75,
    marginBottom: 20
  },
  startButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
    alignSelf: 'center',
  },
  footerText: {
    fontSize: 16,
    textAlign: "center",
    color: "#464646",
    padding: 20,
    marginBottom: 10
  },
  startButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get('window').width * 0.8,
    marginBottom: 20,
    marginTop: 15
  },
  startButtonGradients: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",

  },
  startButtonTexts: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
    alignSelf: 'center',
  },
  dropdownContainer: {
    width: Dimensions.get('window').width / 1.2,
    marginBottom: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  dropdownStyle: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 0,
    borderRadius: 30,
    overflow: 'hidden',
  },
  dropdownLinearGradient: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  itemContainer: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    paddingBottom: 10
  },
     pickerIcon: {
    position: 'absolute',
    top: 10,
    right: 15,
    borderTopWidth: 8,
    borderLeftWidth: 6,
    borderLeftColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    width: 0,
    height: 0,
  },
});
