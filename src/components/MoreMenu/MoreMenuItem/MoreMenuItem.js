import React from "react";
import { Link } from "react-router-dom";
import "./MoreMenuItem.css";
const MoreMenuItem = ({ title, Icon, link }) => {
  if (link) {
    return <Link className="moreMenuItem" to={link}><Icon /><span>{title}</span></Link>;
  }
  return <div className="moreMenuItem"><Icon /><span>{title}</span></div>;
};
export default MoreMenuItem;
