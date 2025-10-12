import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import kathakaliImage from 'assets/images/kathakali-stock-images/kathakali5.jpg';
import Button from 'components/Common/Button';
import EventsCalendar from 'components/Common/EventsCalendar';
import { Typography, Flex, Image } from 'antd';
import { useStyleToken, useColourToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';

const { Text, Title } = Typography;

function MainPage() {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  const styleToken = useStyleToken();
  const colourToken = useColourToken();
  const isMobile = useIsMobile();

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const calendarRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const pageHeadingStyle = isMobile ? styleToken.pageHeadingTextStyleMobile : styleToken.pageHeadingTextStyle;
  const subtitleStyle = isMobile ? styleToken.subtitleTextStyleMobile : styleToken.subtitleTextStyle;

  // Intersection Observer for scroll animations
  useEffect(() => {
    const currentCalendarRef = calendarRef.current;
    const currentHeroRef = heroRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === currentCalendarRef) {
            if (entry.isIntersecting) {
              setIsCalendarVisible(true);
            } else {
              setIsCalendarVisible(false);
            }
          }
          
          if (entry.target === currentHeroRef) {
            if (entry.isIntersecting) {
              setIsHeroVisible(true);
            } else {
              setIsHeroVisible(false);
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    if (currentCalendarRef) {
      observer.observe(currentCalendarRef);
    }
    
    if (currentHeroRef) {
      observer.observe(currentHeroRef);
    }

    return () => {
      if (currentCalendarRef) {
        observer.unobserve(currentCalendarRef);
      }
      if (currentHeroRef) {
        observer.unobserve(currentHeroRef);
      }
    };
  }, []);

  const heroSectionStyle = {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative' as const,
  };

  const scrollIndicatorStyle = {
    position: 'absolute' as const,
    bottom: isMobile ? '3rem' : '4rem',
    left: '50%',
    transform: 'translateX(-50%)',
    color: colourToken.white,
    fontSize: '14px',
    textAlign: 'center' as const,
    animation: 'bounce 2s infinite',
    zIndex: 10,
  };

  const calendarSectionStyle = {
    width: '100%',
    padding: isMobile ? '4rem 1rem' : '6rem 2rem',
    transform: isCalendarVisible ? 'translateY(0) scale(1)' : 'translateY(100px) scale(0.95)',
    opacity: isCalendarVisible ? 1 : 0,
    transition: 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  return (
    <>
      {/* Add CSS animation keyframes */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateX(-50%) translateY(0);
            }
            40% {
              transform: translateX(-50%) translateY(-10px);
            }
            60% {
              transform: translateX(-50%) translateY(-5px);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes pulse {
            0% {
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            50% {
              box-shadow: 0 25px 70px rgba(219, 42, 107, 0.4);
            }
            100% {
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
          }
          
          .hero-content {
            animation: fadeInUp 1s ease-out;
          }
          
          .hero-image {
            animation: fadeInUp 1s ease-out 0.3s both;
          }

          .hero-text-left {
            animation: slideInLeft 1s ease-out 0.2s both;
          }

          .hero-image-right {
            animation: slideInRight 1.2s ease-out 0.4s both, pulse 3s ease-in-out 2s infinite;
          }

          .calendar-title {
            animation: scaleIn 0.8s ease-out;
          }

          .calendar-description {
            animation: fadeInUp 0.8s ease-out 0.2s both;
          }

          .calendar-container {
            animation: fadeInUp 1s ease-out 0.4s both;
          }
        `}
      </style>

      {/* Hero Section */}
      <div ref={heroRef} style={heroSectionStyle}>
        <div style={{ width: '100%', padding: isMobile ? '0 1rem 0 2rem' : '0 3rem 0 4rem' }}>
          <Flex vertical align="center" style={{ textAlign: 'center', marginBottom: isMobile ? '1.5rem' : '2rem' }}>
            <Title 
              style={{
                ...styleToken.pageHeadingTextStyle,
                fontSize: isMobile ? '3rem' : '4.5rem',
                marginBottom: isMobile ? '1rem' : '1.5rem',
                background: `linear-gradient(45deg, ${colourToken.white}, ${colourToken.pinkLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 'bold',
              }}
              className={isHeroVisible ? "hero-content" : ""}
            >
              Welcome to KathakalAI
            </Title>
          </Flex>
          
          <Flex align="center" gap={isMobile ? "3rem" : "4rem"} vertical={isMobile} style={{ width: '100%' }}>
            <Flex vertical align={isMobile ? "center" : "left"} style={{ flex: 1 }} className={isHeroVisible ? "hero-text-left" : ""}>
              <Title style={{
                ...pageHeadingStyle,
                fontSize: isMobile ? '2rem' : '3rem',
                marginBottom: isMobile ? '1rem' : '1.5rem',
                textAlign: isMobile ? 'center' : 'left',
                fontWeight: 'bold',
              }}>
                Discover the World of Cultures
              </Title>
              <Text style={{
                ...subtitleStyle,
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                marginBottom: isMobile ? '2rem' : '2.5rem',
                maxWidth: '600px',
                lineHeight: 1.6,
                textAlign: isMobile ? 'center' : 'left',
              }}>
                Experience the beauty and diversity of cultures from all around the
                globe through our AI-powered cultural recognition platform.
              </Text>
              <Flex gap="large" vertical={isMobile} style={{ width: isMobile ? '100%' : 'auto' }}>
                <Button onClick={() => handleNavigate('/cultures')}>
                  Explore Cultures
                </Button>
                <Button onClick={() => handleNavigate('/about-us')}>
                  Learn About Us
                </Button>
              </Flex>
            </Flex>
            
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              justifyContent: 'center',
              marginRight: isMobile ? '1rem' : '2rem'
            }} className={isHeroVisible ? "hero-image-right" : ""}>
              <Image
                src={kathakaliImage}
                alt="Cultural Heritage"
                style={{ 
                  width: '100%',
                  height: 'auto', 
                  borderRadius: '20px',
                  boxShadow: `0 20px 60px rgba(0, 0, 0, 0.3)`,
                  border: `3px solid ${colourToken.pinkLight}`,
                  transition: 'transform 0.3s ease',
                }}
                preview={false}
              />
            </div>
          </Flex>
        </div>
        
        {/* Scroll Indicator */}
        <div style={scrollIndicatorStyle}>
          <div style={{ 
            marginBottom: '8px', 
            fontSize: '13px', 
            opacity: 0.9,
            fontWeight: '500',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Scroll to explore events
          </div>
          <div style={{ 
            fontSize: '24px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
          }}>⬇</div>
        </div>
      </div>

      {/* Cultural Events Calendar Section */}
      <div ref={calendarRef} style={calendarSectionStyle}>
        <Flex 
          vertical 
          align="center" 
          style={{ 
            width: '100%',
          }}
        >
          <Title 
            level={2} 
            style={{
              ...pageHeadingStyle, 
              marginBottom: '1rem', 
              textAlign: 'center',
              color: colourToken.white,
              fontSize: isMobile ? '2rem' : '3rem',
              fontWeight: 'bold',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}
            className="calendar-title"
          >
            Upcoming Cultural Events
          </Title>
          <Text 
            style={{
              ...subtitleStyle, 
              textAlign: 'center', 
              marginBottom: '3rem', 
              maxWidth: '800px',
              fontSize: isMobile ? '1.1rem' : '1.3rem',
              color: colourToken.white,
              lineHeight: 1.6,
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }}
            className="calendar-description"
          >
            Discover and participate in various cultural performances and workshops
          </Text>
          <div 
            style={{ 
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
            className="calendar-container"
          >
            <EventsCalendar events={[]}/>
          </div>
        </Flex>
      </div>
    </>
  );
}

export default MainPage;
