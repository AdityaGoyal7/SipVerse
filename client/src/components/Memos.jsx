import { useState, useEffect } from "react";
import "../App.css";

const Memos = ({ state }) => {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { contract } = state;

  useEffect(() => {
    const fetchMemos = async () => {
      if (!contract) return;
      setLoading(true);
      try {
        const result = await contract.getMemos();
        setMemos([...result].reverse()); // newest first
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMemos();
  }, [contract]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const shortAddr = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <section className="memos-section">
      <div className="memos-header">
        <h2 className="memos-title">On-Chain Feedback</h2>
        <div className="memos-chain-badge">
          ⛓ BLOCKCHAIN VERIFIED
        </div>
      </div>

      {loading ? (
        <div className="memos-empty">
          <div className="memos-empty-icon" style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</div>
          <p>Fetching from blockchain...</p>
        </div>
      ) : memos.length === 0 ? (
        <div className="memos-empty">
          <div className="memos-empty-icon">📭</div>
          <p>No feedback yet. Be the first to sip & say something!</p>
        </div>
      ) : (
        <div className="memos-grid">
          {memos.map((memo, i) => (
            <div key={i} className="memo-card" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="memo-header">
                <div className="memo-name">
                  <div className="memo-avatar">{getInitials(memo.name || 'AN')}</div>
                  {memo.name}
                </div>
                <div className="memo-time">
                  {new Date(memo.timestamp * 1000).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </div>
              </div>
              <p className="memo-message">"{memo.message}"</p>
              <span className="memo-address">⟠ {shortAddr(memo.from)}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Memos;
