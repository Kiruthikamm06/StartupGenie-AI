/*async function generatePlan() {
    const idea = document.getElementById('ideaInput').value;
    const budget = document.getElementById('budgetInput').value;
    
    if (!idea || !budget) return alert("Please enter both Idea and Budget!");

    document.getElementById('loadingSection').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea, budget })
        });
        
        if (!response.ok) throw new Error('API Error');
        const data = await response.json(); // Indha 'data' backend-la irundhu varudhu

        const updateText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.innerText = text || "Data not provided by AI";
        };

        // 1. MAPPING STRATEGY & AUDIENCE
        updateText('startupName', data.startupName);
        updateText('taglineDisplay', data.tagline);
        updateText('domainBadge', data.domain);
        updateText('problemText', data.problem);
        updateText('solutionText', data.solution);
        updateText('bizModelText', data.businessModel);
        
        // --- TARGET AUDIENCE FIX ---
        updateText('audienceText', data.targetAudience || data.audience); 

        // 2. FINANCIALS (Budget Based)
        const runway = Math.floor(budget / 500) || 0;
        updateText('runwayText', `${runway} Months`);
        updateText('breakEvenText', `Month ${Math.max(1, Math.floor(runway * 0.7))}`);
        // --- DYNAMIC COMPETITORS MAPPING ---
const compList = document.getElementById('competitorList');

if (compList) {
    // API response-la competitors list irukka-nu check pannunga
    if (data.competitors && Array.isArray(data.competitors) && data.competitors.length > 0) {
        
        // Dynamic-ah HTML generate pannudhu
        compList.innerHTML = data.competitors.map(competitor => `
            <div class="card competitor-box" style="margin-bottom: 15px; border-left: 4px solid var(--accent); transition: 0.3s;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <span style="font-size: 1.2rem;">⚔️</span>
                    <h4 style="color: var(--accent2); font-family: 'Syne'; font-size: 1rem; margin: 0;">
                        ${competitor.name}
                    </h4>
                </div>
                <p style="font-size: 0.85rem; color: rgba(238,242,255,0.8); line-height: 1.5; margin: 0;">
                    <strong style="color: #ff4d4d; font-size: 0.75rem; text-transform: uppercase;">Weakness:</strong> 
                    ${competitor.weakness}
                </p>
            </div>
        `).join('');

    } else {
        // API-la irundhu competitors varala-na idhu thaan kaatum
        compList.innerHTML = `
            <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 20px;">
                <p style="color: rgba(255,255,255,0.4); font-size: 0.9rem;">
                    Genie couldn't find direct competitors for this unique idea! 🦄
                </p>
            </div>
        `;
    }
}

        // 3. MVP PLAN (Full 4 Weeks)
        const mvpList = document.getElementById('mvpList');
        if (mvpList && data.mvpPlan) {
            mvpList.innerHTML = data.mvpPlan.map(m => `
                <li class="mvp-item">
                    <div class="step-circle">${m.week}</div>
                    <div class="step-content">
                        <strong>Week ${m.week}: ${m.title}</strong>
                        <p>${m.task}</p>
                    </div>
                </li>
            `).join('');
        }

        // 4. REVEAL & RENDER GRAPH
        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
        
        setTimeout(() => {
            // API-la irundhu graph data (e.g. [10, 50, 200...]) vandha adha anupunga, 
            // illana budget-ah vachu calculation-ku anupunga.
            renderGrowthChart(data.graphData || budget); 
            document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
        }, 150);

    } catch (err) {
        console.error(err);
        alert("API connection failed! Check if backend is returning 'targetAudience' and 'mvpPlan'.");
        document.getElementById('loadingSection').classList.add('hidden');
    }
}

function renderGrowthChart(inputData) {
    const canvas = document.getElementById('growthChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (window.myGrowthChart) window.myGrowthChart.destroy();

    let profit;
    let investment;

    // API-la irundhu direct-ah profit array vandha adha use pannum
    // Illana budget-ah vachu calculate pannum
    if (Array.isArray(inputData)) {
        profit = inputData;
        investment = inputData[0] * 2; // Rough estimate for baseline
    } else {
        investment = parseFloat(inputData);
        const revenue = [
            investment * 0.4,
            investment * 1.2,
            investment * 2.8,
            investment * 5.5,
            investment * 10.0
        ];
        const costFactor = [0.8, 0.6, 0.4, 0.3, 0.25];
        profit = revenue.map((rev, index) => Math.floor(rev * (1 - costFactor[index])));
    }

    window.myGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
            datasets: [
                {
                    label: 'Net Profit ($)',
                    data: profit,
                    backgroundColor: 'rgba(124, 245, 192, 0.2)',
                    borderColor: '#7cf5c0',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#7cf5c0'
                },
                {
                    label: 'Investment Baseline',
                    data: Array(5).fill(investment),
                    borderColor: 'rgba(255, 99, 132, 0.4)',
                    borderDash: [5, 5],
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#eef2ff', font: { size: 11 } } }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#888', callback: (v) => '$' + v.toLocaleString() }
                },
                x: { grid: { display: false }, ticks: { color: '#888' } }
            }
        }
    });
}*/
/*
async function generatePlan() {
    const idea = document.getElementById('ideaInput').value;
    const budget = document.getElementById('budgetInput').value;
    const location = document.getElementById('locationInput').value;
    
    if (!idea || !budget || !location) return alert("Please fill all fields!");

    document.getElementById('loadingSection').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idea, budget, location })
        });
        
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();

        const updateText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.innerText = text || "Not available";
        };

        // UI Mappings
        updateText('startupName', data.startupName);
        updateText('taglineDisplay', data.tagline);
        updateText('domainBadge', data.domain);
        updateText('problemText', data.problem);
        updateText('solutionText', data.solution);
        updateText('audienceText', data.targetAudience || data.audience);
        updateText('bizModelText', data.businessModel);
        updateText('currentLocAnalysis', data.locationAnalysis);
        updateText('recommendedLoc', data.expansionLocation);

        // Financials
        const runway = Math.floor(budget / 500) || 0;
        updateText('runwayText', `${runway} Months`);
        updateText('breakEvenText', `Month ${Math.max(1, Math.floor(runway * 0.75))}`);

        // Competitors
        const compList = document.getElementById('competitorList');
        if (compList && data.competitors) {
            compList.innerHTML = data.competitors.map(c => `
                <div class="card competitor-box" style="border-left: 4px solid var(--accent); margin-bottom: 10px;">
                    <h4 style="color: var(--accent2); margin:0;">⚔️ ${c.name}</h4>
                    <p style="font-size: 0.8rem; margin-top:5px; color: rgba(255,255,255,0.7);">
                        <strong>Weakness:</strong> ${c.weakness}
                    </p>
                </div>
            `).join('');
        }

        // MVP Roadmap
        const mvpList = document.getElementById('mvpList');
        if (mvpList && data.mvpPlan) {
            mvpList.innerHTML = data.mvpPlan.map(m => `
                <li class="mvp-item" style="list-style:none; margin-bottom:15px; position:relative; padding-left:35px;">
                    <div style="position:absolute; left:0; top:0; background:var(--accent); color:#000; border-radius:50%; width:22px; height:22px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:bold;">${m.week}</div>
                    <strong>Week ${m.week}: ${m.title}</strong>
                    <p style="font-size:0.85rem; opacity:0.7; margin-top:4px;">${m.task}</p>
                </li>
            `).join('');
        }

        document.getElementById('loadingSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
        
        setTimeout(() => {
            renderGrowthChart(budget);
            document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
        }, 200);

    } catch (err) {
        console.error(err);
        alert("Server error! Make sure your backend API is running.");
        document.getElementById('loadingSection').classList.add('hidden');
    }
}

function renderGrowthChart(budget) {
    const canvas = document.getElementById('growthChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (window.myGrowthChart) window.myGrowthChart.destroy();

    const investment = parseFloat(budget);
    const profit = [0.5, 1.5, 3.2, 6.0, 12.0].map(m => Math.floor(investment * m * 0.5));

    window.myGrowthChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
            datasets: [{
                label: 'Projected Net Profit ($)',
                data: profit,
                borderColor: '#7cf5c0',
                backgroundColor: 'rgba(124, 245, 192, 0.15)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#7cf5c0'
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
                x: { grid: { display: false }, ticks: { color: '#888' } }
            }
        }
    });
}*/
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
}
