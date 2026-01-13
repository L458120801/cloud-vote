import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreatePoll() {
    const [title, setTitle] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, '']);

    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validOptions = options.filter(o => o.trim());
        if (!title.trim() || validOptions.length < 2) return;

        setLoading(true);
        try {
            const serverUrl = 'http://localhost:3000'; // Hardcoded for demo
            const res = await axios.post(`${serverUrl}/api/polls`, {
                title,
                options: validOptions
            });
            navigate(`/result/${res.data.id}`);
        } catch (error) {
            console.error(error);
            alert('Failed to create poll');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="layout-container animate-in">
            <div className="glass-card" style={{ width: '100%', maxWidth: '600px' }}>
                <h2 style={{ marginBottom: '2rem' }}>✨ Create a Poll</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Question / Title</label>
                        <input
                            type="text"
                            placeholder="e.g. Where should we eat lunch?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Options</label>
                        {options.map((opt, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder={`Option ${idx + 1}`}
                                    value={opt}
                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                    style={{ marginBottom: 0 }}
                                    required
                                />
                                {options.length > 2 && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => removeOption(idx)}
                                        style={{ padding: '0 1rem', color: '#ef4444', borderColor: '#ef4444' }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={addOption}
                            style={{ width: '100%', marginTop: '0.5rem', borderStyle: 'dashed' }}
                        >
                            + Add Option
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/')}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn"
                            style={{ flex: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create & Launch 🚀'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
