import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { analyze, isBackendAvailable } from '../lib/api';
import { useAnalysisStore } from '../store/useAnalysisStore';
import '../styles/form.css';
import Results from './Results.jsx';
import { useRef } from 'react';
import FloatingTextarea from '../components/FloatingTextarea.jsx';

export default function Home() {
    const nav = useNavigate();
    const { setLoading, setResult, result } = useAnalysisStore();
    const resultsRef = useRef(null);
    const [text, setText] = useState('In 2023, Google bought OpenAI for $50B.');
    const [context, setContext] = useState('OpenAI remains independent and has not been acquired by Google.');
    const [backendStatus, setBackendStatus] = useState('checking');
    const [error, setError] = useState('');

    // Check backend status on component mount
    useEffect(() => {
        checkBackendStatus();
    }, []);

    async function checkBackendStatus() {
        try {
            const isAvailable = await isBackendAvailable();
            setBackendStatus(isAvailable ? 'available' : 'unavailable');
        } catch (err) {
            setBackendStatus('unavailable');
        }
    }

    useEffect(() => {
        if (result && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            resultsRef.current.setAttribute('tabindex', '-1');
            resultsRef.current.focus();
        }
    }, [result]);

    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const data = await analyze({ 
                response_text: text, 
                optional_context: context ? [context] : [] 
            });
            setResult(data);
        } catch (err) {
            console.error('Analysis error:', err);
            
            // Set user-friendly error message
            if (err.response?.status === 503) {
                setError('THI model is currently unavailable. Please try again later.');
            } else if (err.code === 'ECONNREFUSED') {
                setError('Cannot connect to the analysis service. Please check if all servers are running.');
            } else {
                setError(err.message || 'An error occurred during analysis. Please try again.');
            }
            
            // Fallback to mock data for demonstration
            setResult({
                thi: 0.62,
                label: 'hallucination',
                threshold: 0.5,
                weights: { 
                    contradiction: 0.35, 
                    lack_support: 0.30, 
                    instability: 0.15, 
                    speculative: 0.10, 
                    numeric: 0.10 
                },
                per_claim: [
                    {
                        claim: text,
                        scores: { 
                            contradiction: 0.81, 
                            lack_support: 0.72, 
                            instability: 0.18, 
                            speculative: 0.05, 
                            numeric: 0.0, 
                            thi_claim: 0.69 
                        },
                        evidence: { text: context },
                        highlights: { speculative_spans: [], numeric_flags: [] }
                    }
                ]
            });
        } finally {
            setLoading(false);
        }
    }

    const getStatusColor = () => {
        switch (backendStatus) {
            case 'available': return 'text-green-400';
            case 'unavailable': return 'text-red-400';
            default: return 'text-yellow-400';
        }
    };

    const getStatusText = () => {
        switch (backendStatus) {
            case 'available': return 'Backend Connected';
            case 'unavailable': return 'Backend Disconnected';
            default: return 'Checking Connection...';
        }
    };

    return (
        <div className="analyze-page min-h-[60vh]">
            {/* Connection Status */}
            <div className="mx-auto w-full max-w-3xl mb-6">
                <div className={`flex items-center gap-2 text-sm ${getStatusColor()}`}>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor().replace('text-', 'bg-')}`}></div>
                    <span>{getStatusText()}</span>
                    {backendStatus === 'unavailable' && (
                        <button 
                            onClick={checkBackendStatus}
                            className="ml-2 px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                        >
                            Retry
                        </button>
                    )}
                </div>
            </div>

            <form onSubmit={onSubmit} className="mx-auto w-full max-w-3xl bg-[rgba(12,8,12,0.35)] border border-[rgba(255,90,163,0.04)] p-8 rounded-xl shadow-soft-pink">
                <div className="mb-10">
                    <h1 className="text-2xl text-white font-extrabold">Detect Hallucination Risk</h1>
                    <p className="text-[rgba(201,182,200,0.9)] mt-2">
                        Paste the AI response and optional context. We'll run quick explainable checks and return a Hallucination Probability.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                <div className="mb-6">
                    <FloatingTextarea 
                        id="ai-response" 
                        label="AI Response Text" 
                        value={text} 
                        onChange={e => setText(e.target.value)} 
                        rows={8} 
                        placeholder=" " 
                    />
                </div>

                <div className="mb-6">
                    <FloatingTextarea 
                        id="context" 
                        label="Optional Context (evidence or reference text)" 
                        value={context} 
                        onChange={e => setContext(e.target.value)} 
                        rows={4} 
                        placeholder=" " 
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        type="submit" 
                        disabled={backendStatus === 'unavailable'}
                        className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-[#ff5aa3] to-[#ff2d8a] text-white hover:scale-[1.01] active:scale-[0.995] shadow-lg transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Analyze
                    </button>
                    <span className="text-[rgba(201,182,200,0.85)] text-sm">
                        {backendStatus === 'available' 
                            ? 'Connected to THI model' 
                            : 'Using fallback mode - check server connections'
                        }
                    </span>
                </div>
            </form>

            {/* Results Panel */}
            <div className="w-full max-w-3xl mx-auto mt-8" ref={resultsRef}>
                <Results />
            </div>
        </div>
    );
}