import React, {useState} from 'react';

function Login({onLogin}) {
  const [formValue, setFormValue] = useState({
      email: '',
      password: ''
    }
  )
  const [errorMessage, setErrorMessage] = useState()
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormValue({
      ...formValue,
      [name]: value
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formValue.email || !formValue.password) {
      setErrorMessage('Both fields are required');
      return;
    }
    onLogin({
      email: formValue.email,
      password: formValue.password
    });
  }


  return (
    <div className="login">
      <p className="login__welcome">
        Вход
      </p>
      <div className="register__error">{errorMessage}</div>
      <form className="login__form" onSubmit={handleSubmit}>
        <input type="text" value={formValue.email} onChange={handleChange} id="email" placeholder="Email"
               name="email"
               minLength="2" maxLength="40"/>
        <span className="login__error"></span>
        <input type="password" value={formValue.password} onChange={handleChange} id="password" placeholder="Пароль"
               name="password"
               minLength="2" maxLength="200"/>
        <span className="login__error"></span>
        <button type="submit" className="login__link">Войти</button>
      </form>
    </div>
  )
}

export default Login;