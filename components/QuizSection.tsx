import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Question, Choice } from '../types';

interface QuizSectionProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

const QuizSection: React.FC<QuizSectionProps> = ({ questions, onComplete }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number[]>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectChoice = (questionId: number, choiceId: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      const newAnswers = currentAnswers.includes(choiceId)
        ? currentAnswers.filter(id => id !== choiceId)
        : [...currentAnswers, choiceId];
      
      return {
        ...prev,
        [questionId]: newAnswers
      };
    });
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach(q => {
      const selectedChoiceIds = userAnswers[q.id] || [];
      const correctChoiceIds = q.choices.filter(c => c.is_correct).map(c => c.id);
      
      // Check if arrays have same elements (ignoring order)
      const isCorrect = 
        selectedChoiceIds.length === correctChoiceIds.length &&
        selectedChoiceIds.every(id => correctChoiceIds.includes(id));

      if (isCorrect) {
        newScore++;
      }
    });
    setScore(newScore);
    setIsSubmitted(true);
    onComplete(newScore);
  };

  const allAnswered = questions.every(q => (userAnswers[q.id]?.length || 0) > 0);

  if (questions.length === 0) return null;

  return (
    <div className="mt-12 bg-white dark:bg-bg-card-dark rounded-2xl p-6 md:p-8 shadow-sm border border-brand-grey-light dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-brand-blue/10 rounded-lg">
          <HelpCircle className="text-brand-blue w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">اختبر معلوماتك</h2>
      </div>

      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id} className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex gap-2">
              <span className="text-brand-blue">{index + 1}.</span>
              {question.text}
            </h3>
            
            <div className="space-y-3">
              {question.choices.map((choice) => {
                const isSelected = (userAnswers[question.id] || []).includes(choice.id);
                const isCorrect = choice.is_correct;
                
                let choiceClass = "w-full text-right p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ";
                
                if (isSubmitted) {
                  if (isCorrect) {
                    choiceClass += "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300";
                  } else if (isSelected && !isCorrect) {
                    choiceClass += "bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300";
                  } else {
                    choiceClass += "border-gray-200 dark:border-gray-700 opacity-50";
                  }
                } else {
                  if (isSelected) {
                    choiceClass += "border-brand-blue bg-brand-blue/5 text-brand-blue dark:border-sky-500 dark:bg-sky-500/10 dark:text-sky-400";
                  } else {
                    choiceClass += "border-gray-200 dark:border-gray-700 hover:border-brand-blue/50 dark:hover:border-sky-500/50 hover:bg-gray-50 dark:hover:bg-gray-800";
                  }
                }

                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(question.id, choice.id)}
                    disabled={isSubmitted}
                    className={choiceClass}
                  >
                    <span className="font-medium">{choice.text}</span>
                    {isSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                    {!isSubmitted && isSelected && <div className="w-4 h-4 rounded bg-brand-blue dark:bg-sky-500 flex items-center justify-center"><CheckCircle className="w-3 h-3 text-white" /></div>}
                    {!isSubmitted && !isSelected && <div className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 group-hover:border-brand-blue/50" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!isSubmitted ? (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all ${
              allAnswered 
                ? 'bg-brand-blue hover:bg-brand-blue-dark shadow-lg hover:shadow-xl transform hover:-translate-y-1' 
                : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            }`}
          >
            إرسال الإجابات
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-brand-blue/5 dark:bg-sky-900/20 rounded-xl border border-brand-blue/20 text-center"
        >
          <h3 className="text-xl font-bold text-brand-blue dark:text-sky-400 mb-2">
            النتيجة: {score} من {questions.length}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {score === questions.length ? 'ممتاز! إجاباتك كلها صحيحة 🎉' : 'حاول مرة أخرى لتحسين نتيجتك 💪'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default QuizSection;
