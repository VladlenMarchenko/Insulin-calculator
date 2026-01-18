import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function generatePatientPDF({ profile, history }) {
  const pdf = new jsPDF("p", "mm", "a4");

  const container = document.createElement("div");
  container.style.padding = "20px";
  container.style.width = "600px";
  container.style.background = "#fff";
  container.style.fontFamily = "Arial";

  container.innerHTML = `
    <h2>Медицинский отчёт пациента</h2>

    ${
      profile.photo
        ? `<img src="${profile.photo}" style="width:120px;border-radius:50%;margin-bottom:12px;" />`
        : ""
    }

    <p><strong>Email:</strong> ${profile.email}</p>
    <p><strong>Рост:</strong> ${profile.height || "—"}</p>
    <p><strong>Вес:</strong> ${profile.weight || "—"}</p>
    <p><strong>Заболевания:</strong> ${profile.diseases || "—"}</p>

    <h3>История измерений</h3>
    <table border="1" cellpadding="6" cellspacing="0" width="100%">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Глюкоза</th>
          <th>Инсулин</th>
        </tr>
      </thead>
      <tbody>
        ${history
          .map(
            (h) => `
          <tr>
            <td>${new Date(h.created_at).toLocaleDateString()}</td>
            <td>${h.glucose}</td>
            <td>${h.dose ?? "—"}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  document.body.appendChild(container);

  const canvas = await html2canvas(container, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
  pdf.save(`patient_${profile.email}.pdf`);

  document.body.removeChild(container);
}
