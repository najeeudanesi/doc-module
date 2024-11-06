import React, { useEffect, useState } from "react";
import { formatDate } from "../../utility/general";
import { get } from "../../utility/fetch";
import ViewVisit from "../modals/ViewVisit";
import { RiFilePaper2Line } from "react-icons/ri";
import NurseNotes from "../modals/NurseNotes";
import Pagination from "../UI/Pagination";


function VisitTable({ patientId, next }) {
    const [modalData, setModalData] = useState(null); // State to store the data for the modal
    const [noteModalData, setNoteModalData] = useState(null); // State to store the data for the note modal
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const pageSize = 10; // Number of rows per page

    const fetchData = async (page = 1) => {
        setIsLoading(true);
        try {
            const response = await get(`/patients/vital-by-patientId?patientId=${patientId}&pageIndex=${page}&pageSize=${pageSize}`);
            setData(response.data);
            setTotalPages(response.totalPages || 1); // Assuming the response includes total pages
        } catch (e) {
            console.log(e);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData(currentPage); // Fetch data when the component mounts or page changes
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="w-100">
            {!isLoading ? (
                <div className="w-100 none-flex-item m-t-40">
                    <table className="bordered-table-2">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="w-10">Date</th>
                                <th>Weight</th>

                                <th>Temp</th>
                                <th>Height</th>
                                <th>Heart</th>
                                <th>Respiratory</th>
                                <th>Blood Pressure</th>
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
                                    <td>{row?.heartPulse}</td>
                                    <td>{row?.respiratory}</td>
                                    <td>{row?.bloodPressure}</td>
                                    <td>
                                        <div className="outline pointer" onClick={() => setNoteModalData(row)}>
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
            ) : (<div>Loading....</div>)}

            {modalData && <ViewVisit closeModal={() => setModalData(null)} visit={modalData} next={next} />}
            {noteModalData && <NurseNotes closeModal={() => setNoteModalData(null)} data={noteModalData} next={next} patientId={patientId} />}
        </div>
    );
}

export default VisitTable;
