import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import ThinJaroLogo from './ThinJaroLogo';

const questions = [
  {
    id: 'goal',
    question: 'What is your main goal?',
    options: [
      'Lose weight',
      'Gain muscle mass',
      'Improve overall health',
      'Increase energy',
      'Reduce stress',
    ],
  },
  {
    id: 'activity_level',
    question: 'What is your current activity level?',
    options: [
      'Sedentary (little or no exercise)',
      'Lightly active (1-3 days/week)',
      'Moderately active (3-5 days/week)',
      'Very active (6-7 days/week)',
    ],
  },
  {
    id: 'sleep',
    question: 'How many hours do you sleep per night?',
    options: [
      'Less than 5 hours',
      '5-6 hours',
      '7-8 hours',
      'More than 8 hours',
    ],
  },
  {
    id: 'water',
    question: 'How much water do you drink per day?',
    options: [
      'Less than 1 liter',
      '1-2 liters',
      '2-3 liters',
      'More than 3 liters',
    ],
  },
  {
    id: 'diet',
    question: 'How would you describe your eating habits?',
    options: [
      'Irregular and unplanned',
      'I eat when I\'m hungry',
      'I try to eat well but don\'t always succeed',
      'I have a healthy eating routine',
    ],
  },
];

export default function OnboardingScreen({ onComplete, isGenerating }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showIntro, setShowIntro] = useState(true);

  const handleAnswer = (answer) => {
    const question = questions[currentQuestion];
    setAnswers({ ...answers, [question.id]: answer });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const currentQuestionData = questions[currentQuestion];

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9FC] via-[#F5D4E4] to-[#E8A6C1] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <ThinJaroLogo width={140} />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-center mb-4">
                <Sparkles size={48} className="text-[#E8A6C1]" />
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Welcome!
              </h1>

              <p className="text-gray-700 text-lg mb-6">
                Let's create your personalized 30-day protocol
              </p>

              <div
                className="p-4 rounded-2xl mb-6"
                style={{
                  background: 'white',
                  boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.2)',
                }}
              >
                <p className="text-sm text-gray-600 leading-relaxed">
                  Answer a few quick questions so we can better understand your goals and create a fully personalized plan for you.
                </p>
              </div>

              <button
                onClick={() => setShowIntro(false)}
                className="w-full py-4 rounded-3xl font-bold text-white text-lg transition-all duration-300 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)',
                  boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.4)',
                }}
              >
                Get Started
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9FC] via-[#F5D4E4] to-[#E8A6C1] flex flex-col">
      {/* Header */}
      <div className="p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="p-2 rounded-xl transition-all disabled:opacity-30"
              style={{
                background: 'white',
                boxShadow: '4px 4px 12px rgba(232, 166, 193, 0.2)',
              }}
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>

            <span className="text-sm font-semibold text-gray-700">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#E8A6C1] to-[#C9A6E8]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-6 pb-6">
        <div className="max-w-md w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2
                className="text-2xl font-bold text-gray-800 mb-8 text-center"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {currentQuestionData.question}
              </h2>

              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleAnswer(option)}
                    className="w-full p-4 rounded-2xl text-left transition-all duration-300 active:scale-98"
                    style={{
                      background: answers[currentQuestionData.id] === option
                        ? 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)'
                        : 'white',
                      boxShadow: '6px 6px 18px rgba(232, 166, 193, 0.2)',
                      color: answers[currentQuestionData.id] === option ? 'white' : '#374151',
                    }}
                  >
                    <span className="font-medium">{option}</span>
                  </motion.button>
                ))}
              </div>

              {isLastQuestion && answers[currentQuestionData.id] && (
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  onClick={handleSubmit}
                  disabled={isGenerating}
                  className="w-full mt-6 py-4 rounded-3xl font-bold text-white text-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)',
                    boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.4)',
                    opacity: isGenerating ? 0.7 : 1,
                  }}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating your protocol...
                    </>
                  ) : (
                    <>
                      Create my protocol
                      <ChevronRight size={20} />
                    </>
                  )}
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
