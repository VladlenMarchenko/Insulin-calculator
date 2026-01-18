import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPatients,
  getPatientHistory,
} from "../services/api";

export default function Patients({ token }) {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [lastMap, setLastMap] = useState({});
  const [activeTab, setActiveTab] = useState("pending"); // pending | all
  const [search, setSearch] = useState("");

  useEffect(() => {
    getPatients(token).then(async (rows) => {
      const list = rows || [];
      setPatients(list);

      const map = {};

      for (const p of list) {
        const history = await getPatientHistory(
          p.id,
          token
        );

        if (history && history.length > 0) {
          const last = [...history].sort(
            (a, b) =>
              new Date(b.created_at) -
              new Date(a.created_at)
          )[0];
          map[p.id] = last;
        }
      }

      setLastMap(map);
    });
  }, [token]);

  /* 🔀 ФИЛЬТР ПО ТАБУ */
  const tabFiltered =
    activeTab === "pending"
      ? patients.filter(
          (p) =>
            lastMap[p.id] &&
            !lastMap[p.id].dose_approved
        )
      : patients;

  /* 🔍 ПОИСК ПО EMAIL + ФИО */
  const filteredPatients = tabFiltered.filter(
    (p) => {
      const text = (
        p.email +
        " " +
        (p.name || "")
      ).toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    }
  );

  return (
    <div className="container">
      <h2>Пациенты</h2>

      {/* 🔍 ПОИСК */}
      <input
        placeholder="Поиск по ФИО или email"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* 🔀 ТАБЫ */}
      <div className="tabs">
        <button
          className={
            activeTab === "pending"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("pending")
          }
        >
          Неподтверждённые
        </button>

        <button
          className={
            activeTab === "all"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("all")
          }
        >
          Все
        </button>
      </div>

      {/* 📋 СПИСОК */}
      {filteredPatients.length === 0 ? (
        <p className="muted">
          Пациенты не найдены
        </p>
      ) : (
        filteredPatients.map((p) => {
          const last = lastMap[p.id];

          return (
            <div
              key={p.id}
              className="card patient-card"
              onClick={() =>
                navigate(`/patients/${p.id}`)
              }
            >
              <strong>
                {p.name || "Пациент"}
              </strong>

              <div className="muted">
                {p.email}
              </div>

              {last ? (
                <>
                  <div className="muted">
                    Сахар: {last.glucose}
                  </div>

                  <div className="muted">
                    Инсулин:{" "}
                    {last.dose ?? "—"} ед.
                  </div>

                  {!last.dose_approved && (
                    <div className="badge warning">
                      Требует подтверждения
                    </div>
                  )}
                </>
              ) : (
                <div className="muted">
                  Нет измерений
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
