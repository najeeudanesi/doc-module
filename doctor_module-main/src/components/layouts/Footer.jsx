import React from "react";
import footerLogo from "../../assets/images/footerimg.png";
const Footer = () => (
  <footer className="p-4">
    <div className="content space-between flex-v-center">
      <div className="footer-inner-left">
        <p>2024 Greenzone Technologies Limited</p>
      </div>
      <img src={footerLogo} alt="logo" className="brand m-l-20" width="150"></img>

    </div>
  </footer>
);

export default Footer;
