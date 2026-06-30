import { useNavigate } from "react-router-dom";
import "./landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="lp-root">

      {/* ── Left panel ── */}
      <div className="lp-left">
        <div className="lp-brand">
          <span className="lp-moon">🌙</span>
          <h1 className="lp-title">MidNight<br />Crave</h1>
          <p className="lp-sub">Late-night hunger sorted.<br />Order in seconds.</p>
        </div>

        <div className="lp-actions">
          <button className="lp-btn lp-btn--primary" onClick={() => {/* ToDO */}}>
            Login
          </button>
          <button className="lp-btn lp-btn--ghost" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>

        <p className="lp-foot">Fresh. Fast. Always open.</p>
      </div>

      {/* ── Right panel ── */}
      <div className="lp-right">
        <div className="lp-glow" />
        <ul className="lp-food-grid" aria-hidden="true">
          {["🍕", "🍔", "🍜", "🌮", "🍣", "🍩", "🥗", "🍟"].map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        <div className="lp-badge">
          <span>50+</span>
          <small>restaurants near you</small>
        </div>
      </div>

    </div>
  );
}
