import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [joinId, setJoinId] = useState('');
    const navigate = useNavigate();

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinId.trim()) {
            navigate(`/vote/${joinId}`);
        }
    };

    return (
        <div className="layout-container animate-in">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>CloudVote ☁️</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                    Real-time polling for the modern web.
                </p>
            </div>

            <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Get Started</h2>

                <button
                    className="btn"
                    style={{ width: '100%', marginBottom: '2rem', fontSize: '1.1rem' }}
                    onClick={() => navigate('/create')}
                >
                    🚀 Create New Poll
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ height: '1px', background: '#334155', flex: 1 }}></div>
                    <span style={{ color: '#475569', fontSize: '0.9rem' }}>OR JOIN</span>
                    <div style={{ height: '1px', background: '#334155', flex: 1 }}></div>
                </div>

                <form onSubmit={handleJoin}>
                    <input
                        type="text"
                        placeholder="Enter Poll ID / Code"
                        value={joinId}
                        onChange={(e) => setJoinId(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn btn-secondary"
                        style={{ width: '100%' }}
                        disabled={!joinId.trim()}
                    >
                        Join Existing Poll
                    </button>
                </form>
            </div>
        </div>
    );
}
