import { Typography, Flex, Button } from 'antd';
import { LeftOutlined, TrophyOutlined } from '@ant-design/icons';
import { useStyleToken } from 'themeStyles';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useIsMobile from 'utils/isMobile';

import type { Ornament } from './types';
import characterConfigs from './characterConfigs';

const { Title } = Typography;

function OrnamentsPage() {
  const { characterId } = useParams<{ characterId: string }>();
  const styleToken = useStyleToken();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const characterConfig = characterConfigs[characterId!] || characterConfigs.pacha;
  const ornamentsData = characterConfig.data;
  const characterImage = characterConfig.image;
  const characterTitle = characterConfig.title;
  const { imageStyle, svgStyle } = characterConfig;

  const mobileImageStyle: React.CSSProperties = {
    ...imageStyle,
    transform: 'none',
    margin: '0 auto',
    width: '100%',
    maxWidth: '100%',
  };

  const mobileSvgStyle: React.CSSProperties = {
    ...svgStyle,
    transform: 'none',
  };

  const activeImageStyle = isMobile ? mobileImageStyle : imageStyle;
  const activeSvgStyle = isMobile ? mobileSvgStyle : svgStyle;

  const [hovered, setHovered] = useState<string | null>(null);
  const [tapped, setTapped] = useState<string | null>(null);
  const [hoveredListName, setHoveredListName] = useState<string | null>(null);
  const [tappedListName, setTappedListName] = useState<string | null>(null);

  const activeOrnamentName = isMobile
    ? (tappedListName ?? tapped)
    : (hoveredListName ?? hovered);

  const ornament = ornamentsData.find((o: Ornament) => o.name === activeOrnamentName);
  const isPathHighlighted = (name: string) => name === activeOrnamentName;

  const uniqueOrnamentNames = ornamentsData.reduce((acc: string[], o: Ornament) => {
    if (!acc.includes(o.name)) acc.push(o.name);
    return acc;
  }, []);

  return (
    <Flex vertical align="center">
      <Title style={{
        ...styleToken.pageHeadingTextStyle,
        fontSize: isMobile ? '1.6rem' : undefined,
      }}>
        {characterTitle}
      </Title>

      {/* Main content: figure | tooltip | list — side by side on desktop, stacked on mobile */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'center' : 'flex-start',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 1200,
        gap: isMobile ? 0 : 24,
        padding: isMobile ? '0' : '0 32px',
        marginTop: isMobile ? 0 : -60,
      }}>

        {/* Column 1: Figure + SVG overlay — scaled down on desktop */}
        <div style={{
          position: 'relative',
          flexShrink: 0,
          width: isMobile ? '100%' : undefined,
          transform: isMobile ? undefined : 'scale(0.75)',
          transformOrigin: isMobile ? undefined : 'top center',
        }}>
          <img
            src={characterImage}
            alt={`${characterTitle} Kathakali Character`}
            style={activeImageStyle}
          />
          <svg viewBox="0 0 960 1280" style={activeSvgStyle}>
            {ornamentsData.map(({ id, name, pathD }) => (
              <path
                key={id}
                d={pathD}
                fill={isPathHighlighted(name) ? 'rgba(255,215,0,0.25)' : 'transparent'}
                stroke={isPathHighlighted(name) ? 'gold' : 'transparent'}
                strokeWidth={isMobile ? 6 : 3}
                pointerEvents="auto"
                onMouseEnter={!isMobile ? () => setHovered(name) : undefined}
                onMouseLeave={!isMobile ? () => setHovered(null) : undefined}
                onClick={isMobile ? () => {
                  setTappedListName(null);
                  setTapped((prev) => (prev === name ? null : name));
                } : undefined}
                style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
              />
            ))}
          </svg>
        </div>

        {/* Column 2: Tooltip info panel (desktop only) */}
        {!isMobile && (
          <div style={{
            width: 260,
            flexShrink: 0,
            marginTop: 80,
            alignSelf: 'flex-start',
            minHeight: 160,
          }}>
            {ornament ? (
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.85)',
                color: 'white',
                padding: '14px 18px',
                borderRadius: '10px',
                fontSize: '1rem',
                pointerEvents: 'none',
                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,215,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}>
                <strong style={{ fontSize: '1.1rem', color: 'gold', marginBottom: 8 }}>
                  {ornament.name}
                </strong>
                {ornament.image && (
                  <img
                    src={ornament.image}
                    alt={ornament.name}
                    style={{ marginBottom: 8, maxWidth: '100%', borderRadius: 6 }}
                  />
                )}
                <div style={{ fontSize: '0.9rem', color: '#ddd', lineHeight: 1.5 }}>
                  {ornament.description}
                </div>
              </div>
            ) : (
              <div style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.85rem',
                textAlign: 'center',
                marginTop: 16,
                fontStyle: 'italic',
              }}>
                Hover over the figure or a name to learn more
              </div>
            )}
          </div>
        )}

        {/* Column 3: Ornament name list */}
        <div style={{
          marginTop: isMobile ? 24 : 80,
          marginBottom: isMobile ? 100 : 40,
          width: isMobile ? '100%' : 220,
          flexShrink: 0,
          padding: isMobile ? '0 16px' : '0',
        }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12,
            padding: '20px 16px',
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: 16, marginTop: 0, letterSpacing: 1 }}>
              Ornaments
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              gap: isMobile ? 10 : 8,
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}>
              {uniqueOrnamentNames.map((name) => {
                const isActive = isMobile ? tappedListName === name : hoveredListName === name;
                return (
                  <button
                    type="button"
                    key={name}
                    onMouseEnter={!isMobile ? () => setHoveredListName(name) : undefined}
                    onMouseLeave={!isMobile ? () => setHoveredListName(null) : undefined}
                    onClick={isMobile ? () => {
                      setTapped(null);
                      setTappedListName((prev) => (prev === name ? null : name));
                    } : undefined}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 20,
                      border: '2px solid',
                      borderColor: isActive ? 'gold' : '#555',
                      backgroundColor: isActive ? 'rgba(255,215,0,0.15)' : 'transparent',
                      color: isActive ? 'gold' : 'white',
                      cursor: 'pointer',
                      fontSize: isMobile ? '0.85rem' : '0.95rem',
                      transition: 'all 0.2s ease',
                      fontWeight: isActive ? 'bold' : 'normal',
                      width: isMobile ? 'auto' : '100%',
                      textAlign: 'left',
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Mobile bottom panel */}
      {isMobile && ornament && (
        <div style={{
          position: 'fixed',
          bottom: 70,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.92)',
          color: 'white',
          padding: '16px',
          borderRadius: '16px 16px 0 0',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 12,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.4)',
        }}>
          {ornament.image && (
            <img
              src={ornament.image}
              alt={ornament.name}
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
            />
          )}
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '1rem', display: 'block', marginBottom: 4 }}>{ornament.name}</strong>
            <div style={{ fontSize: '0.85rem', color: '#ccc' }}>{ornament.description}</div>
          </div>
          <button
            type="button"
            onClick={() => { setTapped(null); setTappedListName(null); }}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: 4,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Back Button */}
      <Button
        icon={<LeftOutlined />}
        onClick={() => navigate('/cultures/kathakali/ornaments')}
        style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1000 }}
      >
        Back
      </Button>

      {/* Test Yourself Button */}
      <Button
        type="primary"
        icon={<TrophyOutlined />}
        onClick={() => navigate(`/cultures/kathakali/ornaments/${characterId}/game`)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          background: '#52c41a',
          borderColor: '#52c41a',
          fontSize: '16px',
          height: '40px',
          paddingLeft: '20px',
          paddingRight: '20px',
          boxShadow: '0 4px 12px rgba(82, 196, 26, 0.4)',
        }}
      >
        Test Yourself
      </Button>
    </Flex>
  );
}

export default OrnamentsPage;
