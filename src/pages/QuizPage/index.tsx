import React, { useState } from 'react';
import { Button, Card, Image, Radio, message, Typography } from 'antd';
import { useColourToken, useStyleToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';
import { QuizCategory, QuizItem } from './quizTypes';
import quizCharacter from './characterData';
import quizExpression from './expressionData';

const { Text, Title } = Typography;

const EXPRESSION = 'Expression';
const CHARACTER = 'Character';

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

  const generateQuiz = (type: 'Expression' | 'Character') => {
    let dataset: QuizCategory[] = [];
    if (type === 'Character') {
      dataset = quizCharacter;
    } else if (type === 'Expression') {
      dataset = quizExpression;
    }

    const generatedQuiz = generateQuizFromDataset(dataset);
    setQuizItems(generatedQuiz);
    setSelectedAnswers({});
    setChecked(false);
    setScore(0);
  };

  // Handle option change for each quiz item.
  const onOptionChange = (quizId: number, value: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: value }));
  };

  // Check the answers, update the cumulative score, and display a success message.
  const checkAnswers = () => {
    let correctCount = 0;
    quizItems.forEach((item) => {
      if (selectedAnswers[item.id] === item.correctAnswer) {
        correctCount += 1;
      }
    });
    setScore((prev) => prev + correctCount);
    setChecked(true);
    message.success(`You got ${correctCount} out of ${quizItems.length} correct!`);
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
          onClick={() => generateQuiz(CHARACTER)}
          style={{ marginRight: isMobile ? 0 : 8, marginBottom: isMobile ? 8 : 0, width: '250px' }}
        >
          Generate Quiz For Characters
        </Button>
        <Button type="primary" style={{ width: '250px' }} onClick={() => generateQuiz(EXPRESSION)}>
          Generate Quiz For Expressions
        </Button>
      </div>

      <div>
        {quizItems.map((item) => (
          <Card key={item.id} style={{ marginBottom: 16, backgroundColor: colourToken.lightGray }}>
            <p style={{ fontSize: '1rem' }}>{item.question}</p>
            <div
              style={{
                // Switch to column layout on mobile, row on desktop
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'flex-start',
                gap: 24,
              }}
            >
              <Image
                src={item.image}
                // Use full width on mobile, fixed size on desktop
                style={{
                  width: isMobile ? '100%' : 300,
                  height: isMobile ? 'auto' : 300,
                  objectFit: 'cover',
                }}
              />
              <div style={{ width: isMobile ? '100%' : 'auto' }}>
                <Radio.Group
                  onChange={(e) => onOptionChange(item.id, e.target.value)}
                  value={selectedAnswers[item.id]}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  {item.options.map((option) => (
                    <Radio key={option} value={option} style={{ marginBottom: 8 }}>
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>

                {checked && (
                  <div style={{ marginTop: 8 }}>
                    {selectedAnswers[item.id] === item.correctAnswer ? (
                      <Text style={{ color: 'green' }}>Correct!</Text>
                    ) : (
                      <Text style={{ color: 'red' }}>
                        Incorrect. Correct Answer: {item.correctAnswer}
                      </Text>
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
