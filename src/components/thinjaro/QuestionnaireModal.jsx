import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

const questions = [
  {
    id: 'objetivo',
    question: 'Qual é seu principal objetivo?',
    type: 'select',
    options: [
      'Perder peso',
      'Ganhar massa muscular',
      'Melhorar saúde geral',
      'Aumentar energia',
      'Melhorar sono',
      'Reduzir estresse',
    ],
  },
  {
    id: 'nivel',
    question: 'Qual seu nível de atividade atual?',
    type: 'select',
    options: ['Sedentário', 'Levemente ativo', 'Moderadamente ativo', 'Muito ativo', 'Atleta'],
  },
  {
    id: 'tempo',
    question: 'Quanto tempo você pode dedicar por dia?',
    type: 'select',
    options: ['10-15 minutos', '20-30 minutos', '30-45 minutos', '1 hora ou mais'],
  },
  {
    id: 'restricoes',
    question: 'Você tem restrições alimentares?',
    type: 'text',
    placeholder: 'Ex: vegetariano, sem glúten, sem lactose...',
  },
  {
    id: 'sono',
    question: 'Quantas horas você dorme por noite?',
    type: 'select',
    options: ['Menos de 5 horas', '5-6 horas', '6-7 horas', '7-8 horas', 'Mais de 8 horas'],
  },
  {
    id: 'habitos',
    question: 'Descreva seus hábitos atuais',
    type: 'textarea',
    placeholder: 'Ex: trabalho sentado, estressado, como fast-food...',
  },
  {
    id: 'idade',
    question: 'Qual sua idade?',
    type: 'number',
    placeholder: 'Ex: 29',
  },
  {
    id: 'medidas',
    question: 'Altura e peso (opcional)',
    type: 'text',
    placeholder: 'Ex: 1.78m - 87kg',
  },
  {
    id: 'extras',
    question: 'Informações adicionais',
    type: 'textarea',
    placeholder: 'Qualquer outra coisa que você gostaria de compartilhar...',
  },
];

export default function QuestionnaireModal({ isOpen, onClose, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(answers);
      setAnswers({});
      setCurrentStep(0);
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = answers[currentQuestion?.id];
  const isLastQuestion = currentStep === questions.length - 1;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg rounded-3xl p-6"
          style={{
            background: 'white',
            boxShadow: '0 8px 32px rgba(232, 166, 193, 0.3)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Protocolo Personalizado
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-2xl transition-all"
              style={{
                background: '#FFF9FC',
                boxShadow: '4px 4px 12px rgba(232, 166, 193, 0.15)',
              }}
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="mb-6">
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{
                background: '#FFF9FC',
                boxShadow: 'inset 2px 2px 4px rgba(232, 166, 193, 0.2)',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full"
                style={{
                  background: 'linear-gradient(90deg, #E8A6C1 0%, #C9A6E8 100%)',
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Pergunta {currentStep + 1} de {questions.length}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQuestion.question}</h3>

              {currentQuestion.type === 'select' && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className="w-full p-4 rounded-2xl text-left transition-all duration-300"
                      style={{
                        background: answers[currentQuestion.id] === option ? '#E8A6C120' : '#FFF9FC',
                        boxShadow:
                          answers[currentQuestion.id] === option
                            ? 'inset 3px 3px 8px rgba(232, 166, 193, 0.2), inset -3px -3px 8px rgba(255, 255, 255, 0.8)'
                            : '4px 4px 12px rgba(232, 166, 193, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <span
                        className={`font-medium ${
                          answers[currentQuestion.id] === option ? 'text-gray-800' : 'text-gray-600'
                        }`}
                      >
                        {option}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'text' && (
                <input
                  type="text"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full p-4 rounded-2xl border-none outline-none"
                  style={{
                    background: '#FFF9FC',
                    boxShadow: 'inset 3px 3px 8px rgba(232, 166, 193, 0.1), inset -3px -3px 8px rgba(255, 255, 255, 0.8)',
                  }}
                />
              )}

              {currentQuestion.type === 'number' && (
                <input
                  type="number"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  className="w-full p-4 rounded-2xl border-none outline-none"
                  style={{
                    background: '#FFF9FC',
                    boxShadow: 'inset 3px 3px 8px rgba(232, 166, 193, 0.1), inset -3px -3px 8px rgba(255, 255, 255, 0.8)',
                  }}
                />
              )}

              {currentQuestion.type === 'textarea' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder={currentQuestion.placeholder}
                  rows={4}
                  className="w-full p-4 rounded-2xl border-none outline-none resize-none"
                  style={{
                    background: '#FFF9FC',
                    boxShadow: 'inset 3px 3px 8px rgba(232, 166, 193, 0.1), inset -3px -3px 8px rgba(255, 255, 255, 0.8)',
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              className="px-6 py-3 rounded-2xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: '#FFF9FC',
                boxShadow: '4px 4px 12px rgba(232, 166, 193, 0.15), -4px -4px 12px rgba(255, 255, 255, 0.8)',
                color: '#6B7280',
              }}
            >
              <ArrowLeft size={20} />
            </button>

            <button
              onClick={isLastQuestion ? handleSubmit : handleNext}
              disabled={!canProceed || isSubmitting}
              className="flex-1 px-6 py-3 rounded-2xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)',
                boxShadow: '4px 4px 12px rgba(232, 166, 193, 0.3), -4px -4px 12px rgba(255, 255, 255, 0.8)',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Gerando...
                </>
              ) : isLastQuestion ? (
                'Gerar Protocolo'
              ) : (
                <>
                  Próxima
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
