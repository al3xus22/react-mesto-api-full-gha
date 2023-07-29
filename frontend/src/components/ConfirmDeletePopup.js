import React from "react";
import PopupWithForm from "./PopupWithForm";

function ConfirmDeletePopup(props) {
  function handleSubmit(e) {
    e.preventDefault();
    props.onConfirmDelete();
  }

  return (
    <PopupWithForm
      name="confirm"
      title="Вы уверены?"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      textButton="Да"
    />
  )
}

export default ConfirmDeletePopup;