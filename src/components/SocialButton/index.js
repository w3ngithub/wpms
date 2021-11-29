import React from "react";
import "./style.css";

function SocialButton({ Icon, text, onClick }) {
  return (
    <div className="social_button_container" onClick={onClick}>
      <span className="social_icon">{Icon}</span>
      <span className="social_content">{text}</span>
    </div>
  );
}

export default SocialButton;
