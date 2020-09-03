import React from "react";
import "./style.css";

const FooterPanel = () => {
  return (
    <div>
      <div className="py-2 text-center footer-style">
        © Svitlana Zaster &nbsp; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default FooterPanel;
