import React from "react";

function PopupWithForm(props) {
  return (
    <div className={`popup popup_${props.name} ${props.isOpen ? "popup_opened" : ""}`}>
      <div className={`popup__container popup__container_${props.name}`}>
        <button className="popup__button-close" type="button" onClick={props.onClose}></button>
        <h2 className="popup__title">{props.title}</h2>
        <form name={props.name} onSubmit={props.onSubmit}
              className={`popup__form popup__form_${props.name}`}>
          {props.children}
          <button className={`popup__button-submit popup__button-submit_${props.name}`}
                  type="submit">{props.textButton}</button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;