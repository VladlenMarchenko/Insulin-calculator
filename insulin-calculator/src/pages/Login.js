import { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    const res = await login({ email, password });

    if (!res || !res.token) {
      alert("Ошибка входа");
      return;
    }

    onLogin(res);

    navigate(res.role === "doctor" ? "/patients" : "/calculator");
  };

  return (
    <div className="container">
      <h1>Вход</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={submit}>Войти</button>

      <button className="secondary" onClick={() => navigate("/register")}>
        Регистрация
      </button>
    </div>
  );
}
