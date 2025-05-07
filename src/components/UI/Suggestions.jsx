import React, { useEffect, useState } from 'react';
import { BeatLoader } from "react-spinners";
import axios from 'axios';

const Suggestions = ({ payload, id,  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestion, setSuggestion] = useState('');
    const [allergyPred, setAllergyPred] = useState('');
    const [riskAnalysis, setRiskAnalysis] = useState('');

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

    const fetchSuggestions = async () => {
        setIsLoading(true);

        // Check if payload is empty
        if (!payload || Object.keys(payload).length === 0) {
            setIsLoading(false);
            setSuggestion('No data available for analysis.');
        }
        try {
            const drugRes = await axios.post(`${process.env.REACT_APP_BASE_URL}/ConnectedHealthWebApi/api/Patient/drug-interactions`, payload);
            if (drugRes.status === 200) {
                const formattedDrugSuggestion = formatSuggestion(drugRes?.data?.data?.analysis);
                setSuggestion(formattedDrugSuggestion);
            }

            const allergyRes = await axios.post(`${process.env.REACT_APP_BASE_URL}/ConnectedHealthWebApi/api/Patient/allergy-interactions`, payload);
            if (allergyRes.status === 200) {
                const formattedAllergySuggestion = formatSuggestion(allergyRes?.data?.data?.analysis);
                setAllergyPred(formattedAllergySuggestion);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toLabel = (key) =>
        key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());

    // render each field of the risk object
    const renderRiskData = (data) => (
        <div className="space-y-2">
            {Object.entries(data).map(([field, value]) => {
                // for array values (like lifestyleAdvice), render a nested list
                if (Array.isArray(value)) {
                    return (
                        <div key={field}>
                            <span className="text-green-600 font-bold">{toLabel(field)}:</span>
                            <ul className="ml-4 list-disc">
                                {value.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    );
                }

                // for everything else (string, number)
                return (
                    <div key={field}>
                        <span className="text-green-600 font-bold">{toLabel(field)}:</span>{' '}
                        <span>{value}</span>
                    </div>
                );
            })}
        </div>
    );

    const fetchRiskSuggestions = async () => {
        setIsLoading(true);
        try {

            const riskRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/ConnectedHealthWebApi/api/Patient/risk-analysis`, payload);
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
        }else {
            setIsLoading(false);
            setSuggestion(null);
        }
    }, [payload]);
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
                        <div className="cards mt-5 p-4">
                            <h3 className="text-green-600 font-bold mb-3">Risk Analysis</h3>
                            {renderRiskData(riskAnalysis)}
                        </div>
                    )}
                    {suggestion && (
                        <div className="cards m-t-20">
                            <h3 className='green'>Drug Interaction Suggestions</h3>
                            <ul>{suggestion}</ul>
                        </div>
                    )}
                    {allergyPred && (
                        <div className="cards m-t-20">
                            <h3 className='green'>Allergic Reactions</h3>
                            <ul>{allergyPred}</ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Suggestions;
