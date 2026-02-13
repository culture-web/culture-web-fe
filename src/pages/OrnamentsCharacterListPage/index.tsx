import { Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import pachaImage from 'assets/images/kathakali-stock-images/pacha.png';
import minukkufemaleImage from 'assets/images/kathakali-stock-images/minukkufemale.png'
import chuvannathadiImage from 'assets/images/kathakali-stock-images/chuvannathadi.png'
import kathiImage from 'assets/images/kathakali-stock-images/kathi.png'
import karimaleImage from 'assets/images/kathakali-stock-images/karimale.png'
import krishnaImage from 'assets/images/kathakali-stock-images/krishna.png'
import rowdrabheemanImage from 'assets/images/kathakali-stock-images/rowdrabheeman.png'


const characters = [
  { id: 'pacha', name: 'Pacha', image: pachaImage },
  { id: 'minukkufemale', name: 'Minukku Female', image: minukkufemaleImage },
  { id: 'chuvannathadi', name: 'Chuvanna Thadi (Red Beard)', image: chuvannathadiImage},
  { id: 'kathi', name: 'Kathi', image: kathiImage },
  { id: 'karimale', name: 'Kari Male', image: karimaleImage },
  { id: 'krishna', name: 'Krishna', image: krishnaImage },
  { id: 'rowdrabheeman', name: 'Rowdrabheeman', image: rowdrabheemanImage },    
  // Add more
];

const imageTransforms: Record<string, { transform: string }> = {
  pacha: { transform: 'translate(25px, -40px) scale(1.1)' },
  minukkufemale: { transform: 'scale(0.95)'},
  chuvannathadi: { transform: 'translate(10px, -10px)'},
  kathi: { transform: 'translate(10px, -10px)' },
  karimale: { transform: 'translate(0, -30px) scale(1.1)' },
  krishna: { transform: 'translate(0px, 0px) scale(1.1)' },
  rowdrabheeman: {transform: 'scale(1.05)'}
};


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
                      ...(imageTransforms[char.id] || {})                    }}
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
