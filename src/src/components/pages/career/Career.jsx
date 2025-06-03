import React, { useState } from "react";
import "./career.css"; // Import our unique-named CSS
import {
  FaCheckCircle, // For the green checkmark
  FaGraduationCap, // Education icon
  FaScroll, // Licenses icon (or similar)
  FaCertificate, // Certifications icon
  FaBriefcase, // Work Experiences icon
  FaUsers, // Associations icon
  FaAward, // Awards & Recognition icon
  FaPlus, // Add new icon
  FaArrowRight, // Arrow icon for buttons
  FaRegEdit, // Edit icon in table
  FaRegUserCircle, // Placeholder for top profile icon (changed from FaRegCircleUser for fa)
} from "react-icons/fa"; // Changed from 'react-icons/fa6' to 'react-icons/fa'

// Placeholder for profile image
import profilePic from "./dr_ember_wynn_placeholder.png"; // Assuming image is in same folder

function Career() {
  const [activeTab, setActiveTab] = useState("education");

  const profileInfo = {
    name: "Dr. Ember Wynn",
    hospital: "Healing Stripes Hospital, Lagos",
    profilePic: profilePic, // Use the imported placeholder
  };

  const tabs = [
    {
      id: "education",
      label: "Education",
      icon: FaGraduationCap,
      checked: true,
    },
    { id: "licenses", label: "Licenses", icon: FaScroll, checked: false },
    {
      id: "certifications",
      label: "Certifications",
      icon: FaCertificate,
      checked: false,
    },
    {
      id: "work-experiences",
      label: "Work Experiences",
      icon: FaBriefcase,
      checked: false,
    },
    {
      id: "associations",
      label: "Associations",
      icon: FaUsers,
      checked: false,
    },
    {
      id: "awards-recognition",
      label: "Awards & Recognition",
      icon: FaAward,
      checked: false,
    },
  ];

  // Mock data for the Education table
  const educationData = [
    // {
    //   s_n: 1,
    //   institution: 'Lagos State University Teaching Hospital',
    //   degree: 'Bachelors Degree',
    //   fieldOfStudies: 'Medicine & Anatomy',
    //   graduationDates: '2014',
    // },
    // // Add more mock data rows here if needed
    // {
    //     s_n: 2,
    //     institution: 'University of Ibadan',
    //     degree: 'MD',
    //     fieldOfStudies: 'General Surgery',
    //     graduationDates: '2018',
    // },
  ];

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "education":
        return (
          <div className="cp-content__section">
            <div className="cp-content__section-header">
              <h2 className="cp-content__section-title">Education</h2>
              <div className="cp-content__section-actions">
                <button className="cp-content__action-button cp-content__action-button--add">
                  <FaPlus /> Add now
                </button>
                <button className="cp-content__action-button cp-content__action-button--next">
                  Licenses <FaArrowRight />
                </button>
              </div>
            </div>

            <div className="cp-table__wrapper">
              <table className="cp-table">
                <thead className="cp-table__head">
                  <tr className="cp-table__row-header">
                    <th className="cp-table__header-cell">S/n</th>
                    <th className="cp-table__header-cell cp-table__header-cell--institution">
                      Institution
                    </th>
                    <th className="cp-table__header-cell">Degree</th>
                    <th className="cp-table__header-cell">Field Of Studies</th>
                    <th className="cp-table__header-cell">Graduation Dates</th>
                    <th className="cp-table__header-cell cp-table__header-cell--action"></th>{" "}
                    {/* Action column */}
                  </tr>
                </thead>
                <tbody className="cp-table__body">
                  {educationData.map((item) => (
                    <tr key={item.s_n} className="cp-table__row">
                      <td className="cp-table__cell">{item.s_n}</td>
                      <td className="cp-table__cell">{item.institution}</td>
                      <td className="cp-table__cell">{item.degree}</td>
                      <td className="cp-table__cell">{item.fieldOfStudies}</td>
                      <td className="cp-table__cell">{item.graduationDates}</td>
                      <td className="cp-table__cell cp-table__cell--action">
                        <FaRegEdit className="cp-table__edit-icon" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "licenses":
        return (
          <div className="cp-content__section">
            <div className="cp-content__section-header">
              <h2 className="cp-content__section-title">Licenses</h2>
              <div className="cp-content__section-actions">
                <button className="cp-content__action-button cp-content__action-button--add">
                  <FaPlus /> Add now
                </button>
                <button className="cp-content__action-button cp-content__action-button--next">
                  Certificatios <FaArrowRight />
                </button>
              </div>
            </div>

            <div className="cp-table__wrapper">
              <table className="cp-table">
                <thead className="cp-table__head">
                  <tr className="cp-table__row-header">
                    <th className="cp-table__header-cell">S/n</th>
                    <th className="cp-table__header-cell cp-table__header-cell--institution">
                      Title
                    </th>
                    <th className="cp-table__header-cell">
                      Issuing Organisation
                    </th>
                    <th className="cp-table__header-cell">Country</th>
                    <th className="cp-table__header-cell">Validity</th>
                    <th className="cp-table__header-cell cp-table__header-cell--action"></th>{" "}
                    {/* Action column */}
                  </tr>
                </thead>
                <tbody className="cp-table__body">
                  {educationData.map((item) => (
                    <tr key={item.s_n} className="cp-table__row">
                      <td className="cp-table__cell">{item.s_n}</td>
                      <td className="cp-table__cell">{item.institution}</td>
                      <td className="cp-table__cell">{item.degree}</td>
                      <td className="cp-table__cell">{item.fieldOfStudies}</td>
                      <td className="cp-table__cell">{item.graduationDates}</td>
                      <td className="cp-table__cell cp-table__cell--action">
                        <FaRegEdit className="cp-table__edit-icon" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "certifications":
        return (
          <div className="cp-content__section">
            <div className="cp-content__section-header">
              <h2 className="cp-content__section-title">Certifications</h2>
              <div className="cp-content__section-actions">
                <button className="cp-content__action-button cp-content__action-button--add">
                  <FaPlus /> Add now
                </button>
                <button className="cp-content__action-button cp-content__action-button--next">
                  Certificatios <FaArrowRight />
                </button>
              </div>
            </div>

            <div className="cp-table__wrapper">
              <table className="cp-table">
                <thead className="cp-table__head">
                  <tr className="cp-table__row-header">
                    <th className="cp-table__header-cell">S/n</th>
                    <th className="cp-table__header-cell cp-table__header-cell--institution">
                      Title
                    </th>
                    <th className="cp-table__header-cell">
                      Issuing Organisation
                    </th>
                    <th className="cp-table__header-cell">Country</th>
                    <th className="cp-table__header-cell">Validity</th>
                    <th className="cp-table__header-cell cp-table__header-cell--action"></th>{" "}
                    {/* Action column */}
                  </tr>
                </thead>
                <tbody className="cp-table__body">
                  {educationData.map((item) => (
                    <tr key={item.s_n} className="cp-table__row">
                      <td className="cp-table__cell">{item.s_n}</td>
                      <td className="cp-table__cell">{item.institution}</td>
                      <td className="cp-table__cell">{item.degree}</td>
                      <td className="cp-table__cell">{item.fieldOfStudies}</td>
                      <td className="cp-table__cell">{item.graduationDates}</td>
                      <td className="cp-table__cell cp-table__cell--action">
                        <FaRegEdit className="cp-table__edit-icon" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "work-experiences":
        return (
          <div className="cp-content__section">
            <div className="cp-content__section-header">
              <h2 className="cp-content__section-title">Work Experiences</h2>
              <div className="cp-content__section-actions">
                <button className="cp-content__action-button cp-content__action-button--add">
                  <FaPlus /> Add now
                </button>
                <button className="cp-content__action-button cp-content__action-button--next">
                  Associations <FaArrowRight />
                </button>
              </div>
            </div>

            <div className="cp-table__wrapper">
              <table className="cp-table">
                <thead className="cp-table__head">
                  <tr className="cp-table__row-header">
                    <th className="cp-table__header-cell">S/n</th>
                    <th className="cp-table__header-cell cp-table__header-cell--institution">
                      Job Title
                    </th>
                    <th className="cp-table__header-cell">Organisation</th>
                    <th className="cp-table__header-cell">Start Date</th>
                    <th className="cp-table__header-cell">End Date</th>
                    <th className="cp-table__header-cell cp-table__header-cell--action"></th>{" "}
                    {/* Action column */}
                  </tr>
                </thead>
                <tbody className="cp-table__body">
                  {educationData.map((item) => (
                    <tr key={item.s_n} className="cp-table__row">
                      <td className="cp-table__cell">{item.s_n}</td>
                      <td className="cp-table__cell">{item.institution}</td>
                      <td className="cp-table__cell">{item.degree}</td>
                      <td className="cp-table__cell">{item.fieldOfStudies}</td>
                      <td className="cp-table__cell">{item.graduationDates}</td>
                      <td className="cp-table__cell cp-table__cell--action">
                        <FaRegEdit className="cp-table__edit-icon" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "associations":
        return (
          <div className="cp-content__section">
            <div className="cp-content__section-header">
              <h2 className="cp-content__section-title">Associations</h2>
              <div className="cp-content__section-actions">
                <button className="cp-content__action-button cp-content__action-button--add">
                  <FaPlus /> Add now
                </button>
                <button className="cp-content__action-button cp-content__action-button--next">
                  Awards <FaArrowRight />
                </button>
              </div>
            </div>

            <div className="cp-table__wrapper">
              <table className="cp-table">
                <thead className="cp-table__head">
                  <tr className="cp-table__row-header">
                    <th className="cp-table__header-cell">S/n</th>
                    <th className="cp-table__header-cell cp-table__header-cell--institution">
                      Name Of Association
                    </th>
                    <th className="cp-table__header-cell">Validity</th>
                    <th className="cp-table__header-cell">Membership Type</th>
                    <th className="cp-table__header-cell">Location</th>
                    <th className="cp-table__header-cell cp-table__header-cell--action"></th>{" "}
                    {/* Action column */}
                  </tr>
                </thead>
                <tbody className="cp-table__body">
                  {educationData.map((item) => (
                    <tr key={item.s_n} className="cp-table__row">
                      <td className="cp-table__cell">{item.s_n}</td>
                      <td className="cp-table__cell">{item.institution}</td>
                      <td className="cp-table__cell">{item.degree}</td>
                      <td className="cp-table__cell">{item.fieldOfStudies}</td>
                      <td className="cp-table__cell">{item.graduationDates}</td>
                      <td className="cp-table__cell cp-table__cell--action">
                        <FaRegEdit className="cp-table__edit-icon" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "awards-recognition":
        return (
          <div className="cp-content__section">
            <div className="cp-content__section-header">
              <h2 className="cp-content__section-title">Associations</h2>
              <div className="cp-content__section-actions">
                <button className="cp-content__action-button cp-content__action-button--add">
                  <FaPlus /> Add now
                </button>
                <button className="cp-content__action-button cp-content__action-button--next">
                  Awards <FaArrowRight />
                </button>
              </div>
            </div>

            <div className="cp-table__wrapper">
              <table className="cp-table">
                <thead className="cp-table__head">
                  <tr className="cp-table__row-header">
                    <th className="cp-table__header-cell">S/n</th>
                    <th className="cp-table__header-cell cp-table__header-cell--institution">
                      Award & Recognition
                    </th>
                    <th className="cp-table__header-cell">Issueing Body</th>
                    <th className="cp-table__header-cell">Validity</th>
                    <th className="cp-table__header-cell">Location</th>
                    <th className="cp-table__header-cell cp-table__header-cell--action"></th>{" "}
                    {/* Action column */}
                  </tr>
                </thead>
                <tbody className="cp-table__body">
                  {educationData.map((item) => (
                    <tr key={item.s_n} className="cp-table__row">
                      <td className="cp-table__cell">{item.s_n}</td>
                      <td className="cp-table__cell">{item.institution}</td>
                      <td className="cp-table__cell">{item.degree}</td>
                      <td className="cp-table__cell">{item.fieldOfStudies}</td>
                      <td className="cp-table__cell">{item.graduationDates}</td>
                      <td className="cp-table__cell cp-table__cell--action">
                        <FaRegEdit className="cp-table__edit-icon" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="cp-page__container main-content w-100">
      {/* Top Header */}
      <div className="cp-top-header ">
        <div className="cp-top-header__profile-info">
          <img
            src={profileInfo.profilePic}
            alt="Profile"
            className="cp-top-header__profile-pic"
          />
          <div className="cp-top-header__text-info">
            <span className="cp-top-header__name">{profileInfo.name}</span>
            <span className="cp-top-header__hospital">
              {profileInfo.hospital}
            </span>
          </div>
        </div>
        <div className="cp-top-header__right-section">
          <button className="cp-top-header__preview-button">
            Preview Profile
          </button>
          {/* Changed from FaRegCircleUser to FaRegUserCircle for compatibility with react-icons/fa */}
          <FaRegUserCircle className="cp-top-header__user-icon" />
        </div>
      </div>

      <div>
        <h2 className="cp-sidebar__title">Profile Setup</h2>
        <p className="">
          Please provide the following information to get started!
        </p>
      </div>
      <div className="cp-page__body-wrapper">
        {/* Left Sidebar - Tab Navigation */}
        <aside className="cp-sidebar">
          <ul className="cp-sidebar__nav">
            {tabs.map((tab) => (
              <li
                key={tab.id}
                className={`cp-sidebar__nav-item ${
                  activeTab === tab.id ? "cp-sidebar__nav-item--active" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="cp-sidebar__nav-content">
                  <tab.icon className="cp-sidebar__nav-icon" />
                  <span>{tab.label}</span>
                </div>
                {tab.checked && (
                  <FaCheckCircle className="cp-sidebar__nav-checkmark" />
                )}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content Area */}
        <main className="cp-main-content">{renderTabContent()}</main>
      </div>
    </div>
  );
}

export default Career;
