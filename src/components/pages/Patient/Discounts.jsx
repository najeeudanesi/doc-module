import { useEffect, useState } from "react";
import { get } from "../../../utility/fetch";
import LabsTable from "../../tables/LabsTble";
import ReportsTable from "../../tables/ReportsTable";
import PendingPayments from "../../tables/PendingPayments";

function Discounts({ id }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    // console.log("id:", id);
    setIsLoading(true);
    try {
      let res = await get(`/PatientPayment/GetPaymentsForDiscount?patientId=${id}`);
      // console.log(res);
      setData(res?.data?.data);
    } catch (error) {
      console.error('Error fetching lab reports:', error);
    }
    setIsLoading(false);
  }

 

  useEffect(() => {
    fetchData();
  }, [])
  return (
    <div>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
            <PendingPayments data={data} id={id} fetch={fetchData} />
          
        )}
      </div>
    </div>
  );
}

export default Discounts;
