import React from 'react';
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from "./ProtectedRoute";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import Login from "./Login";
import Register from "./Register";
import PageNotFound from "./PageNotFound";
import { api } from "../utils/Api";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmDeletePopup from "./ConfirmDeletePopup";
import InfoTooltip from "./InfoTooltip";
import * as auth from '../utils/Auth';

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({
    avatar: '../images/loader.gif',
    name: 'Загрузка',
    about: 'Загрузка',
    _id: ''
  });

  const navigate = useNavigate();
  const [userEmail, setUserEmail] = React.useState({ email: '' });
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isConfirmDeletePopupOpen, setConfirmDeletePopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = React.useState(false);
  const [tooltip, setTooltip] = React.useState({ image: '', message: '' });
  const [cards, setCards] = React.useState([]);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [cardId, setCardId] = React.useState('');

//Загрузка инфо пользователя и карточек--------------------------------------------------------------------------
//   React.useEffect(() => {
//     loggedIn && Promise.all([api.getUserInfo(), api.getInitialCards()])
//       .then(([user, cards]) => {
//         setCurrentUser(user);
//         setCards(cards);
//       })
//       .catch((error) => {
//         console.log(error)
//       });
//   }, [loggedIn]);

  function loadData() {
    api.getUserInfo()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((error) => {
        console.log(error)
      });

    api.getInitialCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch((error) => {
        console.log(error)
      });
  }


//Регистрация------------------------------------------------------------------------------------------------
  const registerUser = ({ email, password }) => {
    auth.register({ email, password })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`))
      .then(() => {
        setInfoTooltipOpen(true);
        setTooltip({
          image: true,
          message: 'Вы успешно зарегистрировались!'
        });
        navigate('/signin', { replace: true });
      })
      .catch((error) => {
        setInfoTooltipOpen(true);
        setTooltip({
          image: false,
          message: 'Что-то пошло не так!'
        });
        console.error(error)
      });
  };

//Логин----------------------------------------------------------------------------------------------------
  const handleLogin = (formValue) => {
    const { password, email } = formValue;
    auth.authorize({ email, password })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`))
      .then(() => {
        auth.getContent()
          .then(res => res.json())
          .then((res) => {
            if (res) {
              setUserEmail(res.email);
              setLoggedIn(true);
              navigate('/main', { replace: true });
            }
          })
      })
      .catch((err) => {
        setInfoTooltipOpen(true);
        setTooltip({
          image: false,
          message: 'Неверный email или пароль!'
        });
        console.log(err);
      });
  }

//Выход из профиля----------------------------------------------------------------------------------------------
  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        navigate('/signin', { replace: true });
        setLoggedIn(false);
        setUserEmail({ email: '' });
      })
      .catch((err) => console.log(err));
  };

//Аутентификация------------------------------------------------------------------------------------------------
  const checkToken = () => {
    auth.getContent()
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error('Unauthorized');
        }
      })
      .then((res) => {
        if (res.email) {
          loadData();
          setUserEmail(res.email);
          setLoggedIn(true);
          navigate('/', { replace: true });
        }
      })
      .catch((error) => {
        console.log(error);
      })
  };

  React.useEffect(() => {
    checkToken();
  }, [loggedIn]);

//Обновление пользователя----------------------------------------------------------------------------------------
  function handleUpdateUser(newUserData) {
    api.setUserInfo(newUserData)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups()
      })
      .catch((error) => {
        console.log(error)
      });
  }


//Функция добавления карточки------------------------------------------------------------------------------------
  function handleAddPlaceSubmit(data) {
    api.addNewCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error)
      });
  }

//Функция лайков карточки ---------------------------------------------------------------------------------------
  function handleCardLike(card) {
    const isLiked = card.likes?.some((i) => i === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((response) => {
        const updatedCard = response.data;
        setCards((state) => state.map((c) => (c._id === updatedCard._id ? updatedCard : c))
        );
      })
      .catch((error) => {
        console.log(error)
      })
  }

//Обновление аватара----------------------------------------------------------------------------------------------
  function handleUpdateAvatar(userData) {
    api.updateUserAvatar(userData)
      .then((userAvatar) => {
        setCurrentUser(userAvatar);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error)
      });
  }

//Закрытие попапов при клике по оверлэю-----------------------------------------------------------------------
  React.useEffect(() => {
    function handleEscPress(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }

    const handleOverlayClick = (evt) => {
      if (evt.target.classList.contains('popup_opened')) {
        closeAllPopups();
      }
    };
    if (isEditProfilePopupOpen || isAddPlacePopupOpen || isEditAvatarPopupOpen || isConfirmDeletePopupOpen || selectedCard) {
      document.addEventListener('keydown', handleEscPress);
      document.addEventListener('click', handleOverlayClick);
      return () => {
        document.removeEventListener('keydown', handleEscPress);
        document.removeEventListener('mousedown', handleOverlayClick);
      }
    }
  }, [isEditProfilePopupOpen, isAddPlacePopupOpen, isEditAvatarPopupOpen, isConfirmDeletePopupOpen, selectedCard])

//Открытие попапов по клику-----------------------------------------------------------------------------------
  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(selectedCard) {
    setSelectedCard(selectedCard)
  }

//Удаление карточки-------------------------------------------------------------------------------------------
  function handleCardDelete() {
    api.deleteUserCard(cardId)
      .then(() => {
        const newCard = cards.filter((item) => item._id !== cardId);
        setCards(newCard);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error)
      });
  }

//Открытие попапа потдверждения удаления карточки------------------------------------------------------------
  function handleDeletePlaceClick(card) {
    setCardId(card);
    setConfirmDeletePopupOpen(true);
  }

//Закрытие попапов-------------------------------------------------------------------------------------------
  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setConfirmDeletePopupOpen(false);
    setInfoTooltipOpen(false);
    setSelectedCard({});
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="Root">
        <div className="page">
          <Header loggedIn={loggedIn} handleSignOut={handleSignOut} userEmail={userEmail}/>
          <Routes>
            <Route path="/" element={loggedIn ? <Navigate to="/main"/> : <Navigate to="/signin" replace/>}/>
            <Route path="/main" element={
              <ProtectedRoute loggedIn={loggedIn} element={Main}
                              onEditAvatar={handleEditAvatarClick}
                              onEditProfile={handleEditProfileClick}
                              onAddPlace={handleAddPlaceClick}
                              cards={cards}
                              onCardClick={handleCardClick}
                              handleCardLike={handleCardLike}
                              handleCardDeleteClick={handleDeletePlaceClick}
              />
            }
            />
            <Route path="/signin" element={<Login onLogin={handleLogin}/>}/>
            <Route path="/signup" element={<Register registerUser={registerUser}/>}/>
            <Route path='*' element={<PageNotFound/>}/>
          </Routes>
          <Footer loggedIn={loggedIn}/>

          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit}/>
          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
                           onUpdateAvatar={handleUpdateAvatar}/>
          <ConfirmDeletePopup isOpen={isConfirmDeletePopupOpen} onClose={closeAllPopups}
                              onConfirmDelete={handleCardDelete}/>
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
          />
          <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} tooltip={tooltip}/>
        </div>

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
