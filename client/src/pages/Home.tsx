import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
    const [joinId, setJoinId] = useState('');
    const [recentPolls, setRecentPolls] = useState<{ id: string, title: string }[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Determine API URL based on environment
        const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : `${window.location.protocol}//${window.location.hostname}:3000`;

        axios.get(`${apiUrl}/api/polls`)
            .then(res => setRecentPolls(res.data.slice(0, 3)))
            .catch(err => console.error(err));
    }, []);

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

            <div className="glass-card" style={{ width: '100%', maxWidth: '400px', marginBottom: '2rem' }}>
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

            {recentPolls.length > 0 && (
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', textAlign: 'center' }}>🔥 Featured Demos</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {recentPolls.map(poll => (
                            <div
                                key={poll.id}
                                className="glass-card"
                                style={{
                                    padding: '1rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(`/result/${poll.id}`)}
                            >
                                <span style={{ fontWeight: 500 }}>{poll.title}</span>
                                <span style={{ color: 'var(--accent-color)' }}>View →</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
