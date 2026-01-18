export function saveCalculation(dose) {
  const history = JSON.parse(localStorage.getItem("history")) || [];

  history.push({
    dose,
    date: new Date().toLocaleString(),
  });

  localStorage.setItem("history", JSON.stringify(history));
}

export function getHistory() {
  return JSON.parse(localStorage.getItem("history")) || [];
}
