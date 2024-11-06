import { useCallback, useEffect, useState } from "react";
import { get } from "../../../utility/fetch";
import LabsTable from "../../tables/LabsTble";

function Labs({ id }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vitalId, setVitalId] = useState(null);
  const [activeButton, setActiveButton] = useState('Lab Requests');
  const [labReports, setLabReports] = useState([]);
  const [patientData, setPatientData] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let res = await get(`/patients/${id}/lab_reports`);
      setData(res?.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [id]);

  const fetchPatientData = useCallback(async () => {
    try {
      let response = await get(`/patients/${id}/data`);
      setPatientData(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const handleToggle = (button) => {
    setActiveButton(button);
  };

  const vitals = useCallback(async () => {
    try {
      let response = await get(`/patients/vital-by-patientId?patientId=${id}`);
      if (response.data && response.data.length > 0) {
        const newVitalId = response.data[0].vitalId;
        setVitalId(newVitalId);
        return newVitalId;
      } else {
        console.error('No vital data found');
        return null;
      }
    } catch (e) {
      console.error('Error fetching vitals:', e);
      return null;
    }
  }, [id]);

  const vitalData = useCallback(async (vId) => {
    if (!patientData) {
      console.error('Patient data not available');
      return;
    }
    if (!vId) {
      console.error('Vital ID not available');
      return;
    }

    const requestBody = {
      age: patientData.age,
      diagnosis: patientData.diagnosis || '',
      dateOfVisit: new Date().toISOString(),
      appointmentId: patientData.appointmentId || 0,
      hmoId: patientData.hmoId || 0,
      hmoPackageId: patientData.hmoPackageId || 0,
      testRequests: [],
      otherTestRequests: [],
      additionalNote: ''
    };

    try {
      let response = await get(`/patients/list/${id}/lab-requests-by-patient-id`);
      console.log("Vital data posted, response:", response?.data);
      setLabReports(response?.data);
    } catch (e) {
      console.error('Error posting vital data:', e);
    }
  }, [id, patientData]);

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchPatientData();
      await fetchData();
      const newVitalId = await vitals();
      if (newVitalId && patientData) {
        await vitalData(newVitalId);
      }
    };

    fetchAllData();
  }, [fetchPatientData, fetchData, vitals, vitalData]);


  return (
    <div>
      <div className="lab-button">
        <button
          onClick={() => handleToggle('Lab Reports')}
          className={activeButton === 'Lab Reports' ? 'activeLab' : 'nonActiveLab'}
        >
          Lab Reports
        </button>
        <button
          onClick={() => handleToggle('Lab Requests')}
          className={activeButton === 'Lab Requests' ? 'activeLab' : 'nonActiveLab'}
        >
          Lab Requests
        </button>
      </div>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          activeButton === 'Lab Reports' ? (
            <LabsTable data={data} id={id} />
          ) : (
            <div>
              <h2>Lab Reports</h2>
              <pre>{JSON.stringify(labReports, null, 2)}</pre>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Labs;