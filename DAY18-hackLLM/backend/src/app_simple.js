const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Simple analyze endpoint
app.post('/api/analyze/thi', (req, res) => {
    const { response_text, optional_context } = req.body;
    
    // Mock response for testing
    const mockResult = {
        thi: 0.45,
        label: 'uncertain',
        threshold: 0.5,
        weights: {
            contradiction: 0.35,
            lack_support: 0.30,
            instability: 0.15,
            speculative: 0.10,
            numeric: 0.10
        },
        per_claim: [{
            claim: response_text,
            scores: {
                contradiction: 0.4,
                lack_support: 0.5,
                instability: 0.3,
                speculative: 0.2,
                numeric: 0.1,
                thi_claim: 0.45
            },
            evidence: { text: optional_context || response_text },
            highlights: { speculative_spans: [], numeric_flags: [] }
        }]
    };
    
    res.json(mockResult);
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'THI Backend API (Simple)',
        version: '1.0.0',
        status: 'running'
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on port ${PORT}`);
});
