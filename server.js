/*const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function callGroq(idea) {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    const prompt = `Analyze: "${idea}". Return ONLY JSON with:
    {
      "startupName": "", "tagline": "", "domain": "",
      "problem": "", "solution": "", "audience": "", "businessModel": "",
      "competitors": [{"name": "", "weakness": ""}, {"name": "", "weakness": ""}],
      "mvpPlan": [
        {"week": "1", "title": "Validate", "task": ""},
        {"week": "2", "title": "Build", "task": ""},
        {"week": "3", "title": "Launch", "task": ""}
      ],
      "bullseyeScore": { "urgency": 85, "virality": 75 }
    }`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        })
    });
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
}

app.post("/api/generate", async (req, res) => {
    req.setTimeout(60000);
    try {
        const result = await callGroq(req.body.idea);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "AI Error" });
    }
});
app.listen(PORT, () => console.log(`🚀 Genie Live at http://localhost:${PORT}`));*/
/*const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Function-la ippo Idea, Budget, and Location moonaiyum pass panrom
async function callGroq(idea, budget, location) {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    
    // AI-ku kudukura instruction (Prompt) ippo detail-ah irukum
  // server.js-la prompt section-ah indha maari mathunga
const prompt = `Analyze this startup: "${idea}" in ${location} with $${budget}. 
Return ONLY a JSON object with these EXACT keys:
{
  "startupName": "string",
  "tagline": "string",
  "domain": "string",
  "marketScore": 8,
  "techScore": 9,
  "problem": "string",
  "solution": "string",
  "targetAudience": "string",
  "businessModel": "string",
  "locationAnalysis": "string",
  "expansionLocation": "string",
  "competitors": [
    {"name": "Competitor 1", "weakness": "string"},
    {"name": "Competitor 2", "weakness": "string"}
  ],
  "mvpPlan": [
    {"week": "1", "title": "string", "task": "string"},
    {"week": "2", "title": "string", "task": "string"},
    {"week": "3", "title": "string", "task": "string"},
    {"week": "4", "title": "string", "task": "string"}
  ],
  "graphData": [number, number, number, number, number]
}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile", // Using Llama 3.3 for high intelligence
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        })
    });
    
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
}

app.post("/api/generate", async (req, res) => {
    req.setTimeout(60000);
    try {
        // Request body-la irundhu idea, budget, location moonaiyum edukkom
        const { idea, budget, location } = req.body;
        
        // Data-vai AI function-ku anupurom
        const result = await callGroq(idea, budget, location);
        
        res.json(result);
    } catch (err) {
        console.error("Error details:", err);
        res.status(500).json({ error: "Genie is tired, try again!" });
    }
});
*/
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function callGroq(idea, budget, location) {
    const url = "https://api.groq.com/openai/v1/chat/completions";
    
    const prompt = `Analyze this startup: "${idea}" in ${location} with $${budget}. 
    Return ONLY a JSON object with these EXACT keys:
    {
      "startupName": "string",
      "tagline": "string",
      "domain": "string",
      "marketScore": 8,
      "techScore": 9,
      "problem": "string",
      "solution": "string",
      "targetAudience": "string",
      "businessModel": "string",
      "locationAnalysis": "string",
      "expansionLocation": "string",
      "competitors": [{"name": "string", "weakness": "string"}],
      "mvpPlan": [{"week": "1", "title": "string", "task": "string"}],
      "graphData": [number, number, number, number, number]
    }`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a JSON generator. Do not include markdown or text outside JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.2
        })
    });

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Safety check to remove any markdown backticks if AI adds them
    content = content.replace(/```json|```/g, "");
    return JSON.parse(content);
}

app.post("/api/generate", async (req, res) => {
    try {
        const { idea, budget, location } = req.body;
        const result = await callGroq(idea, budget, location);
        res.json(result);
    } catch (err) { 
        console.error("SERVER ERROR:", err);
        res.status(500).json({ error: "Check API Key or JSON format" }); 
    }
});

app.listen(PORT, () => console.log(`🚀 Genie Live at http://localhost:${PORT}`));
