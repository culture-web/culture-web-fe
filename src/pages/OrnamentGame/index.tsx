import { Typography, Flex, Button, Card, Progress, Input, Space, Tag } from 'antd';
import { LeftOutlined, CheckCircleFilled, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useStyleToken } from 'themeStyles';
import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useIsMobile from 'utils/isMobile';
import type { Ornament } from '../OrnamentsPage/types';
import characterConfigs from '../OrnamentsPage/characterConfigs';

const { Title } = Typography;

interface NumberedOrnament extends Ornament {
  quizNumber: number;
}

function OrnamentGamePage() {
  const styleToken = useStyleToken();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { characterId } = useParams<{ characterId: string }>();

  const characterConfig = characterConfigs?.[characterId || 'pacha'];

  const allOrnaments: Ornament[] = useMemo(() => characterConfig?.data || [], [characterConfig]);
  const uniqueOrnaments: Ornament[] = Array.from(
    new Map(allOrnaments.map((o: Ornament) => [o.name, o])).values()
  );

  const numberedUniqueOrnaments: NumberedOrnament[] = uniqueOrnaments.map((ornament, index) => ({
    ...ornament,
    quizNumber: index + 1,
  }));

  const totalOrnaments = numberedUniqueOrnaments.length;

  const nameToQuizNumber: Record<string, number> = {};
  numberedUniqueOrnaments.forEach((o) => {
    nameToQuizNumber[o.name] = o.quizNumber;
  });

  const uniqueNames = [...new Set(uniqueOrnaments.map((o: Ornament) => o.name))].sort();

  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [feedback, setFeedback] = useState<{ [key: number]: 'correct' | 'wrong' | null }>({});

  const correctAnswers = Object.values(feedback).filter((f) => f === 'correct').length;
  const progressPercent = totalOrnaments > 0
    ? parseFloat(((correctAnswers / totalOrnaments) * 100).toFixed(1))
    : 0;

  const handleInputChange = (number: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [number]: value }));
  };

  const handleSubmitAnswer = useCallback((number: number) => {
    const userAnswer = answers[number]?.trim().toLowerCase() || '';
    if (!userAnswer) return;

    const correctOrnament = numberedUniqueOrnaments.find((o) => o.quizNumber === number);
    if (!correctOrnament) return;

    const correctName = correctOrnament.name.toLowerCase().trim();

    if (userAnswer === correctName) {
      setFeedback((prev) => ({ ...prev, [number]: 'correct' }));
      const idsToReveal = allOrnaments
        .filter((o: Ornament) => o.name === correctOrnament.name)
        .map((o: Ornament) => o.id);
      setRevealedIds((prev) => new Set([...prev, ...idsToReveal]));
    } else {
      setFeedback((prev) => ({ ...prev, [number]: 'wrong' }));
      setTimeout(() => {
        setFeedback((prev) => ({ ...prev, [number]: null }));
      }, 2000);
    }
  }, [answers, numberedUniqueOrnaments, allOrnaments]);

  const resetGame = () => {
    setRevealedIds(new Set());
    setAnswers({});
    setFeedback({});
  };

  const getPathCenter = (pathD: string): { x: number; y: number } => {
    if (!pathD || pathD.length < 10) return { x: 0, y: 0 };
    const numbers = pathD.match(/[\d.]+/g);
    if (!numbers || numbers.length < 4) return { x: 0, y: 0 };
    const coords = numbers.map(Number);
    const xCoords: number[] = [];
    const yCoords: number[] = [];
    for (let i = 0; i < Math.min(coords.length, 30); i += 2) {
      if (!Number.isNaN(coords[i])) xCoords.push(coords[i]);
      if (!Number.isNaN(coords[i + 1])) yCoords.push(coords[i + 1]);
    }
    if (xCoords.length === 0 || yCoords.length === 0) return { x: 0, y: 0 };
    return {
      x: (Math.min(...xCoords) + Math.max(...xCoords)) / 2,
      y: (Math.min(...yCoords) + Math.max(...yCoords)) / 2,
    };
  };

  if (!characterConfig) {
    return (
      <Flex vertical align="center" justify="center" style={{ minHeight: '80vh' }}>
        <Title level={3}>Character &quot;{characterId}&quot; not found</Title>
        <Button type="primary" onClick={() => navigate('/quiz')}>Back to Quiz</Button>
      </Flex>
    );
  }

  const { title, image } = characterConfig;

  // ── Figure panel ────────────────────────────────────────────────
  const FigurePanel = (
    <div style={{
      position: 'relative',
      borderRadius: 16,
      padding: 12,
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      background: '#fafafa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      width: '100%',
      minHeight: isMobile ? 480 : 500,
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src={image}
          alt={title}
          style={{
            width: '100%',
            height: isMobile ? 460 : '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
            transform: 'none',
          }}
        />
        <svg
          viewBox="0 0 960 1280"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {allOrnaments.map(({ id, name, pathD, labelPosition }: Ornament) => {
            if (!pathD) return null;
            const quizNumber = nameToQuizNumber[name];
            const autoCenter = getPathCenter(pathD);
            const center = labelPosition
              ? { x: labelPosition.x, y: labelPosition.y }
              : autoCenter;
            const isRevealed = revealedIds.has(id);
            if (center.x === 0 && center.y === 0) return null;
            return (
              <g key={id}>
                <path
                  d={pathD}
                  fill={!isRevealed ? '#222' : 'transparent'}
                  fillOpacity={0.88}
                  stroke="#fff"
                  strokeWidth="3"
                  pointerEvents="none"
                />
                {!isRevealed && quizNumber && (
                  <>
                    <circle
                      cx={center.x}
                      cy={center.y}
                      r="22"
                      fill="white"
                      stroke="#1890ff"
                      strokeWidth="3"
                      filter="url(#glow)"
                    />
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
    </div>
  );

  // ── Names hint panel ─────────────────────────────────────────────
  const NamesPanel = (
    <Card
      title="Available Ornament Names"
      style={{ width: '100%' }}
      headStyle={{ background: '#f0f0f0', fontWeight: 600 }}
    >
      <Flex wrap="wrap" gap={8}>
        {uniqueNames.map((name) => {
          const quizNumber = nameToQuizNumber[name];
          const isUsed = feedback[quizNumber] === 'correct';
          return (
            <Tag
              key={name}
              color={isUsed ? 'success' : 'blue'}
              style={{
                fontSize: 14,
                padding: '6px 12px',
                margin: 0,
                opacity: isUsed ? 0.5 : 1,
                textDecoration: isUsed ? 'line-through' : 'none',
              }}
            >
              {name} {isUsed && '✓'}
            </Tag>
          );
        })}
      </Flex>
      <div style={{ marginTop: 12, fontSize: 12, color: '#666', fontStyle: 'italic' }}>
        💡 Tip: Match the numbered silhouettes with these ornament names
      </div>
    </Card>
  );

  // ── Answer input panel ───────────────────────────────────────────
  const AnswerPanel = (
    <Card
      title={`Type Ornament Names (1-${totalOrnaments})`}
      style={{ width: '100%' }}
      headStyle={{
        background: '#f0f0f0',
        fontWeight: 600,
        fontSize: 16,
        textAlign: 'center',
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Flex vertical gap={12}>
        {numberedUniqueOrnaments.map(({ quizNumber, name }) => {
          const isCorrect = feedback[quizNumber] === 'correct';
          const isWrong = feedback[quizNumber] === 'wrong';
          let cardBackground = '#fafafa';
          let cardBorderColor = '#d9d9d9';
          if (isCorrect) {
            cardBackground = '#f6ffed';
            cardBorderColor = '#52c41a';
          } else if (isWrong) {
            cardBackground = '#fff2f0';
            cardBorderColor = '#ff4d4f';
          }
          return (
            <Card
              key={quizNumber}
              style={{
                background: cardBackground,
                borderColor: cardBorderColor,
                border: '2px solid',
                transition: 'all 0.3s ease',
                boxShadow: isCorrect ? '0 2px 8px rgba(82,196,26,0.3)' : 'none',
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
                  flexShrink: 0,
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
                    background: isCorrect ? '#f0f0f0' : 'white',
                  }}
                />
                {isCorrect && (
                  <CheckCircleFilled style={{ color: '#52c41a', fontSize: 20 }} />
                )}
              </Flex>
              {isCorrect && (
                <div style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: '#52c41a',
                  textAlign: 'center',
                  fontWeight: '500',
                }}>
                  ✓ {name}
                </div>
              )}
            </Card>
          );
        })}
      </Flex>
    </Card>
  );

  return (
    <Flex vertical align="center" gap={24} style={{ minHeight: '100vh', padding: '20px 0' }}>
      <Title style={{
        ...styleToken.pageHeadingTextStyle,
        fontSize: isMobile ? '1.4rem' : undefined,
        textAlign: 'center',
        padding: '0 16px',
      }}>
        {title} Ornament Game
      </Title>

      {/* Progress bar */}
      <Card style={{ width: '100%', maxWidth: isMobile ? '100%' : 1400, margin: '0 16px' }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
          <div>Progress: <strong>{correctAnswers}/{totalOrnaments}</strong></div>
          <Progress percent={progressPercent} size="small" style={{ width: isMobile ? 120 : 200 }} />
          <Space>
            <Button onClick={resetGame}>Reset</Button>
            {progressPercent === 100 && <CheckCircleFilled style={{ color: '#52c41a', fontSize: 24 }} />}
          </Space>
        </Flex>
      </Card>

      {isMobile ? (
        // ── MOBILE layout: figure → [names | answers] side by side ──
        <Flex vertical gap={16} style={{ width: '100%', padding: '0 12px' }}>
          {FigurePanel}
          <Flex vertical gap={12} style={{ width: '100%' }}>
            {NamesPanel}
            {AnswerPanel}
          </Flex>
        </Flex>
      ) : (
        // ── DESKTOP layout: [figure above names] | answer panel ──
        <Flex gap={40} justify="center" align="stretch" style={{ width: '100%', maxWidth: 1400, padding: '0 20px' }}>
          <Flex vertical gap={20} style={{ flex: 1, maxWidth: 600 }}>
            {FigurePanel}
            {NamesPanel}
          </Flex>
          <div style={{ flex: 1, maxWidth: 400 }}>
            {AnswerPanel}
          </div>
        </Flex>
      )}

      {/* Back Button */}
      <Button
        icon={<LeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000 }}
      >
        Back
      </Button>
    </Flex>
  );
}

export default OrnamentGamePage;
