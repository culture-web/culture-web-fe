import { Typography, Flex, Image, Button } from 'antd';
import pachaImage from 'assets/images/kathakali-stock-images/pacha.png';
import { useStyleToken } from 'themeStyles';
import { useState } from 'react';
import ornamentsData from './onamentsData';

const { Title} = Typography;

// To do: Use SVG with custom path or polygon tomake the border more precise/ CSS Clip-Path

function OrnamentsPage() {
   
  const styleToken = useStyleToken();
  const [hovered, setHovered] = useState<string | null>(null);
  const ornament = ornamentsData.find(o => o.name === hovered);

  return (
    <Flex vertical align="center">
      <Title style={styleToken.pageHeadingTextStyle}>Pacha</Title>

      <div
        style={{
          position: 'relative',
          maxWidth: 1000, 
          margin: '-100px auto',
          background: 'transparent',
        }}
      >
        <img
          src={pachaImage} 
          alt="Pacha Kathakali Character"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            pointerEvents: 'none',
          }}
        />

        <svg
          viewBox="0 0 960 1280" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
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
              style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
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
              textAlign: 'left', // <-- for text
              display: 'flex',   // <-- for vertical stacking
              flexDirection: 'column', // <-- vertical stacking
              alignItems: 'flex-start', // <-- left align children
            }}
          >
            <strong>{ornament.name}</strong>
            {ornament.image && (
              <img
                src={ornament.image}
                alt={ornament.name}
                style={{ marginTop: 8, maxWidth: 220, borderRadius: 4 }}
              />
            )}
            <div style={{ fontSize: '0.9em', marginTop: '4px' }}>{ornament.description}</div>
          </div>
        )}
      </div>
    </Flex>
      
  );
}

export default OrnamentsPage;

