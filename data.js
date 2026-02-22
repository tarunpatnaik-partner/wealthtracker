/* ============================================================
   MY WEALTH, MY TRACKING — Data Store & Sample Data
   ============================================================ */

const ASSET_TYPES = [
    { id: 'stocks', name: 'Stocks', icon: '📈', color: 'var(--accent-teal)' },
    { id: 'mutual-funds', name: 'Mutual Funds', icon: '🏦', color: 'var(--accent-purple)' },
    { id: 'sip', name: 'SIP', icon: '🔄', color: 'var(--accent-blue)' },
    { id: 'fd', name: 'Fixed Deposits', icon: '🔒', color: 'var(--accent-gold)' },
    { id: 'ppf', name: 'PPF', icon: '🏛️', color: 'var(--accent-orange)' },
    { id: 'nps', name: 'NPS', icon: '👴', color: 'var(--accent-pink)' },
    { id: 'epf', name: 'EPF', icon: '🏗️', color: 'var(--accent-blue)' },
    { id: 'gold', name: 'Gold', icon: '🥇', color: 'var(--accent-gold)' },
    { id: 'bonds', name: 'Bonds', icon: '📄', color: 'var(--accent-teal)' },
    { id: 'insurance', name: 'Insurance', icon: '🛡️', color: 'var(--accent-purple)' },
    { id: 'real-estate', name: 'Real Estate', icon: '🏠', color: 'var(--accent-orange)' },
];

const SAMPLE_INVESTMENTS = [
    { id: 1, type: 'stocks', name: 'Reliance Industries', ticker: 'RELIANCE', exchange: 'NSE', qty: 25, buyPrice: 2450, currentPrice: 2892, buyDate: '2024-06-15', broker: 'Zerodha' },
    { id: 2, type: 'stocks', name: 'TCS', ticker: 'TCS', exchange: 'NSE', qty: 10, buyPrice: 3580, currentPrice: 3945, buyDate: '2024-03-10', broker: 'Groww' },
    { id: 3, type: 'stocks', name: 'HDFC Bank', ticker: 'HDFCBANK', exchange: 'NSE', qty: 30, buyPrice: 1520, currentPrice: 1685, buyDate: '2024-08-22', broker: 'Zerodha' },
    { id: 4, type: 'stocks', name: 'Infosys', ticker: 'INFY', exchange: 'NSE', qty: 40, buyPrice: 1420, currentPrice: 1560, buyDate: '2024-01-05', broker: 'Angel One' },
    { id: 5, type: 'stocks', name: 'ITC Ltd', ticker: 'ITC', exchange: 'NSE', qty: 100, buyPrice: 430, currentPrice: 465, buyDate: '2024-05-18', broker: 'Zerodha' },
    { id: 6, type: 'mutual-funds', name: 'Axis Bluechip Fund', folio: 'AX12345', units: 450.23, nav: 52.8, buyNav: 46.5, amc: 'Axis AMC', buyDate: '2023-11-10' },
    { id: 7, type: 'mutual-funds', name: 'Mirae Asset Large Cap', folio: 'MA67890', units: 312.5, nav: 98.6, buyNav: 82.3, amc: 'Mirae Asset', buyDate: '2023-06-15' },
    { id: 8, type: 'mutual-funds', name: 'Parag Parikh Flexi Cap', folio: 'PP11223', units: 280.0, nav: 72.4, buyNav: 61.0, amc: 'PPFAS', buyDate: '2024-02-20' },
    { id: 9, type: 'mutual-funds', name: 'SBI Small Cap Fund', folio: 'SB44556', units: 120.75, nav: 148.9, buyNav: 115.2, amc: 'SBI AMC', buyDate: '2023-09-05' },
    { id: 10, type: 'fd', name: 'SBI Fixed Deposit', bank: 'SBI', amount: 500000, rate: 7.1, tenure: '24 months', maturityDate: '2026-06-15', startDate: '2024-06-15' },
    { id: 11, type: 'fd', name: 'HDFC Fixed Deposit', bank: 'HDFC Bank', amount: 300000, rate: 7.25, tenure: '36 months', maturityDate: '2027-03-10', startDate: '2024-03-10' },
    { id: 12, type: 'ppf', name: 'PPF Account', account: 'PPF-SBI-001', yearlyContribution: 150000, currentBalance: 485000, startYear: 2021 },
    { id: 13, type: 'nps', name: 'NPS Tier 1', account: 'NPS-T1-001', yearlyContribution: 50000, currentBalance: 225000, allocation: 'Aggressive' },
    { id: 14, type: 'gold', name: 'Sovereign Gold Bond 2024', goldType: 'SGB', units: 4, buyPrice: 5800, currentPrice: 6450, buyDate: '2024-02-10' },
    { id: 15, type: 'gold', name: 'Digital Gold', goldType: 'Digital', weight: 10, buyPrice: 5600, currentPrice: 6450, buyDate: '2024-04-05' },
    { id: 16, type: 'bonds', name: 'REC Ltd Bond', issuer: 'REC', faceValue: 100000, coupon: 7.54, maturityDate: '2029-08-15', buyDate: '2024-08-15' },
    { id: 17, type: 'insurance', name: 'LIC Jeevan Anand', policy: 'LIC-JA-001', premium: 48000, sumAssured: 2500000, policyType: 'Endowment', startDate: '2022-04-01' },
    { id: 18, type: 'real-estate', name: 'Flat in Bangalore', purchasePrice: 7500000, currentValuation: 9200000, rentalIncome: 25000, buyDate: '2021-01-15' },
];

const SAMPLE_SIPS = [
    { id: 1, fundName: 'Axis Bluechip Fund - Direct Growth', amount: 5000, frequency: 'Monthly', startDate: '2023-11-10', stepUp: 10, status: 'active', totalInvested: 75000, currentValue: 88500 },
    { id: 2, fundName: 'Mirae Asset Large Cap - Direct Growth', amount: 10000, frequency: 'Monthly', startDate: '2023-06-15', stepUp: 15, status: 'active', totalInvested: 200000, currentValue: 248000 },
    { id: 3, fundName: 'Parag Parikh Flexi Cap - Direct Growth', amount: 3000, frequency: 'Monthly', startDate: '2024-02-20', stepUp: 10, status: 'active', totalInvested: 36000, currentValue: 41200 },
    { id: 4, fundName: 'SBI Small Cap - Direct Growth', amount: 5000, frequency: 'Monthly', startDate: '2023-09-05', stepUp: 0, status: 'active', totalInvested: 85000, currentValue: 102000 },
    { id: 5, fundName: 'HDFC Mid Cap Opportunities', amount: 7500, frequency: 'Monthly', startDate: '2024-01-10', stepUp: 10, status: 'paused', totalInvested: 97500, currentValue: 108000 },
];

const SAMPLE_WATCHLIST = [
    { id: 1, name: 'Bajaj Finance', ticker: 'BAJFINANCE', exchange: 'NSE', price: 6890, change: 1.24 },
    { id: 2, name: 'Asian Paints', ticker: 'ASIANPAINT', exchange: 'NSE', price: 2756, change: -0.45 },
    { id: 3, name: 'Tata Motors', ticker: 'TATAMOTORS', exchange: 'NSE', price: 785, change: 2.1 },
    { id: 4, name: 'Adani Ports', ticker: 'ADANIPORTS', exchange: 'NSE', price: 1245, change: -1.3 },
    { id: 5, name: 'Kotak Mahindra Bank', ticker: 'KOTAKBANK', exchange: 'NSE', price: 1820, change: 0.67 },
    { id: 6, name: 'Nifty BeES', ticker: 'NIFTYBEES', exchange: 'NSE', price: 245, change: 0.82 },
];

const SAMPLE_GOALS = [
    { id: 1, name: 'Retirement Fund', target: 20000000, current: 3200000, color: 'var(--accent-teal)' },
    { id: 2, name: 'Child Education', target: 5000000, current: 1850000, color: 'var(--accent-purple)' },
    { id: 3, name: 'Emergency Fund', target: 1000000, current: 780000, color: 'var(--accent-gold)' },
    { id: 4, name: 'Dream Home', target: 10000000, current: 2500000, color: 'var(--accent-blue)' },
];

// Data Store with localStorage persistence
const DataStore = {
    _key: 'mywealth_data',
    _getData() {
        const d = localStorage.getItem(this._key);
        if (d) return JSON.parse(d);
        const initial = { investments: SAMPLE_INVESTMENTS, sips: SAMPLE_SIPS, watchlist: SAMPLE_WATCHLIST, goals: SAMPLE_GOALS, profile: { name: 'Tarun Patnaik', pan: 'XXXXX1234X', email: 'tarun@example.com' }, settings: { darkMode: true, currency: 'INR' }, nextId: 100 };
        this._save(initial);
        return initial;
    },
    _save(data) { localStorage.setItem(this._key, JSON.stringify(data)); },
    getInvestments() { return this._getData().investments; },
    getSips() { return this._getData().sips; },
    getWatchlist() { return this._getData().watchlist; },
    getGoals() { return this._getData().goals; },
    getProfile() { return this._getData().profile; },
    getSettings() { return this._getData().settings; },
    addInvestment(inv) {
        const d = this._getData();
        inv.id = d.nextId++;
        d.investments.push(inv);
        this._save(d);
        return inv;
    },
    deleteInvestment(id) {
        const d = this._getData();
        d.investments = d.investments.filter(i => i.id !== id);
        this._save(d);
    },
    addToWatchlist(item) {
        const d = this._getData();
        item.id = d.nextId++;
        d.watchlist.push(item);
        this._save(d);
    },
    removeFromWatchlist(id) {
        const d = this._getData();
        d.watchlist = d.watchlist.filter(i => i.id !== id);
        this._save(d);
    },
    updateProfile(profile) {
        const d = this._getData();
        d.profile = { ...d.profile, ...profile };
        this._save(d);
    },
    exportData() { return JSON.stringify(this._getData(), null, 2); },
    importData(json) {
        try { const d = JSON.parse(json); this._save(d); return true; }
        catch { return false; }
    },
    resetData() { localStorage.removeItem(this._key); }
};

// Utility functions
const Utils = {
    formatCurrency(n) {
        if (n === undefined || n === null) return '₹0';
        const abs = Math.abs(n);
        if (abs >= 10000000) return (n < 0 ? '-' : '') + '₹' + (abs / 10000000).toFixed(2) + ' Cr';
        if (abs >= 100000) return (n < 0 ? '-' : '') + '₹' + (abs / 100000).toFixed(2) + ' L';
        return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    },
    formatPct(n) { return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'; },
    pnlClass(n) { return n >= 0 ? 'pnl-positive' : 'pnl-negative'; },
    changeClass(n) { return n >= 0 ? 'profit' : 'loss'; },
    getInvestmentValue(inv) {
        switch (inv.type) {
            case 'stocks': return inv.qty * inv.currentPrice;
            case 'mutual-funds': return inv.units * inv.nav;
            case 'fd': { const yrs = (new Date(inv.maturityDate) - new Date(inv.startDate)) / (365.25*86400000); return inv.amount * Math.pow(1 + inv.rate/100, Math.min(yrs, (Date.now() - new Date(inv.startDate).getTime())/(365.25*86400000))); }
            case 'ppf': case 'nps': case 'epf': return inv.currentBalance;
            case 'gold': return inv.goldType === 'Digital' ? inv.weight * inv.currentPrice : inv.units * inv.currentPrice;
            case 'bonds': return inv.faceValue;
            case 'insurance': return inv.sumAssured;
            case 'real-estate': return inv.currentValuation;
            default: return 0;
        }
    },
    getInvestmentCost(inv) {
        switch (inv.type) {
            case 'stocks': return inv.qty * inv.buyPrice;
            case 'mutual-funds': return inv.units * inv.buyNav;
            case 'fd': return inv.amount;
            case 'ppf': case 'nps': case 'epf': return inv.yearlyContribution * (new Date().getFullYear() - (inv.startYear || 2021) + 1);
            case 'gold': return inv.goldType === 'Digital' ? inv.weight * inv.buyPrice : inv.units * inv.buyPrice;
            case 'bonds': return inv.faceValue;
            case 'insurance': return inv.premium * Math.max(1, Math.ceil((Date.now() - new Date(inv.startDate).getTime())/(365.25*86400000)));
            case 'real-estate': return inv.purchasePrice;
            default: return 0;
        }
    },
    getAssetLabel(type) { return ASSET_TYPES.find(a => a.id === type)?.name || type; },
    getAssetIcon(type) { return ASSET_TYPES.find(a => a.id === type)?.icon || '💰'; },
    getAssetColor(type) { return ASSET_TYPES.find(a => a.id === type)?.color || 'var(--accent-teal)'; },
};
