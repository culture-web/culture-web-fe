import React, { useState } from 'react';
import { Button, Card, Image, Radio, message, Typography } from 'antd';
import { QuizCategory, QuizItem } from './quizTypes';
import quizCharacter from './characterData';
import quizExpression from './expressionData';

const { Text } = Typography;

const EXPRESSION = 'Expression'
const CHARACTER = 'Character'



const generateQuizFromDataset = (dataset: QuizCategory[]): QuizItem[] => {
  const quizItems = dataset.map(category => {
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
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [checked, setChecked] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [currentQuizType, setCurrentQuizType] = useState<'Expression' | 'Character'>('Expression');

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
    setCurrentQuizType(type);
    setScore(0);
  };

  // Handle option change for each quiz item.
  const onOptionChange = (quizId: number, value: string) => {
    setSelectedAnswers(prev => ({ ...prev, [quizId]: value }));
  };

  // Check the answers, update the cumulative score, and display a success message.
  const checkAnswers = () => {
    let correctCount = 0;
    quizItems.forEach(item => {
      if (selectedAnswers[item.id] === item.correctAnswer) {
        correctCount+= 1;
      }
    });
    setScore(prev => prev + correctCount);
    setChecked(true);
    message.success(`You got ${correctCount} out of ${quizItems.length} correct!`);
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => generateQuiz(CHARACTER)} style={{ marginRight: 8 }}>
          Generate Quiz Character
        </Button>
        <Button type="primary" onClick={() => generateQuiz(EXPRESSION)}>
          Generate Quiz Expression
        </Button>
      </div>
      <div>
        {quizItems.map(item => (
          <Card key={item.id} style={{ marginBottom: 16, backgroundColor: '#f0f0f0' }}>
            <p style={{ fontSize: '1rem'}}>{item.question}</p>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 24 }}>
              <Image 
                src={item.image} 
                style={{ width: 300, height: 300, objectFit: 'cover' }} 
              />
              <div>
                <Radio.Group
                  onChange={(e) => onOptionChange(item.id, e.target.value)}
                  value={selectedAnswers[item.id]}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  {item.options.map(option => (
                    <Radio key={option} value={option} style={{ marginBottom: 8 }}>
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>
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
          </Card>
        ))}
      </div>
      {quizItems.length > 0 && !checked && (
        <Button
          type="primary"
          onClick={checkAnswers}
          disabled={Object.keys(selectedAnswers).length < quizItems.length}
        >
          Check Answers
        </Button>
      )}
      <div style={{ marginTop: 24 }}>
        <h3>Total Score: {score}</h3>
      </div>
    </div>
  );
  
};

export default QuizPage;
