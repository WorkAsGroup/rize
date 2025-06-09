import axios from "axios";
import {
  setLoading,
  setError,
  setSuccess,
  setExamQuestions,
  setActiveSubjectId,
  setExamPatternSections,
  setQuestionDetails,
  setQuestionLoading,
  setUniqueeId,
  setExamSessionId,
  setFinishTest,
  setAutoSaveId,
  setActiveQuestionIndex,
  setExamDuration,
  setReloadQuestion,
  setAutoSaveTime,
  setFinishedData,
} from "../slices/examSlice";
import {
  getPreExam,
  getPatternSelection,
  getPreExamdata,
  getPreviousPapRes,
  getSubmitExamResults,
  getAutoSaveData,
  getAutoSaveTime,
  addAutoSaveData,
  reloadQuestion,
  addAnalytics,
} from "../../core/CommonService";
import { getUniqueId } from "react-native-device-info";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export const questionsThunk = (paramsData) => async (dispatch) => {
  console.log(paramsData, "dataaaa");
  dispatch(setLoading(true));
  try {
    const navigate = paramsData.navigate;
    const autoSaveId = paramsData.autoSaveId;
    console.log("questionsCalled", autoSaveId);
    const params = {
      exam_paper_id: paramsData.exam_paper_id,
      exam_session_id: paramsData.exam_session_id,
      type: paramsData.type,
    };

    const response = await getPreExam(params);
    const data = response.data;
    console.log(response, "responseData", params);
    if (response.statusCode === 200) {
      if (data.length > 0) {
        let questionDetails = [];
        data.map((item, index) => {
          questionDetails.push({
            question_id: item.id,
            status: "0",
            question_time: 0,
            attempt_answer: "",
            reason_for_wrong: 0,
            comments: "",
            slno: index + 1,
            subject_id: item.subject,
            review: false,
            is_disabled: false,
            answer: item.answer,
          });
        });
        console.log("qhbuqrhfbqwrhbqwrhbqhpwr", autoSaveId);
        dispatch(setExamQuestions(data));
        if (autoSaveId !== 0 && autoSaveId !== undefined) {
          const params = {
            autoSaveId: autoSaveId,
          };
          console.log("calyasdas", params);
          await dispatch(fetchAutoSaveDataThunk(params));
          dispatch(setLoading(false));
        } else {
          console.log("erripwoef", params);
          dispatch(setQuestionDetails(questionDetails));
          dispatch(setActiveQuestionIndex(0));
          dispatch(setActiveSubjectId(data[0]?.subject));
          dispatch(setLoading(false));
        }

        dispatch(setSuccess(data.message));
        // navigate(APP_ROUTES.EXAM_QUESTIONS);
        dispatch(setLoading(false));
      }
    } else {
      dispatch(setError("Failed to fetch data"));
    }
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(setError(error.response?.data?.message || error.message));
  }
};

export const patternSectionsThunk =
  (params, type) => async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));

      dispatch(setQuestionLoading(true));

      const { examQuestions } = getState().questions;

      const uniqueSubjectsFromExamQuestions = examQuestions.reduce(
        (unique, item) => {
          if (
            item.subject !== null &&
            item.subject !== undefined &&
            !unique.includes(item.subject)
          ) {
            unique.push(item.subject);
          }
          return unique;
        },
        []
      );

      const response = await getPatternSelection(params);
      const data = response.data.data;
      console.log(data, "filteredSubjects", type);
      if (response.data.statusCode === 200) {
        if (data.length > 0) {
          if (type === "custom") {
            const uniqueSubjects = data.filter((item) =>
              uniqueSubjectsFromExamQuestions.includes(Number(item.subject_id))
            );

            let currentStartNo = 1;
            const filteredSubjects = uniqueSubjects.map((subject) => {
              const questionCount = subject.ending_no - subject.starting_no + 1;
              const updatedSubject = {
                ...subject,
                starting_no: currentStartNo,
                ending_no: currentStartNo + questionCount - 1,
              };
              currentStartNo = updatedSubject.ending_no + 1;
              return updatedSubject;
            });
            dispatch(setLoading(false));
            console.log(filteredSubjects, "filteredSubjects");
            dispatch(setExamPatternSections(filteredSubjects));
          } else {
            dispatch(setExamPatternSections(data));
            dispatch(setLoading(false));
          }
        }
      } else {
        dispatch(setLoading(false));
        dispatch(setError("Failed to fetch data"));
      }
    } catch (error) {
      dispatch(setLoading(false));
      dispatch(setError(error.response?.data?.message || error.message));
    } finally {
      dispatch(setLoading(false));
      dispatch(setQuestionLoading(false));
    }
  };

// STARTEXAM
export const startExamThunk = (params) => async (dispatch, getState) => {
  // console.log(params, "paramad")
  const { examSessionId } = params.exam_session_id;
  const navigate = params.navigate;
  console.log(params, "paranfkjenf");
  let startExamParams = "";

  if (params?.exam_type === "previous") {
    startExamParams = {
      student_user_exam_id: params.student_user_exam_id,
      exam_paper_id: params.exam_paper_id,
      exam_session_id: examSessionId,
    };
  } else {
    startExamParams = {
      student_user_exam_id: params.student_user_exam_id,
      exam_paper_id: params.exam_paper_id,
      exam_session_id: params.exam_session_id,
    };
  }
  try {
    dispatch(setQuestionLoading(true));
    const response = await getPreExamdata(startExamParams);

    const data = response.data;
    console.log(data, "aidoiedoweidnwe");
    if (data.statusCode === 200) {
      dispatch(setUniqueeId(data?.data?.uid));
      console.log("calledExams");
      await dispatch(
        questionsThunk({
          exam_paper_id: params.exam_paper_id,
          exam_session_id:
            params?.exam_type === "previous"
              ? examSessionId
              : params.exam_session_id,
          type: params?.type
            ? params.type === "previous"
              ? "previous_exam"
              : params.type === "custom"
              ? "custom_exam"
              : "schedule_exam"
            : "schedule_exam",

          autoSaveId: params.autoSaveId,
        })
      );
      console.log({ exam_pattern_id: params }, params.type);
      dispatch(
        patternSectionsThunk(
          { exam_pattern_id: params.exam_pattern_id },
          params.type
        )
      );
      dispatch(autoSaveTimeThunk());
    } else {
      dispatch(setError("Failed to start exam"));
    }
  } catch (error) {
    dispatch(setError(error.message || error.response?.data?.message));
  }
};

export const submitExamThunk = (params) => async (dispatch) => {
  dispatch(setLoading(true));
  const setBackSubmitBtn = params?.setBackSubmitBtn;
  const navigate = params.navigate;
  const isTimeUp = params?.isTimeUp;
  console.log(params, "paramee");
  try {
    const response = await getSubmitExamResults(params.params);
    const data = response.data;
    setAutoSaveId(0);
    console.log(data, "submitExamsss");
    if (data.statusCode === 200) {
      if (!isTimeUp) {
        setBackSubmitBtn(false);
      }

      dispatch(setFinishTest(true));

      const examObject = {
        exam_paper_id: params.params.exam_paper_id,
        previous_paper_id: params.previous_paper_id,
        exam_session_id: data.data.exam_session_id,
        type: params.params.type,
        isTimeUp: isTimeUp,
      };
      // navigate(APP_ROUTES.EXAM_RESULT, { state: examObject });
      dispatch(setFinishedData(examObject));
      if (data) {
        dispatch(setExamSessionId(data?.data?.exam_session_id));
      } else {
        dispatch(setError("Failed to fetch data"));
      }
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const addAutoSaveThunk = (params) => async (dispatch) => {
  try {
    const response = await addAutoSaveData(params);
    console.log(response, "hey Im called", params);
    const saveId = response.data[0]?.id;
    if (response.statusCode === 200) {
      dispatch(setAutoSaveId(saveId));
    } else {
      dispatch(setError("Failed to fetch data"));
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  }
};

export const fetchAutoSaveDataThunk =
  (params) => async (dispatch, getState) => {
    const examDuration = getState().questions.examDuration;
    try {
      const response = await getAutoSaveData(params);
      const data = response.data[0];
      console.log(data, params, data.examtimer, "iejfoiwejfoiwenfowei");
      const activeSubjectId = JSON.parse(data.questions_data).find(
        (q) => q.slno === data.qsno
      )?.subject_id;

      if (response.statusCode == 200) {
        if (!examDuration > 0) {
          dispatch(setExamDuration(Math.floor(parseInt(data.examtimer) / 60)));
        }

        dispatch(setQuestionDetails(JSON.parse(data.questions_data)));

        dispatch(setActiveQuestionIndex(data.qsno - 1));
        dispatch(setActiveSubjectId(activeSubjectId));
        dispatch(setSuccess(data.message));
      } else {
        dispatch(setError("Failed to fetch data"));
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message));
    }
  };

export const autoSaveTimeThunk = (params) => async (dispatch) => {
  try {
    const response = await getAutoSaveTime(params);
    console.log(response, "herfiwrfl cw");
    const data = response.data;
    if (data.length > 0) {
      dispatch(setAutoSaveTime(data));
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  }
};

export const reloadQuesationThunk = (params) => async (dispatch, getState) => {
  try {
    const { examQuestions, questionDetails } = getState().questions;

    dispatch(setReloadQuestion(true));

    const response = await reloadQuestion(params);
    const data = response.data.data;

    if (response.data.statusCode === 200) {
      if (data.length > 0) {
        let filteredQuestionDetails = [...questionDetails];
        let filteredExamQuestions = [...examQuestions];

        const isExistingQuestion = data.find(
          (item) => item.id === params.question_id
        );

        if (isExistingQuestion) {
          filteredExamQuestions = filteredExamQuestions.map((question) =>
            question.id === isExistingQuestion.id
              ? {
                  ...question,
                  ...isExistingQuestion,
                  selection_type: 2,
                }
              : question
          );

          if (
            !filteredExamQuestions.find((q) => q.id === isExistingQuestion.id)
          ) {
            filteredQuestionDetails.push({
              question_id: isExistingQuestion.id,
              status: "0",
              question_time: 0,
              attempt_answer: "",
              reason_for_wrong: 0,
              comments: "",
              slno: questionDetails.length + 1,
              subject_id: isExistingQuestion.subject,
              review: false,
              is_disabled: false,
            });

            filteredExamQuestions.push({
              id: isExistingQuestion.id,
              question: isExistingQuestion.question,
              option1: isExistingQuestion.option1,
              option2: isExistingQuestion.option2,
              option3: isExistingQuestion.option3,
              option4: isExistingQuestion.option4,
              qtype: isExistingQuestion.qtype,
              explanation: isExistingQuestion.explanation,
              answer: isExistingQuestion.answer,
              subject: isExistingQuestion.subject,
              chapter: isExistingQuestion.chapter,
              compquestion: isExistingQuestion.compquestion,
              list1type: isExistingQuestion.list1type,
              list2type: isExistingQuestion.list2type,
              mat_question: isExistingQuestion.mat_question,
              inputquestion: isExistingQuestion.inputquestion,
              complexity: isExistingQuestion.complexity,
              selection_type: 2,
            });
          }
        }

        dispatch(setExamQuestions(filteredExamQuestions));
        dispatch(setQuestionDetails(filteredQuestionDetails));
      }
    }
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  } finally {
    dispatch(setReloadQuestion(false));
  }
};

export const globalAnalyticsThunk = (params) => async (dispatch) => {
  const uniqueId = useSelector((state) => state.header.deviceId);
  try {
    // Usually synchronous
    // const uniqueId = await getUniqueId();

    const payload = {
      ...params,
      ip_address: uniqueId,
    };
    console.log(payload, "payloadwefwefewfew");
    const response = await addAnalytics(payload);
    console.log("Analytics Response:", response);
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(setError(errorMessage));
  }
};
