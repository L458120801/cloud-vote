import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import io from 'socket.io-client';
import axios from 'axios';

interface Poll {
    id: string;
    title: string;
    options: { id: number; text: string; votes: number }[];
}

export default function PollResult() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [totalVotes, setTotalVotes] = useState(0);

    useEffect(() => {
        if (!id) return;

        // Initial Fetch
        const fetchPoll = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/polls/${id}`);
                setPoll(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPoll();

        // Socket Connection
        const socket = io('http://localhost:3000');
        socket.emit('join', id);

        socket.on('update', (updatedPoll: Poll) => {
            setPoll(updatedPoll);
        });

        return () => {
            socket.disconnect();
        };
    }, [id]);

    useEffect(() => {
        if (poll) {
            setTotalVotes(poll.options.reduce((acc, curr) => acc + curr.votes, 0));
        }
    }, [poll]);

    if (!poll) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Poll Data...</div>;

    const voteUrl = `${window.location.origin}/vote/${poll.id}`;

    return (
        <div className="layout-container animate-in">

            {/* Header */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>← Home</button>
                <div style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                    Poll ID: <span style={{ fontFamily: 'monospace', color: 'white' }}>{poll.id}</span>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{poll.title}</h1>
                <p style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Live Results • {totalVotes} votes</p>
            </div>

            {/* Main Content Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 300px',
                gap: '2rem',
                width: '100%',
                maxWidth: '1000px'
            }}>

                {/* Left: Bars */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
                    {poll.options.map((opt) => {
                        const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                        return (
                            <div key={opt.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: '600' }}>{opt.text}</span>
                                    <span>{opt.votes} votes ({percentage}%)</span>
                                </div>
                                <div style={{
                                    height: '24px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${percentage}%`,
                                        background: 'linear-gradient(90deg, var(--accent-color), #8b5cf6)',
                                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right: QR Code & Share */}
                <div className="glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', background: 'white', borderRadius: '12px' }}>
                        <QRCodeCanvas value={voteUrl} size={180} />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Scan to Vote</p>

                    <input
                        type="text"
                        readOnly
                        value={voteUrl}
                        onClick={(e) => e.currentTarget.select()}
                        style={{ textAlign: 'center', fontSize: '0.8rem', marginBottom: 0 }}
                    />
                    <a href={voteUrl} target="_blank" className="btn" style={{ width: '100%', textDecoration: 'none' }}>
                        Open Vote Page
                    </a>
                </div>

            </div>
        </div>
    );
}
