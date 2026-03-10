// Study Pulse - Magical Burnout & Stress Monitoring
// Backend Logic & State Management

// Generate magical stars
function createStars() {
    const container = document.getElementById('stars-container');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
        star.style.setProperty('--opacity', Math.random() * 0.8 + 0.2);
        star.style.setProperty('--color', ['#ffd700', '#00d4ff', '#ff006e', '#9d4edd'][Math.floor(Math.random() * 4)]);
        container.appendChild(star);
    }
}

// Create particle burst
function createParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
        particle.style.setProperty('--ty', (Math.random() - 0.5) * 100 + 'px');
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 3000);
    }
}

// Tab Switching System
function initTabs() {
    const tabs = ['dashboard', 'checkin', 'tracker', 'wellness'];
    
    tabs.forEach(tab => {
        // Desktop buttons
        const btn = document.getElementById('btn-' + tab);
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                switchToTab(tab);
            });
        }
        
        // Mobile buttons
        const mobileBtns = document.querySelectorAll('.mobile-tab[data-tab="' + tab + '"]');
        mobileBtns.forEach(mbtn => {
            mbtn.addEventListener('click', function(e) {
                e.preventDefault();
                switchToTab(tab);
            });
        });
    });
    
    // Quick action buttons
    document.getElementById('goto-checkin').addEventListener('click', () => switchToTab('checkin'));
    document.getElementById('goto-tracker').addEventListener('click', () => switchToTab('tracker'));
    document.getElementById('goto-wellness').addEventListener('click', () => switchToTab('wellness'));
    document.getElementById('goto-breathing').addEventListener('click', () => {
        switchToTab('wellness');
        setTimeout(() => startBreathingExercise(), 500);
    });
}

function switchToTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById('section-' + tabName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update desktop nav buttons
    document.querySelectorAll('.magic-tab').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('text-slate-300');
        btn.classList.remove('text-white');
    });
    
    const activeBtn = document.getElementById('btn-' + tabName);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.classList.remove('text-slate-300');
        activeBtn.classList.add('text-white');
    }
    
    // Close mobile menu
    document.getElementById('mobile-menu').classList.add('hidden');
    
    // Update charts if dashboard
    if (tabName === 'dashboard') {
        setTimeout(updateCharts, 100);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// State Management
let currentData = {
    stressLevel: 5,
    sleepHours: 7.5,
    studyHours: 7.5,
    mood: 4,
    symptoms: [],
    history: []
};

// Initialize with sample data
function initializeData() {
    createStars();
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        currentData.history.push({
            date: date.toISOString().split('T')[0],
            stress: Math.floor(Math.random() * 4) + 3,
            sleep: 6 + Math.random() * 3,
            study: 5 + Math.random() * 6,
            mood: Math.floor(Math.random() * 3) + 2
        });
    }
    updateDashboard();
    renderLogs();
    initEventListeners();
}

// Event Listeners for interactive elements
function initEventListeners() {
    // Mobile menu toggle
    document.getElementById('mobile-menu-btn').addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    });

    // Stress slider
    document.getElementById('stress-slider').addEventListener('input', function(e) {
        currentData.stressLevel = parseInt(e.target.value);
        document.getElementById('stress-value').textContent = e.target.value;
        const colors = ['#06ffa5', '#06ffa5', '#ffd700', '#ffd700', '#ff006e'];
        const color = e.target.value <= 3 ? '#06ffa5' : e.target.value <= 7 ? '#ffd700' : '#ff006e';
        document.getElementById('stress-value').style.color = color;
        document.getElementById('stress-value').style.textShadow = `0 0 20px ${color}`;
    });

    // Study slider
    document.getElementById('study-slider').addEventListener('input', function(e) {
        currentData.studyHours = parseFloat(e.target.value);
        document.getElementById('study-display').textContent = e.target.value + ' hrs';
    });

    // Sleep buttons
    document.querySelectorAll('.sleep-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentData.sleepHours = parseFloat(this.dataset.value);
            document.querySelectorAll('.sleep-btn').forEach(b => {
                b.classList.remove('border-yellow-400', 'bg-purple-500/20', 'ring-2', 'ring-yellow-400/50');
                b.classList.add('border-purple-500/30');
            });
            this.classList.remove('border-purple-500/30');
            this.classList.add('border-yellow-400', 'bg-purple-500/20', 'ring-2', 'ring-yellow-400/50');
        });
    });

    // Mood buttons
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentData.mood = parseInt(this.dataset.mood);
            document.querySelectorAll('.mood-btn').forEach(b => {
                b.classList.remove('ring-2', 'border-yellow-400', 'bg-yellow-500/10', 'grayscale-0');
                b.classList.add('border-purple-500/30', 'grayscale');
            });
            this.classList.remove('border-purple-500/30', 'grayscale');
            
            const colors = ['border-rose-400', 'bg-rose-500/10', 'border-orange-400', 'bg-orange-500/10', 'border-yellow-400', 'bg-yellow-500/10', 'border-emerald-400', 'bg-emerald-500/10'];
            const index = (currentData.mood - 1) * 2;
            this.classList.add(colors[index], colors[index + 1], 'ring-2', 'ring-yellow-400/50', 'grayscale-0');
        });
    });

    // Symptom buttons
    document.querySelectorAll('.symptom-tag').forEach(btn => {
        btn.addEventListener('click', function() {
            const symptom = this.dataset.symptom;
            if (symptom === 'none') {
                currentData.symptoms = [];
                document.querySelectorAll('.symptom-tag').forEach(tag => {
                    tag.classList.remove('bg-rose-500/20', 'border-rose-400', 'text-rose-400');
                    tag.classList.add('border-purple-500/30');
                });
                this.classList.add('bg-rose-500/20', 'border-rose-400', 'text-rose-400');
                return;
            }
            
            const index = currentData.symptoms.indexOf(symptom);
            if (index > -1) {
                currentData.symptoms.splice(index, 1);
                this.classList.remove('bg-rose-500/20', 'border-rose-400', 'text-rose-400');
                this.classList.add('border-purple-500/30');
            } else {
                currentData.symptoms.push(symptom);
                this.classList.remove('border-purple-500/30');
                this.classList.add('bg-rose-500/20', 'border-rose-400', 'text-rose-400');
                document.querySelector('[data-symptom="none"]').classList.remove('bg-rose-500/20', 'border-rose-400', 'text-rose-400');
                document.querySelector('[data-symptom="none"]').classList.add('border-purple-500/30');
            }
        });
    });

    // Submit checkin
    document.getElementById('submit-checkin').addEventListener('click', submitCheckin);
    
    // Add study session
    document.getElementById('add-study-session').addEventListener('click', addStudySession);
    
    // Breathing button
    document.getElementById('breathing-btn').addEventListener('click', startBreathingExercise);
}

function calculateBurnoutScore() {
    let score = 0;
    score += (currentData.stressLevel / 10) * 40;
    score += Math.max(0, (8 - currentData.sleepHours) / 8) * 30;
    score += Math.max(0, (currentData.studyHours - 8) / 8) * 20;
    score += ((6 - currentData.mood) / 5) * 10;
    score += currentData.symptoms.length * 3;
    
    return Math.min(100, Math.round(score));
}

function submitCheckin() {
    const score = calculateBurnoutScore();
    const today = new Date().toISOString().split('T')[0];
    
    const entry = {
        date: today,
        stress: currentData.stressLevel,
        sleep: currentData.sleepHours,
        study: currentData.studyHours,
        mood: currentData.mood,
        burnoutScore: score
    };
    
    const existingIndex = currentData.history.findIndex(h => h.date === today);
    if (existingIndex >= 0) {
        currentData.history[existingIndex] = entry;
    } else {
        currentData.history.push(entry);
    }
    
    showToast('✦ Rune cast successfully! Destiny revealed! ✦', 'success');
    updateDashboard();
    renderLogs();
    generateTips(score);
    
    setTimeout(() => switchToTab('dashboard'), 500);
}

// Dashboard Updates
function updateDashboard() {
    const latest = currentData.history[currentData.history.length - 1];
    if (!latest) return;
    
    const score = latest.burnoutScore || calculateBurnoutScore();
    
    const circle = document.getElementById('burnout-circle');
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    
    document.getElementById('burnout-score').textContent = score;
    
    let status = 'Aura Balanced';
    let color = 'text-emerald-400';
    let glowColor = '#06ffa5';
    if (score > 70) {
        status = 'Shadows Gathering';
        color = 'text-rose-400';
        glowColor = '#ff006e';
    } else if (score > 40) {
        status = 'Storms Brewing';
        color = 'text-amber-400';
        glowColor = '#ffd700';
    }
    document.getElementById('burnout-status').textContent = status;
    document.getElementById('burnout-status').className = `text-center text-sm font-bold magic-font ${color} glow-text`;
    document.getElementById('burnout-status').style.textShadow = `0 0 10px ${glowColor}`;
    
    const recent = currentData.history.slice(-7);
    const avgStress = recent.reduce((a, b) => a + b.stress, 0) / recent.length;
    document.getElementById('weekly-avg').textContent = avgStress.toFixed(1);
    
    const avgSleep = recent.reduce((a, b) => a + b.sleep, 0) / recent.length;
    document.getElementById('avg-sleep').textContent = avgSleep.toFixed(1);
    
    const sleepBars = document.getElementById('sleep-bars');
    sleepBars.innerHTML = '';
    recent.forEach(day => {
        const height = (day.sleep / 10) * 100;
        const barColor = day.sleep < 6 ? 'bg-rose-500' : day.sleep < 7 ? 'bg-amber-500' : 'bg-emerald-500';
        sleepBars.innerHTML += `
            <div class="w-full bg-purple-900/50 rounded-t-sm relative group cursor-pointer" style="height: ${Math.min(100, height)}%">
                <div class="absolute bottom-0 w-full ${barColor} rounded-t-sm opacity-80 group-hover:opacity-100 transition shadow-[0_0_10px_currentColor]"></div>
                <div class="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-purple-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 border border-purple-500/30">
                    ${day.sleep.toFixed(1)}h
                </div>
            </div>
        `;
    });
    
    updateCharts();
}

function updateCharts() {
    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = 'rgba(147, 51, 234, 0.1)';
    
    const ctx1 = document.getElementById('weeklyChart');
    if (ctx1) {
        const recent = currentData.history.slice(-7);
        new Chart(ctx1, {
            type: 'line',
            data: {
                labels: recent.map(h => h.date.slice(5)),
                datasets: [{
                    label: 'Mana Strain',
                    data: recent.map(h => h.stress),
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#ffd700',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#ffd700'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 10, grid: { color: 'rgba(147, 51, 234, 0.1)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
    
    const ctx2 = document.getElementById('studyChart');
    if (ctx2) {
        const recent = currentData.history.slice(-7);
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: recent.map(h => h.date.slice(5)),
                datasets: [{
                    label: 'Knowledge Seeking',
                    data: recent.map(h => h.study),
                    backgroundColor: 'rgba(245, 158, 11, 0.8)',
                    borderRadius: 4
                }, {
                    label: 'Dream Realm',
                    data: recent.map(h => h.sleep),
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { position: 'top', labels: { color: '#94a3b8', font: { family: 'Cinzel' } } } 
                },
                scales: {
                    y: { grid: { color: 'rgba(147, 51, 234, 0.1)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }
    
    const ctx3 = document.getElementById('correlationChart');
    if (ctx3) {
        new Chart(ctx3, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Strain vs Knowledge',
                    data: currentData.history.map(h => ({x: h.study, y: h.stress})),
                    backgroundColor: 'rgba(255, 0, 110, 0.6)',
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { title: { display: true, text: 'Hours of Study', color: '#94a3b8', font: { family: 'Cinzel' } }, grid: { color: 'rgba(147, 51, 234, 0.1)' } },
                    y: { title: { display: true, text: 'Mana Strain', color: '#94a3b8', font: { family: 'Cinzel' } }, grid: { color: 'rgba(147, 51, 234, 0.1)' } }
                }
            }
        });
    }
}

// Format hours to hours and minutes (e.g., "6 hours and 7 minutes")
function formatHoursToTime(hours) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
        return `${wholeHours} hours`;
    } else if (minutes === 1) {
        return `${wholeHours} hours and 1 minute`;
    } else {
        return `${wholeHours} hours and ${minutes} minutes`;
    }
}

function renderLogs() {
    const studyLog = document.getElementById('study-log');
    const sleepLog = document.getElementById('sleep-log');
    
    studyLog.innerHTML = '';
    sleepLog.innerHTML = '';
    
    const recent = currentData.history.slice(-5).reverse();
    
    recent.forEach(entry => {
        const studyTime = formatHoursToTime(entry.study);
        const sleepTime = formatHoursToTime(entry.sleep);
        
        studyLog.innerHTML += `
            <div class="flex items-center justify-between p-3 rounded-lg bg-purple-900/30 border border-purple-500/20 hover:border-yellow-400/50 transition group">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center rune-glow">
                        <i class="fas fa-scroll text-amber-400"></i>
                    </div>
                    <div>
                        <div class="font-medium text-slate-200 magic-font">${entry.date}</div>
                        <div class="text-xs text-purple-400">Ritual Completed</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-amber-400 magic-font">${studyTime}</div>
                    <div class="text-xs text-purple-500">${entry.study > 10 ? 'Intense' : 'Balanced'}</div>
                </div>
            </div>
        `;
        
        const sleepQuality = entry.sleep < 6 ? 'Nightmare' : entry.sleep < 7 ? 'Restless' : 'Peaceful';
        const sleepColor = entry.sleep < 6 ? 'rose' : entry.sleep < 7 ? 'amber' : 'emerald';
        sleepLog.innerHTML += `
            <div class="flex items-center justify-between p-3 rounded-lg bg-purple-900/30 border border-purple-500/20 hover:border-indigo-400/50 transition group">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-${sleepColor}-500/20 flex items-center justify-center rune-glow">
                        <i class="fas fa-moon text-${sleepColor}-400"></i>
                    </div>
                    <div>
                        <div class="font-medium text-slate-200 magic-font">${entry.date}</div>
                        <div class="text-xs text-purple-400">${sleepQuality} slumber</div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="font-bold text-${sleepColor}-400 magic-font">${sleepTime}</div>
                </div>
            </div>
        `;
    });
}

function generateTips(score) {
    const tipsGrid = document.getElementById('tips-grid');
    const riskCard = document.getElementById('wellness-risk-card');
    
    let riskIcon, riskTitle, riskDesc, riskColor;
    if (score > 70) {
        riskIcon = 'fa-skull';
        riskTitle = 'Shadows Converge!';
        riskDesc = 'Thy essence is depleted! Seek the healing springs immediately. Speak with the Council of Healers.';
        riskColor = 'rose';
    } else if (score > 40) {
        riskIcon = 'fa-triangle-exclamation';
        riskTitle = 'Storms on the Horizon';
        riskDesc = 'The balance wavers. Perform protective rituals before the darkness grows.';
        riskColor = 'amber';
    } else {
        riskIcon = 'fa-shield-halved';
        riskTitle = 'Thy Aura Shines Bright!';
        riskDesc = 'The protective wards hold strong. Continue thy harmonious practices.';
        riskColor = 'emerald';
    }
    
    riskCard.innerHTML = `
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${riskColor}-400 via-yellow-400 to-${riskColor}-400"></div>
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-${riskColor}-500/20 mb-4 rune-glow relative">
            <i class="fas ${riskIcon} text-5xl text-${riskColor}-400"></i>
            <div class="absolute inset-0 rounded-full border-2 border-${riskColor}-400/30 animate-spin" style="animation-duration: ${score > 70 ? '2s' : '10s'};"></div>
        </div>
        <h3 class="text-2xl font-bold mb-2 magic-font text-white glow-text">${riskTitle}</h3>
        <p class="text-purple-300 mb-6 italic">${riskDesc}</p>
        <div class="flex justify-center gap-4 text-sm">
            <div class="px-4 py-2 rounded-full bg-${riskColor}-500/10 text-${riskColor}-400 border border-${riskColor}-400/30 magic-font">
                <i class="fas fa-star mr-2"></i>${score > 70 ? 'Critical' : score > 40 ? 'Caution' : 'Protected'}
            </div>
        </div>
    `;
    
    const tips = [];
    
    if (currentData.sleepHours < 6) {
        tips.push({
            icon: 'fa-bed',
            title: 'Dream Ward Ritual',
            desc: 'Thy dream visits are too brief. Enchant thy chamber for 7-8 hours of mystical restoration.',
            color: 'indigo'
        });
    }
    
    if (currentData.studyHours > 10) {
        tips.push({
            icon: 'fa-hourglass-half',
            title: 'The Pomodoro Enchantment',
            desc: 'Even the greatest mages rest. Study for 25 minutes, then restore mana for 5 minutes.',
            color: 'amber'
        });
    }
    
    if (currentData.stressLevel > 7) {
        tips.push({
            icon: 'fa-wind',
            title: 'Emergency Mana Purge',
            desc: 'Thy strain is critical! Perform the 4-7-8 breathing spell or walk in moonlight immediately.',
            color: 'cyan'
        });
    }
    
    if (currentData.symptoms.includes('headache') || currentData.symptoms.includes('fatigue')) {
        tips.push({
            icon: 'fa-droplet',
            title: 'Elixir of Hydration',
            desc: 'Physical afflictions detected. Drink the sacred waters and check thy posture alignment.',
            color: 'blue'
        });
    }
    
    if (tips.length < 3) {
        tips.push({
            icon: 'fa-person-walking',
            title: 'Movement Meditation',
            desc: 'Every hour, rise and perform the Stretching Ritual for 2 minutes to maintain flow.',
            color: 'emerald'
        });
        tips.push({
            icon: 'fa-users',
            title: 'Summon Allies',
            desc: 'Connect with thy fellowship. Shared magic strengthens all who participate.',
            color: 'violet'
        });
    }
    
    tipsGrid.innerHTML = tips.map(tip => `
        <div class="spell-card rounded-xl p-6 hover:transform hover:scale-[1.02] transition cursor-pointer group magic-card">
            <div class="flex items-start justify-between mb-4">
                