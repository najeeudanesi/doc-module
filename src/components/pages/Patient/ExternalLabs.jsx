import { useEffect, useState } from "react";
import { get } from "../../../utility/fetch";
import LabsTable from "../../tables/LabsTble";
import ReportsTable from "../../tables/ReportsTable";

function ExternalLabs({ id }) {
  const [data, setData] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [activeButton, setActiveButton] = useState('Lab Reports');
  const [isLoading, setIsLoading] = useState(true);

  const handleToggle = (button) => {
    setActiveButton(button);
  };

  const fetchData = async () => {
    // console.log("id:", id);
    setIsLoading(true);
    try {
      let res = await get(`/patients/${id}/external_lab_reports`);
      // console.log(res);
      setData(res?.data);
    } catch (error) {
      console.error('Error fetching lab reports:', error);
    }
    setIsLoading(false);
  }

  const getLabReport = async () => {
    try {
      let response = await get(`/patients/list/${id}/1/10/external-lab-requests-by-patient-id`);
      setLabReports(response);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
    getLabReport();
  }, [])
  return (
    <div>
      <div className="lab-button">
        <button
          onClick={() => handleToggle('Lab Reports')}
          className={activeButton === 'Lab Reports' ? 'activeLab' : 'nonActiveLab'}
        >
          External Lab Reports
        </button>
        <button
          onClick={() => handleToggle('Lab Requests')}
          className={activeButton === 'Lab Requests' ? 'activeLab' : 'nonActiveLab'}
        >
          External Lab Requests
        </button>
      </div>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          activeButton === 'Lab Reports' ? (
            <LabsTable data={data} id={id} />
          ) : (
            <ReportsTable data={labReports} />
          )
        )}
      </div>
    </div>
  );
}

export default ExternalLabs;
