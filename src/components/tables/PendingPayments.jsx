import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utility/general";
import DiscountModal from "../modals/DiscountModal";

function PendingPayments({ data, fetch }) {
    const navigate = useNavigate();
    const [pendingPayment, setPendingPayment] = useState({})
    const [modalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    }

    return (
        <div className="w-100 ">
            <div className="w-100 none-flex-item m-t-40">
                <table className="bordered-table">
                    <thead className="border-top-none">
                        <tr className="border-top-none">
                            <th>S/N</th>
                            <th>Service/Product Name</th>
                            <th>Cost</th>

                            <th>Date Created</th>
                        </tr>
                    </thead>

                    <tbody className="white-bg view-det-pane">
                        {data?.map((row, index) => {
                            const lastVisit =
                                row?.visits && row?.visits?.length > 0
                                    ? row?.visits[row?.visits?.length - 1]
                                    : null;

                            return (
                                <tr
                                    key={index}
                                    className="pointer"
                                    onClick={() => {
                                        setPendingPayment(row);
                                        toggleModal()
                                    }}
                                >
                                    <td>{index + 1}</td>

                                    <td>{row?.serviceOrProductName}</td>
                                    <td>{row?.cost}</td>
                                    <td>{formatDate(row?.createdOn)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {modalOpen && 
                <DiscountModal data={pendingPayment} fetch={fetch} closeModal={toggleModal}/>
            }
        </div>
    );
}

export default PendingPayments;
