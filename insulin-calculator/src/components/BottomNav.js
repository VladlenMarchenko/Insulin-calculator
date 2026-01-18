import { NavLink } from "react-router-dom";
import { Calculator, History, User, Users, LogOut } from "lucide-react";

export default function BottomNav({ role, onLogout }) {
  return (
    <nav className="bottom-nav">
      {/* 👤 ПАЦИЕНТ */}
      {role === "patient" && (
        <>
          <NavLink
            to="/calculator"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Calculator size={22} />
            <span>Калькулятор</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <History size={22} />
            <span>История</span>
          </NavLink>
        </>
      )}

      {/* 👨‍⚕️ / 👤 ПРОФИЛЬ (ОБЩИЙ) */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? "nav-item active" : "nav-item"
        }
      >
        <User size={22} />
        <span>Профиль</span>
      </NavLink>

      {/* 👨‍⚕️ ВРАЧ */}
      {role === "doctor" && (
        <NavLink
          to="/patients"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <Users size={22} />
          <span>Пациенты</span>
        </NavLink>
      )}

      {/* 🚪 ВЫХОД */}
      <button className="nav-item logout" onClick={onLogout}>
        <LogOut size={22} />
        <span>Выход</span>
      </button>
    </nav>
  );
}
