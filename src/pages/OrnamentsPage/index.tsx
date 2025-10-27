import { Typography, Flex, Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useStyleToken } from 'themeStyles';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import type { Ornament } from './types';
import characterConfigs from './characterConfigs';

const { Title } = Typography;

function OrnamentsPage() {
  const { characterId } = useParams<{ characterId: string }>();
  const styleToken = useStyleToken();
  const navigate = useNavigate();


  const characterConfig = characterConfigs[characterId!] || characterConfigs['pacha'];
  const ornamentsData = characterConfig.data;
  const characterImage = characterConfig.image;
  const characterTitle = characterConfig.title;
  const { imageStyle, svgStyle } = characterConfig;


  const [hovered, setHovered] = useState<string | null>(null);
  const ornament = ornamentsData.find((o: Ornament) => o.name === hovered);

  return (
    <Flex vertical align="center">
      <Title style={styleToken.pageHeadingTextStyle}>{characterTitle}</Title>
      <div style={{ position: 'relative', maxWidth: 1000, margin: '-100px auto', background: 'transparent' }}>
        <img
          src={characterImage}
          alt={`${characterTitle} Kathakali Character`}
          style={imageStyle}
        />
        <svg
          viewBox="0 0 960 1280"
          style={svgStyle}
        >
          {ornamentsData.map(({ id, name, pathD }) => (
            <path
              key={id}
              d={pathD}
              fill="transparent"
              stroke={hovered === name ? 'gold' : 'transparent'}
              strokeWidth={3}
              pointerEvents="auto"
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
              style={{
                cursor: 'pointer',
                transition: 'stroke 0.2s ease'
              }}
            />
          ))}
        </svg>
        {ornament && (
          <div
            style={{
              position: 'absolute',
              top: ornament.tooltipPosition.top,
              left: ornament.tooltipPosition.left,
              transform: 'translate(-20%, -10%)',
              backgroundColor: 'rgba(0,0,0,0.85)',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '1.5rem',
              pointerEvents: 'none',
              minWidth: '220px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
              zIndex: 10,
              whiteSpace: 'normal',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <strong>{ornament.name}</strong>
            {ornament.image && (
              <img src={ornament.image} alt={ornament.name} style={{ marginTop: 8, maxWidth: 220, borderRadius: 4 }} />
            )}
            <div style={{ fontSize: '0.9em', marginTop: '4px' }}>{ornament.description}</div>
          </div>
        )}
      </div>
      <Button
        icon={<LeftOutlined />}
        onClick={() => navigate('/cultures/kathakali/ornaments')}
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

export default OrnamentsPage;
