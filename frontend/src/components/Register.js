import React, {useState} from 'react';
import {Link} from 'react-router-dom';

function Register({registerUser}) {
  const [formValue, setFormValue] = useState({
      email: '',
      password: ''
    }
  )
  const [errorMessage, setErrorMessage] = useState();

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormValue({
      ...formValue,
      [name]: value
    });
  }
  const {email, password} = formValue;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValue.email || !formValue.password) {
      setErrorMessage('Both fields are required');
      return;
    }
    registerUser({email, password});
  }

  return (
    <div className="register">
      <p className="register__welcome">
        Регистрация
      </p>
      <div className="register__error">{errorMessage}</div>
      <form className="register__form" onSubmit={handleSubmit}>
        <input type="text" value={formValue.email} onChange={handleChange} id="email" placeholder="Email"
               name="email"
               minLength="2" maxLength="40"/>
        <span className="register__error"></span>
        <input type="password" value={formValue.password} onChange={handleChange} id="password" placeholder="Пароль"
               name="password"
               minLength="2" maxLength="200"/>
        <span className="register__error"></span>
        <button type="submit" className="register__link">Зарегистрироваться</button>
      </form>
      <div className="register__signin">
        <p>Уже зарегистрированы?</p>
        <Link to="/signin" className="register__login-link" replace>Войти</Link>
      </div>
    </div>
  )
}

export default Register;