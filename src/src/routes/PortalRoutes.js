/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Routes, Route } from "react-router";
import Dashboard from "../components/pages/Dashboard";
import Patients from "../components/pages/Patients";
import Facility from "../components/pages/Facility";
import PatientDetails from "../components/pages/PatientDetails";
import AuthRoute from "./AuthRoute";
import CustomerEngagement from "../components/pages/CustomerEngagement";
import NotFound from "../components/pages/NotFound"; // Import your 404 page component
import PatientDetailsNew from "../components/pages/PatientDetailsNew";
import FamilyConsultation from "../components/pages/Patient/FamilyConsultation";
import FamilyConsultationReadOnly from "../components/pages/Patient/FamilyConsultationReadOnly";
import IVFConsultation from "../components/pages/Patient/IVFConsultation";
import GeneralSurgery from "../components/pages/Patient/GeneralSurgery";
import Orthopedic from "../components/pages/Patient/Orthopedic";
import GeneralPractice from "../components/pages/Patient/GeneralPracticee";
import Treatments from "../components/pages/Patient/Treatments";
import Antinatal from "../components/pages/Patient/Antinatal";
import MedicalDashboard from "../components/pages/medical-dashboard";
import Others from "../components/pages/others/Others";
import Lab from "../components/pages/lab/Lab";
import PharmacyPage from "../components/pages/pharmacy/Pharmacy";
import Career from "../components/pages/career/Career";
import ProfilePage from "../components/pages/career/ProfilePages";

export default () => (
  <Routes>
    <Route
      path="/dashboard"
      element={
        <AuthRoute>
          <Dashboard />
        </AuthRoute>
      }
    />
    <Route
      path="/patients"
      element={
        <AuthRoute>
          <Patients />
        </AuthRoute>
      }
    />
    <Route
      path="/appointments"
      element={
        <AuthRoute>
          <MedicalDashboard />
        </AuthRoute>
      }
    />
    <Route
      path="/others"
      element={
        <AuthRoute>
          <Others />
        </AuthRoute>
      }
    />
    <Route
      path="/lab"
      element={
        <AuthRoute>
          <Lab />
        </AuthRoute>
      }
    />
    <Route
      path="/pharmacy"
      element={
        <AuthRoute>
          <PharmacyPage />
        </AuthRoute>
      }
    />
    <Route
      path="/career"
      element={
        <AuthRoute>
          <Career />
        </AuthRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <AuthRoute>
          <ProfilePage />
        </AuthRoute>
      }
    />

    <Route
      path="/customer-engagement"
      element={
        <AuthRoute>
          <CustomerEngagement />
        </AuthRoute>
      }
    />
    {/* <Route path="/patients/patient-details/:patientId" element={<AuthRoute><PatientDetails/></AuthRoute>} /> */}
    <Route
      path="/patients/patient-details/:patientId"
      element={
        <AuthRoute>
          <PatientDetailsNew />
        </AuthRoute>
      }
    />
    <Route
      path="/patients/family-medcine/:patientId"
      element={
        <AuthRoute>
          <FamilyConsultation />
        </AuthRoute>
      }
    />
    <Route
      path="/patients/family-medcine-treatment/:patientId"
      element={
        <AuthRoute>
          <FamilyConsultationReadOnly />
        </AuthRoute>
      }
    />
    <Route
      path="/patients/IVF-consultation/:patientId"
      element={
        <AuthRoute>
          <IVFConsultation />
        </AuthRoute>
      }
    />
    <Route
      path="/patients/general-surgery/:patientId"
      element={
        <AuthRoute>
          <GeneralSurgery />
        </AuthRoute>
      }
    />
    <Route
      path="/patients/orthopedic-consultation/:patientId"
      element={
        <AuthRoute>
          <Orthopedic />
        </AuthRoute>
      }
    />
    <Route
      path="/patients/general-practice/:patientId"
      element={
        <AuthRoute>
          <GeneralPractice />
        </AuthRoute>
      }
    />
    <Route
      path="/patients/antinatal/:patientId"
      element={
        <AuthRoute>
          <Antinatal />
        </AuthRoute>
      }
    />

    {/* Render the NotFound component for unmatched routes */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);
