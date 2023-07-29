import React from 'react';
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const card = props.card;
  const isOwn = card.owner === currentUser._id;
  const isLiked = card.likes?.some((i) => i === currentUser._id);
  const cardLikeButtonClassName = (
    `element__button-like ${isLiked && ' element__button-like_active'}`
  );

  function handleClick() {
    props.onCardClick(card);
  }

  function handleLikeClick() {
    props.onCardLike(card);
  }

  function handleDeleteClick() {
    props.onCardDeleteClick(card._id);
  }

  return (
      <li key={card._id} className="element">
        {isOwn && <button className='element__trash' onClick={handleDeleteClick}/>}
        <img src={card.link} alt={card.name} className="element__image" onClick={handleClick}/>
        <div className="element__content">
          <h2 className="element__name">{card.name}</h2>
          <div className="element__like-container">
            <button onClick={handleLikeClick} className={cardLikeButtonClassName} type="button"></button>
            <p className="element__likes">{card.likes?.length || 0}</p>
          </div>
        </div>
      </li>
  )
}

export default Card;