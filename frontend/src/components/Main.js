import React from "react";
import Card from "./Card.js";
import {CurrentUserContext} from "../contexts/CurrentUserContext";

function Main(props) {
  const cards = props.cards;
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <img src={currentUser.avatar} alt="Аватар" className="profile__avatar"/>
        <button className="profile__avatar-edit" type="button" onClick={props.onEditAvatar}></button>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <button className="profile__edit-button" type="button" onClick={props.onEditProfile}></button>
          <p className="profile__job">{currentUser.about}</p>
        </div>
        <button className="profile__add-button" type="button" onClick={props.onAddPlace}></button>
      </section>
      <section className="elements-list">
        <ul className="elements">
          {cards.map((card) => (
            <Card
              onCardLike={props.handleCardLike}
              onCardDeleteClick={props.handleCardDeleteClick}
              onCardClick={props.onCardClick}
              card={card}
              key={card._id}
              cardId={card._id}
            />
          ))
          }
        </ul>
      </section>
    </main>
  );
}

export default Main;