import "./Header.css";

export default function Header() {
  return (
    <header className="header">

      <div className="header-left">

        <div className="header-title">
          <h1>Enterprise Startup</h1>
          <span className="suite">INTELLIGENCE SUITE</span>
        </div>

        <p className="subtitle">
          AI Powered Startup Evaluation Platform
        </p>

      </div>

      <div className="header-right">

        <div className="status-card">
          <span className="dot"></span>
          <div>
            <strong>PostgreSQL</strong>
            <small>Connected</small>
          </div>
        </div>

        <div className="status-card">
          <span className="dot ai"></span>
          <div>
            <strong>AI Engine</strong>
            <small>Active</small>
          </div>
        </div>

      </div>

    </header>
  );
}