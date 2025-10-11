import { useNavigate } from 'react-router-dom';
import kathakaliImage from 'assets/images/kathakali-stock-images/kathakali5.jpg';
import Button from 'components/Common/Button';
import EventsCalendar from 'components/Common/EventsCalendar';
import { Typography, Flex, Image } from 'antd';
import { useStyleToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';

const { Text, Title } = Typography;

function MainPage() {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  const styleToken = useStyleToken();
  const isMobile = useIsMobile();

  const pageHeadingStyle = isMobile ? styleToken.pageHeadingTextStyleMobile : styleToken.pageHeadingTextStyle;
  const subtitleStyle = isMobile ? styleToken.subtitleTextStyleMobile : styleToken.subtitleTextStyle;

  return (
    <Flex vertical align="center" style={{ width: '100%' }}>
      <Title style={styleToken.pageHeadingTextStyle}>Home</Title>
      <Flex align="center" gap="3rem" vertical={isMobile}>
        <Flex vertical align="left">
          <Title style={pageHeadingStyle}>
            Discover the World of Cultures at KathakalAI
          </Title>
          <Text style={subtitleStyle}>
            Experience the beauty and diversity of cultures from all around the
            globe.
          </Text>
          <Flex gap="large" vertical={isMobile}>
            <Button onClick={() => handleNavigate('/cultures')}>
              Learn More About Other Cultures
            </Button>
            <Button onClick={() => handleNavigate('/about-us')}>
              Learn More About KathakalAI
            </Button>
          </Flex>
        </Flex>
        <Image
          src={kathakaliImage}
          alt="Cultural"
          style={{ 
            maxWidth: '100%', 
            height: 'auto', 
            borderRadius: '8px', // Optional for rounded corners
            border: '2px solid #ccc', // Added border property
            marginBottom: isMobile ? '2rem' : '0', // Added margin bottom for mobile
           }}
          preview={false}
        />
      </Flex>

      {/* Cultural Events Calendar Section */}
      <Flex 
        vertical 
        align="center" 
        style={{ 
          width: '100%', 
          marginTop: '4rem',
          marginBottom: '2rem'
        }}
      >
        <Title level={2} style={pageHeadingStyle}>
          Upcoming Cultural Events
        </Title>
        <Text style={subtitleStyle}>
          Discover and participate in various cultural performances and workshops
        </Text>
        <div style={{ width: '100%', maxWidth: '1000px', marginTop: '2rem' }}>
          <EventsCalendar />
        </div>
      </Flex>
    </Flex>
  );
}

export default MainPage;
