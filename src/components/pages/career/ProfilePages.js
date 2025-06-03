import React, { useState } from 'react';
import './profilePage.css'; // Import our unique-named CSS
import {
  FaGraduationCap,
  FaScroll,
  FaCertificate,
  FaBriefcase,
  FaUsers,
  FaAward,
  FaArrowRight,
  FaRegEdit,
  FaRegUserCircle,
//   FaArrowRightFromBracket,
  FaChevronDown, // New icon for accordion expand/collapse
  FaChevronUp // New icon for accordion expand/collapse
} from 'react-icons/fa';

// Placeholder for profile image
import profilePic from './dr_ember_wynn_placeholder.png';

function ProfilePage() {
  // State to manage which accordion item is currently open
  const [openAccordion, setOpenAccordion] = useState('education'); // 'education' open by default

  const profileInfo = {
    name: 'Dr. Ember Wynn',
    hospital: 'Healing Stripes Hospital, Lagos',
    profilePic: profilePic,
  };

  // Define the accordion sections (no 'checked' property needed anymore)
  const sections = [
    { id: 'education', label: 'Education', icon: FaGraduationCap, hasContent: true },
    { id: 'licenses', label: 'Licenses', icon: FaScroll, hasContent: false },
    { id: 'certifications', label: 'Certifications', icon: FaCertificate, hasContent: false },
    { id: 'work-experiences', label: 'Work Experiences', icon: FaBriefcase, hasContent: false },
    { id: 'associations', label: 'Associations', icon: FaUsers, hasContent: false },
    { id: 'awards-recognition', label: 'Awards & Recognition', icon: FaAward, hasContent: false },
  ];

  const educationEntries = [
    {
      id: 1,
      institution: 'Lagos State University Teaching Hospital',
      degree: 'Bachelor of Medicine Bachelor of Surgery (MBBS)',
      distinction: 'First Class Distinction',
      years: '2005 - 2011',
      country: 'Nigeria',
    },
    {
      id: 2,
      institution: 'London School of Nursing',
      degree: 'Bachelor of Medicine Bachelor of Surgery (MBBS)',
      distinction: 'First Class Distinction',
      years: '2012 - 2015',
      country: 'United Kingdom',
    },
  ];

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id); // Close if already open, open otherwise
  };

  const renderSectionContent = (id) => {
    switch (id) {
      case 'education':
        return (
          <>
            <div className="profile-accordion__section-header">
              <h2 className="profile-accordion__section-title">Education</h2>
              {/* Add any section-specific actions here if needed, like "Add new" */}
            </div>
            {educationEntries.map((entry) => (
              <div key={entry.id} className="profile-education__card">
                <div className="profile-education__details">
                  <div className="profile-education__degree">{entry.degree}</div>
                  <div className="profile-education__institution">{entry.institution}</div>
                  <div className="profile-education__distinction">{entry.distinction}</div>
                  <div className="profile-education__years">{entry.years}</div>
                  <div className="profile-education__country">{entry.country}</div>
                </div>
                <div className="profile-education__actions">
                  <button className="profile-education__view-certificate">
                    View certificate
                     {/* <FaArrowRightFromBracket /> */}
                  </button>
                  <FaRegEdit className="profile-education__edit-icon" />
                </div>
              </div>
            ))}
          </>
        );
      case 'licenses':
      case 'certifications':
      case 'work-experiences':
      case 'associations':
      case 'awards-recognition':
        return (
          <p className="profile-accordion__placeholder">
            Content for {sections.find(s => s.id === id).label} goes here.
            {/* You can add an "Add New" button here if applicable to all sections */}
            <button className="profile-accordion__add-new-btn">
                <FaArrowRight /> Add new
            </button>
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-page__container w-100 main-content">
      {/* Top Header */}
      <div className="profile-top-header">
        <div className="profile-top-header__profile-info">
          <img
            src={profileInfo.profilePic}
            alt="Profile"
            className="profile-top-header__profile-pic"
          />
          <div className="profile-top-header__text-info">
            <span className="profile-top-header__name">{profileInfo.name}</span>
            <span className="profile-top-header__hospital">
              {profileInfo.hospital}
            </span>
          </div>
        </div>
        {/* <div className="profile-top-header__right-section">
          <button className="profile-top-header__preview-button">
            Preview Profile
          </button>
          <FaRegUserCircle className="profile-top-header__user-icon" />
        </div> */}
      </div>

      <div className="profile-page__body-wrapper w-100">
        {/* Main Content Area - now contains accordions */}
        <main className="profile-main-content-accordion w-100">
          <h2 className="profile-main-content-accordion__title">Profile Setup</h2>
          <p className="profile-main-content-accordion__instruction">
            Please provide the following information to get started!
          </p>

          <div className="profile-accordion-container w-100">
            {sections.map((section) => (
              <div key={section.id} className="profile-accordion__item">
                <div
                  className={`profile-accordion__header ${openAccordion === section.id ? 'profile-accordion__header--open' : ''}`}
                  onClick={() => toggleAccordion(section.id)}
                >
                  <div className="profile-accordion__header-left">
                    <section.icon className="profile-accordion__icon" />
                    <span className="profile-accordion__label">{section.label}</span>
                  </div>
                  {openAccordion === section.id ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                {openAccordion === section.id && (
                  <div className="profile-accordion__content">
                    {renderSectionContent(section.id)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProfilePage;