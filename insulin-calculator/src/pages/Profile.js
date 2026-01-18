import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";

export default function Profile({ token, role }) {
  const [profile, setProfile] = useState({});
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    getProfile(token).then((data) => {
      if (data) setProfile(data);
    });
  }, [token]);

  const save = async () => {
    const updated = await updateProfile(profile, token);
    setProfile(updated);
    setEdit(false);
  };

  const change = (key, value) => {
    setProfile({ ...profile, [key]: value });
  };

  return (
    <div className="container">
      <h1>Профиль</h1>

      {/* ФОТО */}
      {profile.photo && (
        <img
          src={profile.photo}
          alt="avatar"
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 16,
          }}
        />
      )}

      {edit && (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => change("photo", reader.result);
            reader.readAsDataURL(file);
          }}
        />
      )}

      {/* ОБЩЕЕ ПОЛЕ */}
      <h2>Имя</h2>
      {edit ? (
        <input
          value={profile.name || ""}
          onChange={(e) => change("name", e.target.value)}
        />
      ) : (
        <div className="card">{profile.name || "—"}</div>
      )}

      {/* ===== ПАЦИЕНТ ===== */}
      {role === "patient" && (
        <>
          <h2>Рост (см)</h2>
          {edit ? (
            <input
              value={profile.height || ""}
              onChange={(e) => change("height", e.target.value)}
            />
          ) : (
            <div className="card">{profile.height || "—"}</div>
          )}

          <h2>Вес (кг)</h2>
          {edit ? (
            <input
              value={profile.weight || ""}
              onChange={(e) => change("weight", e.target.value)}
            />
          ) : (
            <div className="card">{profile.weight || "—"}</div>
          )}

          <h2>Хронические заболевания</h2>
          {edit ? (
            <textarea
              value={profile.diseases || ""}
              onChange={(e) => change("diseases", e.target.value)}
            />
          ) : (
            <div className="card">{profile.diseases || "—"}</div>
          )}

          <div className="muted">
            Статус:{" "}
            {profile.approved ? "🟢 Подтверждён врачом" : "🟠 Ожидает подтверждения"}
          </div>
        </>
      )}

      {/* ===== ВРАЧ ===== */}
      {role === "doctor" && (
        <>
          <h2>Должность</h2>
          {edit ? (
            <input
              value={profile.position || ""}
              onChange={(e) => change("position", e.target.value)}
            />
          ) : (
            <div className="card">{profile.position || "—"}</div>
          )}

          <h2>Место работы</h2>
          {edit ? (
            <input
              value={profile.workplace || ""}
              onChange={(e) => change("workplace", e.target.value)}
            />
          ) : (
            <div className="card">{profile.workplace || "—"}</div>
          )}
        </>
      )}

      <br />

      {edit ? (
        <button onClick={save}>Сохранить</button>
      ) : (
        <button className="secondary" onClick={() => setEdit(true)}>
          Редактировать
        </button>
      )}
    </div>
  );
}
