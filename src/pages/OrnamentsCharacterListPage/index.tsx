import { Card, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import useIsMobile from 'utils/isMobile';
import pachaImage from 'assets/images/kathakali-stock-images/pacha.png';
import minukkufemaleImage from 'assets/images/kathakali-stock-images/minukkufemale.png';
import chuvannathadiImage from 'assets/images/kathakali-stock-images/chuvannathadi.png';
import kathiImage from 'assets/images/kathakali-stock-images/kathi.png';
import karimaleImage from 'assets/images/kathakali-stock-images/karimale.png';
import krishnaImage from 'assets/images/kathakali-stock-images/krishna.png';
import rowdrabheemanImage from 'assets/images/kathakali-stock-images/rowdrabheeman.png';
import { LeftOutlined } from '@ant-design/icons';  

const characters = [
  { id: 'pacha', name: 'Pacha', image: pachaImage },
  { id: 'minukkufemale', name: 'Minukku Female', image: minukkufemaleImage },
  { id: 'chuvannathadi', name: 'Chuvanna Thadi (Red Beard)', image: chuvannathadiImage },
  { id: 'kathi', name: 'Kathi', image: kathiImage },
  { id: 'karimale', name: 'Kari Male', image: karimaleImage },
  { id: 'krishna', name: 'Krishna', image: krishnaImage },
  { id: 'rowdrabheeman', name: 'Rowdrabheeman', image: rowdrabheemanImage },
];

const imageTransforms: Record<string, { transform: string }> = {
  pacha: { transform: 'translate(25px, -40px) scale(1.1)' },
  minukkufemale: { transform: 'scale(0.95)' },
  chuvannathadi: { transform: 'translate(10px, -10px)' },
  kathi: { transform: 'translate(10px, -10px)' },
  karimale: { transform: 'translate(0, -30px) scale(1.1)' },
  krishna: { transform: 'translate(0px, 0px) scale(1.1)' },
  rowdrabheeman: { transform: 'scale(1.05)' },
};

function OrnamentsCharacterListPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
      <Row
        gutter={[isMobile ? 12 : 24, isMobile ? 12 : 24]}
        justify="start"
        style={{ paddingTop: isMobile ? 16 : 0 }}
      >
        {characters.map((char) => (
          <Col
            key={char.id}
            xs={12}
            sm={12}
            md={8}
            lg={6}
            xl={6}
          >
            <Card
              className="character-card"
              hoverable
              style={{
                width: '100%',
                margin: isMobile ? 0 : '1rem 0',
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
                    overflow: 'hidden',
                    height: isMobile ? 180 : 'clamp(200px, 25vw, 400px)',
                  }}
                >
                  <img
                    src={char.image}
                    alt={char.name}
                    style={{
                      height: isMobile ? 180 : 'clamp(200px, 25vw, 400px)',
                      objectFit: 'contain',
                      display: 'block',
                      ...(isMobile ? {} : (imageTransforms[char.id] || {})),
                    }}
                  />
                </div>
              }
              onClick={() => navigate(`/cultures/kathakali/ornaments/${char.id}`)}
            >
              <div
                style={{
                  textAlign: 'center',
                  fontSize: isMobile ? '0.85rem' : '1.3rem',
                  fontWeight: 600,
                  margin: '4px 0',
                  color: 'white',
                }}
              >
                {char.name}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Button
        icon={<LeftOutlined />}
        onClick={() => navigate('/cultures/kathakali')}
        style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 1000,
        }}
      >
        Back
      </Button>

    </>
  );
}

export default OrnamentsCharacterListPage;
