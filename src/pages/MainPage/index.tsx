import { useNavigate } from 'react-router-dom';
import kathakaliImage from 'assets/images/kathakali-stock-images/kathakali5.jpg';
import Button from 'components/Common/Button';
import { Typography, Flex, Image, Grid } from 'antd';
import { useStyleToken } from 'themeStyles';
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

function MainPage() {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  const styleToken = useStyleToken();
  const screens = useBreakpoint();
  const isMobile = screens.xs;

  return (
    <Flex vertical>
      <Title style={styleToken.pageHeadingStyle}>Home</Title>
      <Flex align="center" gap="large" vertical={isMobile}>
        <Flex vertical align="center">
          <Title style={styleToken.pageHeadingStyle}>
            Discover the World of Cultures at KathakalAI
          </Title>
          <Text style={styleToken.subtitleTextStyle}>
            Experience the beauty and diversity of cultures from all around the
            globe.
          </Text>
          <Flex justify="center" gap="large">
            <Button onClick={() => handleNavigate('/cultures')}>
              Get Started
            </Button>
            <Button onClick={() => handleNavigate('/about-us')}>
              Learn More →
            </Button>
          </Flex>
        </Flex>
        <Image
          src={kathakaliImage}
          alt="Cultural"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Flex>
    </Flex>
  );
}

export default MainPage;
