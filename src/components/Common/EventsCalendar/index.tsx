import { useState } from 'react';
import { useColourToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';

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

interface EventsCalendarProps {
  events: Event[];
  loading: boolean;
  error: string | null;
}

function EventsCalendar({ events, loading = false, error = null }: EventsCalendarProps) {
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
    width: '100%',
    backgroundColor: 'transparent',
  };

  const calendarMainContentStyle = {
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(245, 245, 245, 0.8) 100%)`,
    backdropFilter: 'blur(15px)',
    borderRadius: '16px',
    padding: isMobile ? '20px' : '32px',
    marginBottom: '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    border: `1px solid rgba(255, 255, 255, 0.3)`,
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
    color: colourToken.primary,
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'background-color 0.3s ease',
  };

  const monthYearStyle = {
    color: colourToken.primary,
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
    backgroundColor: colourToken.lightGray,
    borderRadius: '8px',
    padding: isMobile ? '4px 2px' : '6px 4px',
    textAlign: 'left' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    minHeight: isMobile ? '80px' : '100px',
    display: 'flex',
    flexDirection: 'column' as const,
    border: '1px solid transparent',
    overflow: 'hidden',
  };

  const calendarDayHoverStyle = {
    backgroundColor: colourToken.white,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  const calendarDaySelectedStyle = {
    backgroundColor: colourToken.pinkLight,
    color: colourToken.white,
    border: `1px solid ${colourToken.pink}`,
  };

  const calendarDayHasEventsStyle = {
    border: `2px solid ${colourToken.pinkLight}`,
    backgroundColor: colourToken.white,
  };

  const dayNumberStyle = {
    color: colourToken.primary,
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: 500,
    marginBottom: '4px',
    alignSelf: 'flex-start',
  };

  const eventBlockStyle = {
    backgroundColor: colourToken.pinkLight,
    color: colourToken.white,
    fontSize: isMobile ? '10px' : '11px',
    fontWeight: 500,
    padding: '2px 4px',
    marginBottom: '2px',
    borderRadius: '3px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const moreEventsStyle = {
    fontSize: isMobile ? '9px' : '10px',
    color: colourToken.gray,
    fontWeight: 500,
    padding: '1px 4px',
    cursor: 'pointer',
  };

  const emptyDayStyle = {
    minHeight: isMobile ? '50px' : '60px',
  };

  const eventDetailsStyle = {
    backgroundColor: colourToken.lightGray,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    border: `1px solid ${colourToken.gray}20`,
  };

  const eventCardStyle = {
    backgroundColor: colourToken.white,
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    borderLeft: `4px solid ${colourToken.pinkLight}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const eventTitleStyle = {
    color: colourToken.primary,
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
    color: colourToken.primary,
    margin: 0,
    fontSize: '14px',
    lineHeight: 1.5,
  };

  const upcomingEventsStyle = {
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(245, 245, 245, 0.8) 100%)`,
    backdropFilter: 'blur(15px)',
    borderRadius: '16px',
    padding: isMobile ? '20px' : '32px',
    marginTop: '2rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    border: `1px solid rgba(255, 255, 255, 0.3)`,
  };

  const upcomingEventsGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
    gridAutoRows: '1fr',
    gap: isMobile ? '16px' : '20px',
    marginTop: '1.5rem',
  };

  const upcomingEventCardStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 248, 248, 0.8) 100%)`,
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.3s ease',
    border: `1px solid rgba(255, 255, 255, 0.4)`,
    minHeight: '180px',
  };

  const eventDateStyle = {
    backgroundColor: colourToken.pinkLight,
    color: colourToken.white,
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'center' as const,
    alignSelf: 'flex-start',
  };

  const eventInfoStyle = {
    flex: 1,
    width: '100%',
  };

  const eventInfoTitleStyle = {
    color: colourToken.primary,
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: 600,
  };

  const eventInfoTextStyle = {
    color: colourToken.gray,
    margin: 0,
    fontSize: '14px',
  };

  // Use events from props
  const allEvents = events;

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // Helper functions for handling multi-day events
  const getEventStartDate = (event: Event) => new Date(event.start_time);
  const getEventEndDate = (event: Event) => event.end_time ? new Date(event.end_time) : new Date(event.start_time);
  
  const isEventOnDate = (event: Event, date: Date) => {
    const startDate = getEventStartDate(event);
    const endDate = getEventEndDate(event);
    
    // Check if the given date falls within the event's date range
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const eventStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const eventEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    
    return checkDate >= eventStart && checkDate <= eventEnd;
  };

  const getEventsForDate = (date: Date) => allEvents.filter(event => isEventOnDate(event, date));

  const getEventsByCategory = (eventsList: Event[]) => {
    const categories = ['Kathakali', 'Kootiyattam', 'Bharatanatyam', 'Odissi', 'Music', 'Other'];
    const colors = [colourToken.pinkLight, colourToken.pink, '#9C27B0', '#673AB7', '#3F51B5', '#607D8B'];
    
    return eventsList.map(event => ({
      ...event,
      color: colors[categories.indexOf(event.category || 'Other')] || colors[5]
    }));
  };

  const renderEventBlocks = (dayEvents: Event[], date: Date) => {
    const maxVisible = isMobile ? 2 : 3;
    const eventsWithColors = getEventsByCategory(dayEvents);
    const visibleEvents = eventsWithColors.slice(0, maxVisible);
    const remainingCount = dayEvents.length - maxVisible;

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {visibleEvents.map((event) => {
          const startTime = getEventStartDate(event);
          const endTime = getEventEndDate(event);
          const isMultiDay = startTime.toDateString() !== endTime.toDateString();
          
          return (
            <div
              key={event.id}
              style={{
                ...eventBlockStyle,
                backgroundColor: event.color,
              }}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, {
                  backgroundColor: event.color,
                  transform: 'scale(1.02)',
                  zIndex: 10,
                });
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, {
                  backgroundColor: event.color,
                  transform: 'scale(1)',
                  zIndex: 1,
                });
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDate(date);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation();
                  setSelectedDate(date);
                }
              }}
              role="button"
              tabIndex={0}
              title={`${event.title} - ${isMultiDay ? 'Multi-day event' : startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`}
            >
              {isMultiDay ? `📅 ${event.title}` : event.title}
            </div>
          );
        })}
        {remainingCount > 0 && (
          <div 
            style={moreEventsStyle}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDate(date);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                setSelectedDate(date);
              }
            }}
            role="button"
            tabIndex={0}
          >
            +{remainingCount} more
          </div>
        )}
      </div>
    );
  };

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
                backgroundColor: hasEvents ? colourToken.white : colourToken.lightGray,
                transform: 'none',
                boxShadow: 'none',
              });
            }
          }}
          role="button"
          tabIndex={0}
        >
          <span style={dayNumberStyle}>{day}</span>
          {hasEvents && renderEventBlocks(dayEvents, date)}
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
          <h4 style={{ color: colourToken.primary, margin: '0 0 16px 0', fontSize: '18px' }}>
            No events on {selectedDate.toLocaleDateString()}
          </h4>
        </div>
      );
    }

    return (
      <div style={eventDetailsStyle}>
        <h4 style={{ color: colourToken.primary, margin: '0 0 16px 0', fontSize: '18px' }}>
          Events on {selectedDate.toLocaleDateString()}
        </h4>
        {dayEvents.map((event: Event) => {
          const startTime = getEventStartDate(event);
          const endTime = getEventEndDate(event);
          const isMultiDay = startTime.toDateString() !== endTime.toDateString();
          
          return (
            <div key={event.id} style={{...eventCardStyle, marginBottom: dayEvents.indexOf(event) === dayEvents.length - 1 ? 0 : '12px'}}>
              <h5 style={eventTitleStyle}>{event.title}</h5>
              <p style={eventTimeStyle}>
                {isMultiDay 
                  ? `${startTime.toLocaleDateString()} - ${endTime.toLocaleDateString()}` 
                  : `${startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
                }
              </p>
              <p style={eventVenueStyle}>{event.location}</p>
              <p style={eventDescriptionStyle}>{event.description}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={eventsCalendarStyle}>
      {/* Loading State */}
      {loading && (
        <div style={{
          ...calendarMainContentStyle,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px'
        }}>
          <div style={{
            color: colourToken.primary,
            fontSize: '16px',
            fontWeight: 500
          }}>
            Loading events...
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={{
          ...calendarMainContentStyle,
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          gap: '16px'
        }}>
          <div style={{
            color: colourToken.red || '#ff474c',
            fontSize: '16px',
            fontWeight: 500,
            textAlign: 'center'
          }}>
            Failed to load events: {error}
          </div>
          <button
            type="button"
            style={{
              background: colourToken.pinkLight,
              color: colourToken.white,
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Calendar - only show when not loading and no error */}
      {!loading && !error && (
        <>
          <div style={calendarMainContentStyle}>
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
      </div>

      {/* Upcoming Events Grid */}
      <div style={upcomingEventsStyle}>
        <h4 style={{ color: colourToken.primary, margin: '0 0 16px 0', fontSize: '18px' }}>
          Upcoming Cultural Events
        </h4>
        <div style={upcomingEventsGridStyle}>
          {allEvents
            .filter(event => getEventStartDate(event) > new Date())
            .sort((a, b) => getEventStartDate(a).getTime() - getEventStartDate(b).getTime())
            .slice(0, isMobile ? 4 : 6)
            .map(event => {
              const startTime = getEventStartDate(event);
              const endTime = getEventEndDate(event);
              const isMultiDay = startTime.toDateString() !== endTime.toDateString();
              
              return (
                <div 
                  key={event.id} 
                  style={upcomingEventCardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={eventDateStyle}>
                    {isMultiDay 
                      ? `${startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    }
                  </div>
                  <div style={eventInfoStyle}>
                    <h5 style={eventInfoTitleStyle}>{event.title}</h5>
                    <p style={eventInfoTextStyle}>
                      {isMultiDay 
                        ? `${startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${endTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} • ${event.location}`
                        : `${startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - ${endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} • ${event.location}`
                      }
                    </p>
                    {event.category && (
                      <span style={{
                        background: `linear-gradient(45deg, ${colourToken.pinkLight}, ${colourToken.pink})`,
                        color: colourToken.white,
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        marginTop: '8px',
                        display: 'inline-block',
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.5px',
                      }}>
                        {event.category}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
        </>
      )}
    </div>
  );
}

export default EventsCalendar;