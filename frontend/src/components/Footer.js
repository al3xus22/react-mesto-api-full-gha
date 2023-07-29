import React from "react";

function Footer({loggedIn}) {
  return (
    <footer className={loggedIn ? "footer" : ""}>
      <p className="footer__copyright">© 2023 Mesto Russia</p>
    </footer>
  );
}

export default Footer;