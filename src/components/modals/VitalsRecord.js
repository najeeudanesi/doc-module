import React from 'react';

const VitalsRecords = ({ vitals = [] }) => {
  return (
    <aside className="sidebar">
      <div className="bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 relative overflow-auto max-h-[90vh]">
          <h2 className="text-xl font-bold mb-4">Vitals Records</h2>
          {vitals.length === 0 ? (
            <p className="text-gray-500">No vitals recorded.</p>
          ) : (
            vitals.map((v, i) => (
              <div key={i} className="vitals-card border-b border-gray-200 py-3 mb-3">
                <div className="vitals-row"><strong>Date of Visit:</strong> {v.dateOfVisit}</div>
                <div className="vitals-row"><strong>Nurse:</strong> {v.vitalNurseName}</div>
                <div className="vitals-row"><strong>Patient:</strong> {v.patientName}</div>
                <div className="vitals-row"><strong>Temperature:</strong> {v.temperature} °C</div>
                <div className="vitals-row"><strong>Blood Pressure:</strong> {v.bloodPressure}</div>
                <div className="vitals-row"><strong>Heart Pulse:</strong> {v.heartPulse}</div>
                <div className="vitals-row"><strong>Respiratory:</strong> {v.respiratory}</div>
                <div className="vitals-row"><strong>Blood Sugar:</strong> {v.bloodSugar}</div>
                <div className="vitals-row"><strong>Oxygen Saturation:</strong> {v.oxygenSaturation}</div>
                <div className="vitals-row"><strong>Height:</strong> {v.height} cm</div>
                <div className="vitals-row"><strong>Weight:</strong> {v.weight} kg</div>
                <div className="vitals-row"><strong>BMI:</strong> {v.bmi}</div>
                <div className="vitals-row"><strong>Notes:</strong> {v.notes?.join(', ') || '-'}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default VitalsRecords;
