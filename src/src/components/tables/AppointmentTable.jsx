import { Clock10Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { get } from "../../utility/fetch";
import { formatDate } from "../../utility/general";
import NurseNotes from "../modals/NurseNotes";
import ViewVisit from "../modals/ViewVisit";
import ViewAppointmentModal from "../modals/ViewAppointmentModal"; // Import your modal
import Pagination from "../UI/Pagination";

function AppointmentTable({ patientId, next }) {
    const [modalData, setModalData] = useState(null); // State to store the data for the modal
    const [noteModalData, setNoteModalData] = useState(null); // State to store the data for the note modal
    const [appointmentModalData, setAppointmentModalData] = useState(null); // New state for ViewAppointmentModal
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const generatePageNumbers = () => {
        let pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages = [1, 2, 3, 4, totalPages];
            } else if (currentPage >= totalPages - 2) {
                pages = [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
            }
        }
        return pages;
    };

    const fetchData = async (currentPage) => {
        try {
            const response = await get(`/appointment/get-appointment-bypatientId/${patientId}?pageIndex=${currentPage}&pageSize=10`);
            console.log("Fetched data:", response.data); // Log fetched data for debugging
            setData(response?.data);
            setTotalPages(response?.pageCount);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    return (
        <div className="w-100">
            {!isLoading ? (
                <div className="w-100 none-flex-item m-t-40">
                    <table className="bordered-table-2">
                        <thead className="border-top-none">
                            <tr className="border-top-none">
                                <th className="center-text">Date</th>
                                <th className="center-text">Time</th>
                                <th className="center-text">Description</th>
                                <th className="center-text">Patient Name</th>
                                <th className="center-text">Tracking</th>
                                <th className="center-text">Doctor</th>
                                <th className="center-text">Nurse</th>
                                <th className="center-text"> </th>
                            </tr>
                        </thead>

                        <tbody className="white-bg view-det-pane">
                            {data.map((row) => (
                                <tr key={row?.id}>
                                    <td>{formatDate(row?.appointDate)}</td>
                                    <td>{row?.appointTime}</td>
                                    <td>{row?.description}</td>
                                    <td>{row?.patientName}</td>
                                    <td>{row?.tracking}</td>
                                    <td>{row?.doctor}</td>
                                    <td>{row?.nurse}</td>
                                    <td>
                                        <div
                                            className="rounded-btn-yellow w-75 flex flex-v-center gap-2 flex-h-center"
                                            onClick={() => {
                                                setAppointmentModalData(row); // Pass the row data to the modal
                                                console.log("Clicked row data:", row); // Log clicked row data for debugging
                                            }}
                                        >
                                            <Clock10Icon />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination component */}
                    <div className="w-100 m-t-20"> <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageChange={handlePageChange}
                    /></div>

                </div>
            ) : (
                <div>Loading....</div>
            )}

            {modalData && <ViewVisit closeModal={() => setModalData(null)} visit={modalData} next={next} />}
            {noteModalData && <NurseNotes closeModal={() => setNoteModalData(null)} data={noteModalData} next={next} patientId={patientId} />}
            {appointmentModalData && (
                <ViewAppointmentModal
                    closeModal={() => setAppointmentModalData(null)} // Close modal handler
                    data={appointmentModalData} // Pass the data to the modal
                />
            )}
        </div>
    );
}

export default AppointmentTable;
