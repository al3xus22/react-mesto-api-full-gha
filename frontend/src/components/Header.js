import React from 'react';
import NavBar from "./NavBar";
import headerlogo from "../images/header__logo.svg";
import {useLocation, Link} from "react-router-dom";

function Header({loggedIn, handleSignOut, userEmail}) {
  const location = useLocation();
  return (
    <header className="header">
      <img src={headerlogo} className="header__logo" alt="Место_Россия"/>
      {location.pathname === "/signin" &&
        <Link className="header__sign-in" to="/signup">Регистрация</Link>}
      {location.pathname === "/signup" &&
        <Link className="header__sign-in" to="/signin">Войти</Link>}
      {loggedIn && <NavBar handleSignOut={handleSignOut} userEmail={userEmail}/> }
    </header>
  );
}

export default Header;