import { useState } from "react";
import { saveCalculation } from "../services/api";

export default function Calculator({ token }) {
  const [breadUnits, setBU] = useState("");
  const [glucose, setGlucose] = useState("");
  const [result, setResult] = useState(null);
  const [interpretation, setInterpretation] = useState("");

  const insulinPerBU = 1.5;
  const targetGlucose = 5.5;
  const sensitivity = 2;

  const calculate = async () => {
    const dose =
      breadUnits * insulinPerBU +
      (glucose - targetGlucose) / sensitivity;

    let interp = "Норма";
    if (dose < 2) interp = "Низкая доза";
    else if (dose > 6) interp = "Повышенная доза";

    setResult(dose.toFixed(2));
    setInterpretation(interp);

    await saveCalculation(
      {
        breadUnits,
        glucose,
        dose,
        interpretation: interp,
      },
      token
    );
  };

  return (
    <div className="container">
      <h1>Калькулятор</h1>

      <input
        placeholder="ХЕ"
        value={breadUnits}
        onChange={(e) => setBU(e.target.value)}
      />

      <input
        placeholder="Глюкоза"
        value={glucose}
        onChange={(e) => setGlucose(e.target.value)}
      />

      <button onClick={calculate}>Рассчитать</button>

      {result && (
        <div className="result">
          <strong>{result} ЕД</strong>
          <p>{interpretation}</p>
        </div>
      )}
    </div>
  );
}
