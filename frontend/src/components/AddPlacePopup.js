import React from 'react';
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {
  const inputTitleRef = React.useRef('');
  const inputLinkRef = React.useRef('');

  function handleSubmit(event) {
    event.preventDefault();
    props.onAddPlace({
      title: inputTitleRef.current.value,
      link: inputLinkRef.current.value
    })
  }

  React.useEffect(() => {
    inputTitleRef.current.value = '';
    inputLinkRef.current.value = '';
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name="add"
      title="Новое место"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      textButton="Создать"
    >
      <fieldset className="popup__inputs">
        <label htmlFor="title-input" className="popup__label">
          <input ref={inputTitleRef} type="text" id="title-input" name="title" placeholder="Название"
                 className="popup__input popup__input_type_title" required minLength="2" maxLength="30"/>
          <span className="title-input-error popup__input-error popup__input-error_span"></span>
        </label>
        <label htmlFor="link-input" className="popup__label">
          <input ref={inputLinkRef} type="url" id="link-input" name="link" placeholder="Ссылка на картинку"
                 className="popup__input popup__input_type_link" required/>
          <span className="link-input-error popup__input-error popup__input-error_span"></span>
        </label>
      </fieldset>
    </PopupWithForm>
  )
}

export default AddPlacePopup;