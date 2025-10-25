import React, { useState } from "react";
// import { Link } from 'react-router-dom';
import { MdNotifications } from "react-icons/md";
import { TiArrowSortedDown } from "react-icons/ti";

import UserAvater from "../../assets/images/user-avater.png";
// import HeaderSearch from "../inputs/HeaderSearch";

// import { formatFileUrl } from "../../utility/general";

const Header = ({ history, details = {}, navList = [] }) => {
  const [userPix, setUserPix] = useState("");
  const [imgHasError, setImgHasError] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // useEffect(() => {
  //   !imgHasError && setUserPix(formatFileUrl(details.userProfilePicture));
  // }, [imgHasError, details]);

  const handleImgError = () => {
    setUserPix("");
    setImgHasError(true);
  };

  const handleAvatarClick = () => {
    setShowDropdown((prev) => !prev);
  };

  function getRoleTitle(roles) {
    if (!Array.isArray(roles) || roles.length === 0) return "No Role";

    let roleString = "";

    const hasRole = (roleName) => roles.includes(roleName);
 if (hasRole("Doctor")) {
      roleString = "Doctor";
    }
     else if (hasRole("Nurse") && hasRole("checkin")) {
      roleString = "Checkin Nurse";
    }
    // Priority 4: Nurse and Local Admin
    else if (hasRole("Nurse") && hasRole("Local Admin")) {
      roleString = "Admin Nurse";
    }
    else if (hasRole("Pharmacist")) {
      roleString = "Pharmacist";
    }
    // Priority 1: Super Admin or more than 7 roles
   
    // Priority 2: Only one role
    else if (roles.length === 1) {
      roleString = roles[0];
    }
    // Priority 3: Nurse and checkin
    else if (hasRole("Nurse") && hasRole("checkin")) {
      roleString = "Checkin Nurse";
    }
    // Priority 4: Nurse and Local Admin
    else if (hasRole("Nurse") && hasRole("Local Admin")) {
      roleString = "Admin Nurse";
    }
    else if (hasRole("Health Finance Admin")) {
      roleString += " - Admin Manager";
    }
    // Fallback
    else {
      roleString = roles[0]; // default to first role
    }

    // Add "- Admin Manager" if Health Finance Admin is present
   
     if (hasRole("Super Admin") || roles.length > 7) {
      roleString += " - Super Admin";
    }

    return roleString;
  }

  const handleChangePassword = () => {
    // Implement navigation or modal for password change here
    alert("Change Password clicked");
    setShowDropdown(false);
  };

  return (
    <header>
      <div className="content header-content space-between flex-v-center">
        <div className="header-left">
          {/* <HeaderSearch placeholder="Search transactions or invoices" /> */}
        </div>
        <div className="header-right flex flex-v-center">
          <div className="right-item notification flex p-r">
            <MdNotifications />
            <span className="indicator" />
          </div>
          <div className="right-item">
            <ul className="nav-menu">
              {navList && navList.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="right-item">
            <div
              role="presentation"
              onClick={handleAvatarClick}
              className="user-avater-details flex flex-v-center pointer"
              style={{ position: "relative" }}
            >
              <div className="m-r-5 right-text" style={{ paddingTop: "3px" }}>
                <p className="name">
                  {localStorage.getItem("name") || "Osagie Osaigbovo"}
                </p>
                <p className="role">
                  {(() => {
                    const userInfo = JSON.parse(
                      localStorage.getItem("USER_INFO") || "{}"
                    );
                    const roles = userInfo.role || [];
                    return (
                      getRoleTitle(roles) ||
                      localStorage.getItem("role") ||
                      "Officer 1"
                    );
                  })()}
                </p>
              </div>
              <div className="flex">
                <img
                  onError={handleImgError}
                  src={userPix || UserAvater}
                  alt="user avater"
                />
              </div>
              <div className="flex arrow">
                <TiArrowSortedDown />
              </div>
              {showDropdown && (
                <div
                  className="avatar-dropdown"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    borderRadius: "4px",
                    zIndex: 100,
                    minWidth: "160px",
                  }}
                >
                  <button
                    className="dropdown-item"
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
