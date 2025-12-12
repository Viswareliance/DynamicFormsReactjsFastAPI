// src/pages/LayoutPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { addAnswer, removeAnswer } from "../ReduxStore/reduxSlice.js";

import HeaderComp from "../components/HeaderComp";
import TitleComp from "../components/TitleComp";
import QuestionSectionComp from "../components/QuestionSectionComp";
import CopilotSectionComp from "../components/CopilotSectionComp";
import ConsolidationSectionComp from "../components/ConsolidationSectionComp";
import FooterComp from "../components/FooterComp";

//  Load backend URL from .env
const API = import.meta.env.VITE_API_URL;

const LayoutPage = () => {
  const [currentQturn, setCurrentQturn] = useState(null);
  const [questionData, setQuestionData] = useState(null);

  const [allQuestions, setAllQuestions] = useState({});
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("Company");
  const [loading, setLoading] = useState(false);
  const [noMoreQuestions, setNoMoreQuestions] = useState(false);
  const [toolBar, setToolBar] = useState({});

  // answers is an object keyed by category
  const answers = useSelector((state) => state.answers.answers, shallowEqual);
  const dispatch = useDispatch();

  // Fetch full json once
  const fetchAllQuestions = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/questions`);
      setAllQuestions(res.data.data.QuestionSection || {});
      setToolBar(res.data.data.ToolBarSection || {});
    } catch (err) {
      console.error("Error fetching all questions:", err);
    }
  }, []);

  useEffect(() => {
    fetchAllQuestions();
  }, [fetchAllQuestions]);

  // When selectedCategory or allQuestions changes, update filteredQuestions and currentQturn (only if different)
  useEffect(() => {
    const categoryQuestions = allQuestions[selectedCategory] || [];
    setFilteredQuestions(categoryQuestions);

    const firstQturn =
      categoryQuestions.length > 0 ? categoryQuestions[0].QturnId : null;
    // only update if it's different
    setCurrentQturn((prev) => {
      if (prev === firstQturn) return prev;
      return firstQturn;
    });
  }, [selectedCategory, allQuestions]);

  // Fetch single question from backend
  const fetchQuestion = useCallback(
    async (qt) => {
      if (!qt) {
        setQuestionData(null);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `${API}/questions/category/${selectedCategory}/${qt}`
        );
        setQuestionData(res.data.data);
        setNoMoreQuestions(false);
      } catch (err) {
        console.error("Error fetching question:", err);
        setQuestionData(null);
        setNoMoreQuestions(true);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory]
  );

  useEffect(() => {
    fetchQuestion(currentQturn);
  }, [currentQturn, fetchQuestion]);

  const handleNext = () => {
    const idx = filteredQuestions.findIndex((q) => q.QturnId === currentQturn);
    if (idx !== -1 && idx < filteredQuestions.length - 1) {
      setCurrentQturn(filteredQuestions[idx + 1].QturnId);
    } else {
      setNoMoreQuestions(true);
    }
  };

  const handlePrevious = () => {
    const idx = filteredQuestions.findIndex((q) => q.QturnId === currentQturn);
    if (idx > 0) {
      setCurrentQturn(filteredQuestions[idx - 1].QturnId);
    }
  };

  // Pass an onAnswerSubmit prop so child doesn't directly dispatch (keeps single source of truth)
  const handleAnswerSubmit = (qturnId, Question_description, answer) => {
    dispatch(
      addAnswer({
        category: selectedCategory,
        qturnId,
        Question_description,
        answer,
      })
    );
  };
  const handleRemoveAnswer = (qturnId) => {
    dispatch(
      removeAnswer({
        category: selectedCategory,
        qturnId,
      })
    );
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50 overflow-hidden">
      <HeaderComp
        toolBar={toolBar}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      <TitleComp selectedCategory={selectedCategory} />

      <div className="flex flex-1 gap-4 p-4 overflow-hidden w-full">
        <div className="h-full" style={{ width: "30%" }}>
          <QuestionSectionComp
            selectedCategory={selectedCategory}
            questionData={questionData}
            loading={loading}
            noMoreQuestions={noMoreQuestions}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            onAnswerSubmit={handleAnswerSubmit}
            onRemoveAnswer={handleRemoveAnswer}
          />
        </div>

        <div className="h-full overflow-hidden" style={{ width: "40%" }}>
          <CopilotSectionComp questionData={questionData} />
        </div>

        <div className="h-full overflow-hidden" style={{ width: "30%" }}>
          <ConsolidationSectionComp
            allQuestions={allQuestions[selectedCategory] || []}
            answers={answers[selectedCategory] || []}
            selectedCategory={selectedCategory}
            onSelectQuestion={(qt) => setCurrentQturn(qt)}
          />
        </div>
      </div>

      <FooterComp />
    </div>
  );
};

export default LayoutPage;
