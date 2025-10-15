import { Card, Button, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import pachaImage from 'assets/images/kathakali-stock-images/pacha.png';
import minukkufemaleImage from 'assets/images/kathakali-stock-images/minukkufemale.png'

const characters = [
  { id: 'pacha', name: 'Pacha', image: pachaImage },
  { id: 'kathi', name: 'Kathi', image: minukkufemaleImage },
  // Add more
];

function OrnamentsCharacterListPage() {
  const navigate = useNavigate();
  return (
    <>
      <style>
        {`
          .character-card {
            border: none !important;
            transition: border 0.2s;  
          }
          .character-card:hover {
            border: 2px solid #fff !important;
          }
        `}
      </style>
      <Row gutter={24} justify="start">
        {characters.map((char) => (
          <Col key={char.id}>
            <Card
              className="character-card"
              hoverable
              style={{
                width: 440,
                margin: '1rem 0',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                overflow: 'hidden',
                background: '#232433',
                cursor: 'pointer',
              }}
              cover={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#585656ff',
                  }}
                >
                  <img
                    src={char.image}
                    alt={char.name}
                    style={{
                      height: 540,
                      objectFit: 'contain',
                      display: 'block',
                      ...(char.id === 'pacha' ? { transform: 'translate(25px, -30px)' } : {}),
                    }}
                  />
                </div>
              }
              onClick={() => navigate(`/cultures/kathakali/ornaments/${char.id}`)}
            >
              <div
                style={{
                  textAlign: 'center',
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  margin: '8px 0',
                  color: 'white',
                }}
              >
                {char.name}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default OrnamentsCharacterListPage;
