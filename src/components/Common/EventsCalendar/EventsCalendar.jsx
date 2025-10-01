import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './EventsCalendar.module.css';

function EventsCalendar({ events = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Sample kathakali events data - you can replace this with real data later
  const sampleEvents = [
    {
      id: 1,
      title: 'Kathakali Performance - Ramayana',
      date: new Date(2025, 9, 15), // October 15, 2025
      time: '7:00 PM',
      venue: 'Cultural Center Main Hall',
      description: 'Experience the epic tale of Ramayana through traditional Kathakali dance-drama.'
    },
    {
      id: 2,
      title: 'Kathakali Workshop for Beginners',
      date: new Date(2025, 9, 22), // October 22, 2025
      time: '2:00 PM',
      venue: 'Dance Studio A',
      description: 'Learn the basics of Kathakali including makeup, costumes, and basic movements.'
    },
    {
      id: 3,
      title: 'Kathakali Character Recognition Demo',
      date: new Date(2025, 9, 28), // October 28, 2025
      time: '6:00 PM',
      venue: 'Innovation Lab',
      description: 'Interactive demonstration of AI-powered Kathakali character recognition.'
    },
    {
      id: 4,
      title: 'Traditional Kathakali Music Evening',
      date: new Date(2025, 10, 5), // November 5, 2025
      time: '7:30 PM',
      venue: 'Heritage Auditorium',
      description: 'An evening dedicated to the classical music that accompanies Kathakali performances.'
    }
  ];

  const allEvents = [...events, ...sampleEvents];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date) => {
    return allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction) => {
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
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const hasEvents = dayEvents.length > 0;
      const isSelected = selectedDate && 
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={day}
          className={`${styles.calendarDay} ${hasEvents ? styles.hasEvents : ''} ${isSelected ? styles.selected : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <span className={styles.dayNumber}>{day}</span>
          {hasEvents && <div className={styles.eventDot}></div>}
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
        <div className={styles.eventDetails}>
          <h4>No events on {selectedDate.toLocaleDateString()}</h4>
        </div>
      );
    }

    return (
      <div className={styles.eventDetails}>
        <h4>Events on {selectedDate.toLocaleDateString()}</h4>
        {dayEvents.map(event => (
          <div key={event.id} className={styles.eventCard}>
            <h5 className={styles.eventTitle}>{event.title}</h5>
            <p className={styles.eventTime}>{event.time}</p>
            <p className={styles.eventVenue}>{event.venue}</p>
            <p className={styles.eventDescription}>{event.description}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.eventsCalendar}>
      <div className={styles.calendarHeader}>
        <button 
          className={styles.navButton} 
          onClick={() => navigateMonth(-1)}
        >
          ‹
        </button>
        <h3 className={styles.monthYear}>
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button 
          className={styles.navButton} 
          onClick={() => navigateMonth(1)}
        >
          ›
        </button>
      </div>

      <div className={styles.calendarGrid}>
        <div className={styles.daysOfWeekHeader}>
          {daysOfWeek.map(day => (
            <div key={day} className={styles.dayOfWeek}>{day}</div>
          ))}
        </div>
        <div className={styles.daysGrid}>
          {renderCalendarDays()}
        </div>
      </div>

      {renderEventDetails()}

      <div className={styles.upcomingEvents}>
        <h4>Upcoming Kathakali Events</h4>
        <div className={styles.eventsList}>
          {allEvents
            .filter(event => new Date(event.date) > new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3)
            .map(event => (
              <div key={event.id} className={styles.upcomingEventCard}>
                <div className={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className={styles.eventInfo}>
                  <h5>{event.title}</h5>
                  <p>{event.time} • {event.venue}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

EventsCalendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.instanceOf(Date).isRequired,
      time: PropTypes.string,
      venue: PropTypes.string,
      description: PropTypes.string,
    })
  ),
};

export default EventsCalendar;