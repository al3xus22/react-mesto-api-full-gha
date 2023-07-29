import React from 'react';
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const inputRef = React.useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  }

  React.useEffect(() => {
    inputRef.current.value = '';
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name="update-avatar"
      title="Обновить аватар"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      textButton="Сохранить"
    >
      <fieldset className="popup__inputs">
        <label htmlFor="link-input" className="popup__label">
          <input ref={inputRef} defaultValue={''} type="url" id="link-avatar" name="avatar"
                 placeholder="Ссылка на картинку"
                 className="popup__input popup__input_type_link" required/>
          <span className="link-avatar-error popup__input-error popup__input-error_span"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;