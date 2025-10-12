import { useState } from 'react';
import { useColourToken } from 'themeStyles';
import useIsMobile from 'utils/isMobile';
import { Event } from 'types/interface';

interface EventsCalendarProps {
  events: Event[];
  upcomingEvents: Event[];
  loading: boolean;
  error: string | null;
  currentUpcomingPage: number;
  totalUpcomingEvents: number;
  upcomingEventsLoading: boolean;
  eventsPerPage: number;
  onPreviousUpcomingPage: () => void;
  onNextUpcomingPage: () => void;
}

function EventsCalendar({ 
  events, 
  upcomingEvents, 
  loading = false, 
  error = null,
  currentUpcomingPage,
  totalUpcomingEvents,
  upcomingEventsLoading,
  eventsPerPage,
  onPreviousUpcomingPage,
  onNextUpcomingPage
}: EventsCalendarProps) {
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

  const paginationControlsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '24px',
    padding: '0 8px',
  };

  const paginationButtonStyle = {
    background: `linear-gradient(45deg, ${colourToken.pinkLight}, ${colourToken.pink})`,
    color: colourToken.white,
    border: 'none',
    borderRadius: '8px',
    padding: isMobile ? '8px 12px' : '10px 16px',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '4px' : '6px',
    minWidth: isMobile ? '70px' : 'auto',
    justifyContent: 'center',
  };

  const paginationButtonDisabledStyle = {
    ...paginationButtonStyle,
    background: colourToken.gray,
    cursor: 'not-allowed',
    opacity: 0.5,
  };

  const pageIndicatorStyle = {
    color: colourToken.primary,
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: 500,
    textAlign: 'center' as const,
    flex: isMobile ? 1 : 'none',
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

  const allEvents = events;

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getEventStartDate = (event: Event) => new Date(event.start_time);
  const getEventEndDate = (event: Event) => event.end_time ? new Date(event.end_time) : new Date(event.start_time);
  
  const sortedUpcomingEvents = upcomingEvents && upcomingEvents.length > 0 
    ? [...upcomingEvents].sort((a, b) => getEventStartDate(a).getTime() - getEventStartDate(b).getTime())
    : [];

  const totalUpcomingPages = Math.ceil(totalUpcomingEvents / eventsPerPage);
  
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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '200px',
          gap: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${colourToken.lightGray}`,
            borderTop: `3px solid ${colourToken.pinkLight}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
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
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              fontSize: '48px',
              opacity: 0.8,
            }}>
              📅
            </div>
            <div style={{
              color: colourToken.primary,
              fontSize: '18px',
              fontWeight: 600,
              textAlign: 'center',
              marginBottom: '4px'
            }}>
              Oops! Something went wrong
            </div>
            <div style={{
              color: colourToken.primary,
              fontSize: '14px',
              fontWeight: 400,
              textAlign: 'center',
              maxWidth: '400px',
              lineHeight: 1.5,
              opacity: 0.9
            }}>
              {error}
            </div>
          </div>
          <button
            type="button"
            style={{
              background: colourToken.pinkLight,
              color: colourToken.white,
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colourToken.pink;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colourToken.pinkLight;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => window.location.reload()}
          >
            Try Again
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
        
        {upcomingEventsLoading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
            gap: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: `3px solid ${colourToken.lightGray}`,
              borderTop: `3px solid ${colourToken.pinkLight}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <div style={{
              color: colourToken.gray,
              fontSize: '14px',
              fontWeight: 500,
            }}>
              Loading events...
            </div>
          </div>
        ) : (
        <div style={upcomingEventsGridStyle}>
          {sortedUpcomingEvents.length > 0 ? (
            sortedUpcomingEvents.map(event => {
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
              })
          ) : (
            // Empty state when no upcoming events
            <div style={{
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '2rem 1rem' : '3rem 2rem',
              textAlign: 'center' as const,
              color: colourToken.gray,
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 248, 248, 0.8) 100%)`,
              borderRadius: '12px',
              border: `1px solid rgba(255, 255, 255, 0.4)`,
              gridColumn: '1 / -1', // Span full width
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                opacity: 0.6,
              }}>
                📅
              </div>
              <h5 style={{
                color: colourToken.primary,
                margin: '0 0 0.5rem 0',
                fontSize: isMobile ? '1.1rem' : '1.3rem',
                fontWeight: 600,
              }}>
                No Upcoming Events
              </h5>
              <p style={{
                color: colourToken.gray,
                margin: 0,
                fontSize: isMobile ? '0.9rem' : '1rem',
                lineHeight: 1.5,
                maxWidth: '400px',
              }}>
                Check back soon for exciting cultural events and performances!
              </p>
            </div>
          )}
        </div>
        )}
        
        {/* Pagination Controls */}
        {totalUpcomingPages > 1 && (
          <div style={{
            ...paginationControlsStyle,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '12px',
            padding: isMobile ? '12px' : '16px',
            marginTop: '24px',
            border: `1px solid ${colourToken.pinkLight}20`,
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '12px' : '0',
          }}>
            {isMobile ? (
              <>
                <div style={pageIndicatorStyle}>
                  Page {currentUpcomingPage + 1} of {totalUpcomingPages}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <button
                    type="button"
                    style={currentUpcomingPage === 0 ? paginationButtonDisabledStyle : paginationButtonStyle}
                    onClick={onPreviousUpcomingPage}
                    disabled={currentUpcomingPage === 0}
                  >
                    ← Prev
                  </button>
                  
                  <button
                    type="button"
                    style={currentUpcomingPage >= totalUpcomingPages - 1 ? paginationButtonDisabledStyle : paginationButtonStyle}
                    onClick={onNextUpcomingPage}
                    disabled={currentUpcomingPage >= totalUpcomingPages - 1}
                  >
                    Next →
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  style={currentUpcomingPage === 0 ? paginationButtonDisabledStyle : paginationButtonStyle}
                  onClick={onPreviousUpcomingPage}
                  disabled={currentUpcomingPage === 0}
                  onMouseEnter={(e) => {
                    if (currentUpcomingPage > 0) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentUpcomingPage > 0) {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  ← Previous
                </button>
                
                <div style={pageIndicatorStyle}>
                  Page {currentUpcomingPage + 1} of {totalUpcomingPages}
                </div>
                
                <button
                  type="button"
                  style={currentUpcomingPage >= totalUpcomingPages - 1 ? paginationButtonDisabledStyle : paginationButtonStyle}
                  onClick={onNextUpcomingPage}
                  disabled={currentUpcomingPage >= totalUpcomingPages - 1}
                  onMouseEnter={(e) => {
                    if (currentUpcomingPage < totalUpcomingPages - 1) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentUpcomingPage < totalUpcomingPages - 1) {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  Next →
                </button>
              </>
            )}
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}

export default EventsCalendar;