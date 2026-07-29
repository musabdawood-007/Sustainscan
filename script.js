const defaultMenu = [
    { id: 1, name: 'Chicken Biryani', cost: 250 },
    { id: 2, name: 'Zinger Burger', cost: 350 },
    { id: 3, name: 'Daal Chawal', cost: 100 },
    { id: 4, name: 'Fresh Salad', cost: 80 }
];

let menu = JSON.parse(localStorage.getItem('sustainMenu')) || defaultMenu;
let reports = JSON.parse(localStorage.getItem('sustainReports')) || []; 
let chartInstance = null;

// --- WELCOME ANIMATION ---
window.onload = function() {
    setTimeout(() => {
        const intro = document.getElementById('introAnimation');
        intro.style.opacity = '0';
        intro.style.transition = 'opacity 0.8s ease-out';
        setTimeout(() => {
            intro.remove();
            const main = document.getElementById('mainContent');
            main.classList.remove('hidden');
            void main.offsetWidth; 
            main.classList.remove('opacity-0');
        }, 800);
    }, 2500); 
};

// --- VIEW MANAGEMENT ---
function switchView(viewName) {
    document.getElementById('landingView').classList.add('hidden');
    document.getElementById('howItWorksView').classList.add('hidden');
    document.getElementById('aboutView').classList.add('hidden');
    document.getElementById('studentView').classList.add('hidden');
    document.getElementById('adminView').classList.add('hidden');

    document.getElementById(viewName + 'View').classList.remove('hidden');
}

function openAbout() {
    switchView('about');
}

// --- AUTH SYSTEM ---
function openLogin() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('loginModal').classList.add('flex');
}

function closeLogin() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('loginModal').classList.remove('flex');
    document.getElementById('studentRegModal').classList.add('hidden');
    document.getElementById('adminLoginModal').classList.add('hidden');
}

function openAuth(type) {
    closeLogin();
    if (type === 'student') {
        document.getElementById('studentRegModal').classList.remove('hidden');
        document.getElementById('studentRegModal').classList.add('flex');
    } else {
        document.getElementById('adminLoginModal').classList.remove('hidden');
        document.getElementById('adminLoginModal').classList.add('flex');
    }
}

// Student Register
document.getElementById('studentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const phone = document.getElementById('regPhone').value;
    
    document.getElementById('studentNameDisplay').innerText = name;
    closeLogin();
    switchView('student');
    initStudentDashboard();
});

// Admin Login
document.getElementById('adminForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('adminUser').value;
    const p = document.getElementById('adminPass').value;
    
    if (u === 'admin' && p === '098765') {
        closeLogin();
        switchView('admin');
        initAdminDashboard();
    } else {
        document.getElementById('adminError').classList.remove('hidden');
    }
});

// --- LOGOUT ANIMATION ---
function handleLogout() {
    const overlay = document.getElementById('logoutAnimation');
    overlay.style.opacity = '1';
    
    setTimeout(() => {
        location.reload();
    }, 700);
}

// --- STUDENT FEATURES ---
function initStudentDashboard() {
    populateSuggestions();
    updateStats();
    initChart();
}

function populateSuggestions() {
    const list = document.getElementById('suggestions');
    list.innerHTML = '';
    menu.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.name;
        list.appendChild(opt);
    });
}

document.getElementById('wasteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const reason = document.querySelector('input[name="reason"]:checked').value;

    reports.push({
        id: Date.now(),
        studentName: document.getElementById('studentNameDisplay').innerText,
        phone: document.getElementById('regPhone').value,
        itemName: name,
        price: price,
        reason: reason
    });

    localStorage.setItem('sustainReports', JSON.stringify(reports));
    updateStats();
    updateChart();
    alert("Report Submitted!");
    e.target.reset();
});

function updateStats() {
    const totalLoss = reports.reduce((sum, r) => sum + r.price, 0);
    document.getElementById('totalLossPKR').innerText = totalLoss.toLocaleString();
    document.getElementById('reportCount').innerText = reports.length;
}

function initChart() {
    const ctx = document.getElementById('wasteChart').getContext('2d');
    const itemCounts = {};
    reports.forEach(r => { itemCounts[r.itemName] = (itemCounts[r.itemName] || 0) + 1; });

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(itemCounts),
            datasets: [{
                label: 'Waste',
                data: Object.values(itemCounts),
                backgroundColor: '#10b981',
                borderRadius: 8
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'white', font: { size: 10 } } }, x: { ticks: { color: 'white', font: { size: 10 } } } }
        }
    });
}

function updateChart() {
    if (!chartInstance) return;
    const itemCounts = {};
    reports.forEach(r => { itemCounts[r.itemName] = (itemCounts[r.itemName] || 0) + 1; });
    chartInstance.data.labels = Object.keys(itemCounts);
    chartInstance.data.datasets[0].data = Object.values(itemCounts);
    chartInstance.update();
}

// --- ADMIN FEATURES ---
function initAdminDashboard() {
    renderMenu();
    renderLogs();
    calculateAdminLoss();
}

function renderMenu() {
    const grid = document.getElementById('menuGrid');
    grid.innerHTML = '';
    menu.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center bg-white/5 p-2 md:p-3 rounded-lg text-white text-xs border border-white/10';
        div.innerHTML = `<span>${item.name} (${item.cost})</span> <button onclick="deleteItem(${idx})" class="text-red-400 hover:text-red-300">x</button>`;
        grid.appendChild(div);
    });
}

document.getElementById('addFoodForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('newFoodName').value;
    const cost = parseInt(document.getElementById('newFoodCost').value);
    menu.push({ id: Date.now(), name, cost });
    localStorage.setItem('sustainMenu', JSON.stringify(menu));
    e.target.reset();
    renderMenu();
});

function deleteItem(idx) {
    if(confirm('Delete item?')) {
        menu.splice(idx, 1);
        localStorage.setItem('sustainMenu', JSON.stringify(menu));
        renderMenu();
    }
}

function renderLogs() {
    const tbody = document.getElementById('logsTableBody');
    tbody.innerHTML = '';
    if(reports.length === 0) { tbody.innerHTML = '<tr><td colspan="5" class="text-center p-2 md:p-4 text-gray-500">No reports yet.</td></tr>'; return; }
    
    [...reports].reverse().forEach(r => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-white/5 transition';
        tr.innerHTML = `
            <td class="px-2 md:px-4 py-2 md:py-3">${r.studentName}</td>
            <td class="px-2 md:px-4 py-2 md:py-3 text-green-400">${r.phone}</td>
            <td class="px-2 md:px-4 py-2 md:py-3">${r.itemName}</td>
            <td class="px-2 md:px-4 py-2 md:py-3">${r.price}</td>
            <td class="px-2 md:px-4 py-2 md:py-3">${r.reason}</td>
        `;
        tbody.appendChild(tr);
    });
}

function calculateAdminLoss() {
    const totalLoss = reports.reduce((sum, r) => sum + r.price, 0);
    document.getElementById('adminLoss').innerText = totalLoss.toLocaleString();
}

function filterLogs() {
    const query = document.getElementById('logSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#logsTableBody tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}