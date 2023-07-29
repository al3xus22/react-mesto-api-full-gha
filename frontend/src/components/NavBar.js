import React from "react";
import {useNavigate} from "react-router-dom";

function NavBar({handleSignOut, userEmail}) {

  return (
    <div className="menu">
      <p className="menu__user-email">{userEmail}</p>
      <button type="submit" className="menu__link" onClick={handleSignOut}>Выйти</button>
    </div>
  )
}

export default NavBar;