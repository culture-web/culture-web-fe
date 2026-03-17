import React, { useState } from 'react';
import { Button, Card, Image, Radio, message, Typography } from 'antd';
import { useColourToken, useStyleToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';
import BACKEND_URI from 'configs/env.config';
import { generateAdaptiveQuizSession, submitQuizSession } from 'utils/invokeBackend';
import { getUserProficiencyGaps } from 'utils/invokeBackend';
import { getCurrentUserToken } from 'configs/supabase.config';
import { useAuth } from 'contexts/AuthContext';
import { QuizCategory, QuizItem } from './quizTypes';
import quizCharacter from './characterData';
import quizExpression from './expressionData';
import quizOrnament from './ornamentData';

const { Text, Title } = Typography;

const EXPRESSION = 'Expression';
const CHARACTER = 'Character';
const ORNAMENT = 'Ornament';

const generateQuizFromDataset = (dataset: QuizCategory[]): QuizItem[] => {
  const quizItems = dataset.map((category) => {
    const randomIndex = Math.floor(Math.random() * category.items.length);
    return category.items[randomIndex];
  });

  // In-place shuffle using Fisher-Yates algorithm
  for (let i = quizItems.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = quizItems[i];
    quizItems[i] = quizItems[j];
    quizItems[j] = temp;
  }

  return quizItems;
};

const QuizPage: React.FC = () => {
  const colourToken = useColourToken();
  const styleToken = useStyleToken();
  const isMobile = useIsMobile(); // Hook to detect mobile
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [checked, setChecked] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [loadingAdaptiveQuiz, setLoadingAdaptiveQuiz] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState<boolean>(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [activeQuizSessionId, setActiveQuizSessionId] = useState<string | null>(null);
  const [activeQuizSource, setActiveQuizSource] = useState<'adaptive' | 'static' | 'learning' | null>(null);
  const { isAuthenticated } = useAuth();

  const generateAdaptiveQuiz = async () => {
    try {
      setLoadingAdaptiveQuiz(true);

      const result = await generateAdaptiveQuizSession({ count: 5 });

      if (result.questions && result.questions.length > 0) {
        setActiveQuizSessionId(result.quizId);
        setActiveQuizSource('adaptive');
        setQuizItems(
          result.questions.map((q, idx) => ({
            id: idx,
            backendQuestionId: q.backendQuestionId || undefined,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            image: ''
          }))
        );
        setSelectedAnswers({});
        setChecked(false);
        setScore(0);
        message.success(`Generated ${result.questions.length} adaptive questions from your knowledge gaps! 🎯`);
      } else {
        setActiveQuizSessionId(null);
        setActiveQuizSource(null);
        message.info('No knowledge gaps found!');
      }
    } catch (error) {
      console.error('Adaptive quiz error:', error);
      message.error('Failed to generate adaptive quiz');
    } finally {
      setLoadingAdaptiveQuiz(false);
    }
  };

  const generateQuiz = (type: 'Expression' | 'Character' | 'Ornament' | 'Core') => {
    let dataset: QuizCategory[] = [];
    if (type === 'Character') {
      dataset = quizCharacter;
    } else if (type === 'Expression') {
      dataset = quizExpression;
    } else if (type === 'Ornament') {
      dataset = quizOrnament;
    } else if (type === 'Core') {
      // Combine both Character and Expression datasets
      dataset = [...quizCharacter, ...quizExpression];
    }

    const generatedQuiz = generateQuizFromDataset(dataset);
    const limitedQuiz = type === 'Ornament' ? generatedQuiz.slice(0, 6) : generatedQuiz; 
    setQuizItems(limitedQuiz);
    setSelectedAnswers({});
    setChecked(false);
    setScore(0);
    setActiveQuizSessionId(null);
    setActiveQuizSource('static');
  };

  // Generate quiz from chat learning history
  const generateQuizFromLearning = async () => {
    try {
      setLoadingQuiz(true);
      
      // Get chat history from sessionStorage (cleared when tab closes)
      const chatHistory = sessionStorage.getItem('chatHistory');
      if (!chatHistory) {
        message.error('No chat history found. Please chat with the AI first in the Learn tab.');
        return;
      }

      const parsedHistory = JSON.parse(chatHistory);
      if (!Array.isArray(parsedHistory) || parsedHistory.length === 0) {
        message.error('Chat history is empty. Ask questions in the chat first.');
        return;
      }

      // Send to backend to generate quiz
      const response = await fetch(`${BACKEND_URI}/kathakali/generate-quiz-from-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatHistory: parsedHistory,
          count: 5, // Generate 5 questions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const data = await response.json();
      
      if (!data.questions || data.questions.length === 0) {
        message.error('No quiz questions could be generated from your chat history.');
        return;
      }

      // Transform LLM response to QuizItem format
      const transformedQuiz: QuizItem[] = data.questions.map((q: { id: number; question: string; options: string[]; correctAnswer: string; explanation: string }) => ({
        id: q.id,
        question: q.question,
        image: '', // No image for LLM-generated quiz
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      }));

      setQuizItems(transformedQuiz);
      setSelectedAnswers({});
      setChecked(false);
      setScore(0);
      setActiveQuizSessionId(null);
      setActiveQuizSource('learning');
      
      message.success(`Generated ${transformedQuiz.length} questions from your learning history!`);
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error generating quiz from learning:', error);
      message.error(err.message || 'Failed to generate quiz from chat history');
    } finally {
      setLoadingQuiz(false);
    }
  };

  // Handle option change for each quiz item.
  const onOptionChange = (quizId: number, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: value }));
  };

  // Check the answers, update the cumulative score, and display a success message.
  const checkAnswers = async () => {
    // Always grade on the frontend using the quiz payload (robust matching).
    let correctCount = 0;
    quizItems.forEach((item) => {
      if (selectedAnswers[item.id] === item.correctAnswer) {
        correctCount += 1;
      }
    });
    setScore((prev) => prev + correctCount);
    setChecked(true);
    message.success(`You got ${correctCount} out of ${quizItems.length} correct!`);

    // For adaptive quizzes: submit best-effort for proficiency updates, but do NOT let
    // backend response affect marking.
    if (activeQuizSource === 'adaptive' && activeQuizSessionId) {
      try {
        setSubmittingQuiz(true);

        const mappedAnswers = quizItems.map((item) => ({
          backendQuestionId: item.backendQuestionId,
          answer: selectedAnswers[item.id]
        }));
        console.log('Mapped answers before filter:', mappedAnswers);

        const answers = mappedAnswers
          .filter((a) => !!a.backendQuestionId && typeof a.answer === 'string' && a.answer.length > 0)
          .map((a) => ({
            backendQuestionId: a.backendQuestionId as string,
            answer: a.answer
          }));

        const submission = await submitQuizSession({
          quizId: activeQuizSessionId,
          answers,
        });

        if (submission.proficiencyUpdatesApplied.length > 0) {
          message.success('Your understanding of certain concepts has improved!');
        }
      } catch (error) {
        console.warn('Adaptive quiz submission failed (marking unaffected):', error);
      } finally {
        setSubmittingQuiz(false);
      }
    }
  };

  return (
    // Use a max-width and center the container. Adjust padding for mobile vs. desktop.
    <div>
      <Title style={{ ...styleToken.pageHeadingTextStyle, textAlign: 'center' }}>
        Quiz
      </Title>

      {/* Buttons row (center them, add spacing for mobile) */}
      <div style={{ marginBottom: 16, textAlign: 'center' }}>
        <Button
          type="primary"
          onClick={() => generateQuiz('Core')}
          style={{ marginRight: isMobile ? 0 : 8, marginBottom: isMobile ? 8 : 0, width: '250px' }}
        >
          Kathakali Basics Quiz
        </Button>
        
        <Button
          type="primary"
          onClick={() => generateQuiz(ORNAMENT)}
          style={{ marginRight: isMobile ? 0 : 8, marginBottom: isMobile ? 8 : 0, width: '250px' }}
        >
          Generate Quiz For Ornaments
        </Button>
        {/* Show only for guests (not logged in) */}
        {!isAuthenticated && (
          <Button 
            type="primary" 
            style={{ width: '250px', background: '#52c41a', borderColor: '#52c41a',marginRight: isMobile ? 0 : 8, marginBottom: isMobile ? 8 : 0  }} 
            onClick={generateQuizFromLearning}
            loading={loadingQuiz}
          >
            Generate from Learning
          </Button>
        )}
        {/* Show only for logged-in users */}
        {isAuthenticated && (
          <Button 
            type="primary" 
            style={{ width: '250px', background: '#1890ff', borderColor: '#1890ff', marginRight: isMobile ? 0 : 8, marginBottom: isMobile ? 8 : 0  }} 
            onClick={generateAdaptiveQuiz}
            loading={loadingAdaptiveQuiz}
          >
            Generate Adaptive Quiz
          </Button>
        )}

      </div>

      <div>
        {quizItems.map((item) => (
          <Card 
            key={item.id} 
            style={{ 
              marginBottom: 16, 
              backgroundColor: colourToken.lightGray
            }}
          >
            <p style={{ fontSize: '2rem' }}>{item.question}</p>
            <div
              style={{
                // Switch to column layout on mobile, row on desktop
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'flex-start',
                gap: 24,
              }}
            >
              {/* Only show image if it exists */}
              {item.image && (
                <Image
                  src={item.image}
                  // Use full width on mobile, fixed size on desktop
                  style={{
                    width: isMobile ? '100%' : 300,
                    height: isMobile ? 'auto' : 300,
                    objectFit: 'cover',
                  }}
                />
              )}
              <div style={{ width: isMobile ? '100%' : 'auto', flex: 1 }}>
                <Radio.Group
                  onChange={(e) => onOptionChange(item.id, e.target.value)}
                  value={selectedAnswers[item.id]}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  {item.options.map((option) => (
                    <Radio key={option} value={option} style={{ marginBottom: 8, fontSize: '1.5rem' }}>
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>

                {checked && (
                  <div style={{ marginTop: 12, padding: 12, background: colourToken.primary, borderRadius: 8 }}>
                    {selectedAnswers[item.id] === item.correctAnswer ? (
                      <Text style={{ color: 'green', fontWeight: 'bold' }}>✓ Correct!</Text>
                    ) : (
                      <div>
                        <Text style={{ color: 'red', fontWeight: 'bold', display: 'block' }}>
                          ✗ Incorrect. Correct Answer: {item.correctAnswer}
                        </Text>
                      </div>
                    )}
                    {/* Show explanation if available (from LLM-generated quiz) */}
                    {item.explanation && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #3a3d4a' }}>
                        <Text style={{ color: colourToken.gray, fontSize: '0.9rem' }}>
                          <strong>Explanation:</strong> {item.explanation}
                        </Text>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Check Answers button (only shows if quiz items exist and not yet checked) */}
      {quizItems.length > 0 && !checked && (
        <Button
          type="primary"
          onClick={checkAnswers}
          disabled={Object.keys(selectedAnswers).length < quizItems.length}
          loading={submittingQuiz}
        >
          Check Answers
        </Button>
      )}

      {/* Score display */}
      {quizItems.length > 0 &&<div style={{ marginTop: 24 }}>
        <h3>Total Score: {score}</h3>
      </div>}
    </div>
  );
};

export default QuizPage;
