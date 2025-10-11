import React, { useState } from 'react';
import { Calendar, Modal, Typography, Flex, Card } from 'antd';
import { ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { CulturalEvent, CalendarEventData } from '../../../types/events';
import useIsMobile from '../../../utils/isMobile';
import './styles.css';

const { Text, Title } = Typography;

interface EventsCalendarProps {
  eventData: CalendarEventData;
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({ eventData }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<CulturalEvent[]>([]);
  const isMobile = useIsMobile();

  // Get all events for the upcoming events list
  const upcomingEvents = Object.values(eventData)
    .flat()
    .filter(event => dayjs(event.date).isAfter(dayjs().subtract(1, 'day')))
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
    .slice(0, 5);

  const getCategoryColor = (category: CulturalEvent['category']) => {
    switch (category) {
      case 'kathakali':
        return '#ff4757';
      case 'kootiyattam':
        return '#5352ed';
      case 'general':
        return '#3742fa';
      default:
        return '#747d8c';
    }
  };

  // Custom cell render for calendar dates with events
  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const events = eventData[dateStr] || [];
    
    if (events.length === 0) return null;

    return (
      <div style={{ 
        position: 'relative',
        width: '100%',
        height: '100%'
      }}>
        <div style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: getCategoryColor(events[0].category),
        }} />
      </div>
    );
  };

  const onSelect = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD');
    const events = eventData[dateStr] || [];
    
    if (events.length > 0) {
      setSelectedDate(value);
      setSelectedEvents(events);
      setModalVisible(true);
    }
  };

  const formatTime = (time: string) => dayjs(`2000-01-01 ${time}`).format('h:mm A');

  // Custom header render for the calendar
  const headerRender = ({ value }: { value: Dayjs }) => {
    const month = value.format('MMMM YYYY');
    
    return (
      <div style={{ 
        padding: '20px 0',
        textAlign: 'center',
        background: '#2c3e50',
        color: 'white',
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '0'
      }}>
        {month}
      </div>
    );
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '900px', 
      margin: '0 auto',
      background: '#2c3e50',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Calendar Section */}
      <Calendar
        dateCellRender={dateCellRender}
        onSelect={onSelect}
        headerRender={headerRender}
        fullscreen={false}
        style={{
          background: '#2c3e50',
        }}
        className="dark-calendar"
      />

      {/* Upcoming Events Section */}
      <div style={{ 
        background: '#34495e',
        padding: '24px',
        borderTop: '1px solid #4a6275'
      }}>
        <Title 
          level={4} 
          style={{ 
            color: 'white', 
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 'normal'
          }}
        >
          Upcoming Kathakali Events
        </Title>
        
        <Flex vertical gap="12px">
          {upcomingEvents.map((event) => (
            <button 
              key={event.id}
              style={{
                background: '#2c3e50',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #4a6275',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#34495e';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#2c3e50';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => {
                setSelectedDate(dayjs(event.date));
                setSelectedEvents([event]);
                setModalVisible(true);
              }}
              type="button"
            >
              <Flex align="center" gap="16px">
                {/* Date Badge */}
                <div style={{
                  background: getCategoryColor(event.category),
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  {dayjs(event.date).format('MMM DD')}
                </div>
                
                {/* Event Details */}
                <Flex vertical style={{ flex: 1 }}>
                  <Text style={{ 
                    color: 'white', 
                    fontSize: '16px', 
                    fontWeight: '500',
                    marginBottom: '4px'
                  }}>
                    {event.title}
                  </Text>
                  <Text style={{ 
                    color: '#bdc3c7', 
                    fontSize: '14px'
                  }}>
                    {formatTime(event.time)} • {event.location || 'Location TBA'}
                  </Text>
                </Flex>
              </Flex>
            </button>
          ))}
        </Flex>
      </div>

      {/* Modal for event details */}
      <Modal
        title={
          <span style={{ color: '#2c3e50' }}>
            Events on {selectedDate?.format('MMMM D, YYYY')}
          </span>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={isMobile ? '90%' : 600}
      >
        <Flex vertical gap="medium">
          {selectedEvents.map((event) => (
            <Card 
              key={event.id}
              size="small"
              style={{ 
                borderLeft: `4px solid ${getCategoryColor(event.category)}`,
                borderRadius: '8px',
              }}
            >
              <Flex vertical gap="small">
                <Title level={5} style={{ margin: 0, color: '#2c3e50' }}>
                  {event.title}
                </Title>
                
                <Text style={{ color: '#666' }}>
                  {event.description}
                </Text>
                
                <Flex gap="medium" wrap>
                  <Flex align="center" gap="4px">
                    <ClockCircleOutlined style={{ color: '#1890ff' }} />
                    <Text strong>{formatTime(event.time)}</Text>
                  </Flex>
                  {event.location && (
                    <Flex align="center" gap="4px">
                      <EnvironmentOutlined style={{ color: '#52c41a' }} />
                      <Text>{event.location}</Text>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      </Modal>
    </div>
  );
};

export default EventsCalendar;