const fs = require('fs');
const path = require('path');
const https = require('https');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    if (match && match[1]) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Could not read .env.local");
    process.exit(1);
}

if (!apiKey) {
    console.error("No GEMINI_API_KEY found in .env.local");
    process.exit(1);
}

console.log(`Checking models with API Key: ${apiKey.substring(0, 8)}...`);

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", json.error);
            } else if (json.models) {
                console.log("Available Models:");
                json.models.forEach(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name}`);
                    }
                });
            } else {
                console.log("Unexpected response:", json);
            }
        } catch (e) {
            console.error("Parse Error:", e);
            console.log("Raw Response:", data);
        }
    });
}).on('error', err => {
    console.error("Request Error:", err);
});
