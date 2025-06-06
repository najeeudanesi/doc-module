import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../../utility/fetch';
import { calculateAge } from '../../utility/general';

const VitalsRecords = ({ vitals = [] }) => {

  const { patientId, } = useParams();
  const [patient, setPatient] = React.useState(null);
  const getPatientDetails = async () => {
    // setLoading(true);
    try {
      const data = await get(`/patients/${patientId}/data`);
      setPatient(data);
      console.log(data);
      console.log(data?.id);

      // setVisit(data?.visits?.pop());
    } catch (e) {
      console.log(e);
    }
    // setLoading(false);
  };

  useEffect(() => {
    getPatientDetails();
  }, []);



  console.log('Vitals Records:', vitals);
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
                <div className="vitals-row"><strong>Patient:</strong> {patient.firstName} {patient.lastName}</div>
                <div className="vitals-row"><strong>Age:</strong> {calculateAge(patient.dateOfBirth)} years</div>
                <div className="vitals-row"><strong>Sex:</strong> {patient.gender}</div>                
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
