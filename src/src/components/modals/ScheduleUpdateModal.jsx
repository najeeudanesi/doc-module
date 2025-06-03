import React, { useState, useEffect } from 'react';
import './ScheduleUpdateModal.css';
import { post } from '../../utility/fetchWeb';
import notification from '../../utility/notification';

// Add days of week mapping
const DAYS_OF_WEEK = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' }
];

const ScheduleUpdateModal = ({ isOpen, onClose, schedule, isNewSchedule = false }) => {
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [modifyAll, setModifyAll] = useState(false);
  const [modifyOnce, setModifyOnce] = useState(true);
  const [loading, setLoading] = useState(false);
  const [createRecurring, setCreateRecurring] = useState(false);
  const [repeatUntil, setRepeatUntil] = useState('');
  const [selectedDay, setSelectedDay] = useState(0); // Default to Sunday

  useEffect(() => {
    if (isOpen && !isNewSchedule) {
      // Handle existing schedule data
      const [start, end] = schedule.period?.split(' - ') || ['', ''];
      setFromTime(start);
      setToTime(end);
    } else {
      // Reset form for new schedule
      setFromTime('');
      setToTime('');
      setCreateRecurring(false);
      setRepeatUntil('');
    }
  }, [isOpen, schedule, isNewSchedule]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isNewSchedule) {
        const userId = sessionStorage.getItem('userId');

        if (createRecurring) {
          // Create recurring schedule with selected day
          const recurringPayload = {
            id: 0,
            employeeId: parseInt(userId),
            dayOfWeek: selectedDay,
            startTime: fromTime,
            endTime: toTime,
            repeatUntil: new Date(repeatUntil).toISOString(),
            lastGeneratedDate: new Date(repeatUntil).toISOString()
          };

          const response = await post('/Doctors', recurringPayload);
          if (response.statusCode === 200) {
            notification({
              title: 'Success',
              message: `Recurring schedule created successfully for ${DAYS_OF_WEEK[selectedDay].name}!`,
              type: 'success'
            });
            onClose();
          }
        } else {
          // Create single slot
          const payload = {
            id: 0,
            employeeId: parseInt(userId),
            startTimeUtc: new Date(fromTime).toISOString(),
            endTimeUtc: new Date(toTime).toISOString(),
            isBooked: false
          };

          const response = await post('/Doctors/api/slots', payload);
          if (response.statusCode === 200) {
            notification({
              title: 'Success',
              message: 'Schedule slot created successfully!',
              type: 'success'
            });
            onClose();
          }
        }
      } else {
        // Handle existing schedule update logic
        const updatedSchedule = {
          day: schedule.day,
          period: `${fromTime} - ${toTime}`,
          patients: schedule.patients,
          modifyAll,
          modifyOnce
        };
        // Your existing update logic here
        onClose();
      }
    } catch (error) {
      notification({
        title: 'Error',
        message: 'Failed to create schedule. Please try again.',
        type: 'error'
      });
      console.error('Error creating/updating schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isNewSchedule ? 'Create New Schedule' : `Update your ${schedule.day} Appointment`}</h2>
        
        <form onSubmit={handleSubmit}>
          {isNewSchedule && createRecurring && (
            <div className="input-group">
              <label>Day of Week:</label>
              <select 
                value={selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                required
                className="day-select"
              >
                {DAYS_OF_WEEK.map(day => (
                  <option key={day.id} value={day.id}>
                    {day.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="time-inputs">
            <div className="input-group">
              <label>Available from:</label>
              <input
                type={createRecurring ? "time" : "datetime-local"}
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label>To:</label>
              <input
                type={createRecurring ? "time" : "datetime-local"}
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                required
              />
            </div>
          </div>

          {isNewSchedule && createRecurring && (
            <div className="input-group">
              <label>Repeat Until:</label>
              <input
                type="date"
                value={repeatUntil}
                onChange={(e) => setRepeatUntil(e.target.value)}
                required={createRecurring}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}

          {isNewSchedule && (
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={createRecurring}
                  onChange={(e) => setCreateRecurring(e.target.checked)}
                />
                Create recurring schedule
              </label>
            </div>
          )}

          

          {!isNewSchedule && (
            <>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={modifyAll}
                    onChange={(e) => {
                      setModifyAll(e.target.checked);
                      if (e.target.checked) setModifyOnce(false);
                    }}
                  />
                  Modify for all {schedule.day}s going forward
                </label>
              </div>

              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={modifyOnce}
                    onChange={(e) => {
                      setModifyOnce(e.target.checked);
                      if (e.target.checked) setModifyAll(false);
                    }}
                  />
                  Modify for only this week
                </label>
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="update-btn" disabled={loading}>
              {loading ? 'Saving...' : isNewSchedule ? 'Create Schedule' : 'Update Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleUpdateModal;