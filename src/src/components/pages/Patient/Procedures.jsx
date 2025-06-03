import { useEffect, useState } from "react";
import { get } from "../../../utility/fetch";
import LabsTable from "../../tables/LabsTble";
import ReportsTable from "../../tables/ReportsTable";
import ProceduresTable from "../../tables/proceduresTable";

function Procedure({ id, name }) {
  const [data, setData] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [activeButton, setActiveButton] = useState('Lab Reports');
  const [isLoading, setIsLoading] = useState(true);

  const handleToggle = (button) => {
    setActiveButton(button);
  };


  const getProcedureRequests = async () => {
    setIsLoading(true)
    try {
      let response = await get(`/patients/list/1/10/procedure-requests`);
      setProcedures(response);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
  }

  useEffect(() => {
    getProcedureRequests();
  }, [])
  return (
    <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          (
            <ProceduresTable data={procedures} name={name} />
          )
        )}
    </div>
  );
}

export default Procedure;
