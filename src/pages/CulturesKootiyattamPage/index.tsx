import { Typography, Flex, Image, Button } from 'antd';
import kootiyattamImage from 'assets/images/kootiyattam-stock-images/kootiyattam2.jpg';
import { useStyleToken } from 'themeStyles';
import { useRef } from 'react';

const { Title, Text } = Typography;

function KootiyattamPage() {
  const styleToken = useStyleToken();
  const overviewRef = useRef<HTMLDivElement>(null);

  const handleScrollToSection = () => {
    if (overviewRef.current) {
      overviewRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Flex vertical align="center" style={{ marginBottom: '4rem' }}>
      <Title style={styleToken.pageHeadingTextStyle}>Kootiyattam</Title>
      <Image
        src={kootiyattamImage}
        alt="Kootiyattam"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      <Flex>
        <Button
          type="text"
          onClick={handleScrollToSection}
          style={{ fontSize: '1.25rem', color: '#ffffff' }}
        >
          Overview
        </Button>
      </Flex>

      <Flex vertical align="center" style={{ maxWidth: '75vw' }}>
        <Flex vertical ref={overviewRef}>
          <Title level={2} style={{ color: '#ffffff', marginBottom: '1rem' }}>
            Overview
          </Title>
          <Text style={{ fontSize: '1.5rem', color: '#ababab' }}>
            Kootiyattam is one of the oldest traditional theatre forms in India,
            originating in Kerala. It blends ancient Sanskrit theatre with local
            performing traditions, using highly stylized facial expressions,
            gestures, and elaborate costumes. Kootiyattam performances are
            traditionally conducted in temple theatres and follow an elaborate
            ritual structure, with each performance often spanning multiple
            days. Recognized by UNESCO as a masterpiece of the oral and
            intangible heritage of humanity, it stands as one of the most
            respected art forms with deep roots in Indian history and culture.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default KootiyattamPage;
