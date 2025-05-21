import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OptionCard = ({ value, option, optionText, onChangeValue }) => {
    const isChecked = value === true;

    return (
        <TouchableOpacity style={styles.card} onPress={onChangeValue}>
            <View style={styles.row}>
                <View style={[styles.checkbox, isChecked && styles.checked]}>
                    {isChecked && <Icon name="check" size={18} color="white" />}
                </View>
                <Text style={styles.optionLabel}>{option}. </Text>
                <Text style={styles.optionText}>{optionText}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default OptionCard;

const styles = StyleSheet.create({
    card: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#fff',
        marginVertical: 6,
        elevation: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checked: {
        backgroundColor: 'green',
        borderColor: 'green',
    },
    optionLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 6,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
});
