import React, { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { post } from "../../utility/fetch";
import { formatDate } from "../../utility/general";
import TextArea from "../UI/TextArea";
import { useNavigate } from "react-router-dom";
import InputField from "../UI/InputField";
import toast from "react-hot-toast";

function DiscountModal({ data, patientId, closeModal, fetch }) {
    const [visits, setVisits] = useState([]);
    const [lastVisit, setLastVisit] = useState(null);
    const [loading, setLoading] = useState(false);
    const [nurseNotes, setnurseNotes] = useState([]);
    const docInfo = JSON.parse(localStorage.getItem('USER_INFO'))
    const [payload, setPayload] = useState({
        comment: "",
        discountPercentage: 0,
        patientId: data?.patientId,
        appointmentId: data?.appointmentId,
        doctorId: docInfo?.employeeId,
        categoryItemId: data?.serviceOrProductId
    });

    console.log(data)

    const addDiscount = async () => {
        setLoading(true);
        try {
            const response = await post(
                `/PatientPayment/AddDiscount`,
                payload
            );

            if (response?.data?.message == 'Discount applied successfully') {
                toast.success("Discount added successfully");
                fetch();
                closeModal();
            }else{
                toast.error("Error adding Discount");
            }

        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overlay">
            <RiCloseFill className="close-btn pointer" onClick={closeModal} />
            <div className="modal-box max-w-800">
                <div className="p-40">
                    <h3 className="bold-text">Discount On {data?.serviceOrProductName} Payment</h3>

                    <div className="m-t-20">
                        <InputField
                            label="Discount Percentage"
                            name="discountPercentage"
                            value={payload.discountPercentage}
                            type="number"
                            onChange={(e) => setPayload({ ...payload, discountPercentage: parseInt(e.target.value) })}
                        />
                    </div>

                    <div>
                        <TextArea
                            label="Comment"
                            name="comment"
                            value={payload.comment}
                            rows={8}
                            onChange={(e) => setPayload({ ...payload, comment: e.target.value })}
                        />
                    </div>
                    <button className="submit-btn m-t-20" onClick={addDiscount} disabled={loading}>
                        Add Discount
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DiscountModal;
