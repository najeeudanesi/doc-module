import React, { useState } from 'react';
import './DeclineModal.css';

const DeclineModal = ({ isOpen, onClose, onDecline }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onDecline(reason);
    setReason('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="decline-modal-overlay">
      <div className="decline-modal-content">
        <h3>Decline Appointment</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reason">Reason for Declining</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for declining this appointment"
              required
              rows={4}
            />
          </div>
          <div className="decline-modal-actions">
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="decline-btn"
              disabled={loading || !reason.trim()}
            >
              {loading ? 'Declining...' : 'Decline'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeclineModal;