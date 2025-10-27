import { Typography, Flex } from 'antd';
import { useStyleToken } from 'themeStyles';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import type { Ornament } from './types';

import pachaImage from 'assets/images/kathakali-stock-images/pacha.png';
import minukkuFemaleImage from 'assets/images/kathakali-stock-images/minukkufemale.png';
import pachaOrnamentsData from './data/pachaOrnamentsData';
import minukkuFemaleOrnamentsData from './data/minukkuFemaleOrnamentsData';

const { Title } = Typography;

// Add imageStyle and svgStyle for each character to control their display independently
const characterMap: Record<
  string,
  {
    title: string;
    image: string;
    data: Ornament[];
    imageStyle?: React.CSSProperties;
    svgStyle?: React.CSSProperties;
  }
> = {
  pacha: {
    title: 'Pacha',
    image: pachaImage,
    data: pachaOrnamentsData,
    imageStyle: {
      display: 'block',
      width: '100%',
      maxWidth: 900,
      height: 'auto',
      transform: 'translate(25px, -50px)',
      pointerEvents: 'none',
      margin: '0 auto'
    },
    svgStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      transform: 'translate(25px, -50px)'
    }
  },
  minukkufemale: {
    title: 'Minukku Female',
    image: minukkuFemaleImage,
    data: minukkuFemaleOrnamentsData,
    imageStyle: {
      display: 'block',
      width: '100%',
      maxWidth: 380, // Tweak this value independently
      height: 'auto',
      margin: '0 auto',
      pointerEvents: 'none'
    },
    svgStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none'
      // If you need further translation for alignment, add transform here too
    }
  }
};

function OrnamentsPage() {
  const { characterId } = useParams<{ characterId: string }>();
  const styleToken = useStyleToken();

  const characterConfig = characterMap[characterId!] || characterMap['pacha'];
  const ornamentsData = characterConfig.data;
  const characterImage = characterConfig.image;
  const characterTitle = characterConfig.title;
  const imageStyle = characterConfig.imageStyle;
  const svgStyle = characterConfig.svgStyle;

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
    </Flex>
  );
}

export default OrnamentsPage;
