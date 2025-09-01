const { z } = require('zod');
const Analysis = require('../models/Analysis');
const { getTHI } = require('../services/aiClient');

const BodySchema = z.object({
    response_text: z.string().min(1, 'response_text required'),
    optional_context: z.array(z.string()).optional().default([])
});

async function analyze(req, res) {
    const parsed = BodySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ 
            error: parsed.error.issues[0]?.message || 'Invalid body',
            details: parsed.error.issues 
        });
    }
    
    const { response_text, optional_context } = parsed.data;
    
    try {
        // Get THI analysis from the model
        const result = await getTHI({ 
            response_text, 
            optional_context: optional_context.length > 0 ? optional_context.join(' ') : undefined 
        });

        // Transform the result to match frontend expectations
        const transformedResult = {
            thi: result.overall_thi || 0.0,
            label: result.binary_label ? 'hallucination' : 'truthful',
            threshold: result.threshold_used || 0.5,
            weights: {
                contradiction: result.weights_used?.[0] || 0.35,
                lack_support: result.weights_used?.[1] || 0.30,
                instability: result.weights_used?.[2] || 0.15,
                speculative: result.weights_used?.[3] || 0.10,
                numeric: result.weights_used?.[4] || 0.10
            },
            per_claim: result.claims?.map(claim => ({
                claim: claim.claim,
                scores: {
                    contradiction: claim.components?.contradiction_score || 0.0,
                    lack_support: 1 - (claim.components?.support_score || 0.0),
                    instability: claim.components?.instability_score || 0.0,
                    speculative: claim.components?.speculative_score || 0.0,
                    numeric: claim.components?.numeric_score || 0.0,
                    thi_claim: claim.thi_score || 0.0
                },
                evidence: { text: claim.evidence },
                highlights: {
                    speculative_spans: [],
                    numeric_flags: []
                },
                explanation: claim.explanation
            })) || [],
            summary: result.summary || {},
            processing_time_ms: result.processing_time_ms || 0,
            total_claims: result.total_claims || 0
        };

        // Persist analysis to database (best-effort)
        try {
            if (process.env.MONGODB_URI) {
                await Analysis.create({ 
                    request: { response_text, optional_context }, 
                    result: transformedResult, 
                    meta: { 
                        mode: process.env.AI_MODE,
                        original_response: result,
                        timestamp: new Date()
                    } 
                });
            }
        } catch (dbError) {
            console.warn('Failed to persist analysis to database:', dbError.message);
            // Continue without failing the request
        }

        res.json(transformedResult);
        
    } catch (error) {
        console.error('Analysis error:', error);
        
        // Return a fallback response if the AI model is unavailable
        const fallbackResult = {
            thi: 0.5,
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
                    contradiction: 0.5,
                    lack_support: 0.5,
                    instability: 0.5,
                    speculative: 0.5,
                    numeric: 0.5,
                    thi_claim: 0.5
                },
                evidence: { text: optional_context.join(' ') || response_text },
                highlights: { speculative_spans: [], numeric_flags: [] },
                explanation: {
                    contradiction: 'Analysis unavailable',
                    lack_of_support: 'Analysis unavailable',
                    instability: 'Analysis unavailable',
                    speculative: 'Analysis unavailable',
                    numeric_sanity: 'Analysis unavailable'
                }
            }],
            summary: { error: 'AI model temporarily unavailable' },
            processing_time_ms: 0,
            total_claims: 1
        };

        res.json(fallbackResult);
    }
}

module.exports = { analyze };