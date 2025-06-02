import { useState } from "react"
import "./medical-dashboard.css"
import ScheduleUpdateModal from '../modals/ScheduleUpdateModal';
import DeclineModal from '../modals/DeclineModal';
import { get, post } from "../../utility/fetchWeb";
import notification from "../../utility/notification";
import { useNavigate } from "react-router-dom";

const generateDateRange = () => {
  const today = new Date();
  const dates = [];

  // Start from 7 days ago
  for (let i = -7; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    dates.push({
      date: date.getDate(),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      fullDate: date // Keep full date for comparison
    });
  }

  return dates;
};

const MedicalDashboard = ({ data }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Initialize selectedDate with today's date
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewSchedule, setIsNewSchedule] = useState(false);
  const [patientData, setPatientData] = useState([]);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [slots, setSlots] = useState([]);
  const doctorId = sessionStorage.getItem("userId");

  // Generate dynamic dates
  const dates = generateDateRange();

  const navigate = useNavigate();

  const scheduleData = [
    { id: 0, day: "Monday", period: "1:00pm - 3:00pm", patients: 3 },
    { id: 1, day: "Tuesday", period: "1:00pm - 3:00pm", patients: 3 },
    { id: 2, day: "Wednesday", period: "1:00pm - 3:00pm", patients: 3 },
    { id: 3, day: "Thursday", period: "11:00am - 1:00pm", patients: 3 },
    { id: 4, day: "Friday", period: "11:00am - 1:00pm", patients: 3 },
    { id: 5, day: "Saturday", period: "2:00pm - 4:00pm", patients: 3 },
    { id: 6, day: "Sunday", period: "2:00pm - 4:00pm", patients: 3 },
  ]

  const getWaiting = async () => {
    try {
      const data = await get(`/Appointment/doctor/${doctorId}`)
      console.log("Waiting patients: ", data?.data)
      if (data?.status === "success") {
        // Filter for pending appointments only
        const pendingAppointments = data?.data?.filter(
          appointment => appointment.status?.toLowerCase() === 'pending'
        );
        setPatientData(pendingAppointments || []);
      } else {
        setPatientData([])
      }
    } catch (e) {
      console.log("Error: ", e)
      setPatientData([])
    }

  }

  const getSlots = async () => {
    try {
      const data = await get(`/Doctors/api/slots/availableByDoctorId?doctorId=${doctorId}`)
      console.log("Waiting slots: ", data)
      if (data.length > 0) {
        setSlots(data);
      } else {
        setSlots([])
      }
    } catch (e) {
      console.log("Error: ", e)
      setSlots([])
    }

  }

  useState(() => {
    getWaiting();
    getSlots();
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  const getStatusColor = (appointment) => {
    if (appointment.isCanceled) return "#ff6b6b"
    if (appointment.isAdmitted) return "#4ecdc4"
    return "#51cf66"
  }

  const getStatusText = (appointment) => {
    if (appointment.isCanceled) return "Canceled"
    if (appointment.isAdmitted) return "Admitted"
    return "Scheduled"
  }

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
    setIsNewSchedule(false);
    setIsModalOpen(true);
  };

  const handleCreateNewSchedule = () => {
    setSelectedSchedule({});
    setIsNewSchedule(true);
    setIsModalOpen(true);
  };

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      const response = await post(`/Appointment/appointments/${appointmentId}/accept-appointment`);
      if (response.message === 'Appointment accepted.') {
        notification({
          title: 'Success',
          message: 'Appointment accepted successfully',
          type: 'success'
        });
        getWaiting(); // Refresh the appointments list
      }
    } catch (error) {
      notification({
        title: 'Error',
        message: 'Failed to accept appointment',
        type: 'error'
      });
      console.error('Error accepting appointment:', error);
    }
  };

  const handleDeclineAppointment = async (appointmentId, reason) => {
    try {
      const response = await post(`/Appointment/appointments/${appointmentId}/decline`, {
        reason: reason
      });

      if (response.message === 'Appointment declined and notifications sent.') {
        notification({
          title: 'Success',
          message: 'Appointment declined successfully',
          type: 'success'
        });
        getWaiting(); // Refresh the appointments list
      }
    } catch (error) {
      notification({
        title: 'Error',
        message: 'Failed to decline appointment',
        type: 'error'
      });
      console.error('Error declining appointment:', error);
    } finally {
      setIsDeclineModalOpen(false);
      setSelectedAppointmentId(null);
    }
  };

  // Update the formatTime function to include date
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  return (
    <div className="w-100">

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="search-bar">
            <input type="text" placeholder="Search appointments" />
          </div>
          <div className="header-actions">
            <button className="manage-schedule-btn" onClick={toggleDrawer}>
              ← Manage My Schedule
            </button>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="doctor-info">
          <div className="doctor-avatar">
            <img src="/user-avater.png" alt="Doctor" />
          </div>
          <div className="doctor-details">
            <p className="greeting">Good Day</p>
            <h2 className="doctor-name">Dr. Ember Wynn</h2>
            <p className="hospital">Healing Stripes Hospital, Lagos.</p>
          </div>
        </div>

        {/* Bookings Summary */}
        <div className="bookings-summary">
          <div className="summary-card">
            <span>Total Bookings for this month</span>
            <span className="booking-count">25</span>
          </div>
        </div>

        {/* Date Selection */}
        <div className="date-section">
          <h3>Select Date</h3>
          <div className="date-picker">
            {dates.map((dateItem) => (
              <div
                key={dateItem.fullDate.toISOString()}
                className={`date-item ${selectedDate === dateItem.date ? "selected" : ""} ${dateItem.fullDate.toDateString() === new Date().toDateString() ? "today" : ""
                  }`}
                onClick={() => setSelectedDate(dateItem.date)}
              >
                <span className="date-number">{dateItem.date}</span>
                <span className="date-day">{dateItem.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="appointments-section">
          <div className="appointments-list">
            {patientData?.length > 0 ? (
              patientData.map((appointment) => (
                <div key={appointment.id} className="appointment-card2">
                  <div className="patient-avatar">
                    <img src="/user-avater.png" alt={appointment.patientName} />
                  </div>
                  <div className="appointment-details">
                    <div className="patient-info">
                      <h4>{appointment.patientName}</h4>
                      <div className="appointment-meta">
                        <span className="appointment-time">{appointment.appointTime}</span>
                        <span className="appointment-type">{appointment.description}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-8 flex-v-center">
                    <div className="appointment-status">
                      <span className="status-badge" style={{ backgroundColor: getStatusColor(appointment) }}>
                        {getStatusText(appointment)}
                      </span>
                    </div>
                    <div className="appointment-actions">
                      <button
                        onClick={() => {
                          localStorage.setItem("appointmentId", appointment.id);
                          navigate(`/doctor/patients/patient-details/${appointment.patientId}`);
                        }}
                        className="action-btn">View Profile</button>
                      {appointment.status === "Pending" && (
                        <>
                          <button
                            className="action-btn accept-btn m-r-10 m-l-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptAppointment(appointment.id);
                            }}
                          >
                            Accept
                          </button>
                          <button
                            className="action-btn decline-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointmentId(appointment.id);
                              setIsDeclineModalOpen(true);
                            }}
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-appointments">
                <p>No pending appointments found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Management Drawer */}
      <div className={`drawer-overlay ${isDrawerOpen ? "open" : ""}`} onClick={toggleDrawer}></div>
      <div className={`schedule-drawer ${isDrawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <button className="close-btn" onClick={toggleDrawer}>
            ←
          </button>
          <h3>Manage My Schedule</h3>
        </div>

        <div className="schedule-table">
          <div className="table-header2">
            <div className="header-cell">Date</div>
            <div className="header-cell">Start Time</div>
            <div className="header-cell">End Time</div>
            <div className="header-cell">Status</div>
          </div>

          {slots?.map((slot, index) => {
            const startDateTime = formatTime(slot.startTimeUtc);
            const endDateTime = formatTime(slot.endTimeUtc);

            return (
              <div
                key={slot.id || index}
                className="table-row2"
                onClick={() => handleScheduleClick(slot)}
              >
                <div className="cell">
                  {startDateTime.date}
                </div>
                <div className="cell">
                  {startDateTime.time}
                </div>
                <div className="cell">
                  {endDateTime.time}
                </div>
                <div className="cell">
                  <span className={`status-indicator ${slot.isBooked ? 'booked' : 'available'}`}>
                    {slot.isBooked ? 'Booked' : 'Available'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="update-schedule-btn"
          onClick={handleCreateNewSchedule}
        >
          Create New Schedule
        </button>
      </div>

      <ScheduleUpdateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsNewSchedule(false);
        }}
        schedule={selectedSchedule || {}}
        isNewSchedule={isNewSchedule}
      />
      <DeclineModal
        isOpen={isDeclineModalOpen}
        onClose={() => {
          setIsDeclineModalOpen(false);
          setSelectedAppointmentId(null);
        }}
        onDecline={(reason) => handleDeclineAppointment(selectedAppointmentId, reason)}
      />
    </div>
  )
}

export default MedicalDashboard
