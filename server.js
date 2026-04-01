/*
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
*/


      const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/generate', async (req, res) => {
    const { idea, budget, location } = req.body;

    const prompt = `Analyze this startup idea: "${idea}" in ${location} with $${budget}. 
    Return ONLY a JSON object with these EXACT keys.
    
    RULES: 
    - "competitors" must have exactly 2 items.
    - "mvpPlan" must have exactly 4 weeks (1, 2, 3, 4).
    - "graphData" must be 5 numbers that change based on the idea's potential.
    - Provide realistic "runway" and "breakeven" strings.

    {
      "startupName": "string",
      "tagline": "string",
      "marketScore": 8,
      "techScore": 7,
      "problem": "string",
      "solution": "string",
      "locationAnalysis": "string",
      "expansionLocation": "string",
      "runway": "string",
      "breakeven": "string",
      "competitors": [{"name":"string","weakness":"string"},{"name":"string","weakness":"string"}],
      "mvpPlan": [
        {"week": "1", "title": "Validation", "task": "string"},
        {"week": "2", "title": "Build MVP", "task": "string"},
        {"week": "3", "title": "Beta Test", "task": "string"},
        {"week": "4", "title": "Launch", "task": "string"}
      ],
      "graphData": [number, number, number, number, number]
    }`;

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(JSON.parse(response.data.choices[0].message.content));
    } catch (error) {
        res.status(500).json({ error: "Genie Error" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server live on ${PORT}`));
