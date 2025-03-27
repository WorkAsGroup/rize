import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';

const OTPTextInput = ({ length, onOTPEntered, theme ,ref}) => {
    const [otpValues, setOtpValues] = useState(Array(length).fill(''));
    const inputRefs = useRef([]);
    const textInputRef = useRef(null);
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleOTPChange = (index, value) => {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);

        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        } else if (!value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (newOtpValues.every(val => val !== '')) {
            Keyboard.dismiss();
            onOTPEntered(newOtpValues.join(''));
        }
    };

    const clear = () => {       
        setOtpValues(Array(length).fill('')); 
        if(inputRefs.current[0]){
            inputRefs.current[0].focus();
        }
    }
    useImperativeHandle(ref, () => ({
        clear
    }));

    const containerStyle = {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    };

    return (
        <View style={containerStyle} ref={textInputRef}>
            {Array.from({ length }, (_, index) => (
                <TextInput
                    key={index}
                    style={[
                        styles.input,
                        {
                            color: "#000",
                            backgroundColor: theme.white,
                            borderColor: theme.wb,
                        },
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={otpValues[index]}
                    onChangeText={(text) => handleOTPChange(index, text)}
                    ref={(input) => (inputRefs.current[index] = input)}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === 'Backspace' && !otpValues[index]) {
                            if (index > 0) {
                                inputRefs.current[index - 1]?.focus();
                            }
                        }
                    }}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        marginHorizontal: 5,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default OTPTextInput;