const axios = require('axios');
const { env } = require('../config');
const mockTHI = require('./mockData');

async function getTHI(payload) {
    if (env.AI_MODE === 'mock') {
        return mockTHI(payload);
    }
    
    try {
        // Prepare request for THI model
        const thiRequest = {
            text: payload.response_text,
            evidence: payload.optional_context || payload.response_text,
            threshold: 0.5,
            custom_weights: null
        };
        
        const url = `${env.AI_BASE_URL.replace(/\/$/, '')}/analyze`;
        
        console.log(`Sending request to THI model at: ${url}`);
        console.log('Request payload:', JSON.stringify(thiRequest, null, 2));
        
        const { data } = await axios.post(url, thiRequest, { 
            timeout: env.AI_TIMEOUT_MS,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        console.log('THI model response received:', JSON.stringify(data, null, 2));
        
        return data;
        
    } catch (error) {
        console.error('Error calling THI model:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            throw new Error('THI model server is not running. Please start the Python model server.');
        }
        
        if (error.code === 'ETIMEDOUT') {
            throw new Error('THI model request timed out. The model may be processing a large request.');
        }
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(`THI model error: ${error.response.status} - ${error.response.data?.detail || error.response.statusText}`);
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response received from THI model server. Please check if the server is running.');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error(`Error setting up THI model request: ${error.message}`);
        }
    }
}

module.exports = { getTHI };