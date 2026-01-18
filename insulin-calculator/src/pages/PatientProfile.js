import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPatientProfile,
  getPatientHistory,
  approveDose,
} from "../services/api";
import { Line } from "react-chartjs-2";
import { generatePatientPDF } from "../utils/pdf";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function PatientProfile({ token }) {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastMeasurement, setLastMeasurement] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    getPatientProfile(id, token).then(setProfile);

    getPatientHistory(id, token).then((rows) => {
      const data = rows || [];
      setHistory(data);

      if (data.length > 0) {
        const last = [...data].sort(
          (a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        )[0];
        setLastMeasurement(last);
      }
    });
  }, [id, token]);

  if (!profile) {
    return <div className="container">Загрузка...</div>;
  }

  const chartData = {
    labels: history.map((h) =>
      new Date(h.created_at).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Глюкоза",
        data: history.map((h) => Number(h.glucose)),
        tension: 0.4,
      },
      {
        label: "Инсулин",
        data: history.map((h) =>
          h.dose !== null ? Number(h.dose) : null
        ),
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="container">
      <h2>Медкарта пациента</h2>

      {profile.photo && (
        <div className="profile-avatar">
          <img src={profile.photo} alt="Пациент" />
        </div>
      )}

      <div className="card">
        <strong>Email:</strong> {profile.email} <br />
        <strong>Рост:</strong> {profile.height || "—"} <br />
        <strong>Вес:</strong> {profile.weight || "—"} <br />
        <strong>Заболевания:</strong>{" "}
        {profile.diseases || "—"}
      </div>

      {lastMeasurement && (
        <div className="card">
          <strong>Последнее измерение</strong>
          <br />
          Сахар: {lastMeasurement.glucose}
          <br />
          Инсулин: {lastMeasurement.dose ?? "—"} ед.
          <br />

          <span className="muted">
            {new Date(
              lastMeasurement.created_at
            ).toLocaleString()}
          </span>

          <br />

          {lastMeasurement.dose_approved ? (
            <>
              <span style={{ color: "green", fontWeight: 600 }}>
                ✅ Доза подтверждена
              </span>

              {lastMeasurement.doctor_comment && (
                <div className="comment">
                  💬 {lastMeasurement.doctor_comment}
                </div>
              )}
            </>
          ) : (
            <>
              <textarea
                placeholder="Комментарий врача"
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
              />

              <button
                style={{ marginTop: 10 }}
                onClick={async () => {
                  await approveDose(
                    lastMeasurement.id,
                    comment,
                    token
                  );

                  setLastMeasurement({
                    ...lastMeasurement,
                    dose_approved: 1,
                    doctor_comment: comment,
                  });
                }}
              >
                ✅ Подтвердить дозу
              </button>
            </>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="card">
          <Line data={chartData} />
        </div>
      )}

      <button
        style={{ marginTop: 12 }}
        onClick={() =>
          generatePatientPDF({ profile, history })
        }
      >
        📄 Скачать PDF отчёт
      </button>
    </div>
  );
}
