/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { Routes, Route } from 'react-router';
import Dashboard from '../components/pages/Dashboard';
import Patients from '../components/pages/Patients';
import Facility from '../components/pages/Facility';
import PatientDetails from '../components/pages/PatientDetails';
import AuthRoute from './AuthRoute';
import CustomerEngagement from '../components/pages/CustomerEngagement';
import NotFound from '../components/pages/NotFound'; // Import your 404 page component
import PatientDetailsNew from '../components/pages/PatientDetailsNew';
import FamilyConsultation from '../components/pages/Patient/FamilyConsultation';
import FamilyConsultationReadOnly from '../components/pages/Patient/FamilyConsultationReadOnly';
import IVFConsultation from '../components/pages/Patient/IVFConsultation';
import GeneralSurgery from '../components/pages/Patient/GeneralSurgery';
import Ophthalmology from '../components/pages/Patient/Opthalmologyy';

import Orthopedic from '../components/pages/Patient/Orthopedic';
import GeneralPractice from '../components/pages/Patient/GeneralPracticee';
import Treatments from '../components/pages/Patient/Treatments';
import Antinatal from '../components/pages/Patient/Antinatal';
import CardiologyForm from '../components/pages/Patient/CardiologyForm';
import PatientsBySpecialization from '../components/pages/PatientsBySpecialization';
import AllOtherPracticeForm from '../components/pages/Patient/AllOtherPracticeForm';
import AllOtherPractice from '../components/pages/Patient/AllOtherPractice';

export default () => (
    <Routes>
        <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
        <Route path="/patients" element={<AuthRoute><Patients /></AuthRoute>} />
        <Route path="/specialization-patients" element={<AuthRoute><PatientsBySpecialization /></AuthRoute>} />
        <Route path="/facility" element={<AuthRoute><Facility /></AuthRoute>} />
        <Route path="/customer-engagement" element={<AuthRoute><CustomerEngagement /></AuthRoute>} />
        {/* <Route path="/patients/patient-details/:patientId" element={<AuthRoute><PatientDetails/></AuthRoute>} /> */}
        <Route path="/patients/patient-details/:patientId" element={<AuthRoute><PatientDetailsNew /></AuthRoute>} />
        <Route path="/patients/family-medcine/:patientId" element={<AuthRoute><FamilyConsultation /></AuthRoute>} />
        <Route path="/patients/family-medcine-treatment/:patientId" element={<AuthRoute><FamilyConsultationReadOnly /></AuthRoute>} />
        <Route path="/patients/IVF-consultation/:patientId" element={<AuthRoute><IVFConsultation /></AuthRoute>} />
        <Route path="/patients/general-surgery/:patientId" element={<AuthRoute><GeneralSurgery /></AuthRoute>} />
        <Route path="/patients/orthopedic-consultation/:patientId" element={<AuthRoute><Orthopedic /></AuthRoute>} />
        <Route path="/patients/general-practice/:patientId" element={<AuthRoute><GeneralPractice /></AuthRoute>} />
        <Route path="/patients/ophthalmology/:patientId" element={<AuthRoute><Ophthalmology /></AuthRoute>} />
        <Route path="/patients/cardiology/:patientId" element={<AuthRoute><CardiologyForm /></AuthRoute>} />
        <Route path="/patients/antinatal/:patientId" element={<AuthRoute><Antinatal /></AuthRoute>} />

        <Route path="/patients/other-practices/:patientId" element={<AuthRoute><AllOtherPractice /></AuthRoute>} />

       
        {/* Render the NotFound component for unmatched routes */}
        <Route path="*" element={<NotFound />} />
    </Routes>
);
