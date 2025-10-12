import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import kathakaliImage from 'assets/images/kathakali-stock-images/kathakali5.jpg';
import Button from 'components/Common/Button';
import EventsCalendar from 'components/Common/EventsCalendar';
import { Typography, Flex, Image } from 'antd';
import { useStyleToken, useColourToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';
import BACKEND_URI from 'configs/env.config';

const { Text, Title } = Typography;

interface Event {
  id: number;
  title: string;
  description: string | null;
  start_time: string; // ISO 8601 format with timezone
  end_time: string | null; // ISO 8601 format with timezone
  location: string | null;
  url: string; // Unique URL for the event
  category: string | null;
  scraped_at: string; // ISO 8601 format with timezone
}

interface ApiResponse {
  success: boolean;
  data: Event[];
  pagination: {
    limit: number;
    offset: number;
    count: number;
  };
}

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
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
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

  // Sample events for fallback when API is not available
  const getSampleEvents = (): Event[] => [
    {
      id: 1,
      title: 'Kathakali Performance - Ramayana',
      start_time: new Date(2025, 9, 15, 19, 0).toISOString(), // October 15, 2025, 7:00 PM
      end_time: new Date(2025, 9, 15, 21, 0).toISOString(), // October 15, 2025, 9:00 PM
      location: 'Cultural Center Main Hall',
      description: 'Experience the epic tale of Ramayana through traditional Kathakali dance-drama.',
      category: 'Kathakali',
      url: 'kathakali-ramayana-2025',
      scraped_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Kootiyattam Classical Theater Workshop',
      start_time: new Date(2025, 9, 18, 15, 0).toISOString(), // October 18, 2025, 3:00 PM
      end_time: new Date(2025, 9, 20, 17, 0).toISOString(), // October 20, 2025, 5:00 PM (3-day workshop)
      location: 'Heritage Theater',
      description: 'Learn about the ancient Sanskrit theater form recognized by UNESCO.',
      category: 'Kootiyattam',
      url: 'kootiyattam-workshop-2025',
      scraped_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Bharatanatyam Evening Recital',
      start_time: new Date(2025, 9, 22, 18, 30).toISOString(), // October 22, 2025, 6:30 PM
      end_time: new Date(2025, 9, 22, 20, 30).toISOString(), // October 22, 2025, 8:30 PM
      location: 'Dance Studio A',
      description: 'Classical Tamil dance performance featuring traditional compositions.',
      category: 'Bharatanatyam',
      url: 'bharatanatyam-recital-2025',
      scraped_at: new Date().toISOString()
    },
    {
      id: 4,
      title: 'Kathakali Character Recognition Demo',
      start_time: new Date(2025, 9, 28, 18, 0).toISOString(), // October 28, 2025, 6:00 PM
      end_time: new Date(2025, 9, 28, 19, 30).toISOString(), // October 28, 2025, 7:30 PM
      location: 'Innovation Lab',
      description: 'Interactive demonstration of AI-powered Kathakali character recognition.',
      category: 'Kathakali',
      url: 'kathakali-ai-demo-2025',
      scraped_at: new Date().toISOString()
    },
    {
      id: 5,
      title: 'Odissi Dance Festival',
      start_time: new Date(2025, 10, 2, 16, 0).toISOString(), // November 2, 2025, 4:00 PM
      end_time: new Date(2025, 10, 4, 20, 0).toISOString(), // November 4, 2025, 8:00 PM (3-day festival)
      location: 'Cultural Center Studio B',
      description: 'Three-day festival celebrating Odissi, the classical dance of Odisha.',
      category: 'Odissi',
      url: 'odissi-festival-2025',
      scraped_at: new Date().toISOString()
    },
    {
      id: 6,
      title: 'Traditional Carnatic Music Concert',
      start_time: new Date(2025, 10, 5, 19, 30).toISOString(), // November 5, 2025, 7:30 PM
      end_time: new Date(2025, 10, 5, 22, 0).toISOString(), // November 5, 2025, 10:00 PM
      location: 'Heritage Auditorium',
      description: 'An evening of classical South Indian music featuring renowned artists.',
      category: 'Music',
      url: 'carnatic-concert-2025',
      scraped_at: new Date().toISOString()
    }
  ];

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        setEventsError(null);
        
        const url = new URL('/api/events', BACKEND_URI);
        url.searchParams.append('upcoming', 'true');
        url.searchParams.append('limit', '50');
        url.searchParams.append('offset', '0');

        const response = await fetch(url.toString());
        
        if (!response.ok) {
          // If endpoint doesn't exist, fall back to sample data
          if (response.status === 404) {
            console.warn('API endpoint /api/events not found, using sample data');
            setEvents(getSampleEvents());
            setEventsLoading(false);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // If response is not JSON (likely HTML error page), fall back to sample data
          console.warn('API endpoint returned non-JSON response, using sample data');
          setEvents(getSampleEvents());
          setEventsLoading(false);
          return;
        }
        
        const data: ApiResponse = await response.json();

        console.log("events: ", data);
        
        if (data.success) {
          setEvents(data.data);
        } else {
          throw new Error('API returned success: false');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        // Fall back to sample data on any error
        console.warn('Falling back to sample data due to API error');
        setEvents(getSampleEvents());
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
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
            <EventsCalendar 
              events={events}
              loading={eventsLoading}
              error={eventsError}
            />
          </div>
        </Flex>
      </div>
    </>
  );
}

export default MainPage;
