const { Schema, model } = require('mongoose');
const AnalysisSchema = new Schema(
    {
        request: {
            response_text: String,
            optional_context: [String]
        },
        result: {},
        meta: {
            mode: { type: String, enum: ['mock', 'live'], default: 'mock' }
        }
    },
    { timestamps: true }
);
module.exports = model('Analysis', AnalysisSchema);