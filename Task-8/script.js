// --- STATE VARIABLES ---
let currentUserEmail = null;
let transactions = [];
let profile = { name: 'User', currency: 'USD', darkMode: false };
let currentFilter = 'all';
let chartInstance = null;

// Auth State
let isLoginMode = true; 

// Currency Symbols Map
const currencySymbols = {
    'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'JPY': '¥'
};

// ================= AUTHENTICATION LOGIC =================

// Check Session on Load
function init() {
    // Simple Session Check[cite: 1]
    const activeSession = localStorage.getItem('fintrack_activeUser');
    
    if (activeSession) {
        currentUserEmail = activeSession;
        
        // Load data specific to this user
        loadUserData();
        
        // Hide Auth, Show App
        document.getElementById('auth-page').classList.add('hidden');
        document.getElementById('app-content').classList.remove('hidden');
        
        applyProfileSettings();
        masterRefresh();
    } else {
        // Show Auth, Hide App
        document.getElementById('auth-page').classList.remove('hidden');
        document.getElementById('app-content').classList.add('hidden');
    }
}

// Toggle between Login and Signup Modes
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('auth-title');
    const btn = document.getElementById('auth-btn');
    const switchText = document.getElementById('auth-switch-text');
    const switchLink = document.querySelector('.auth-switch a');
    const nameGroup = document.getElementById('auth-name-group');

    if (isLoginMode) {
        title.textContent = "Login to your account";
        btn.textContent = "Login";
        switchText.textContent = "Don't have an account?";
        switchLink.textContent = "Sign up here";
        nameGroup.classList.add('hidden');
        document.getElementById('auth-name').removeAttribute('required');
    } else {
        title.textContent = "Create an account";
        btn.textContent = "Sign Up";
        switchText.textContent = "Already have an account?";
        switchLink.textContent = "Login here";
        nameGroup.classList.remove('hidden');
        document.getElementById('auth-name').setAttribute('required', 'true');
    }
}

// Handle Form Submission (Login or Signup)
function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    const name = document.getElementById('auth-name').value.trim();

    // Fetch existing users DB from LocalStorage
    let usersDB = JSON.parse(localStorage.getItem('fintrack_usersDB')) || {};

    if (isLoginMode) {
        // --- LOGIN LOGIC ---
        if (usersDB[email] && usersDB[email].password === password) {
            // Success
            localStorage.setItem('fintrack_activeUser', email);
            init(); // Reload app state
        } else {
            alert("Invalid email or password. Please try again.");
        }
    } else {
        // --- SIGNUP LOGIC ---
        if (usersDB[email]) {
            alert("An account with this email already exists!");
        } else {
            // Save new user
            usersDB[email] = {
                password: password,
                profile: { name: name, currency: 'USD', darkMode: false },
                transactions: []
            };
            localStorage.setItem('fintrack_usersDB', JSON.stringify(usersDB));
            
            alert("Account created successfully! Logging you in...");
            localStorage.setItem('fintrack_activeUser', email);
            init(); // Reload app state
        }
    }
}

// Logout
function logout() {
    localStorage.removeItem('fintrack_activeUser');
    location.reload(); // Reloads page to reset state and show auth screen
}

// ================= DATA MANAGEMENT =================

function loadUserData() {
    let usersDB = JSON.parse(localStorage.getItem('fintrack_usersDB'));
    if (usersDB && usersDB[currentUserEmail]) {
        transactions = usersDB[currentUserEmail].transactions || [];
        profile = usersDB[currentUserEmail].profile || { name: 'User', currency: 'USD', darkMode: false };
    }
}

function saveUserData() {
    let usersDB = JSON.parse(localStorage.getItem('fintrack_usersDB'));
    if (usersDB && usersDB[currentUserEmail]) {
        usersDB[currentUserEmail].transactions = transactions;
        usersDB[currentUserEmail].profile = profile;
        localStorage.setItem('fintrack_usersDB', JSON.stringify(usersDB));
    }
}


// ================= MAIN APP LOGIC =================

function applyProfileSettings() {
    document.getElementById('display-name').textContent = profile.name;
    document.getElementById('settings-name').value = profile.name;
    document.getElementById('settings-currency').value = profile.currency;
    document.getElementById('settings-darkmode').checked = profile.darkMode;

    if (profile.darkMode) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

// Always call this after any change to data
function masterRefresh() {
    updateCards();
    renderTable();
    renderChart();
}

// Update Summary Cards
function updateCards() {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.type === 'income') totalIncome += parseFloat(t.amount);
        if (t.type === 'expense') totalExpense += parseFloat(t.amount);
    });

    const currentBalance = totalIncome - totalExpense;

    document.getElementById('card-balance').textContent = formatCurrency(currentBalance);
    document.getElementById('card-income').textContent = formatCurrency(totalIncome);
    document.getElementById('card-expense').textContent = formatCurrency(totalExpense);
    document.getElementById('card-count').textContent = transactions.length;
}

// Render Transaction Table
function renderTable() {
    const tbody = document.getElementById('transaction-tbody');
    tbody.innerHTML = ''; 

    const filtered = transactions.filter(t => {
        if (currentFilter === 'all') return true;
        return t.type === currentFilter;
    });

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    filtered.forEach(t => {
        const tr = document.createElement('tr');
        const amountClass = t.type === 'income' ? 'text-income' : 'text-expense';
        const sign = t.type === 'income' ? '+' : '-';
        
        tr.innerHTML = `
            <td>${t.date}</td>
            <td>${t.description}</td>
            <td>${t.category}</td>
            <td class="${amountClass}">${sign}${formatCurrency(t.amount)}</td>
            <td><button class="delete-btn" onclick="deleteTransaction('${t.id}')">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Render Chart.js
function renderChart() {
    const ctx = document.getElementById('cashFlowChart').getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }

    const sortedData = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = sortedData.map(t => t.date); 
    const amounts = sortedData.map(t => t.amount);
    const bgColors = sortedData.map(t => t.type === 'income' ? '#10b981' : '#ef4444');

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Cash Flow (${profile.currency})`,
                data: amounts,
                backgroundColor: bgColors,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function formatCurrency(amount) {
    const symbol = currencySymbols[profile.currency] || '$';
    return `${symbol}${Math.abs(amount).toFixed(2)}`;
}

// Add Transaction
function addTransaction(e) {
    e.preventDefault();

    const type = document.getElementById('trans-type').value;
    const desc = document.getElementById('trans-desc').value;
    const amount = document.getElementById('trans-amount').value;
    const date = document.getElementById('trans-date').value;
    const category = document.getElementById('trans-category').value;

    if (!desc || !amount || !date || !category) {
        alert("Please fill in all fields.");
        return;
    }

    const newTransaction = {
        id: Date.now().toString(),
        type,
        description: desc,
        amount: parseFloat(amount),
        date,
        category
    };

    transactions.push(newTransaction);
    saveUserData(); // Save to user's specific account

    document.getElementById('transaction-form').reset();
    closeModal();
    masterRefresh(); 
}

// Delete Transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveUserData(); // Update user's specific account
    masterRefresh();
}

function setFilter(type) {
    currentFilter = type;
    renderTable();
}

function saveSettings() {
    profile.name = document.getElementById('settings-name').value || 'User';
    profile.currency = document.getElementById('settings-currency').value;
    profile.darkMode = document.getElementById('settings-darkmode').checked;

    saveUserData(); // Save settings specifically for this user
    applyProfileSettings();
    masterRefresh(); 
    
    alert('Preferences saved successfully!');
}

function toggleDarkMode() {
    profile.darkMode = document.getElementById('settings-darkmode').checked;
    applyProfileSettings();
}

function resetAllData() {
    if (confirm("Are you sure you want to wipe all your data? This cannot be undone.")) {
        transactions = [];
        profile = { name: 'User', currency: 'USD', darkMode: false };
        saveUserData();
        location.reload(); 
    }
}

function showPage(pageId) {
    document.getElementById('dashboard-page').classList.add('hidden');
    document.getElementById('settings-page').classList.add('hidden');
    
    document.getElementById('nav-dashboard').classList.remove('active');
    document.getElementById('nav-settings').classList.remove('active');

    document.getElementById(`${pageId}-page`).classList.remove('hidden');
    document.getElementById(`nav-${pageId}`).classList.add('active');
}

function openModal() {
    document.getElementById('transaction-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('transaction-modal').classList.add('hidden');
}

function closeModalOutside(e) {
    if (e.target.id === 'transaction-modal') {
        closeModal();
    }
}

// Run Init on Load
window.onload = init;