import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import RenderHTML from "react-native-render-html";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Defs, Stop, Text as SvgText, LinearGradient as SvgLinearGradient } from "react-native-svg";

const windowWidth = Dimensions.get("window").width;

const sanitizeHtml = (text) => {
  if (!text) return { html: "<p>No Question provided.</p>" };

  text = text.replace(/&nbsp;/g, " "); 
  text = text.replace(/\n/g, " "); 
  text = text.replace(/<p>/g, "").replace(/<\/p>/g, ""); 
  text = text.replace(/<img /g, "<img style='display:inline-block; vertical-align:middle; margin: 0 5px;' "); 

  return {
    html: `<div style='display: flex; flex-direction: row; flex-wrap: wrap; width: ${windowWidth}px; align-items: center;'>${text}</div>`,
  };
};

const OptionSection = ({
  theme,
  selectedNumber,
  exams,
  timeElapsed,
  formatedTime,
  selectedAnswers,
  setSelectedOption,
  handleAnswerSelect,
  removeHtmlTags,
  extractImages,
  handleTextInputChange,
  textInputValues,
  ClearResponseData,
}) => {
  return (
    <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
      <LinearGradient
        colors={theme.mcb1}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={{ flexDirection: "row", marginTop: 8 }}>
          <Svg height="35" width={windowWidth * 0.35}>
            <Defs>
              <SvgLinearGradient id="grad" x1="0" y1="1" x2="1" y2="1">
                <Stop offset="0" stopColor={theme.bg1} stopOpacity="1" />
                <Stop offset="1" stopColor={theme.bg2} stopOpacity="1" />
              </SvgLinearGradient>
            </Defs>
            <SvgText
              fill="url(#grad)"
              fontSize="16"
              fontWeight="bold"
              x="55"
              y="15"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {selectedNumber && `Question # ${selectedNumber}`}
            </SvgText>
          </Svg>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>
              Time spent:
            </Text>
            <Text style={[styles.mockSubtitle, { color: theme.textColor }]}>
              {formatedTime(timeElapsed)}
            </Text>
          </View>
        </View>

        <View>
          <RenderHTML
            source={sanitizeHtml(exams[selectedNumber - 1]?.question || "<p>No Question provided.</p>")}
            contentWidth={windowWidth}
          />
        </View>

        {exams[selectedNumber - 1]?.qtype !== 8 ? (
          <View>
            {["A", "B", "C", "D"].map((option, index) => {
              const optionText =
                index === 0
                  ? exams[selectedNumber - 1]?.option1
                  : index === 1
                  ? exams[selectedNumber - 1]?.option2
                  : index === 2
                  ? exams[selectedNumber - 1]?.option3
                  : exams[selectedNumber - 1]?.option4;

              const cleanedOptionText = removeHtmlTags(optionText);
              const imagesInOption = extractImages(optionText);
              const isImageUrl = imagesInOption.length > 0;

              const isSelected = selectedAnswers[selectedNumber] === option;

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.opt,
                    {
                      borderColor: theme.textColor,
                      borderRadius: 25,
                      backgroundColor: "transparent",
                    },
                  ]}
                  onPress={() => {
                    setSelectedOption(option);
                    handleAnswerSelect(selectedNumber, option);
                  }}
                >
                  <View style={[styles.optbg, { backgroundColor: theme.gray }]}>
                    <Text style={[styles.option, { color: "#FFF" }]}>
                      {option}
                    </Text>
                  </View>

                  <View>
                    {isImageUrl ? (
                      <View style={{ backgroundColor: "#FFF" }}>
                        <Image
                          source={{ uri: imagesInOption[0] }}
                          style={{
                            width: 80,
                            height: 40,
                            borderRadius: 25,
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                    ) : (
                      <Text
                        style={[
                          styles.option,
                          {
                            color: theme.textColor,
                            width: 226,
                            height: 60,
                            overflow: "scroll",
                          },
                        ]}
                      >
                        <RenderHTML
                          source={sanitizeHtml(optionText || "<p>No question provided.</p>")}
                          contentWidth={windowWidth}
                        />
                      </Text>
                    )}
                  </View>

                  <View
                    style={[
                      styles.select,
                      {
                        borderColor: theme.textColor,
                        backgroundColor: isSelected ? theme.textColor : "transparent",
                      },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View>
            <TextInput
              style={[
                styles.textInputStyle,
                {
                  backgroundColor: theme.textColor1,
                  borderColor: theme.textColor1,
                  color: theme.textColor,
                },
              ]}
              value={textInputValues[selectedNumber] || ""}
              onChangeText={(text) => handleTextInputChange(text, selectedNumber)}
              placeholder={`Enter Text`}
              keyboardType="numeric"
              placeholderTextColor={theme.textColor}
              multiline={true}
            />
          </View>
        )}

        <View
          style={{
            marginTop: 10,
            width: windowWidth * 0.8,
            paddingStart: 10,
          }}
        >
          <TouchableOpacity style={{ marginLeft: 15, marginTop: 5 }} onPress={ClearResponseData}>
            <Text
              style={[
                styles.ans,
                {
                  color: "red",
                  fontWeight: "700",
                  textDecorationLine: "underline",
                },
              ]}
            >
              Clear Response
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

export default OptionSection;
