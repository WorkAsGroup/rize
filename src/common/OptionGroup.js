import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AppStyles from './AppStyles';
import OptionCard from './OptionCard';
import { theme } from '../core/theme';

const OptionGroup = ({ value: propValue, onChangeValue, multiple = false, option1, option2, option3, option4, selectedAnswers,
    selectedNumber }) => {
    const [value, setValue] = useState(propValue);

    useEffect(() => {
        setValue(propValue);
    }, [propValue]);

    const onChange = (optionValue) => {
        if (!multiple) {
            optionValue === value ? onChangeValue(null) : onChangeValue(optionValue);
        } else {
            if (value != null) {
                const arr = value.split(',');
                if (arr.includes(optionValue)) {
                    const updatedArr = arr.filter(item => item !== optionValue);
                    updatedArr.length > 0 ? onChangeValue(updatedArr.toString()) : onChangeValue(null);
                } else {
                    onChangeValue([...arr, optionValue].toString());
                }
            } else {
                onChangeValue(optionValue);
            }
        }
    };
console.log(selectedAnswers[selectedNumber] == 'C',"FinalCheck")
    return (
        <View style={AppStyles.column}>
            <OptionCard 
                value={value?.includes('A') ? true : null}
                option="A"
                optionText={option1}
                onChangeValue={() => onChange('A')}
                isSelected={selectedAnswers[selectedNumber] == 'A'? true : false}
            />

            <OptionCard 
                value={value?.includes('B') ? true : null}
                option="B"
                optionText={option2}
                onChangeValue={() => onChange('B')}
                isSelected={selectedAnswers[selectedNumber] == 'B'? true : false}
            />

            <OptionCard 
                value={value?.includes('C') ? true : null}
                option="C"
                optionText={option3}
                onChangeValue={() => onChange('C')}
                isSelected={selectedAnswers[selectedNumber] == 'C'? true : false}
            />

            <OptionCard 
                value={value?.includes('D') ? true : null}
                option="D"
                optionText={option4}
                onChangeValue={() => onChange('D')}
                isSelected={selectedAnswers[selectedNumber] == 'D' ? true : false}
            />
                     
        </View>
    );
};

export default OptionGroup;

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
        marginRight: 20,
    },
    cardContainer: {
        padding:20,
        marginBottom:20,
    },
 
});