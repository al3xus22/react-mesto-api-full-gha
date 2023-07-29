import React from "react";
import PopupWithForm from "./PopupWithForm";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState(currentUser.name);
  const [about, setAbout] = React.useState(currentUser.about);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeAbout(e) {
    setAbout(e.target.value);
  }

  React.useEffect(() => {
    setName(currentUser.name);
    setAbout(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateUser({
      name,
      about
    });
  }

  return (
    <PopupWithForm
      name="profile-edit"
      title="Редактировать профиль"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      textButton="Сохранить"
    >
      <fieldset className="popup__inputs">
        <label htmlFor="name-input" className="popup__label">
          <input type="text" value={name} onChange={handleChangeName} id="name-input" placeholder="Имя" name="name"
                 className="popup__input popup__input_type_name" required
                 minLength="2" maxLength="40"/>
          <span className="name-input-error popup__input-error popup__input-error_span"></span>
        </label>
        <label htmlFor="job-input" className="popup__label">
          <input type="text" value={about} onChange={handleChangeAbout} id="job-input" placeholder="Занятие"
                 name="job"
                 className="popup__input popup__input_type_job" required
                 minLength="2" maxLength="200"/>
          <span className="job-input-error popup__input-error popup__input-error_span"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  )
}

export default EditProfilePopup;