import { Typography, Flex, Image, Button } from 'antd';
import pachaImage from 'assets/images/kathakali-stock-images/pacha1.png';
import { useStyleToken } from 'themeStyles';
import { useState } from 'react';

const { Title, Text } = Typography;

// To do: Use SVG with custom path or polygon tomake the border more precise/ CSS Clip-Path

function OrnamentsPage() {
      const ornaments = [
    {
      id: 'headdress',
      name: 'Kireetam',
      description: 'An elaborate and ornate headgear unique to Kathakali Pacha characters.',
      style: { top: '3%', left: '34%', width: '32%', height: '22%' },
    },
  ];

  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: 412,    
        margin: '40px auto',
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
        viewBox="0 0 412 622" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <path
          d="M 198.19999980926514 68.9749984741211 L 196.19999980926514 72.9749984741211 L 183.19999980926514 76.9749984741211 L 166.19999980926514 86.9749984741211 L 155.19999980926514 98.9749984741211 L 148.19999980926514 117.9749984741211 L 144.19999980926514 135.9749984741211 L 148.19999980926514 155.9749984741211 L 158.19999980926514 171.9749984741211 L 174.19999980926514 182.9749984741211 L 188.19999980926514 170.9749984741211 L 203.19999980926514 168.9749984741211 L 228.19999980926514 169.9749984741211 L 234.19999980926514 181.9749984741211 L 246.19999980926514 175.9749984741211 L 257.19999980926514 160.9749984741211 L 263.19999980926514 149.9749984741211 L 264.19999980926514 127.9749984741211 L 259.19999980926514 107.9749984741211 L 250.19999980926514 93.9749984741211 L 236.19999980926514 80.9749984741211 L 210.19999980926514 72.9749984741211 L 198.19999980926514 67.9749984741211 Z" // Rounded coordinates from your SVG path
          fill="transparent"
          stroke={hovered === 'headdress' ? 'gold' : 'transparent'}
          strokeWidth={3}
          pointerEvents="auto"
          onMouseEnter={() => setHovered('headdress')}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'pointer', transition: 'stroke 0.2s ease' }}
        />
      </svg>

      {hovered === 'headdress' && (
        <div
          style={{
            position: 'absolute',
            top: '12%',     
            left: '88%',    
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            pointerEvents: 'none',
            minWidth: '220px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
            zIndex: 10,
          }}
        >
          <strong>Kireetam</strong>
          <div style={{ fontSize: '0.9em' }}>
            An elaborate and ornate headgear unique to Kathakali Pacha characters.
          </div>
        </div>
      )}
      {/* ornaments.map(({ id, name, description, style }) => (
        <div
          key={id}
          style={{
            position: 'absolute',
            border: hovered === id ? '3px solid gold' : '2px solid transparent',
            borderRadius: '16px',
            boxShadow:
              hovered === id
                ? '0 0 8px 4px rgba(255,215,0,0.38)'
                : 'none',
            cursor: 'pointer',
            zIndex: 2,
            ...style,
            transition: 'border 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={() => setHovered(id)}
          onMouseLeave={() => setHovered(null)}
        > 
          {hovered === id && (
            <div
              style={{
                position: 'absolute',
                top: '-60px',
                left: '-10px',
                minWidth: '180px',
                background: 'rgba(0,0,0,0.92)',
                color: 'white',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.20)',
                padding: '10px',
                zIndex: 3,
                fontSize: '1rem',
              }}
            >
              <strong>{name}</strong>
              <div style={{ fontSize: '0.92em', marginTop: '2px' }}>{description}</div>
            </div>
          )}
        </div>
      )) */} 
    </div>
  );
    return (
    <Flex style={{ width: '50%' }}>
      <Image src={pachaImage} alt="pacha" preview={false} />
    </Flex>

    

    )
}

export default OrnamentsPage;