import React, { useEffect, useState } from "react";
import { formatDate } from "../../utility/general";
import { get } from "../../utility/fetch";
import ViewVisit from "../modals/ViewVisit";
import { RiFilePaper2Line } from "react-icons/ri";
import NurseNotes from "../modals/NurseNotes";
import Pagination from "../UI/Pagination";
import downloadicon from "../../assets/images/download-icon.png";
import VitalsChart from "../UI/VitalChart";

function VisitTable({ patientId, next }) {
  const [modalData, setModalData] = useState(null); // State to store the data for the modal
  const [show, setshow] = useState(null); // State to store the data for the modal
  const [noteModalData, setNoteModalData] = useState(null); // State to store the data for the note modal
  const [data, setData] = useState([]);
  const [dataVitalData, setDataVitalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPagesVital, setTotalPagesVital] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [docpaths, setdocpaths] = useState();
  const [showChart, setShowChart] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setdocpaths(null);
    setIsModalOpen(false);
  };
  const pageSize = 10; // Number of rows per page

  const toggleChart = () => {
    setShowChart((prev) => !prev);
  };
  const fetchData = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await get(
        `/patients/vital-by-patientId?patientId=${patientId}&pageIndex=${page}&pageSize=${30}`
      );
      setData(response.data);
      setTotalPages(response.totalPages || 1); // Assuming the response includes total pages
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsModalOpen(true);
  }, [docpaths]);

  const fetchVitalByAppointmentData = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await get(
        `/patients/vital-by-appointmentId?appointmentId=${localStorage.getItem(
          "appointmentId"
        )}&pageIndex=${page}&pageSize=${pageSize}`
      );
      setDataVitalData(response.data);
      setTotalPagesVital(response.totalPages || 1); // Assuming the response includes total pages
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData(currentPage);
    fetchVitalByAppointmentData(currentPage); // Fetch data when the component mounts or page changes
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-100">
      {!isLoading ? (
        <div>
          <h3>Most Recent Vital</h3>
          <div className="w-100 none-flex-item m-t-40">
            <table className="bordered-table-2">
              <thead className="border-top-none">
                <tr className="border-top-none">
                  <th className="w-10">Date</th>
                  <th>Weight (Kg)</th>

                  <th>Temp (°C)</th>
                  <th>Height (cm)</th>
                  <th>BMI</th>
                  <th>Heart (bpm)</th>
                  <th>Respiratory</th>
                  <th>Blood Pressure (mmHg)</th>
                  <th>ECG</th>
                  <th>Nurse Notes</th>
                  <th>Administered Nurse</th>
                  {/* <th className="w-20">Assigned Doctor</th> */}
                </tr>
              </thead>

              <tbody className="white-bg view-det-pane">
                {dataVitalData.map((row) => (
                  <tr key={row?.id}>
                    <td>{formatDate(row?.dateOfVisit)}</td>
                    <td>{row?.weight}</td>

                    <td>{row?.temperature} C</td>
                    <td>{row?.height} cm</td>
                    <td>{row?.bmi} </td>
                    <td>{row?.heartPulse} bpm</td>
                    <td>{row?.respiratory}</td>
                    <td>{row?.bloodPressure}</td>
                    <td>
                      <div
                        style={{ width: "100%" }}
                        className="outline pointer"
                      // onClick={() => setNoteModalData(row)}
                      >
                        {row?.vitalDocuments?.map((item) => (
                          <div>
                            {/* <iframe
              className=" flex justify-center items-center w-full"
                  // src={`${item.docPath}`}
                  src={`https://docs.google.com/gview?url=${item.docPath}&embedded=true`}
              // src={`https://edogoverp.com/documents/cece8e6f-69c8-4a48-b09e-faad5e01efa9_edologo.png`}
              style={{
                width: "80%",
                height: "83vh",
              }}
            ></iframe> */}
                            <div className="flex">
                              <a
                                // onClick={() => {
                                //   // setIsModalOpen(true);
                                //   setdocpaths(item?.docPath);
                                // }}
                                href={item.docPath}
                                target="blank"
                              // download={true}
                              >
                                {item.docName}
                              </a>
                              {item.docPath && (
                                <a
                                  href={item.docPath}
                                  target="_blank"
                                  download={true}
                                >
                                  <img
                                    style={{ width: "16px", height: "16px" }}
                                    src={downloadicon}
                                  />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div
                        className="outline pointer"
                        onClick={() => setNoteModalData(row)}
                      >
                        <RiFilePaper2Line />
                      </div>
                    </td>
                    <td>{row?.vitalNurseName}</td>
                    {/* <td className="flex flex-v-center space-between">
                                        {row?.doctorName}
                                        <div className="outline pointer" onClick={() => setModalData(row)}>
                                            <RiFilePaper2Line />
                                        </div>
                                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          </div>
          {show && (
            <div className="w-100 none-flex-item m-t-40">
              <table className="bordered-table-2">
                <thead className="border-top-none">
                  <tr className="border-top-none">
                    <th className="w-10">Date</th>
                    <th>Weight</th>
                    <th>Temp</th>
                    <th>Height</th>
                    <th>BMI</th>
                    <th>Heart</th>
                    <th>Respiratory</th>
                    <th>Blood Pressure</th>
                    <th>ECG</th>
                    <th>Nurse Notes</th>
                    <th>Administered Nurse</th>
                    {/* <th className="w-20">Assigned Doctor</th> */}
                  </tr>
                </thead>
                <tbody className="white-bg view-det-pane">
                  {data.map((row) => (
                    <tr key={row?.id}>
                      <td>{formatDate(row?.dateOfVisit)}</td>
                      <td>{row?.weight}</td>
                      <td>{row?.temperature}</td>
                      <td>{row?.height}</td>
                      <td>{row?.bmi}</td>
                      <td>{row?.heartPulse}</td>
                      <td>{row?.respiratory}</td>
                      <td>{row?.bloodPressure}</td>
                      <td>
                        <div
                          className="outline pointer"
                          onClick={() => setNoteModalData(row)}
                        >
                          <RiFilePaper2Line />
                        </div>
                      </td>
                      <td>{row?.vitalNurseName}</td>
                      <td>
                        <div
                          className="outline pointer"
                          onClick={() => setNoteModalData(row)}
                        >
                          <RiFilePaper2Line />
                        </div>
                      </td>
                      <td>{row?.vitalNurseName}</td>
                      {/* <td className="flex flex-v-center space-between">
                                            {row?.doctorName}
                                            <div className="outline pointer" onClick={() => setModalData(row)}>
                                                <RiFilePaper2Line />
                                            </div>
                                        </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination component */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </div>
          )}
          {/* Collapsible Section for Vitals Chart */}
          <div style={{ marginTop: "30px" }}>
            <button onClick={toggleChart} className="submit-btn">
              {showChart ? "Hide Vitals Chart" : "Show Vitals Chart"}
            </button>
            {showChart && (
              <div className="m-t-10">
                <VitalsChart visitsData={data} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>Loading....</div>
      )}

      {modalData && (
        <ViewVisit
          closeModal={() => setModalData(null)}
          visit={modalData}
          next={next}
        />
      )}
      {noteModalData && (
        <NurseNotes
          closeModal={() => setNoteModalData(null)}
          data={noteModalData}
          next={next}
          patientId={patientId}
        />
      )}

      {isModalOpen && docpaths && docpaths.include('.tff') ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
              width: "80%",
              height: "83vh",
            }}
          >
            <div>{docpaths}</div>
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "red",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              &times;
            </button>

            {/* iFrame */}
            <iframe
              className="flex justify-center items-center w-full"
              src={`https://docs.google.com/gview?url=${docpaths}&embedded=true&cacheBust=${Date.now()}`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
              title="Document Viewer"
            ></iframe>
          </div>

        </div>
      ) : ''}

    </div>
  );
}

export default VisitTable;
