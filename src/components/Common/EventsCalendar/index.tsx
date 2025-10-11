import { useState } from 'react';
import { useColourToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';

interface Event {
  id: string | number;
  title: string;
  date: Date;
  time?: string;
  venue?: string;
  description?: string;
  type?: string;
}

interface EventsCalendarProps {
  events?: Event[];
}

function EventsCalendar({ events = [] }: EventsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const colourToken = useColourToken();
  const isMobile = useIsMobile();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Styles
  const eventsCalendarStyle = {
    backgroundColor: colourToken.primary,
    borderRadius: '12px',
    padding: isMobile ? '16px' : '24px',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  };

  const calendarHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const navButtonStyle = {
    background: 'none',
    border: 'none',
    color: colourToken.white,
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'background-color 0.3s ease',
  };

  const monthYearStyle = {
    color: colourToken.white,
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 600,
    margin: 0,
  };

  const calendarGridStyle = {
    marginBottom: '24px',
  };

  const daysOfWeekHeaderStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px',
    marginBottom: '8px',
  };

  const dayOfWeekStyle = {
    color: colourToken.gray,
    fontSize: '14px',
    fontWeight: 500,
    textAlign: 'center' as const,
    padding: '8px',
  };

  const daysGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px',
  };

  const calendarDayStyle = {
    backgroundColor: '#2b2d38',
    borderRadius: '8px',
    padding: isMobile ? '8px 4px' : '12px 8px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    minHeight: isMobile ? '50px' : '60px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const calendarDayHoverStyle = {
    backgroundColor: '#3a3c49',
    transform: 'translateY(-2px)',
  };

  const calendarDaySelectedStyle = {
    backgroundColor: colourToken.pinkLight,
    color: colourToken.white,
  };

  const calendarDayHasEventsStyle = {
    border: `2px solid ${colourToken.pinkLight}`,
  };

  const dayNumberStyle = {
    color: colourToken.white,
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: 500,
  };

  const eventDotStyle = {
    width: '6px',
    height: '6px',
    backgroundColor: colourToken.pinkLight,
    borderRadius: '50%',
    marginTop: '4px',
  };

  const eventDotSelectedStyle = {
    backgroundColor: colourToken.white,
  };

  const emptyDayStyle = {
    minHeight: isMobile ? '50px' : '60px',
  };

  const eventDetailsStyle = {
    backgroundColor: '#2b2d38',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '24px',
  };

  const eventCardStyle = {
    backgroundColor: colourToken.primary,
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    borderLeft: `4px solid ${colourToken.pinkLight}`,
  };

  const eventTitleStyle = {
    color: colourToken.white,
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: 600,
  };

  const eventTimeStyle = {
    color: colourToken.pinkLight,
    margin: '0 0 4px 0',
    fontSize: '14px',
    fontWeight: 500,
  };

  const eventVenueStyle = {
    color: colourToken.gray,
    margin: '0 0 8px 0',
    fontSize: '14px',
  };

  const eventDescriptionStyle = {
    color: colourToken.gray,
    margin: 0,
    fontSize: '14px',
    lineHeight: 1.5,
  };

  const upcomingEventsStyle = {
    backgroundColor: '#2b2d38',
    borderRadius: '8px',
    padding: '20px',
  };

  const eventsListStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'column' as const,
    gap: '12px',
  };

  const upcomingEventCardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '8px' : '16px',
    backgroundColor: colourToken.primary,
    borderRadius: '8px',
    padding: '16px',
    transition: 'transform 0.3s ease',
    flexDirection: (isMobile ? 'column' : 'row') as 'column' | 'row',
    textAlign: (isMobile ? 'center' : 'left') as 'center' | 'left',
  };

  const eventDateStyle = {
    backgroundColor: colourToken.pinkLight,
    color: colourToken.white,
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'center' as const,
    minWidth: isMobile ? 'auto' : '60px',
  };

  const eventInfoStyle = {
    flex: 1,
  };

  const eventInfoTitleStyle = {
    color: colourToken.white,
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: 500,
  };

  const eventInfoTextStyle = {
    color: colourToken.gray,
    margin: 0,
    fontSize: '14px',
  };

  // Sample cultural events data - includes various Indian cultural performances
  const sampleEvents: Event[] = [
    {
      id: 1,
      title: 'Kathakali Performance - Ramayana',
      date: new Date(2025, 9, 15), // October 15, 2025
      time: '7:00 PM',
      venue: 'Cultural Center Main Hall',
      description: 'Experience the epic tale of Ramayana through traditional Kathakali dance-drama.',
      type: 'Kathakali'
    },
    {
      id: 2,
      title: 'Kootiyattam Classical Theater Workshop',
      date: new Date(2025, 9, 18), // October 18, 2025
      time: '3:00 PM',
      venue: 'Heritage Theater',
      description: 'Learn about the ancient Sanskrit theater form recognized by UNESCO.',
      type: 'Kootiyattam'
    },
    {
      id: 3,
      title: 'Bharatanatyam Evening Recital',
      date: new Date(2025, 9, 22), // October 22, 2025
      time: '6:30 PM',
      venue: 'Dance Studio A',
      description: 'Classical Tamil dance performance featuring traditional compositions.',
      type: 'Bharatanatyam'
    },
    {
      id: 4,
      title: 'Kathakali Character Recognition Demo',
      date: new Date(2025, 9, 28), // October 28, 2025
      time: '6:00 PM',
      venue: 'Innovation Lab',
      description: 'Interactive demonstration of AI-powered Kathakali character recognition.',
      type: 'Kathakali'
    },
    {
      id: 5,
      title: 'Odissi Dance Masterclass',
      date: new Date(2025, 10, 2), // November 2, 2025
      time: '4:00 PM',
      venue: 'Cultural Center Studio B',
      description: 'Master class in Odissi, the classical dance of Odisha.',
      type: 'Odissi'
    },
    {
      id: 6,
      title: 'Traditional Carnatic Music Concert',
      date: new Date(2025, 10, 5), // November 5, 2025
      time: '7:30 PM',
      venue: 'Heritage Auditorium',
      description: 'An evening of classical South Indian music featuring renowned artists.',
      type: 'Music'
    },
    {
      id: 7,
      title: 'Koodiyattam Performance - Anguliyankam',
      date: new Date(2025, 10, 12), // November 12, 2025
      time: '8:00 PM',
      venue: 'Traditional Theater',
      description: 'Traditional Sanskrit drama performance in the ancient Koodiyattam style.',
      type: 'Kootiyattam'
    },
    {
      id: 8,
      title: 'Indian Classical Arts Festival',
      date: new Date(2025, 10, 20), // November 20, 2025
      time: '2:00 PM',
      venue: 'Main Auditorium',
      description: 'A day-long festival celebrating various Indian classical performing arts.',
      type: 'Festival'
    }
  ];

  const allEvents = [...events, ...sampleEvents];

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getEventsForDate = (date: Date) => allEvents.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i += 1) {
      days.push(<div key={`empty-${i}`} style={emptyDayStyle} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const hasEvents = dayEvents.length > 0;
      const isSelected = selectedDate && 
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      const combinedDayStyle = {
        ...calendarDayStyle,
        ...(hasEvents ? calendarDayHasEventsStyle : {}),
        ...(isSelected ? calendarDaySelectedStyle : {}),
      };

      days.push(
        <div
          key={day}
          style={combinedDayStyle}
          onClick={() => setSelectedDate(date)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setSelectedDate(date);
            }
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              Object.assign(e.currentTarget.style, calendarDayHoverStyle);
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              Object.assign(e.currentTarget.style, {
                backgroundColor: '#2b2d38',
                transform: 'none',
              });
            }
          }}
          role="button"
          tabIndex={0}
        >
          <span style={dayNumberStyle}>{day}</span>
          {hasEvents && <div style={isSelected ? {...eventDotStyle, ...eventDotSelectedStyle} : eventDotStyle} />}
        </div>
      );
    }

    return days;
  };

  const renderEventDetails = () => {
    if (!selectedDate) return null;

    const dayEvents = getEventsForDate(selectedDate);
    
    if (dayEvents.length === 0) {
      return (
        <div style={eventDetailsStyle}>
          <h4 style={{ color: colourToken.white, margin: '0 0 16px 0', fontSize: '18px' }}>
            No events on {selectedDate.toLocaleDateString()}
          </h4>
        </div>
      );
    }

    return (
      <div style={eventDetailsStyle}>
        <h4 style={{ color: colourToken.white, margin: '0 0 16px 0', fontSize: '18px' }}>
          Events on {selectedDate.toLocaleDateString()}
        </h4>
        {dayEvents.map(event => (
          <div key={event.id} style={{...eventCardStyle, marginBottom: dayEvents.indexOf(event) === dayEvents.length - 1 ? 0 : '12px'}}>
            <h5 style={eventTitleStyle}>{event.title}</h5>
            <p style={eventTimeStyle}>{event.time}</p>
            <p style={eventVenueStyle}>{event.venue}</p>
            <p style={eventDescriptionStyle}>{event.description}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={eventsCalendarStyle}>
      <div style={calendarHeaderStyle}>
        <button 
          type="button"
          style={navButtonStyle}
          onClick={() => navigateMonth(-1)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colourToken.pinkLight;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          ‹
        </button>
        <h3 style={monthYearStyle}>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button 
          type="button"
          style={navButtonStyle}
          onClick={() => navigateMonth(1)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colourToken.pinkLight;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          ›
        </button>
      </div>

      <div style={calendarGridStyle}>
        <div style={daysOfWeekHeaderStyle}>
          {daysOfWeek.map(day => (
            <div key={day} style={dayOfWeekStyle}>{day}</div>
          ))}
        </div>
        <div style={daysGridStyle}>
          {renderCalendarDays()}
        </div>
      </div>

      {renderEventDetails()}

      <div style={upcomingEventsStyle}>
        <h4 style={{ color: colourToken.white, margin: '0 0 16px 0', fontSize: '18px' }}>
          Upcoming Cultural Events
        </h4>
        <div style={eventsListStyle}>
          {allEvents
            .filter(event => new Date(event.date) > new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 4)
            .map(event => (
              <div 
                key={event.id} 
                style={upcomingEventCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={eventDateStyle}>
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div style={eventInfoStyle}>
                  <h5 style={eventInfoTitleStyle}>{event.title}</h5>
                  <p style={eventInfoTextStyle}>{event.time} • {event.venue}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default EventsCalendar;