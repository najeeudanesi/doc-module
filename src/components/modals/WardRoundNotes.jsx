import React, { useEffect, useState } from "react";
import notification from "../../utility/notification";
import TagInputs from "../layouts/TagInputs";
import { RiCloseFill, RiDeleteBinLine } from "react-icons/ri";
import { formatDate } from "../../utility/general";
import axios from "axios";
import GhostTextCompletion from "../UI/TextPrediction";

function WardRoundNotes({ closeModal, treatment, patientId, patientName, getAllAdmittedPatients }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [wardRounds, setWardRounds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    
    // Get current user info
    const currentUser = JSON.parse(localStorage.getItem("USER_INFO"));
    const currentDoctorId = currentUser?.id;
    
    // Extract proper patient ID from treatment object
    const actualPatientId = treatment?.patient?.id || patientId || treatment?.patientId || 0;
    const actualPatientName = patientName || 
        (treatment?.patient ? `${treatment.patient.firstName} ${treatment.patient.lastName}` : "");
    const patientAge = treatment?.patient?.age || "N/A";
    
    const [formData, setFormData] = useState({
        serviceTreatmentId: treatment?.id || 0,
        patientId: actualPatientId,
        note: "",
        createdAt: new Date().toISOString(),
        doctorId: currentDoctorId
    });

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

    const getWardRounds = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            const res = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/medicals/api/ServiceTreatment/ward-round-note/service-treatment/${treatment?.id}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            console.log("Ward Rounds:", res.data);
            
            // Handle different response structures
            let roundsData = [];
            if (Array.isArray(res.data)) {
                roundsData = res.data;
            } else if (res.data?.data && Array.isArray(res.data.data)) {
                roundsData = res.data.data;
            } else if (res.data?.recordList && Array.isArray(res.data.recordList)) {
                roundsData = res.data.recordList;
            }
            
            setWardRounds(roundsData);
            setTotalPages(Math.ceil((roundsData?.length || 0) / 5)); // 5 items per page
        } catch (error) {
            console.error("Error fetching ward rounds:", error);
            notification({ message: "Failed to fetch ward rounds", type: "error" });
            setWardRounds([]);
        } finally {
            setLoading(false);
        }
    };    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.note.trim()) {
            notification({ message: "Please enter a note", type: "error" });
            return;
        }

        setLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json'
                },
            };

            if (isEditing && editingId) {
                // Update existing ward round
                const payload = {
                    ...formData,
                    id: editingId,
                };
                const res = await axios.put(
                    `${process.env.REACT_APP_BASE_URL}/medicals/api/ServiceTreatment/ward-round-note`,
                    payload,
                    config
                );
                if (res.status === 200) {
                    notification({ message: "Ward round updated successfully", type: "success" });
                    setIsEditing(false);
                    setEditingId(null);
                    resetForm();
                    await getWardRounds();
                    if (getAllAdmittedPatients) {
                        await getAllAdmittedPatients();
                    }
                }
            } else {
                // Create new ward round
                const res = await axios.post(
                    `${process.env.REACT_APP_BASE_URL}/medicals/api/ServiceTreatment/ward-round-note`,
                    formData,
                    config
                );
                if (res.status === 200 || res.status === 201) {
                    notification({ message: "Ward round added successfully", type: "success" });
                    resetForm();
                    await getWardRounds();
                    if (getAllAdmittedPatients) {
                        await getAllAdmittedPatients();
                    }
                }
            }
        } catch (error) {
            console.error("Error saving ward round:", error);
            notification({ 
                message: isEditing ? "Failed to update ward round" : "Failed to add ward round", 
                type: "error" 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (wardRound) => {
        setIsEditing(true);
        setEditingId(wardRound.id);
        setFormData({
            serviceTreatmentId: wardRound.serviceTreatmentId,
            patientId: wardRound.patientId,
            note: wardRound.note,
            createdAt: wardRound.createdAt,
            doctorId: currentDoctorId
        });
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        setLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            const res = await axios.delete(
                `${process.env.REACT_APP_BASE_URL}/medicals/api/ServiceTreatment/ward-round-note`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                    data: { id: deleteId }
                }
            );
            
            if (res.status === 200) {
                notification({ message: "Ward round deleted successfully", type: "success" });
                setShowDeleteModal(false);
                setDeleteId(null);
                await getWardRounds();
                if (getAllAdmittedPatients) {
                    await getAllAdmittedPatients();
                }
            }
        } catch (error) {
            console.error("Error deleting ward round:", error);
            notification({ message: "Failed to delete ward round", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    const resetForm = () => {
        setFormData({
            serviceTreatmentId: treatment?.id || 0,
            patientId: actualPatientId,
            note: "",
            createdAt: new Date().toISOString(),
            doctorId: currentDoctorId
        });
        setIsEditing(false);
        setEditingId(null);
    };

    useEffect(() => {
        if (treatment?.id) {
            getWardRounds();
        }
    }, [treatment?.id]);

    // Paginate ward rounds - ensure wardRounds is always an array
    const paginatedWardRounds = Array.isArray(wardRounds) 
        ? wardRounds.slice((currentPage - 1) * 5, currentPage * 5)
        : [];

    return (
        <div className='overlay'>
            <RiCloseFill className='close-btn pointer' onClick={closeModal} />
            <div className="modal-content" style={{ maxWidth: "900px" }}>
                <div className="flex space-between">
                    <div className="flex flex-v-center m-t-20 m-l-10 col-6">
                        <p className="bold-text m-r-10">Ward Round Notes</p> | 
                        <p className="m-l-10">{actualPatientName} {patientAge !== "N/A" ? `${patientAge} years` : ""}</p>
                    </div>
                </div>

                {/* Patient Info */}
                <div className="m-t-20 m-b-20" style={{ 
                    padding: "15px", 
                    backgroundColor: "#f5f5f5", 
                    borderRadius: "8px" 
                }}>
                    <div className="flex space-between">
                        <div>
                            <p><strong>Patient Ref:</strong> {treatment?.patient?.patientRef || "N/A"}</p>
                            <p><strong>Diagnosis:</strong> {treatment?.diagnosis || "N/A"}</p>
                        </div>
                        <div>
                            <p><strong>Admission Date:</strong> {formatDate(treatment?.dateOfVisit)}</p>
                            <p><strong>Doctor:</strong> {treatment?.doctor ? `${treatment.doctor.firstName} ${treatment.doctor.lastName}` : "N/A"}</p>
                        </div>
                    </div>
                </div>

                {/* Add/Edit Form */}
                <div className="m-t-20 m-b-20" style={{ 
                    padding: "20px", 
                    border: "1px solid #ddd", 
                    borderRadius: "8px",
                    backgroundColor: "#fff"
                }}>
                    <h4 className="m-b-10">{isEditing ? "Edit Ward Round Note" : "Add Ward Round Note"}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="w-100">
                            <GhostTextCompletion
                                label="Ward Round Note *"
                                name="note"
                                value={formData.note}
                                handleChange={handleInputChange}
                                noEdit={false}
                                max={5000}
                            />
                        </div>
                        
                        <div className="flex gap-10">
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : (isEditing ? "Update Note" : "Add Note")}
                            </button>
                            
                            {isEditing && (
                                <button 
                                    type="button" 
                                    className="outline-btn"
                                    onClick={resetForm}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Ward Rounds List */}
                <div className="m-t-20">
                    <h4 className="m-b-10">Ward Round History</h4>
                    {loading && wardRounds.length === 0 ? (
                        <div className="center-text m-t-20">Loading...</div>
                    ) : paginatedWardRounds.length === 0 ? (
                        <div className="center-text m-t-20">
                            <p>No ward round notes available</p>
                        </div>
                    ) : (
                        <div className="w-100 none-flex-item">
                            <table className="bordered-table">
                                <thead className="border-top-none">
                                    <tr className="border-top-none">
                                        <th className="center-text">Date</th>
                                        <th className="center-text">Time</th>
                                        <th>Note</th>
                                        <th className="center-text">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="white-bg view-det-pane">
                                    {paginatedWardRounds.map((round) => (
                                        <tr key={round.id}>
                                            <td className="center-text">
                                                {new Date(round.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="center-text">
                                                {new Date(round.createdAt).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </td>
                                            <td>{round.note}</td>
                                            <td className="center-text">
                                                <div className="flex gap-8 flex-h-center">
                                                    {/* Only show edit/delete buttons if current user created this note */}
                                                    {round.doctorId === currentDoctorId ? (
                                                        <>
                                                            <button
                                                                className="icon-btn"
                                                                onClick={() => handleEdit(round)}
                                                                title="Edit"
                                                                style={{
                                                                    padding: "5px 10px",
                                                                    backgroundColor: "#007bff",
                                                                    color: "white",
                                                                    border: "none",
                                                                    borderRadius: "4px",
                                                                    cursor: "pointer"
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="icon-btn"
                                                                onClick={() => handleDeleteClick(round.id)}
                                                                title="Delete"
                                                                style={{
                                                                    padding: "5px 10px",
                                                                    backgroundColor: "#dc3545",
                                                                    color: "white",
                                                                    border: "none",
                                                                    borderRadius: "4px",
                                                                    cursor: "pointer"
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span style={{ color: "#999", fontSize: "12px" }}>
                                                            View Only
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="pagination flex space-between col-6 m-t-20 m-b-20">
                        <div className="flex gap-8">
                            <div className="bold-text">Page</div>
                            <div className="m-r-20">
                                {currentPage}/{totalPages}
                            </div>
                        </div>
                        <div className="flex gap-8">
                            <button
                                className={`pagination-btn ${currentPage === 1 ? "disabled" : ""}`}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                {"Previous"}
                            </button>

                            {generatePageNumbers().map((page, index) => (
                                <button
                                    key={`page-${index}`}
                                    className={`pagination-btn ${
                                        currentPage === page ? "bg-green text-white" : ""
                                    }`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className={`pagination-btn ${
                                    currentPage === totalPages ? "disabled" : ""
                                }`}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                {"Next"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "8px",
                        maxWidth: "400px",
                        width: "90%",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Confirm Delete</h3>
                        <p style={{ marginBottom: "25px" }}>
                            Are you sure you want to delete this ward round note? This action cannot be undone.
                        </p>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                            <button
                                onClick={cancelDelete}
                                disabled={loading}
                                style={{
                                    padding: "8px 20px",
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={loading}
                                style={{
                                    padding: "8px 20px",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WardRoundNotes;
