import { Typography, Flex, Button, Card, Progress, Input, Space } from 'antd';
import { LeftOutlined, CheckCircleFilled, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useStyleToken } from 'themeStyles';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Ornament } from '../OrnamentsPage/types';
import characterConfigs from '../OrnamentsPage/characterConfigs';
import pachaOrnamentsData from '../OrnamentsPage/data/pachaOrnamentsData';

const { Title } = Typography;

function PachaOrnamentGamePage() {
  const styleToken = useStyleToken();
  const navigate = useNavigate();

  const pachaConfig = characterConfigs?.['pacha'] || { image: '', imageStyle: {}, svgStyle: {} };
  const rawOrnaments: Ornament[] = Array.isArray(pachaOrnamentsData) ? pachaOrnamentsData : [];

  // 1) ALL ornaments for drawing silhouettes (24 items including pairs)
  const allOrnaments = rawOrnaments;

  // 2) UNIQUE ornaments by name for quiz inputs (17 unique names)
  const uniqueOrnaments = Array.from(
    new Map(allOrnaments.map(o => [o.name, o])).values()
  );

  // 3) Assign quiz numbers to unique ornaments (1,2,3,...17)
  const numberedUniqueOrnaments = uniqueOrnaments.map((ornament, index) => ({
    ...ornament,
    quizNumber: index + 1,
  }));

  const totalOrnaments = numberedUniqueOrnaments.length;

  // 4) Map: name -> quiz number (so pairs like Thoda1/Thoda2 both map to same number)
  const nameToQuizNumber: Record<string, number> = {};
  numberedUniqueOrnaments.forEach(o => {
    nameToQuizNumber[o.name] = o.quizNumber;
  });

  // State
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [feedback, setFeedback] = useState<{[key: number]: 'correct' | 'wrong' | null}>({});

  const correctAnswers = Object.values(feedback).filter(f => f === 'correct').length;
  const progress = totalOrnaments > 0 ? (correctAnswers / totalOrnaments) * 100 : 0;

  // Handle input change
  const handleInputChange = (number: number, value: string) => {
    setAnswers(prev => ({ ...prev, [number]: value }));
  };

  // Handle answer submission
  const handleSubmitAnswer = useCallback((number: number) => {
    const userAnswer = answers[number]?.trim().toLowerCase() || '';
    if (!userAnswer) return;

    const correctOrnament = numberedUniqueOrnaments.find(o => o.quizNumber === number);
    if (!correctOrnament) return;

    const correctName = correctOrnament.name.toLowerCase().trim();

    if (userAnswer === correctName) {
      // Correct answer
      setFeedback(prev => ({ ...prev, [number]: 'correct' }));

      // Reveal ALL paths with this name (handles pairs like Thoda1/Thoda2)
      const idsToReveal = allOrnaments
        .filter(o => o.name === correctOrnament.name)
        .map(o => o.id);

      setRevealedIds(prev => new Set([...prev, ...idsToReveal]));
    } else {
      // Wrong answer
      setFeedback(prev => ({ ...prev, [number]: 'wrong' }));
      
      // Clear wrong feedback after 2 seconds
      setTimeout(() => {
        setFeedback(prev => ({ ...prev, [number]: null }));
      }, 2000);
    }
  }, [answers, numberedUniqueOrnaments, allOrnaments]);

  const resetGame = () => {
    setRevealedIds(new Set());
    setAnswers({});
    setFeedback({});
  };

  // Calculate center of SVG path
  const getPathCenter = (pathD: string): { x: number; y: number } => {
    if (!pathD || pathD.length < 10) return { x: 0, y: 0 };
    
    const numbers = pathD.match(/[\d.]+/g);
    if (!numbers || numbers.length < 4) return { x: 0, y: 0 };
    
    const coords = numbers.map(Number);
    const xCoords: number[] = [];
    const yCoords: number[] = [];
    
    for (let i = 0; i < Math.min(coords.length, 30); i += 2) {
      if (!isNaN(coords[i])) xCoords.push(coords[i]);
      if (!isNaN(coords[i + 1])) yCoords.push(coords[i + 1]);
    }
    
    if (xCoords.length === 0 || yCoords.length === 0) return { x: 0, y: 0 };
    
    const centerX = (Math.min(...xCoords) + Math.max(...xCoords)) / 2;
    const centerY = (Math.min(...yCoords) + Math.max(...yCoords)) / 2;
    
    return { x: centerX, y: centerY };
  };

  return (
    <Flex vertical align="center" gap={24} style={{ 
      minHeight: '100vh', 
      padding: '20px 0'
    }}>
      <Title style={styleToken.pageHeadingTextStyle}>
        Pacha Ornament Quiz
      </Title>
      
      {/* Progress & Controls */}
      <Card style={{ width: '100%', maxWidth: 800 }}>
        <Flex justify="space-between" align="center">
          <div>Progress: <strong>{correctAnswers}/{totalOrnaments}</strong></div>
          <Progress percent={progress} size="small" style={{ width: 200 }} />
          <Space>
            <Button onClick={resetGame}>Reset</Button>
            {progress === 100 && <CheckCircleFilled style={{ color: '#52c41a', fontSize: 24 }} />}
          </Space>
        </Flex>
      </Card>

      {/* Game Area */}
      <Flex gap={40} justify="center" align="start" style={{ width: '100%', maxWidth: 1400 }}>
        
        {/* LEFT: CHARACTER WITH NUMBERS ON SILHOUETTES */}
        <div style={{ 
          position: 'relative', 
          maxWidth: 600, 
          borderRadius: 16,
          padding: 20,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
          <img 
            src={pachaConfig.image} 
            alt="Pacha" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              maxHeight: 760,
              display: 'block'
            }} 
          />

          {/* SVG - ALL ORNAMENTS with numbers (24 paths, but using shared numbers for pairs) */}
          <svg viewBox="0 0 960 1280" preserveAspectRatio="xMidYMid meet" style={{ 
            position: 'absolute', 
            top: 20, 
            left: 20, 
            width: 'calc(100% - 40px)', 
            height: 'calc(100% - 40px)',
            zIndex: 2,
            pointerEvents: 'none'
          }}>
            <defs>
              <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="white" floodOpacity="1"/>
              </filter>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {allOrnaments.map(({ id, name, pathD }) => {
              if (!pathD) return null;
              
              const quizNumber = nameToQuizNumber[name]; // Same number for pairs
              const center = getPathCenter(pathD);
              const isRevealed = revealedIds.has(id);
              
              if (center.x === 0 && center.y === 0) return null;

              return (
                <g key={id}>
                  {/* Silhouette - disappears when revealed */}
                  <path
                    d={pathD}
                    fill={!isRevealed ? '#222' : 'transparent'}
                    fillOpacity={0.88}
                    stroke="#fff"
                    strokeWidth="3"
                    pointerEvents="none"
                  />
                  
                  {/* Number on silhouette - only show if NOT revealed */}
                  {!isRevealed && quizNumber && (
                    <>
                      {/* White circle background */}
                      <circle
                        cx={center.x}
                        cy={center.y}
                        r="22"
                        fill="white"
                        stroke="#1890ff"
                        strokeWidth="3"
                        filter="url(#glow)"
                      />
                      {/* Number text */}
                      <text
                        x={center.x}
                        y={center.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="26"
                        fontWeight="bold"
                        fill="#1890ff"
                        fontFamily="Arial, sans-serif"
                      >
                        {quizNumber}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* RIGHT: INPUT BOXES - One per unique ornament (17 total) */}
        <Flex vertical gap={12} style={{ width: 350, maxWidth: 350, maxHeight: 700, overflowY: 'auto' }}>
          <div style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginBottom: 12
          }}>
            Type Ornament Names (1-{totalOrnaments})
          </div>
          
          {numberedUniqueOrnaments.map(({ quizNumber, name }) => {
            const isCorrect = feedback[quizNumber] === 'correct';
            const isWrong = feedback[quizNumber] === 'wrong';

            return (
              <Card 
                key={quizNumber}
                style={{ 
                  background: isCorrect ? '#f6ffed' : isWrong ? '#fff2f0' : '#fafafa',
                  borderColor: isCorrect ? '#52c41a' : isWrong ? '#ff4d4f' : '#d9d9d9',
                  border: `2px solid`,
                  transition: 'all 0.3s ease',
                  boxShadow: isCorrect ? '0 2px 8px rgba(82,196,26,0.3)' : 'none'
                }}
                bodyStyle={{ padding: 12 }}
              >
                <Flex align="center" gap={12}>
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    background: isCorrect ? '#52c41a' : '#1890ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    {isCorrect ? <CheckOutlined /> : quizNumber}
                  </div>
                  
                  <Input
                    placeholder={`Type name for #${quizNumber}`}
                    value={answers[quizNumber] || ''}
                    onChange={(e) => handleInputChange(quizNumber, e.target.value)}
                    onPressEnter={() => handleSubmitAnswer(quizNumber)}
                    onBlur={() => handleSubmitAnswer(quizNumber)}
                    disabled={isCorrect}
                    status={isWrong ? 'error' : undefined}
                    suffix={isWrong ? <CloseOutlined style={{ color: '#ff4d4f' }} /> : null}
                    style={{ 
                      flex: 1,
                      background: isCorrect ? '#f0f0f0' : 'white'
                    }}
                  />
                  
                  {isCorrect && (
                    <CheckCircleFilled style={{ color: '#52c41a', fontSize: 20 }} />
                  )}
                </Flex>
                
                {/* Show correct answer when revealed */}
                {isCorrect && (
                  <div style={{ 
                    marginTop: 8, 
                    fontSize: 13, 
                    color: '#52c41a', 
                    textAlign: 'center',
                    fontWeight: '500'
                  }}>
                    ✓ {name}
                  </div>
                )}
              </Card>
            );
          })}
        </Flex>
      </Flex>

      <Button 
        icon={<LeftOutlined />} 
        onClick={() => navigate(-1)} 
        style={{ 
          position: 'fixed', 
          bottom: 20, 
          left: 20, 
          zIndex: 1000 
        }} 
      />
    </Flex>
  );
}

export default PachaOrnamentGamePage;
