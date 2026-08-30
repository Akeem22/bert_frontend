import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Loader2,
} from "lucide-react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeEmail = async (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    if (!subject.trim() || !body.trim()) {
      setError("Please enter both the email subject and body.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          body,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to analyze the email."
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while analyzing the email."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setSubject("");
    setBody("");
    setResult(null);
    setError("");
  };

  const getRiskClass = () => {
    if (!result) return "";

    switch (result.classification) {
      case "SAFE":
        return "safe";

      case "SUSPICIOUS":
        return "suspicious";

      case "HIGH RISK":
        return "high-risk";

      case "PHISHING":
        return "phishing";

      default:
        return "";
    }
  };

  const getRiskIcon = () => {
    if (!result) return null;

    switch (result.classification) {
      case "SAFE":
        return <ShieldCheck size={42} />;

      case "SUSPICIOUS":
        return <AlertTriangle size={42} />;

      case "HIGH RISK":
      case "PHISHING":
        return <ShieldAlert size={42} />;

      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            <ShieldCheck size={26} />
          </div>

          <div>
            <h1>BERT Email Analyzer</h1>
            <p>Email Security Analysis</p>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <main className="container">
        {!result ? (
          <>
            <section className="hero">
              <div className="hero-badge">
                <ShieldCheck size={16} />
                Phishing Detection
              </div>

              <h2>
                Analyze an email for
                <span> phishing threats.</span>
              </h2>

              <p>
                Paste the subject and body of an email below.
                Our detection engine will analyze the message
                and identify potential phishing indicators.
              </p>
            </section>

            <form
              className="email-card"
              onSubmit={analyzeEmail}
            >
              <div className="form-group">
                <label htmlFor="subject">
                  Email Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  placeholder="Enter the email subject..."
                  value={subject}
                  onChange={(e) =>
                    setSubject(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="body">
                  Email Body
                </label>

                <textarea
                  id="body"
                  placeholder="Paste the email body here..."
                  value={body}
                  onChange={(e) =>
                    setBody(e.target.value)
                  }
                  rows={14}
                />
              </div>

              {error && (
                <div className="error-message">
                  <AlertTriangle size={18} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="analyze-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={19}
                      className="spin"
                    />
                    Analyzing Email...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={19} />
                    Analyze Email
                  </>
                )}
              </button>
            </form>

            <div className="info">
              <span>✓</span>
              
            </div>
          </>
        ) : (
          <section className="results">
            <div className="results-header">
              <p>Analysis Complete</p>
              <h2>Email Security Assessment</h2>
            </div>

            <div
              className={`result-card ${getRiskClass()}`}
            >
              <div className="result-icon">
                {getRiskIcon()}
              </div>

              <div className="result-main">
                <span className="result-label">
                  Classification
                </span>

                <h3>{result.classification}</h3>

                <span className="risk-level">
                  {result.risk_level} RISK
                </span>
              </div>

              <div className="score">
                <span>Phishing Risk</span>

                <strong>
                  {result.phishing_risk}
                </strong>

                <small>/ 100</small>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-card">
                <div className="detail-title">
                  <AlertTriangle size={19} />
                  Detected Indicators
                </div>

                {result.indicators &&
                result.indicators.length > 0 ? (
                  <ul className="indicators">
                    {result.indicators.map(
                      (indicator, index) => (
                        <li key={index}>
                          <span className="indicator-dot"></span>
                          {indicator}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <div className="no-indicators">
                    <ShieldCheck size={20} />
                    No significant phishing indicators
                    detected.
                  </div>
                )}
              </div>

              <div className="detail-card">
                <div className="detail-title">
                  <ExternalLink size={19} />
                  Assessment
                </div>

                <p className="justification">
                  {result.justification}
                </p>
              </div>
            </div>

            <button
              className="reset-button"
              onClick={resetAnalysis}
            >
              <RefreshCw size={18} />
              Analyze Another Email
            </button>
          </section>
        )}
      </main>

      <footer>
        <p>
          BERT Email Analyzer 
        </p>
      </footer>
    </div>
  );
}

export default App;