import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Poll {
    id: string;
    title: string;
    options: { id: number; text: string }[];
}

export default function VotePoll() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        // Check local storage for vote status (simple prevention)
        if (localStorage.getItem(`voted-${id}`)) {
            setHasVoted(true);
        }

        axios.get(`http://localhost:3000/api/polls/${id}`)
            .then(res => setPoll(res.data))
            .catch(err => {
                console.error(err);
                alert('Poll not found');
                navigate('/');
            });
    }, [id, navigate]);

    const handleVote = async () => {
        if (selectedOption === null) return;
        setSubmitting(true);
        try {
            await axios.post(`http://localhost:3000/api/polls/${id}/vote`, {
                optionId: selectedOption
            });
            localStorage.setItem(`voted-${id}`, 'true');
            navigate(`/result/${id}`);
        } catch (err) {
            alert('Vote failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (!poll) return <div style={{ marginTop: '3rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="layout-container animate-in" style={{ paddingBottom: '3rem' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '500px' }}>
                <h1 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '2rem' }}>{poll.title}</h1>

                {hasVoted ? (
                    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <h3>You have already voted!</h3>
                        <button className="btn" onClick={() => navigate(`/result/${id}`)} style={{ marginTop: '1rem' }}>
                            View Results
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {poll.options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setSelectedOption(opt.id)}
                                className={`glass-card`}
                                style={{
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    border: selectedOption === opt.id ? '2px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.1)',
                                    background: selectedOption === opt.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.4)',
                                    padding: '1.2rem',
                                    fontSize: '1.1rem',
                                    color: 'white',
                                    transition: 'all 0.2s',
                                    position: 'relative'
                                }}
                            >
                                {opt.text}
                                {selectedOption === opt.id && <span style={{ position: 'absolute', right: '1rem' }}>🔹</span>}
                            </button>
                        ))}

                        <button
                            className="btn"
                            style={{ padding: '1.2rem', marginTop: '1rem' }}
                            disabled={selectedOption === null || submitting}
                            onClick={handleVote}
                        >
                            {submitting ? 'Submitting...' : 'Submit Vote'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
