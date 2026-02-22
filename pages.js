/* ============================================================
   MY WEALTH, MY TRACKING — Page Renderers
   ============================================================ */

const Pages = {
    dashboard() {
        const inv = DataStore.getInvestments();
        const goals = DataStore.getGoals();
        let totalValue = 0, totalCost = 0;
        const assetAllocation = {};
        inv.forEach(i => {
            const v = Utils.getInvestmentValue(i);
            const c = Utils.getInvestmentCost(i);
            totalValue += v; totalCost += c;
            const label = Utils.getAssetLabel(i.type);
            assetAllocation[label] = (assetAllocation[label] || 0) + v;
        });
        const totalPnl = totalValue - totalCost;
        const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
        const sips = DataStore.getSips();
        const activeSips = sips.filter(s => s.status === 'active');
        const monthlySip = activeSips.reduce((s, i) => s + i.amount, 0);

        // Sort for top holdings
        const holdings = inv.map(i => ({ ...i, value: Utils.getInvestmentValue(i), cost: Utils.getInvestmentCost(i) })).sort((a, b) => b.value - a.value);

        return `
        <div style="text-align:center;padding:14px 20px;margin-bottom:20px;background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(0,212,170,0.1));border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
            <div style="font-family:var(--font-display);font-size:1.05rem;font-weight:700;color:var(--text-bright);letter-spacing:0.3px;">"AR could not do it, so I did it"</div>
            <div style="font-size:0.75rem;color:var(--accent-teal);font-weight:600;margin-top:4px;letter-spacing:1px;">Powered by Tarun.ai</div>
        </div>
        <div class="section-header">
            <h2 class="section-title">Dashboard</h2>
            <p class="section-subtitle">Your wealth at a glance • ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div class="stats-grid">
            <div class="stat-card teal"><div class="stat-icon">💰</div><div class="stat-label">Total Portfolio Value</div><div class="stat-value number-animate">${Utils.formatCurrency(totalValue)}</div><div class="stat-sub ${Utils.changeClass(totalPnl)}">↑ ${Utils.formatCurrency(Math.abs(totalPnl))} (${Utils.formatPct(totalPnlPct)})</div></div>
            <div class="stat-card purple"><div class="stat-icon">📊</div><div class="stat-label">Total Invested</div><div class="stat-value number-animate">${Utils.formatCurrency(totalCost)}</div><div class="stat-sub" style="color:var(--text-muted)">${inv.length} investments</div></div>
            <div class="stat-card gold"><div class="stat-icon">🔄</div><div class="stat-label">Monthly SIP</div><div class="stat-value number-animate">${Utils.formatCurrency(monthlySip)}</div><div class="stat-sub" style="color:var(--text-muted)">${activeSips.length} active SIPs</div></div>
            <div class="stat-card blue"><div class="stat-icon">${totalPnl >= 0 ? '📈' : '📉'}</div><div class="stat-label">Unrealized P&L</div><div class="stat-value number-animate ${Utils.changeClass(totalPnl)}" style="color:${totalPnl >= 0 ? 'var(--color-profit)' : 'var(--color-loss)'}">${Utils.formatCurrency(totalPnl)}</div><div class="stat-sub ${Utils.changeClass(totalPnlPct)}">${Utils.formatPct(totalPnlPct)} overall</div></div>
        </div>
        <div class="charts-grid">
            <div class="chart-card"><div class="card-title">Asset Allocation</div><div class="chart-wrapper"><canvas id="allocationChart"></canvas></div></div>
            <div class="chart-card"><div class="card-title">Portfolio Growth (Monthly)</div><div class="chart-wrapper"><canvas id="growthChart"></canvas></div></div>
        </div>
        <div class="charts-grid">
            <div class="card" style="padding:20px">
                <div class="card-title" style="margin-bottom:16px">Top 5 Holdings</div>
                <div class="transactions-list">${holdings.slice(0, 5).map(h => {
            const pnl = h.value - h.cost;
            return `<div class="transaction-item"><div class="transaction-left"><div class="transaction-icon buy">${Utils.getAssetIcon(h.type)}</div><div><div class="transaction-name">${h.name}</div><div class="transaction-date">${Utils.getAssetLabel(h.type)}</div></div></div><div class="transaction-amount"><div class="${Utils.pnlClass(pnl)}">${Utils.formatCurrency(h.value)}</div><div style="font-size:0.72rem" class="${Utils.pnlClass(pnl)}">${Utils.formatPct(h.cost > 0 ? (pnl / h.cost) * 100 : 0)}</div></div></div>`;
        }).join('')}</div>
            </div>
            <div class="card" style="padding:20px">
                <div class="card-title" style="margin-bottom:16px">Goal Progress</div>
                ${goals.map(g => {
            const pct = Math.min(100, (g.current / g.target) * 100);
            return `<div class="goal-card" style="margin-bottom:12px;padding:14px"><div class="goal-name">${g.name}</div><div class="goal-target">Target: ${Utils.formatCurrency(g.target)}</div><div class="goal-progress-bar"><div class="goal-progress-fill" style="width:${pct}%;background:${g.color}"></div></div><div class="goal-progress-text"><span>${Utils.formatCurrency(g.current)}</span><span>${pct.toFixed(1)}%</span></div></div>`;
        }).join('')}
            </div>
        </div>`;
    },

    portfolio() {
        const inv = DataStore.getInvestments();
        const types = ['all', ...new Set(inv.map(i => i.type))];
        return `
        <div class="section-header"><h2 class="section-title">Portfolio</h2><p class="section-subtitle">All your investments in one place</p></div>
        <div class="table-container">
            <div class="table-toolbar">
                <div class="table-tabs">${types.map(t => `<button class="table-tab ${t === 'all' ? 'active' : ''}" data-filter="${t}">${t === 'all' ? 'All' : Utils.getAssetLabel(t)}</button>`).join('')}</div>
                <button class="btn btn-primary btn-sm" onclick="App.navigate('add-investment')">+ Add New</button>
            </div>
            <div style="overflow-x:auto">
            <table class="holdings-table">
                <thead><tr><th>Investment</th><th>Type</th><th>Invested</th><th>Current Value</th><th>P&L</th><th>Returns</th><th>Actions</th></tr></thead>
                <tbody id="portfolioBody">${inv.map(i => {
            const val = Utils.getInvestmentValue(i);
            const cost = Utils.getInvestmentCost(i);
            const pnl = val - cost;
            const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
            return `<tr data-type="${i.type}" data-id="${i.id}"><td><div class="holding-name"><div class="holding-icon" style="background:${Utils.getAssetColor(i.type)}20;color:${Utils.getAssetColor(i.type)}">${Utils.getAssetIcon(i.type)}</div><div class="holding-info"><div class="name">${i.name}</div><div class="sub">${i.ticker || i.folio || i.bank || i.account || i.issuer || i.policy || ''}</div></div></div></td><td data-label="Type"><span class="badge badge-active">${Utils.getAssetLabel(i.type)}</span></td><td data-label="Invested">${Utils.formatCurrency(cost)}</td><td data-label="Current Value" style="font-weight:700">${Utils.formatCurrency(val)}</td><td data-label="P&amp;L" class="${Utils.pnlClass(pnl)}">${Utils.formatCurrency(pnl)}</td><td data-label="Returns" class="${Utils.pnlClass(pnlPct)}">${Utils.formatPct(pnlPct)}</td><td><div class="action-btns"><button class="action-btn" onclick="App.deleteInvestment(${i.id})" title="Delete">🗑️</button></div></td></tr>`;
        }).join('')}</tbody>
            </table>
            </div>
        </div>`;
    },

    addInvestment() {
        return `
        <div class="section-header"><h2 class="section-title">Add Investment</h2><p class="section-subtitle">Track a new investment across any asset class</p></div>
        <div class="card" style="margin-bottom:24px;padding:24px">
            <div class="card-title" style="margin-bottom:16px">Select Asset Type</div>
            <div class="asset-type-grid">${ASSET_TYPES.map(a => `<div class="asset-type-card" data-type="${a.id}" onclick="App.selectAssetType('${a.id}')"><div class="type-icon" style="background:${a.color}15;color:${a.color}">${a.icon}</div><div class="type-name">${a.name}</div></div>`).join('')}</div>
        </div>
        <div id="investmentForm" style="display:none"></div>`;
    },

    analytics() {
        const inv = DataStore.getInvestments();
        const byType = {};
        let totalVal = 0, totalCost = 0;
        inv.forEach(i => {
            const v = Utils.getInvestmentValue(i), c = Utils.getInvestmentCost(i);
            totalVal += v; totalCost += c;
            const t = Utils.getAssetLabel(i.type);
            if (!byType[t]) byType[t] = { value: 0, cost: 0 };
            byType[t].value += v; byType[t].cost += c;
        });
        return `
        <div class="section-header"><h2 class="section-title">Analytics & Reports</h2><p class="section-subtitle">Deep insights into your portfolio performance</p></div>
        <div class="stats-grid">
            <div class="stat-card teal"><div class="stat-icon">📊</div><div class="stat-label">Portfolio XIRR</div><div class="stat-value" style="color:var(--accent-teal)">${Utils.formatPct(totalCost > 0 ? ((totalVal / totalCost) - 1) * 100 : 0)}</div></div>
            <div class="stat-card purple"><div class="stat-icon">📈</div><div class="stat-label">Best Performer</div><div class="stat-value" style="font-size:1.1rem">${inv.length > 0 ? inv.reduce((best, i) => { const r = (Utils.getInvestmentValue(i) - Utils.getInvestmentCost(i)) / Math.max(1, Utils.getInvestmentCost(i)); return r > best.r ? { name: i.name, r } : best; }, { name: '-', r: -Infinity }).name : '-'}</div></div>
            <div class="stat-card gold"><div class="stat-icon">🏷️</div><div class="stat-label">Total Gain</div><div class="stat-value ${Utils.changeClass(totalVal - totalCost)}" style="color:${(totalVal - totalCost) >= 0 ? 'var(--color-profit)' : 'var(--color-loss)'}">${Utils.formatCurrency(totalVal - totalCost)}</div></div>
            <div class="stat-card blue"><div class="stat-icon">🔢</div><div class="stat-label">Investments</div><div class="stat-value">${inv.length}</div></div>
        </div>
        <div class="charts-grid">
            <div class="chart-card"><div class="card-title">Returns by Asset Class</div><div class="chart-wrapper"><canvas id="returnsChart"></canvas></div></div>
            <div class="chart-card"><div class="card-title">Investment vs Current Value</div><div class="chart-wrapper"><canvas id="comparisonChart"></canvas></div></div>
        </div>
        <div class="card" style="padding:20px;margin-top:4px">
            <div class="card-title" style="margin-bottom:16px">Detailed Breakdown</div>
            <table class="holdings-table"><thead><tr><th>Asset Class</th><th>Invested</th><th>Current Value</th><th>Gain/Loss</th><th>Return %</th></tr></thead><tbody>
            ${Object.entries(byType).map(([t, d]) => { const pnl = d.value - d.cost; const pct = d.cost > 0 ? (pnl / d.cost) * 100 : 0; return `<tr><td style="font-weight:600">${t}</td><td>${Utils.formatCurrency(d.cost)}</td><td style="font-weight:700">${Utils.formatCurrency(d.value)}</td><td class="${Utils.pnlClass(pnl)}">${Utils.formatCurrency(pnl)}</td><td class="${Utils.pnlClass(pct)}">${Utils.formatPct(pct)}</td></tr>`; }).join('')}
            </tbody></table>
        </div>`;
    },

    sipTracker() {
        const sips = DataStore.getSips();
        return `
        <div class="section-header"><h2 class="section-title">SIP Tracker</h2><p class="section-subtitle">Systematic Investment Plans — the power of compounding</p></div>
        <div class="stats-grid">
            <div class="stat-card teal"><div class="stat-icon">🔄</div><div class="stat-label">Active SIPs</div><div class="stat-value">${sips.filter(s => s.status === 'active').length}</div></div>
            <div class="stat-card purple"><div class="stat-icon">💸</div><div class="stat-label">Monthly Outflow</div><div class="stat-value">${Utils.formatCurrency(sips.filter(s => s.status === 'active').reduce((s, i) => s + i.amount, 0))}</div></div>
            <div class="stat-card gold"><div class="stat-icon">📊</div><div class="stat-label">Total Invested</div><div class="stat-value">${Utils.formatCurrency(sips.reduce((s, i) => s + i.totalInvested, 0))}</div></div>
            <div class="stat-card blue"><div class="stat-icon">📈</div><div class="stat-label">Current Value</div><div class="stat-value">${Utils.formatCurrency(sips.reduce((s, i) => s + i.currentValue, 0))}</div></div>
        </div>
        <div class="sip-cards-grid">${sips.map(s => `
            <div class="sip-card"><div class="sip-card-header"><div><div class="sip-fund-name">${s.fundName}</div><span class="badge ${s.status === 'active' ? 'badge-active' : 'badge-paused'}">${s.status}</span></div><div class="sip-amount">${Utils.formatCurrency(s.amount)}/mo</div></div>
            <div class="sip-meta">
                <div class="sip-meta-item"><div class="sip-meta-label">Started</div><div class="sip-meta-value">${new Date(s.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</div></div>
                <div class="sip-meta-item"><div class="sip-meta-label">Step-up</div><div class="sip-meta-value">${s.stepUp}% yearly</div></div>
                <div class="sip-meta-item"><div class="sip-meta-label">Invested</div><div class="sip-meta-value">${Utils.formatCurrency(s.totalInvested)}</div></div>
                <div class="sip-meta-item"><div class="sip-meta-label">Current</div><div class="sip-meta-value ${Utils.pnlClass(s.currentValue - s.totalInvested)}">${Utils.formatCurrency(s.currentValue)}</div></div>
            </div></div>`).join('')}</div>
        <div class="card" style="padding:24px;margin-top:8px">
            <div class="card-title" style="margin-bottom:20px">SIP Calculator</div>
            <div class="form-grid">
                <div class="form-group"><label class="form-label">Monthly SIP (₹)</label><input class="form-input" type="number" id="calcSipAmt" value="10000"></div>
                <div class="form-group"><label class="form-label">Duration (Years)</label><input class="form-input" type="number" id="calcSipYears" value="10"></div>
                <div class="form-group"><label class="form-label">Expected Return (%)</label><input class="form-input" type="number" id="calcSipReturn" value="12" step="0.5"></div>
                <div class="form-group"><label class="form-label">Annual Step-up (%)</label><input class="form-input" type="number" id="calcSipStepup" value="10"></div>
            </div>
            <div style="margin-top:16px;text-align:right"><button class="btn btn-primary" onclick="App.calculateSip()">Calculate</button></div>
            <div class="calc-result" id="sipCalcResult">
                <div class="calc-result-item"><div class="calc-result-label">Total Invested</div><div class="calc-result-value" id="calcInvested">—</div></div>
                <div class="calc-result-item"><div class="calc-result-label">Wealth Gained</div><div class="calc-result-value highlight" id="calcWealth">—</div></div>
                <div class="calc-result-item"><div class="calc-result-label">Final Value</div><div class="calc-result-value highlight" id="calcFinal">—</div></div>
            </div>
        </div>`;
    },

    taxPlanning() {
        const inv = DataStore.getInvestments();
        let elss = 0, ppf = 0, nps = 0, insurance = 0, epf = 0;
        inv.forEach(i => {
            if (i.type === 'ppf') ppf += i.yearlyContribution;
            if (i.type === 'nps') nps += i.yearlyContribution;
            if (i.type === 'epf') epf += (i.yearlyContribution || 0);
            if (i.type === 'insurance') insurance += i.premium;
        });
        const total80C = Math.min(150000, elss + ppf + insurance + epf);
        const pct80C = (total80C / 150000) * 100;
        // LTCG/STCG
        let ltcg = 0, stcg = 0;
        inv.filter(i => i.type === 'stocks' || i.type === 'mutual-funds').forEach(i => {
            const pnl = Utils.getInvestmentValue(i) - Utils.getInvestmentCost(i);
            const days = (Date.now() - new Date(i.buyDate).getTime()) / 86400000;
            if (days > 365) ltcg += pnl; else stcg += pnl;
        });

        return `
        <div class="section-header"><h2 class="section-title">Tax Planning</h2><p class="section-subtitle">Optimize your taxes under Indian Income Tax Act</p></div>
        <div class="card tax-meter" style="padding:24px">
            <div class="card-title" style="margin-bottom:16px">Section 80C Utilization (Limit: ₹1,50,000)</div>
            <div class="meter-bar-container"><div class="meter-bar" style="width:${pct80C}%"></div></div>
            <div class="meter-labels"><span>${Utils.formatCurrency(total80C)} utilized</span><span>${Utils.formatCurrency(150000 - total80C)} remaining</span></div>
        </div>
        <div class="tax-cards-grid">
            <div class="tax-card"><div class="tax-card-title">Section 80C Breakdown</div>
                <div class="tax-item"><span class="tax-item-label">ELSS Mutual Funds</span><span class="tax-item-value">${Utils.formatCurrency(elss)}</span></div>
                <div class="tax-item"><span class="tax-item-label">PPF</span><span class="tax-item-value">${Utils.formatCurrency(ppf)}</span></div>
                <div class="tax-item"><span class="tax-item-label">Life Insurance Premium</span><span class="tax-item-value">${Utils.formatCurrency(insurance)}</span></div>
                <div class="tax-item"><span class="tax-item-label">EPF Contribution</span><span class="tax-item-value">${Utils.formatCurrency(epf)}</span></div>
                <div class="tax-item"><span class="tax-item-label"><strong>Total</strong></span><span class="tax-item-value"><strong>${Utils.formatCurrency(total80C)}</strong></span></div>
            </div>
            <div class="tax-card"><div class="tax-card-title">Capital Gains Summary</div>
                <div class="tax-item"><span class="tax-item-label">Long Term Capital Gains</span><span class="tax-item-value ${Utils.pnlClass(ltcg)}">${Utils.formatCurrency(ltcg)}</span></div>
                <div class="tax-item"><span class="tax-item-label">LTCG Tax (12.5% above ₹1.25L)</span><span class="tax-item-value">${Utils.formatCurrency(Math.max(0, (ltcg - 125000) * 0.125))}</span></div>
                <div class="tax-item"><span class="tax-item-label">Short Term Capital Gains</span><span class="tax-item-value ${Utils.pnlClass(stcg)}">${Utils.formatCurrency(stcg)}</span></div>
                <div class="tax-item"><span class="tax-item-label">STCG Tax (20%)</span><span class="tax-item-value">${Utils.formatCurrency(Math.max(0, stcg * 0.20))}</span></div>
            </div>
            <div class="tax-card"><div class="tax-card-title">Section 80CCD(1B) — NPS</div>
                <div class="tax-item"><span class="tax-item-label">NPS Contribution</span><span class="tax-item-value">${Utils.formatCurrency(nps)}</span></div>
                <div class="tax-item"><span class="tax-item-label">Additional Deduction Limit</span><span class="tax-item-value">₹50,000</span></div>
                <div class="tax-item"><span class="tax-item-label">Deduction Claimed</span><span class="tax-item-value">${Utils.formatCurrency(Math.min(50000, nps))}</span></div>
            </div>
            <div class="tax-card"><div class="tax-card-title">Old vs New Regime Comparison</div>
                <div class="tax-item"><span class="tax-item-label">Total Deductions (Old)</span><span class="tax-item-value">${Utils.formatCurrency(total80C + Math.min(50000, nps))}</span></div>
                <div class="tax-item"><span class="tax-item-label">Standard Deduction (New)</span><span class="tax-item-value">₹75,000</span></div>
                <div class="tax-item"><span class="tax-item-label" style="color:var(--accent-teal)"><strong>Recommendation</strong></span><span class="tax-item-value" style="color:var(--accent-teal)">${(total80C + Math.min(50000, nps)) > 75000 ? 'Old Regime' : 'New Regime'}</span></div>
            </div>
        </div>`;
    },

    watchlist() {
        const wl = DataStore.getWatchlist();
        return `
        <div class="section-header"><h2 class="section-title">Watchlist</h2><p class="section-subtitle">Track stocks and instruments you're interested in</p></div>
        <div style="margin-bottom:20px"><button class="btn btn-primary btn-sm" onclick="App.showAddWatchlist()">+ Add to Watchlist</button></div>
        <div id="addWatchlistForm" style="display:none;margin-bottom:20px" class="card" style="padding:20px">
            <div class="form-grid" style="padding:20px">
                <div class="form-group"><label class="form-label">Stock Name</label><input class="form-input" id="wlName" placeholder="e.g. Tata Steel"></div>
                <div class="form-group"><label class="form-label">Ticker</label><input class="form-input" id="wlTicker" placeholder="e.g. TATASTEEL"></div>
                <div class="form-group"><label class="form-label">Exchange</label><select class="form-select" id="wlExchange"><option>NSE</option><option>BSE</option></select></div>
                <div class="form-group"><label class="form-label">Current Price (₹)</label><input class="form-input" type="number" id="wlPrice" placeholder="1250"></div>
            </div>
            <div class="form-actions" style="padding:0 20px 20px"><button class="btn btn-secondary btn-sm" onclick="document.getElementById('addWatchlistForm').style.display='none'">Cancel</button><button class="btn btn-primary btn-sm" onclick="App.addWatchlistItem()">Add</button></div>
        </div>
        <div class="watchlist-grid">${wl.map(w => `
            <div class="watchlist-card"><div class="watchlist-card-header"><div class="watchlist-name">${w.name}</div><span class="watchlist-exchange">${w.exchange}</span></div>
            <div class="watchlist-price">₹${w.price.toLocaleString('en-IN')}</div>
            <div class="watchlist-change ${w.change >= 0 ? 'pnl-positive' : 'pnl-negative'}">${w.change >= 0 ? '▲' : '▼'} ${Math.abs(w.change).toFixed(2)}%</div>
            <div class="watchlist-actions"><button class="btn btn-secondary btn-sm" onclick="App.removeWatchlistItem(${w.id})">Remove</button></div></div>`).join('')}</div>`;
    },

    settings() {
        const p = DataStore.getProfile();
        return `
        <div class="section-header"><h2 class="section-title">Settings</h2><p class="section-subtitle">Manage your profile and preferences</p></div>
        <div class="settings-section"><div class="settings-title">Profile Information</div><div class="settings-card">
            <div class="form-grid" style="gap:16px">
                <div class="form-group"><label class="form-label">Full Name</label><input class="form-input" id="profName" value="${p.name}"></div>
                <div class="form-group"><label class="form-label">PAN Number</label><input class="form-input" id="profPan" value="${p.pan}"></div>
                <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="profEmail" value="${p.email}"></div>
                <div class="form-group"><div style="margin-top:22px"><button class="btn btn-primary btn-sm" onclick="App.saveProfile()">Save Profile</button></div></div>
            </div>
        </div></div>
        <div class="settings-section"><div class="settings-title">Data Management</div><div class="settings-card">
            <div class="setting-row"><div class="setting-info"><div class="setting-name">Export Portfolio Data</div><div class="setting-desc">Download your entire portfolio as a JSON file</div></div><button class="btn btn-secondary btn-sm" onclick="App.exportData()">Export JSON</button></div>
            <div class="setting-row"><div class="setting-info"><div class="setting-name">Import Portfolio Data</div><div class="setting-desc">Restore from a previously exported JSON file</div></div><div><input type="file" id="importFile" accept=".json" style="display:none" onchange="App.importData(event)"><button class="btn btn-secondary btn-sm" onclick="document.getElementById('importFile').click()">Import JSON</button></div></div>
            <div class="setting-row"><div class="setting-info"><div class="setting-name">Reset All Data</div><div class="setting-desc">Clear all investments and restore sample data</div></div><button class="btn btn-danger btn-sm" onclick="App.resetData()">Reset</button></div>
        </div></div>
        <div class="settings-section"><div class="settings-title">About</div><div class="settings-card" style="text-align:center;padding:32px">
            <div style="font-family:var(--font-display);font-size:1.4rem;font-weight:800;background:linear-gradient(135deg,var(--accent-teal),var(--accent-purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">MY WEALTH, MY TRACKING</div>
            <div style="color:var(--text-muted);font-size:0.82rem;margin-top:8px;font-style:italic">"All leading wealth management apps today are crap, so I created my own"</div>
            <div style="color:var(--text-muted);font-size:0.75rem;margin-top:12px">Version 1.0 • Built with ❤️ for Indian Retail Investors</div>
        </div></div>`;
    }
};
