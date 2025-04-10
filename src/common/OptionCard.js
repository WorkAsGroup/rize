import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import decodeUriComponent from 'decode-uri-component';
import COLORS from './Colors';

import HtmlComponent from './HtmlComponent';
import AppStyles from './AppStyles';
import { theme } from '../core/theme';

const width = Dimensions.get('window').width;

const Card = props => {
    const { children,style } = props;
    return (
      <View style={[AppStyles.card,styles.cardContainer,style]}>
          {children}
     </View>
  
    );
  }

const OptionCard = ({ option, optionText, value, disabled = false, double = false, showcheckOption = true, onChangeValue,isSelected }) => {
    const textPadding = decodeUriComponent(optionText).length < 20 ? 6 : 0;

    const borderColor = value === null ? COLORS.ULTRA_LIGHT_GRAY : value ? COLORS.OVERLAY_COLOR : COLORS.LIGHT_RED;
    const optionColor = value === null ? COLORS.ULTRA_LIGHT_GRAY : value ? COLORS.DIM_OVERLAY : COLORS.LIGHT_RED;
    // const icon = value === null ? require('../../images/circle.png') : value ? require('../../images/check-circle.png') : require('../../images/times-circle.png');
    const tintColor = value === null ? COLORS.LIGHT_TEXT_COLOR : value ? COLORS.OVERLAY_COLOR : COLORS.RED;
// console.log(isSelected, "eiourgfoierwufoyiweb")
    return (
        <Card style={{ ...styles.container, borderColor }}>
            <TouchableOpacity disabled={disabled} onPress={onChangeValue} activeOpacity={0.3}>
                <View style={{ ...AppStyles.rowBetween, width: '100%', alignItems: 'flex-start', alignContent: 'center' }}>
                    <View style={{ ...AppStyles.rowStart, alignItems: 'center' }}>
                        <View style={[AppStyles.rowCenter, styles.option, { backgroundColor: optionColor }]}>
                            <Text style={AppStyles.evenMBold}>{option}</Text>
                        </View>

                        <HtmlComponent 
                            style={{ ...AppStyles.evenMRegular, color: COLORS.LIGHT_TEXT_COLOR, width: width - 140, lineHeight: 17 }}
                            containerStyle={{ paddingTop: textPadding }}
                            baseFontStyle={18}
                            text={optionText}
                            tintColor={COLORS.LIGHT_TEXT_COLOR}
                        />
                         <View
                                                          style={[
                                                            styles.select,
                                                            {
                                                              borderColor: theme.textColor,
                                                              backgroundColor: isSelected
                                                                ? "#000"
                                                                : "transparent",
                                                            },
                                                          ]}
                                                        />
                    </View>

   
                </View>
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'column',
    },
    icon: {
        width: 18,
        height: 18,
        marginTop: 5,
    },
    option: {
        width: 30,
        height: 30,
        borderRadius: 5,
        marginRight: 10,
        marginLeft: -10
    },
    cardContainer: {
        padding:20,
        marginBottom:20,
    },
    select: {
        height: 16,
        width: 16,
        borderWidth: 1,
        borderRadius: 8,
        // position: "absolute",
        right: 0,
      },
});

export default OptionCard;