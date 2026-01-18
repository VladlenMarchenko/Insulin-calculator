import React, { useEffect, useState } from "react";
import { getMyHistory } from "../services/api";
import { Line } from "react-chartjs-2";

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

export default function History({ token }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!token) return;
    getMyHistory(token).then((data) =>
      setHistory(data || [])
    );
  }, [token]);

  /* 📈 ГРАФИК — старые → новые */
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

  /* 📋 СПИСОК — новые → старые */
  const sortedHistory = [...history].sort(
    (a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="container">
      <h2>История измерений</h2>

      {history.length > 0 && (
        <div className="card">
          <Line data={chartData} />
        </div>
      )}

      <div className="card">
        {sortedHistory.map((h) => (
          <div key={h.id}>
            <strong>
              {new Date(h.created_at).toLocaleString()}
            </strong>
            <br />
            Сахар: {h.glucose}
            <br />
            Инсулин: {h.dose ?? "—"} ед.
            <br />

            {h.dose_approved ? (
              <span style={{ color: "green" }}>
                ✅ Подтверждено врачом
              </span>
            ) : (
              <span style={{ color: "orange" }}>
                ⏳ Ожидает подтверждения
              </span>
            )}

            {h.doctor_comment && (
              <div className="comment">
                💬 {h.doctor_comment}
              </div>
            )}

            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}
