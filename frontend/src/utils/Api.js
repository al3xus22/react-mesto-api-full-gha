class Api {
  constructor({ baseUrl, headers }) {
    this.url = baseUrl;
    this.headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getUserInfo() {
    return fetch(`${this.url}/users/me`, {
      headers: this.headers,
      credentials: 'include'
    }).then(res => {
      return this._checkResponse(res);
    })
  }

  getInitialCards() {
    return fetch(`${this.url}/cards`, {
      headers: this.headers,
      credentials: 'include',
    }).then(res => {
      return this._checkResponse(res);
    })
  }

  setUserInfo({ name, about }) {
    return fetch(`${this.url}/users/me`, {
      method: 'PATCH',
      headers: this.headers,
      credentials: 'include',
      body: JSON.stringify({
        name: name,
        about: about
      })
    }).then(res => {
      return this._checkResponse(res);
    })
  }

  addNewCard({ title, link }) {
    return fetch(`${this.url}/cards`, {
      method: 'POST',
      headers: this.headers,
      credentials: 'include',
      body: JSON.stringify({
        name: title,
        link: link
      })
    }).then(res => {
      return this._checkResponse(res);
    })
  }

  deleteUserCard(cardId) {
    return fetch(`${this.url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this.headers,
      credentials: 'include',
    }).then(res => {
      return this._checkResponse(res);
    })
  }

  updateUserAvatar({ avatar }) {
    return fetch(`${this.url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this.headers,
      credentials: 'include',
      body: JSON.stringify({
        avatar: avatar
      })
    }).then(res => {
      return this._checkResponse(res);
    })
  }

  changeLikeCardStatus(cardId, isLiked) {
    return fetch(`${this.url}/cards/${cardId}/likes`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: this.headers,
      credentials: 'include'
    }).then(res => {
      return this._checkResponse(res);
    })
  }
}

export const api = new Api({
  //baseUrl: 'http://localhost:3001',
  baseUrl: 'https://kartback.nomoreparties.co',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});