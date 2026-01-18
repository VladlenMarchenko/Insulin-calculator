const API = "http://localhost:5000";

// ---------- AUTH ----------
export const login = (data) =>
  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const register = (data) =>
  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(async (r) => {
    if (!r.ok) return null;
    return r.json();
  });




// ---------- CALCULATIONS ----------
export const saveCalculation = (data, token) =>
  fetch(`${API}/calc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });

export const getMyHistory = (token) =>
  fetch(`${API}/calc/my`, {
    headers: { Authorization: token },
  }).then((r) => r.json());

export const getPatients = (token) =>
  fetch(`${API}/calc/patients`, {
    headers: { Authorization: token },
  }).then((r) => r.json());

export const getPatientHistory = (id, token) =>
  fetch(`${API}/calc/patients/${id}`, {
    headers: { Authorization: token },
  }).then((r) => r.json());

  // ---------- PROFILE ----------
export const getProfile = (token) =>
  fetch(`${API}/profile`, {
    headers: { Authorization: token },
  }).then(async (r) => {
    if (!r.ok) return null;
    const text = await r.text();
    return text ? JSON.parse(text) : null;
  });

export const approvePatient = (id, token) =>
  fetch(`http://localhost:5000/profile/approve/${id}`, {
    method: "POST",
    headers: { Authorization: token },
  }).then(r => r.json());



export const updateProfile = (data, token) =>
  fetch(`${API}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const getPatientProfile = (id, token) =>
  fetch(`http://localhost:5000/profile/patient/${id}`, {
    headers: { Authorization: token },
  }).then(r => r.json());

export const approveDose = (id, comment, token) =>
  fetch(`http://localhost:5000/calc/approve-dose/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ comment }),
  }).then((r) => r.json());
