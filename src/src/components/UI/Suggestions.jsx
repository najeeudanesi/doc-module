import React, { useEffect, useState } from 'react';
import { BeatLoader } from "react-spinners";
import axios from 'axios';
import { get } from '../../utility/fetch';

const Suggestions = ({ payload, patientId, symptoms }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestion, setSuggestion] = useState('');
    const [allergyPred, setAllergyPred] = useState('');
    const [riskAnalysis, setRiskAnalysis] = useState('');

    const [showRisk, setShowRisk] = useState(true);
    const [showSuggestion, setShowSuggestion] = useState(true);
    const [showAllergy, setShowAllergy] = useState(true);
    const [showDiagnosis, setShowDiagnosis] = useState(true);
    const [diagnosis, setDiagnosis] = useState('');

    const formatSuggestion = (rawSuggestion) => {
        const lines = rawSuggestion
            .split('\n')
            .filter(line => line.trim().startsWith('-'))
            .map(line => line.trim().slice(1).trim());

        return lines.map((line, idx) => {
            let html = line;

            html = html.replace(
                /^(#+)\s*(.+)$/,
                (_match, hashes, content) =>
                    `<span style="color: green; font-weight: bold;">${content}</span>`
            );

            html = html.replace(
                /(\*+)([^*]+)\1/g,
                (_match, stars, content) =>
                    `<span style="color: green; font-weight: bold;">${content}</span>`
            );

            return (
                <li
                    key={idx}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            );
        });
    };

    const formatDiagnosis = (diagnosisData) => {
        if (!diagnosisData || !diagnosisData.possibleDiagnoses) return null;
    
        const { possibleDiagnoses, notes } = diagnosisData;
    
        return (
            <div>
                {/* Header */}
                <p>
                    <span style={{ color: "green", fontWeight: "bold" }}>
                        {possibleDiagnoses[0]}
                    </span>
                </p>
    
                {/* List of diagnoses */}
                <ul style={{ marginTop: "10px" }}>
                    {possibleDiagnoses.slice(1).map((item, index) => (
                        <li key={index} style={{ marginBottom: "5px" }}>
                            {item}
                        </li>
                    ))}
                </ul>
    
                {/* Notes */}
                <p
                    style={{
                        fontStyle: "italic",
                        color: "gray",
                        textAlign: "right",
                        marginTop: "10px",
                    }}
                >
                    {notes}
                </p>
            </div>
        );
    };

    const fetchSuggestions = async () => {
        setIsLoading(true);

        if (!payload || Object.keys(payload).length === 0) {
            setIsLoading(false);
            setSuggestion('No data available for analysis.');
            return;
        }

        try {

            const diagnosisRes = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/ConnectedHealthWebApi/api/Diagnosis/diagnose`,
                { patientId: patientId, symptoms: [symptoms] }
            );
            console.log('Diagnosis Response:', diagnosisRes?.data?.diagnosis?.possibleDiagnoses);
            if (diagnosisRes?.data?.diagnosis?.isSuccessful) {
                const formattedDiagnosis = formatDiagnosis(diagnosisRes?.data?.diagnosis);
                setDiagnosis(formattedDiagnosis);
            }

            const drugRes = await axios.post(`${process.env.REACT_APP_BASE_URL}/ConnectedHealthWebApi/api/Patient/drug-interactions`, payload);
            if (drugRes?.status === 200) {
                const formattedDrugSuggestion = formatSuggestion(drugRes?.data?.data?.analysis);
                setSuggestion(formattedDrugSuggestion);
            }

            const allergyRes = await axios.post(`${process.env.REACT_APP_BASE_URL}/ConnectedHealthWebApi/api/Patient/allergy-interactions`, payload);
            if (allergyRes?.status === 200) {
                const formattedAllergySuggestion = formatSuggestion(allergyRes?.data?.data?.analysis);
                setAllergyPred(formattedAllergySuggestion);
            }

            
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    console.log('Payload:', diagnosis);
    const toLabel = (key) =>
        key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());

    const renderRiskData = (data) => (
        <div className="space-y-2 m-t-10">
            {Object.entries(data).map(([field, value]) => {
                if (Array.isArray(value)) {
                    return (
                        <div key={field}>
                            <span className="green bold-text">{toLabel(field)}:</span>
                            <ul className="ml-4 list-disc">
                                {value.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    );
                }

                return (
                    <div key={field}>
                        <span style={{ color: 'green', fontWeight: 'bold' }}>{toLabel(field)}:</span>{' '}
                        <span>{value}</span>
                    </div>
                );
            })}
        </div>
    );

    const fetchRiskSuggestions = async () => {
        setIsLoading(true);
        try {
            const riskRes = await get(`/patients/predictive-risk-analysis/${patientId}`);
            if (riskRes.code === 1) {
                setRiskAnalysis(riskRes?.data);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (payload?.medications?.length > 0) {
            fetchSuggestions();
        }else if(symptoms){
            fetchSuggestions();
        } else {
            setIsLoading(false);
            setSuggestion(null);
        }
    }, [payload, symptoms]);

    useEffect(() => {
        fetchRiskSuggestions();
    }, []);

    return (
        <div>
            {isLoading ? (
                <div className="flex flex-v-center flex-h-center m-t-20">
                    <BeatLoader color="#2d5f21e0" size={10} margin={5} />
                    <p className="m-l-10">Analysing Prescription...</p>
                </div>
            ) : (
                <>
                    {riskAnalysis && (
                        <div className="cards mt-20 p-4">
                            <h3
                                className="green pointer"
                                onClick={() => setShowRisk(!showRisk)}
                            >
                                Risk Analysis Suggestions {showRisk ? '▲' : '▼'}
                            </h3>
                            {showRisk && renderRiskData(riskAnalysis)}
                        </div>
                    )}
                    {suggestion && (
                        <div className="cards m-t-20">
                            <h3
                                className="green pointer"
                                onClick={() => setShowSuggestion(!showSuggestion)}
                            >
                                Drug Interaction Suggestions {showSuggestion ? '▲' : '▼'}
                            </h3>
                            {showSuggestion && <ul>{suggestion}</ul>}
                        </div>
                    )}
                    {allergyPred && (
                        <div className="cards m-t-20">
                            <h3
                                className="green pointer"
                                onClick={() => setShowAllergy(!showAllergy)}
                            >
                                Allergic Reactions Suggestions {showAllergy ? '▲' : '▼'}
                            </h3>
                            {showAllergy && <ul>{allergyPred}</ul>}
                        </div>
                    )}
                    {diagnosis && (
                        <div className="cards m-t-20">
                            <h3
                                className="green pointer"
                                onClick={() => setShowDiagnosis(!showDiagnosis)}
                            >
                                Diagnosis Suggestions {showDiagnosis ? '▲' : '▼'}
                            </h3>
                            {showDiagnosis && <ul>{diagnosis}</ul>}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Suggestions;