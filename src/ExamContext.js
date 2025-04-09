import React, { createContext, useState, useContext } from "react";

// Create Context
const ExamContext = createContext();

// Custom Hook for using Context
export const useExam = () => useContext(ExamContext);

// Provider Component
export const ExamProvider = ({ children }) => {
  const [selectedExam, setSelectedExam] = useState(null);

  return (
    <ExamContext.Provider value={{ selectedExam, setSelectedExam }}>
      {children}
    </ExamContext.Provider>
  );
};
