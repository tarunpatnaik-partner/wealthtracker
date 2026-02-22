/* ============================================================
   MY WEALTH, MY TRACKING — Main Application Controller
   ============================================================ */

const App = {
    currentPage: 'dashboard',
    charts: {},

    init() {
        this.setupNav();
        this.setupMobile();
        this.setupSearch();
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
        this.simulateMarketTicker();
    },

    // --- Routing ---
    handleRoute() {
        const hash = location.hash.slice(1) || 'dashboard';
        this.navigate(hash, false);
    },

    navigate(page, pushHash = true) {
        this.currentPage = page;
        if (pushHash) location.hash = page;
        // Update nav
        document.querySelectorAll('.nav-item').forEach(n => {
            n.classList.toggle('active', n.dataset.page === page);
        });
        // Render page
        const container = document.getElementById('pageContainer');
        const pageMap = {
            'dashboard': Pages.dashboard,
            'portfolio': Pages.portfolio,
            'add-investment': Pages.addInvestment,
            'analytics': Pages.analytics,
            'sip-tracker': Pages.sipTracker,
            'tax-planning': Pages.taxPlanning,
            'watchlist': Pages.watchlist,
            'settings': Pages.settings,
        };
        const renderer = pageMap[page];
        if (renderer) {
            container.innerHTML = renderer();
            container.style.animation = 'none';
            container.offsetHeight; // reflow
            container.style.animation = 'fadeIn 0.3s var(--ease-smooth)';
        }
        // Init charts after render
        setTimeout(() => {
            this.destroyCharts();
            if (page === 'dashboard') this.initDashboardCharts();
            if (page === 'analytics') this.initAnalyticsCharts();
            if (page === 'portfolio') this.initPortfolioFilter();
        }, 50);
        // Close mobile sidebar
        this.closeMobileSidebar();
    },

    // --- Navigation Setup ---
    setupNav() {
        document.querySelectorAll('.nav-item').forEach(n => {
            n.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(n.dataset.page);
            });
        });
    },

    // --- Mobile ---
    setupMobile() {
        const hamburger = document.getElementById('hamburger');
        const overlay = document.getElementById('sidebarOverlay');
        hamburger?.addEventListener('click', () => this.toggleMobileSidebar());
        overlay?.addEventListener('click', () => this.closeMobileSidebar());
    },

    toggleMobileSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('sidebarOverlay').classList.toggle('show');
    },

    closeMobileSidebar() {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.remove('show');
    },

    // --- Search ---
    setupSearch() {
        const input = document.getElementById('globalSearch');
        input?.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            if (q.length > 1 && this.currentPage !== 'portfolio') {
                this.navigate('portfolio');
            }
            setTimeout(() => this.filterPortfolio(q), 100);
        });
    },

    // --- Charts ---
    destroyCharts() {
        Object.values(this.charts).forEach(c => c?.destroy());
        this.charts = {};
    },

    initDashboardCharts() {
        const inv = DataStore.getInvestments();
        const alloc = {};
        inv.forEach(i => {
            const label = Utils.getAssetLabel(i.type);
            alloc[label] = (alloc[label] || 0) + Utils.getInvestmentValue(i);
        });
        const colors = ['#00d4aa', '#7c3aed', '#ffd700', '#3b82f6', '#ec4899', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];
        // Allocation donut
        const allocCtx = document.getElementById('allocationChart');
        if (allocCtx) {
            this.charts.allocation = new Chart(allocCtx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(alloc),
                    datasets: [{ data: Object.values(alloc), backgroundColor: colors.slice(0, Object.keys(alloc).length), borderWidth: 0, hoverOffset: 8 }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { position: 'right', labels: { color: '#8888a8', padding: 12, font: { size: 11, family: 'Inter' }, usePointStyle: true, pointStyleWidth: 8 } },
                        tooltip: { callbacks: { label: (c) => ` ${c.label}: ${Utils.formatCurrency(c.raw)}` }, backgroundColor: '#1a1a3e', titleColor: '#e8e8f0', bodyColor: '#e8e8f0', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }
                    }
                }
            });
        }
        // Growth line chart
        const growthCtx = document.getElementById('growthChart');
        if (growthCtx) {
            const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
            let totalCost = 0; inv.forEach(i => totalCost += Utils.getInvestmentCost(i));
            const base = totalCost * 0.7;
            const invested = months.map((_, i) => base + (totalCost - base) * (i + 1) / 12);
            const current = invested.map((v, i) => v * (1 + (0.02 + Math.random() * 0.05) * (i + 1) / 6));
            this.charts.growth = new Chart(growthCtx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        { label: 'Invested', data: invested, borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.1)', fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 6, borderWidth: 2 },
                        { label: 'Current Value', data: current, borderColor: '#00d4aa', backgroundColor: 'rgba(0,212,170,0.1)', fill: true, tension: 0.4, pointRadius: 3, pointHoverRadius: 6, borderWidth: 2 }
                    ]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: {
                        x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#555570', font: { size: 10 } } },
                        y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#555570', font: { size: 10 }, callback: (v) => Utils.formatCurrency(v) } }
                    },
                    plugins: {
                        legend: { labels: { color: '#8888a8', font: { size: 11, family: 'Inter' }, usePointStyle: true } },
                        tooltip: { backgroundColor: '#1a1a3e', titleColor: '#e8e8f0', bodyColor: '#e8e8f0', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, callbacks: { label: (c) => ` ${c.dataset.label}: ${Utils.formatCurrency(c.raw)}` } }
                    }
                }
            });
        }
    },

    initAnalyticsCharts() {
        const inv = DataStore.getInvestments();
        const byType = {};
        inv.forEach(i => {
            const t = Utils.getAssetLabel(i.type);
            if (!byType[t]) byType[t] = { value: 0, cost: 0 };
            byType[t].value += Utils.getInvestmentValue(i);
            byType[t].cost += Utils.getInvestmentCost(i);
        });
        const labels = Object.keys(byType);
        const returns = labels.map(l => byType[l].cost > 0 ? ((byType[l].value - byType[l].cost) / byType[l].cost) * 100 : 0);
        const colors = returns.map(r => r >= 0 ? '#00d4aa' : '#ef4444');

        const retCtx = document.getElementById('returnsChart');
        if (retCtx) {
            this.charts.returns = new Chart(retCtx, {
                type: 'bar',
                data: { labels, datasets: [{ label: 'Returns %', data: returns, backgroundColor: colors, borderRadius: 6, barThickness: 32 }] },
                options: {
                    responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                    scales: { x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#555570', callback: v => v + '%' } }, y: { grid: { display: false }, ticks: { color: '#8888a8', font: { size: 11 } } } },
                    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1a1a3e', titleColor: '#e8e8f0', bodyColor: '#e8e8f0', callbacks: { label: c => ` ${c.raw.toFixed(2)}%` } } }
                }
            });
        }
        const compCtx = document.getElementById('comparisonChart');
        if (compCtx) {
            this.charts.comparison = new Chart(compCtx, {
                type: 'bar',
                data: { labels, datasets: [{ label: 'Invested', data: labels.map(l => byType[l].cost), backgroundColor: 'rgba(124,58,237,0.6)', borderRadius: 4 }, { label: 'Current', data: labels.map(l => byType[l].value), backgroundColor: 'rgba(0,212,170,0.6)', borderRadius: 4 }] },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    scales: { x: { grid: { display: false }, ticks: { color: '#8888a8', font: { size: 10 }, maxRotation: 45 } }, y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#555570', callback: v => Utils.formatCurrency(v) } } },
                    plugins: { legend: { labels: { color: '#8888a8', usePointStyle: true } }, tooltip: { backgroundColor: '#1a1a3e', titleColor: '#e8e8f0', bodyColor: '#e8e8f0', callbacks: { label: c => ` ${c.dataset.label}: ${Utils.formatCurrency(c.raw)}` } } }
                }
            });
        }
    },

    // --- Portfolio Filter ---
    initPortfolioFilter() {
        document.querySelectorAll('.table-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.table-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.filterPortfolio('', tab.dataset.filter);
            });
        });
    },

    filterPortfolio(search = '', typeFilter = 'all') {
        const rows = document.querySelectorAll('#portfolioBody tr');
        rows.forEach(row => {
            const matchType = typeFilter === 'all' || row.dataset.type === typeFilter;
            const matchSearch = !search || row.textContent.toLowerCase().includes(search);
            row.style.display = matchType && matchSearch ? '' : 'none';
        });
    },

    // --- Add Investment Form ---
    selectAssetType(type) {
        document.querySelectorAll('.asset-type-card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`.asset-type-card[data-type="${type}"]`)?.classList.add('selected');
        const formDiv = document.getElementById('investmentForm');
        formDiv.style.display = 'block';
        const fields = this.getFormFields(type);
        formDiv.innerHTML = `<div class="card" style="padding:24px"><div class="card-title" style="margin-bottom:20px">Enter ${Utils.getAssetLabel(type)} Details</div>
            <div class="form-grid">${fields.map(f => `<div class="form-group ${f.full ? 'full-width' : ''}"><label class="form-label">${f.label}</label>${f.type === 'select' ? `<select class="form-select" id="inv_${f.key}">${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}</select>` : `<input class="form-input" type="${f.type || 'text'}" id="inv_${f.key}" placeholder="${f.placeholder || ''}" ${f.step ? `step="${f.step}"` : ''}>`}</div>`).join('')}</div>
            <div class="form-actions"><button class="btn btn-secondary" onclick="App.navigate('add-investment')">Cancel</button><button class="btn btn-primary" onclick="App.saveInvestment('${type}')">Save Investment</button></div></div>`;
    },

    getFormFields(type) {
        const common = [{ key: 'name', label: 'Name', placeholder: 'Investment name', full: true }];
        const fields = {
            'stocks': [...common, { key: 'ticker', label: 'Ticker (NSE/BSE)', placeholder: 'e.g. RELIANCE' }, { key: 'exchange', label: 'Exchange', type: 'select', options: ['NSE', 'BSE'] }, { key: 'qty', label: 'Quantity', type: 'number', placeholder: '10' }, { key: 'buyPrice', label: 'Buy Price (₹)', type: 'number', placeholder: '2450' }, { key: 'currentPrice', label: 'Current Price (₹)', type: 'number', placeholder: '2600' }, { key: 'buyDate', label: 'Buy Date', type: 'date' }, { key: 'broker', label: 'Broker', placeholder: 'Zerodha' }],
            'mutual-funds': [...common, { key: 'folio', label: 'Folio Number', placeholder: 'AX12345' }, { key: 'units', label: 'Units', type: 'number', step: '0.01' }, { key: 'buyNav', label: 'Buy NAV (₹)', type: 'number', step: '0.01' }, { key: 'nav', label: 'Current NAV (₹)', type: 'number', step: '0.01' }, { key: 'amc', label: 'AMC', placeholder: 'Axis AMC' }, { key: 'buyDate', label: 'Purchase Date', type: 'date' }],
            'sip': [...common, { key: 'amount', label: 'SIP Amount (₹)', type: 'number' }, { key: 'frequency', label: 'Frequency', type: 'select', options: ['Monthly', 'Quarterly'] }, { key: 'startDate', label: 'Start Date', type: 'date' }, { key: 'stepUp', label: 'Annual Step-up %', type: 'number' }],
            'fd': [...common, { key: 'bank', label: 'Bank', placeholder: 'SBI' }, { key: 'amount', label: 'Amount (₹)', type: 'number' }, { key: 'rate', label: 'Interest Rate %', type: 'number', step: '0.01' }, { key: 'tenure', label: 'Tenure', placeholder: '24 months' }, { key: 'startDate', label: 'Start Date', type: 'date' }, { key: 'maturityDate', label: 'Maturity Date', type: 'date' }],
            'ppf': [...common, { key: 'account', label: 'Account Number', placeholder: 'PPF-SBI-001' }, { key: 'yearlyContribution', label: 'Yearly Contribution (₹)', type: 'number' }, { key: 'currentBalance', label: 'Current Balance (₹)', type: 'number' }, { key: 'startYear', label: 'Start Year', type: 'number', placeholder: '2021' }],
            'nps': [...common, { key: 'account', label: 'Account', placeholder: 'NPS-T1-001' }, { key: 'yearlyContribution', label: 'Yearly Contribution (₹)', type: 'number' }, { key: 'currentBalance', label: 'Current Balance (₹)', type: 'number' }, { key: 'allocation', label: 'Allocation', type: 'select', options: ['Aggressive', 'Moderate', 'Conservative'] }],
            'epf': [...common, { key: 'account', label: 'UAN', placeholder: 'UAN-001' }, { key: 'yearlyContribution', label: 'Yearly Contribution (₹)', type: 'number' }, { key: 'currentBalance', label: 'Current Balance (₹)', type: 'number' }],
            'gold': [...common, { key: 'goldType', label: 'Gold Type', type: 'select', options: ['SGB', 'Digital', 'Physical'] }, { key: 'units', label: 'Units/Weight (grams)', type: 'number', step: '0.01' }, { key: 'buyPrice', label: 'Buy Price per unit (₹)', type: 'number' }, { key: 'currentPrice', label: 'Current Price per unit (₹)', type: 'number' }, { key: 'buyDate', label: 'Buy Date', type: 'date' }],
            'bonds': [...common, { key: 'issuer', label: 'Issuer', placeholder: 'REC Ltd' }, { key: 'faceValue', label: 'Face Value (₹)', type: 'number' }, { key: 'coupon', label: 'Coupon Rate %', type: 'number', step: '0.01' }, { key: 'maturityDate', label: 'Maturity Date', type: 'date' }, { key: 'buyDate', label: 'Buy Date', type: 'date' }],
            'insurance': [...common, { key: 'policy', label: 'Policy Number', placeholder: 'LIC-001' }, { key: 'premium', label: 'Annual Premium (₹)', type: 'number' }, { key: 'sumAssured', label: 'Sum Assured (₹)', type: 'number' }, { key: 'policyType', label: 'Type', type: 'select', options: ['Term', 'ULIP', 'Endowment', 'Whole Life'] }, { key: 'startDate', label: 'Start Date', type: 'date' }],
            'real-estate': [...common, { key: 'purchasePrice', label: 'Purchase Price (₹)', type: 'number' }, { key: 'currentValuation', label: 'Current Valuation (₹)', type: 'number' }, { key: 'rentalIncome', label: 'Monthly Rental (₹)', type: 'number' }, { key: 'buyDate', label: 'Purchase Date', type: 'date' }],
        };
        return fields[type] || common;
    },

    saveInvestment(type) {
        const fields = this.getFormFields(type);
        const inv = { type };
        let valid = true;
        fields.forEach(f => {
            const el = document.getElementById(`inv_${f.key}`);
            if (!el) return;
            let val = el.value;
            if (f.type === 'number') val = parseFloat(val) || 0;
            inv[f.key] = val;
            if (f.key === 'name' && !val) valid = false;
        });
        if (!valid) { this.toast('Please fill in the investment name', 'error'); return; }
        DataStore.addInvestment(inv);
        this.toast(`${inv.name} added to portfolio!`, 'success');
        this.navigate('portfolio');
    },

    deleteInvestment(id) {
        if (confirm('Delete this investment?')) {
            DataStore.deleteInvestment(id);
            this.toast('Investment deleted', 'info');
            this.navigate('portfolio');
        }
    },

    // --- SIP Calculator ---
    calculateSip() {
        const amt = parseFloat(document.getElementById('calcSipAmt')?.value) || 10000;
        const yrs = parseInt(document.getElementById('calcSipYears')?.value) || 10;
        const ret = parseFloat(document.getElementById('calcSipReturn')?.value) || 12;
        const stepUp = parseFloat(document.getElementById('calcSipStepup')?.value) || 0;
        const r = ret / 100 / 12;
        let totalInv = 0, totalVal = 0, monthly = amt;
        for (let y = 0; y < yrs; y++) {
            for (let m = 0; m < 12; m++) {
                totalInv += monthly;
                totalVal = (totalVal + monthly) * (1 + r);
            }
            monthly *= (1 + stepUp / 100);
        }
        document.getElementById('calcInvested').textContent = Utils.formatCurrency(totalInv);
        document.getElementById('calcWealth').textContent = Utils.formatCurrency(totalVal - totalInv);
        document.getElementById('calcFinal').textContent = Utils.formatCurrency(totalVal);
    },

    // --- Watchlist ---
    showAddWatchlist() {
        const form = document.getElementById('addWatchlistForm');
        if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
    },

    addWatchlistItem() {
        const name = document.getElementById('wlName')?.value;
        const ticker = document.getElementById('wlTicker')?.value;
        const exchange = document.getElementById('wlExchange')?.value || 'NSE';
        const price = parseFloat(document.getElementById('wlPrice')?.value) || 0;
        if (!name) { this.toast('Please enter a stock name', 'error'); return; }
        DataStore.addToWatchlist({ name, ticker, exchange, price, change: (Math.random() * 4 - 1).toFixed(2) * 1 });
        this.toast(`${name} added to watchlist`, 'success');
        this.navigate('watchlist');
    },

    removeWatchlistItem(id) {
        DataStore.removeFromWatchlist(id);
        this.toast('Removed from watchlist', 'info');
        this.navigate('watchlist');
    },

    // --- Settings ---
    saveProfile() {
        DataStore.updateProfile({
            name: document.getElementById('profName')?.value || '',
            pan: document.getElementById('profPan')?.value || '',
            email: document.getElementById('profEmail')?.value || '',
        });
        const p = DataStore.getProfile();
        const avatar = document.getElementById('userAvatar');
        if (avatar) avatar.querySelector('span').textContent = p.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        this.toast('Profile saved!', 'success');
    },

    exportData() {
        const data = DataStore.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'my-wealth-backup.json'; a.click();
        URL.revokeObjectURL(url);
        this.toast('Data exported!', 'success');
    },

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (DataStore.importData(e.target.result)) {
                this.toast('Data imported successfully!', 'success');
                this.navigate('dashboard');
            } else {
                this.toast('Invalid file format', 'error');
            }
        };
        reader.readAsText(file);
    },

    resetData() {
        if (confirm('Reset all data? This will restore sample investments.')) {
            DataStore.resetData();
            this.toast('Data reset to defaults', 'info');
            this.navigate('dashboard');
        }
    },

    // --- Market Ticker Simulation ---
    simulateMarketTicker() {
        setInterval(() => {
            const nifty = 22474.05 + (Math.random() - 0.5) * 50;
            const sensex = 74119.39 + (Math.random() - 0.5) * 150;
            const nChange = (Math.random() - 0.3) * 1.5;
            const sChange = (Math.random() - 0.3) * 1.5;
            const nEl = document.getElementById('niftyValue');
            const sEl = document.getElementById('sensexValue');
            const ncEl = document.getElementById('niftyChange');
            const scEl = document.getElementById('sensexChange');
            if (nEl) { nEl.textContent = nifty.toFixed(2); nEl.className = `ticker-value ${nChange >= 0 ? 'up' : 'down'}`; }
            if (sEl) { sEl.textContent = sensex.toFixed(2); sEl.className = `ticker-value ${sChange >= 0 ? 'up' : 'down'}`; }
            if (ncEl) { ncEl.textContent = `${nChange >= 0 ? '+' : ''}${nChange.toFixed(2)}%`; ncEl.className = `ticker-change ${nChange >= 0 ? 'up' : 'down'}`; }
            if (scEl) { scEl.textContent = `${sChange >= 0 ? '+' : ''}${sChange.toFixed(2)}%`; scEl.className = `ticker-change ${sChange >= 0 ? 'up' : 'down'}`; }
        }, 5000);
    },

    // --- Toast ---
    toast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
        container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 3000);
    }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
