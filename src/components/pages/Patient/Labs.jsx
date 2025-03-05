import { useState } from "react";
import InternalLabs from "./InternalLabs";
import ExternalLabs from "./ExternalLabs";

function Labs({ id }) {
    const [activeTab, setActiveTab] = useState("Internal Labs");

    return (
        <div>
            {/* Tabs Navigation */}
            <div className="flex flex-h-end tabs-container">
                <div
                    className={`tab-item ${activeTab === "Internal Labs" ? "active" : ""}`}
                    onClick={() => setActiveTab("Internal Labs")}
                >
                    Internal Labs
                </div>
                <div
                    className={`tab-item ${activeTab === "External Labs" ? "active" : ""}`}
                    onClick={() => setActiveTab("External Labs")}
                >
                    External Labs
                </div>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === "Internal Labs" ? <InternalLabs id={id} /> : <ExternalLabs id={id} />}
            </div>
        </div>
    );
}

export default Labs;
