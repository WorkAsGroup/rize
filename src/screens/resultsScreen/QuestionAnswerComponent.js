import React, { useEffect, useState } from "react";

import { View, Text, ScrollView, TouchableOpacity, FlatList, StyleSheet, Modal, Picker, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';

const QuestionAndAnswerComponent = ({ questionAndAnwerData }) => {
    const [state, setState] = useState({
        totalQuestions: 0,
        correctAnswers: 0,
        inCorrectAnswers: 0,
        skipped: 0,
        filteredQuestions: [],
        selectedSubjects: [],
        selectedDifficulty: [],
        isAccordianExpand: false,
        isAllSelect: true,
        isLoading: false,
    });

    const examSubjects = questionAndAnwerData ? questionAndAnwerData[0]?.examSubjects : [];
    const difficultyLevels = questionAndAnwerData ? questionAndAnwerData[0]?.difficulty : [];
    const questionsAndAnswers = questionAndAnwerData ? questionAndAnwerData[0]?.questions : [];

    const [loading, setLoading] = useState(false);
    const { width } = useWindowDimensions();

    useEffect(() => {
        if (questionAndAnwerData && questionAndAnwerData.length > 0) {
            setState((prev) => ({
                ...prev,
                totalQuestions: questionsAndAnswers.length,
                correctAnswers: questionsAndAnswers?.filter((item) => item.status === 2).length,
                inCorrectAnswers: questionsAndAnswers?.filter((item) => item.status === 1).length,
                skipped: questionsAndAnswers?.filter((item) => item.status === 0).length,
                selectedSubjects: examSubjects,
                isAllSelect: true,
                selectedDifficulty: difficultyLevels
            }));
        }
    }, [questionAndAnwerData]);

    useEffect(() => {
        if (state.selectedSubjects.length > 0 || state.selectedDifficulty.length > 0) {
            const filteredQuestions = questionsAndAnswers.filter((question) => {
                const isSubjectSelected = state.selectedSubjects?.some(
                    (subject) => subject.subject_id === question.subject
                );
                const isDifficultySelected = state.selectedDifficulty?.some((difficulty) => {
                    if (difficulty.id === 3) {
                        return [3, 5].includes(question.difficulty);
                    }
                    return difficulty.id === question.difficulty;
                });
                return isSubjectSelected && isDifficultySelected;
            });

            setState((prev) => ({
                ...prev,
                totalQuestions: filteredQuestions.length,
                correctAnswers: filteredQuestions.filter((item) => item.status === 2).length,
                inCorrectAnswers: filteredQuestions.filter((item) => item.status === 1).length,
                skipped: filteredQuestions.filter((item) => item.status === 0).length,
                filteredQuestions: filteredQuestions
            }));
        }
    }, [state.selectedSubjects, state.selectedDifficulty]);

    const handleMultiChange = (value, name) => {
        if (name === "subject") {
            if (value.includes("all")) {
                const allSelected = state.selectedSubjects.length === examSubjects.length;
                setState((prev) => ({
                    ...prev,
                    selectedSubjects: allSelected ? [] : [...examSubjects]
                }));
            } else {
                const selected = examSubjects.filter(subject => value.includes(subject.subject_id));
                setState((prev) => ({
                    ...prev,
                    selectedSubjects: selected
                }));
            }
        } else if (name === "levels") {
            if (value.includes("all")) {
                const allSelected = state.selectedDifficulty.length === difficultyLevels.length;
                setState((prev) => ({
                    ...prev,
                    selectedDifficulty: allSelected ? [] : [...difficultyLevels]
                }));
            } else {
                const selected = difficultyLevels.filter(level => value.includes(level.id));
                setState((prev) => ({
                    ...prev,
                    selectedDifficulty: selected
                }));
            }
        }
    };

    const handleChange = (panel) => {
        setState((prev) => ({
            ...prev,
            isAccordianExpand: prev.isAccordianExpand === panel ? false : panel
        }));
    };

    const renderQuestionItem = ({ item, index }) => (
        <View key={item.slno} style={styles.accordion}>
            <TouchableOpacity onPress={() => handleChange(index)}>
                <View style={styles.accordionHeader}>
                    <View style={styles.headerContent}>
                        {item.status === 0 ? (
                            <Icon name="not-started" size={19} color="#FFC107" />
                        ) : item.status === 1 ? (
                            <Icon name="cancel" size={19} color="#E50004" />
                        ) : item.status === 2 ? (
                            <Icon name="check-circle" size={19} color="#1ABE17" />
                        ) : null}
                        <Text style={styles.questionNumber}>Question No: {item.slno}</Text>
                    </View>
                    {state.isAccordianExpand === index ? (
                        <Icon name="expand-less" size={24} />
                    ) : (
                        <Icon name="expand-more" size={24} />
                    )}
                </View>
            </TouchableOpacity>
            {state.isAccordianExpand === index && (
                <View style={styles.accordionContent}>
                    <HTML source={{ html: item.question }} contentWidth={width} />
                    {/* Add more content rendering here */}
                </View>
            )}
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <Loading />
            ) : (
                <>
                    {questionAndAnwerData && questionAndAnwerData.length > 0 ? (
                        <>
                            <View style={styles.filterContainer}>
                                <Picker
                                    selectedValue={state.selectedSubjects.map(subject => subject.subject_id)}
                                    onValueChange={(itemValue) => handleMultiChange(itemValue, "subject")}
                                    mode="dropdown"
                                    style={styles.picker}
                                >
                                    <Picker.Item label="All Subjects" value="all" />
                                    {examSubjects.map((subject) => (
                                        <Picker.Item key={subject.subject_id} label={subject.subject_name} value={subject.subject_id} />
                                    ))}
                                </Picker>
                                <Picker
                                    selectedValue={state.selectedDifficulty.map(difficulty => difficulty.id)}
                                    onValueChange={(itemValue) => handleMultiChange(itemValue, "levels")}
                                    mode="dropdown"
                                    style={styles.picker}
                                >
                                    <Picker.Item label="All Levels" value="all" />
                                    {difficultyLevels.map((difficulty) => (
                                        <Picker.Item key={difficulty.id} label={difficulty.type} value={difficulty.id} />
                                    ))}
                                </Picker>
                            </View>
                            <View style={styles.analysisContainer}>
                                <Text style={styles.analysisTitle}>Analysis breakdown of answers</Text>
                                <View style={styles.analysisRow}>
                                    <View style={styles.analysisItem}>
                                        <Text style={styles.analysisValue}>{state.totalQuestions}</Text>
                                        <Text style={styles.analysisLabel}>Total Questions</Text>
                                    </View>
                                    <View style={styles.analysisItem}>
                                        <Text style={[styles.analysisValue, { color: "#28A745" }]}>{state.correctAnswers}</Text>
                                        <Text style={styles.analysisLabel}>Correct answers</Text>
                                    </View>
                                    <View style={styles.analysisItem}>
                                        <Text style={[styles.analysisValue, { color: "#E50004" }]}>{state.inCorrectAnswers}</Text>
                                        <Text style={styles.analysisLabel}>Incorrect answers</Text>
                                    </View>
                                    <View style={styles.analysisItem}>
                                        <Text style={[styles.analysisValue, { color: "#FFC107" }]}>{state.skipped}</Text>
                                        <Text style={styles.analysisLabel}>Skipped</Text>
                                    </View>
                                </View>
                            </View>
                            <FlatList
                                data={state.filteredQuestions}
                                renderItem={renderQuestionItem}
                                keyExtractor={(item) => item.slno.toString()}
                            />
                        </>
                    ) : (
                        <Text style={styles.noDataText}>No data found</Text>
                    )}
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    picker: {
        width: '48%',
        height: 40,
        borderRadius: 9,
    },
    analysisContainer: {
        marginBottom: 16,
    },
    analysisTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 8,
    },
    analysisRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    analysisItem: {
        alignItems: 'center',
    },
    analysisValue: {
        fontSize: 23,
        fontWeight: '400',
    },
    analysisLabel: {
        fontSize: 12,
        fontWeight: '400',
    },
    accordion: {
        marginBottom: 16,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    questionNumber: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
    },
    accordionContent: {
        padding: 16,
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 16,
    },
});

export default QuestionAndAnswerComponent;