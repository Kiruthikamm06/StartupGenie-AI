/*
async function generatePlan() {
    const idea = document.getElementById('ideaInput').value;
    const budget = parseFloat(document.getElementById('budgetInput').value) || 0;
    const location = document.getElementById('locationInput').value;

    if (!idea || !budget || !location) return alert("Please fill all fields!");

    document.getElementById('loadingSection').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');

    try {
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea, budget, location })
        });
        const data = await res.json();

        // 1. Text Data
        document.getElementById('startupName').innerText = data.startupName || "The Startup";
        document.getElementById('taglineDisplay').innerText = data.tagline || "";
        document.getElementById('pText').innerText = data.problem || "Information not provided.";
        document.getElementById('sText').innerText = data.solution || "Information not provided.";
        
        // 2. Location Logic (Fixed)
        document.getElementById('locName').innerText = location.toUpperCase();
        document.getElementById('locAnalysis').innerText = data.locationAnalysis || "Market analysis unavailable.";
        document.getElementById('expLoc').innerText = `Recommended next step: ${data.expansionLocation || "Neighboring districts"}`;

        // 3. Scores & Bars
        const m = data.marketScore || 5;
        const t = data.techScore || 5;
        document.getElementById('mText').innerText = `${m}/10`;
        document.getElementById('mBar').style.width = `${m*10}%`;
        document.getElementById('tText').innerText = `${t}/10`;
        document.getElementById('tBar').style.width = `${t*10}%`;
        document.getElementById('ovScore').innerText = ((m + t) / 2).toFixed(1);

        // 4. Financials
        document.getElementById('runwayText').innerText = `${Math.floor(budget / 500) || 6} Months`;
        document.getElementById('breakEvenText').innerText = "Month 10-12";

        // 5. Competitors (Dynamic Cards)
       // app.js-la Competitors section
const comps = data.competitors || [];
document.getElementById('competitorList').innerHTML = comps.map(c => `
    <div style="background:#0d1117; padding:15px; border-radius:10px; border: 1px solid #333;">
        <h4 style="margin:0; color:var(--accent2); font-size:1rem;">${c.name}</h4>
        <p style="font-size:0.8rem; margin:5px 0 0 0; opacity:0.8;">Weakness: ${c.weakness}</p>
    </div>
`).join('');

// app.js-la MVP Plan section (4 weeks check)
const mvp = data.mvpPlan || [];
document.getElementById('mvpList').innerHTML = mvp.map(m => `
    <div style="display:flex; gap:15px; margin-bottom:12px;">
        <div style="background:var(--accent); color:#000; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; flex-shrink:0;">${m.week}</div>
        <div>
            <h4 style="margin:0; font-size:1rem;">${m.title}</h4>
            <p style="margin:2px 0; font-size:0.85rem; opacity:0.7;">${m.task}</p>
        </div>
    </div>
`).join('');

        // 7. Graph
        let points = data.graphData || [budget*0.2, budget*0.5, budget*1.5, budget*4, budget*10];

        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');

        setTimeout(() => renderChart(points), 500);

    } catch (e) {
        console.error(e);
        alert("Something went wrong. Check server console.");
        document.getElementById('loadingSection').classList.add('hidden');
    }
}

function renderChart(points) {
    const ctx = document.getElementById('growthChart').getContext('2d');
    if(window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
            datasets: [{
                data: points,
                borderColor: '#7cf5c0',
                backgroundColor: 'rgba(124, 245, 192, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { display: false },
                x: { ticks: { color: '#888' }, grid: { display: false } }
            }
        }
    });
}*/

        async function generatePlan() {
    const idea = document.getElementById('ideaInput').value;
    const budget = document.getElementById('budgetInput').value;
    const location = document.getElementById('locationInput').value;

    if (!idea || !budget || !location) return alert("Please fill all fields!");

    document.getElementById('loadingSection').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');

    try {
        const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea, budget, location })
        });
        const data = await res.json();

        // Basic Details
        document.getElementById('startupName').innerText = data.startupName;
        document.getElementById('taglineDisplay').innerText = data.tagline;
        document.getElementById('pText').innerText = data.problem;
        document.getElementById('sText').innerText = data.solution;
        document.getElementById('locAnalysis').innerText = data.locationAnalysis;
        document.getElementById('expLoc').innerText = data.expansionLocation;

        // Financials (Runway & Breakeven)
        document.getElementById('runwayText').innerText = data.runway || "12 Months";
        document.getElementById('breakevenText').innerText = data.breakeven || "18 Months";

        // Scores
        document.getElementById('mText').innerText = `${data.marketScore}/10`;
        document.getElementById('mBar').style.width = `${data.marketScore * 10}%`;
        document.getElementById('tText').innerText = `${data.techScore}/10`;
        document.getElementById('tBar').style.width = `${data.techScore * 10}%`;
        document.getElementById('ovScore').innerText = ((data.marketScore + data.techScore) / 2).toFixed(1);

        // Competitors
        document.getElementById('competitorList').innerHTML = data.competitors.map(c => `
            <div style="background:#161b22; padding:15px; border-radius:10px; border:1px solid #30363d;">
                <h4 style="margin:0; color:#a583ff;">${c.name}</h4>
                <p style="font-size:0.8rem; margin:5px 0 0 0; opacity:0.8;">Weakness: ${c.weakness}</p>
            </div>
        `).join('');

        // 4-Week MVP Plan
        document.getElementById('mvpList').innerHTML = data.mvpPlan.map(m => `
            <div style="display:flex; gap:15px; margin-bottom:15px;">
                <div style="background:#7cf5c0; color:#0d1117; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; flex-shrink:0;">${m.week}</div>
                <div>
                    <h4 style="margin:0; font-size:1rem; color:#fff;">${m.title}</h4>
                    <p style="margin:4px 0; font-size:0.85rem; opacity:0.7;">${m.task}</p>
                </div>
            </div>
        `).join('');

        // Dynamic Graph
        renderChart(data.graphData);

        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');

    } catch (e) {
        console.error(e);
        alert("Genie is tired. Try again!");
        document.getElementById('loadingSection').classList.add('hidden');
    }
}

function renderChart(points) {
    const ctx = document.getElementById('growthChart').getContext('2d');
    if(window.myChart) window.myChart.destroy();
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
            datasets: [{
                data: points,
                borderColor: '#7cf5c0',
                backgroundColor: 'rgba(124, 245, 192, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { 
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: '#8b949e' } } }
        }
    });
}
