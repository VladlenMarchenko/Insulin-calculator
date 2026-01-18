import { useState } from "react";
import { register, login } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const navigate = useNavigate();

  const submit = async () => {
    await register({ email, password, role });

    const res = await login({ email, password });

    if (!res || !res.token) {
      alert("Ошибка регистрации");
      return;
    }

    onLogin(res);

    navigate(res.role === "doctor" ? "/patients" : "/calculator");
  };

  return (
    <div className="container">
      <h1>Регистрация</h1>

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

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="patient">Пациент</option>
        <option value="doctor">Медперсонал</option>
      </select>

      <button onClick={submit}>Зарегистрироваться</button>
    </div>
  );
}
