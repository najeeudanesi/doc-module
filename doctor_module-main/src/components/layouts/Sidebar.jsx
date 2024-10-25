import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { RiLogoutCircleLine } from "react-icons/ri";
import EdsgLogo from "../../assets/images/SidebarLogo.png";
import { AiOutlineHome } from "react-icons/ai";
import { logout } from "../../utility/auth";
import aiLogo from "../../assets/images/Greezone-ai.png"; // import aiLogo

const Sidebar = ({ history, menuList }) => {
  const location = useLocation(); // Use useLocation hook to access the location

  const { pathname } = location;

  return (
    <nav className="page-sidebar">
      <div className="sidebar-header">
        {/* <img src={EdsgLogo} alt="logo" className="brand" width="150" /> */}
      </div>

      <div className="sidebar-menu">
        <ul className="menu-items">
          {menuList &&
            menuList.map((item) => (
              <MenuItem props={item} pathname={pathname} key={item.title} />
            ))}
          <li onClick={logout}>
            <RiLogoutCircleLine className="icon" />
            <Link className="has-sub-menu">
              <span className="title">Log Out</span>
            </Link>
          </li>
          <div className="m-l-20 m-t-20">
            {/* <img src={aiLogo} alt="logo" className="brand m-l-20" width="150"></img> */}
          </div>
        </ul>
      </div>
    </nav>
  );
};

const MenuItem = ({ props: { title, href, icon, children }, pathname }) => {
  const [isShowingSub, setIsShowingSub] = useState(false);

  const isActive = pathname === href || pathname.startsWith(href);

  return (
    <>
      <li className={`${isActive ? "active" : ""}`}>
        {icon}
        {children ? (
          <>
            <Link
              onClick={() => setIsShowingSub(!isShowingSub)}
              className="has-sub-menu"
            >
              <span className="title">{title}</span>
            </Link>
            {children && (
              <IoIosArrowBack
                className={`${isShowingSub ? "open" : ""} arrow`}
              />
            )}
          </>
        ) : (
          <Link to={href}>
            <span className="title">{title}</span>
          </Link>
        )}
      </li>
      {children && isShowingSub && (
        <ul className={`${isShowingSub ? "show" : ""} sub-menu`}>
          {children.map((sub) => {
            const isSubActive = pathname === sub.href || pathname.startsWith(sub.href);
            return (
              <li className={`${isSubActive ? "active" : ""}`} key={sub.title}>
                <Link to={sub.href}>{sub.title}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default Sidebar;
