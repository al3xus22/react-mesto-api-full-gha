import React from "react";

function ImagePopup(props) {
  return (
    <div className={`popup popup-image ${props.card.link ? "popup_opened" : ""}`}>
      <div className="popup-image__container">
        <button className="popup__button-close popup-image__button-close" type="button"
                onClick={props.onClose}></button>
        <img src={props.card.link} alt={props.card.name} className="popup-image__full-image"/>
        <figcaption className="popup-image__title">{props.card.name}</figcaption>
      </div>
    </div>
  );
}

export default ImagePopup;