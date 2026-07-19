// ==========================================
// INITIAL SETUP & DOM CACHING
// ==========================================
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskCategorySelect = document.getElementById('task-category');
const taskList = document.getElementById('task-list');
const themeToggleBtn = document.getElementById('theme-toggle');

const pendingCounter = document.getElementById('pending-counter');
const completedCounter = document.getElementById('completed-counter');
const searchInput = document.getElementById('search-input');
const filterCategory = document.getElementById('filter-category');
const clearAllBtn = document.getElementById('clear-all-btn');

// State Management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// ==========================================
// 4. THEME TOGGLE (With Symbol Swapping)
// ==========================================
themeToggleBtn.addEventListener('click', () => {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.dataset.theme; 
    
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    
    // Swap the icon
    themeToggleBtn.textContent = newTheme === 'light' ? '🌙' : '☀️';
});

// ==========================================
// 1. TASK CREATION MODULE & ATTRIBUTES VS PROPERTIES
// ==========================================
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = taskTitleInput.value.trim();
    const category = taskCategorySelect.value;

    if (!text) return;

    const newTask = {
        id: Date.now().toString(),
        text: text,
        category: category,
        status: 'pending'
    };

    tasks.push(newTask);
    saveToLocalStorage();
    
    const taskCard = createTaskElement(newTask);
    taskList.prepend(taskCard); 

    updateCounters();
    taskTitleInput.value = ''; 
});

// Create DOM Elements dynamically
function createTaskElement(task) {
    const li = document.createElement('li');
    li.classList.add('task-card');

    li.setAttribute('data-id', task.id);
    li.dataset.status = task.status; 
    li.dataset.category = task.category;

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    const textNode = document.createTextNode(task.text);
    textSpan.appendChild(textNode); 

    const categorySpan = document.createElement('small');
    categorySpan.textContent = ` [${task.category}]`;

    const actionDiv = document.createElement('div');
    actionDiv.className = 'task-actions';

    actionDiv.innerHTML = `
        <button class="edit-btn">Edit</button>
        <button class="complete-btn success-btn">✔</button>
        <button class="delete-btn danger-btn">✖</button>
    `;

    li.append(textSpan, categorySpan, actionDiv);
    
    return li;
}

// ==========================================
// 5 & 6. EVENT HANDLING & EVENT DELEGATION
// ==========================================
taskList.addEventListener('click', (e) => {
    const target = e.target;
    const taskCard = target.closest('.task-card');
    if (!taskCard) return;

    const taskId = taskCard.getAttribute('data-id');

    // Handle Delete
    if (target.classList.contains('delete-btn')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveToLocalStorage();
        
        taskCard.remove();
        updateCounters();
    }

    // Handle Complete
    if (target.classList.contains('complete-btn')) {
        const task = tasks.find(t => t.id === taskId);
        const newStatus = task.status === 'pending' ? 'completed' : 'pending';
        
        task.status = newStatus;
        saveToLocalStorage();

        taskCard.setAttribute('data-status', newStatus);
        updateCounters();
    }

    // Handle Edit 
    if (target.classList.contains('edit-btn')) {
        const textSpan = taskCard.querySelector('.task-text');
        const currentText = textSpan.textContent;

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = currentText;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.className = 'success-btn';

        textSpan.replaceWith(editInput);
        editInput.after(saveBtn); 
        
        const actionDiv = taskCard.querySelector('.task-actions');
        actionDiv.style.display = 'none';

        const editLabel = document.createElement('span');
        editLabel.textContent = 'Editing: ';
        editInput.before(editLabel);

        saveBtn.addEventListener('click', () => {
            const newText = editInput.value.trim();
            if (newText) {
                const task = tasks.find(t => t.id === taskId);
                task.text = newText;
                saveToLocalStorage();

                textSpan.textContent = newText;
                editInput.replaceWith(textSpan);
                saveBtn.remove();
                editLabel.remove();
                actionDiv.style.display = 'block';
            }
        });
    }
});

// ==========================================
// BONUS FEATURES 
// ==========================================
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderInitialTasks() {
    const fragment = document.createDocumentFragment();
    
    tasks.forEach(task => {
        const taskCard = createTaskElement(task);
        fragment.appendChild(taskCard);
    });
    
    taskList.appendChild(fragment);
    updateCounters();
}

function updateCounters() {
    const pendingCount = tasks.filter(t => t.status === 'pending').length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    
    pendingCounter.textContent = `Pending: ${pendingCount}`;
    completedCounter.textContent = `Completed: ${completedCount}`;
}

// Search and Filter Logic
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterCat = filterCategory.value;

    const allCards = document.querySelectorAll('.task-card');
    
    allCards.forEach(card => {
        if(card.hasAttribute('data-category')) {
            const cat = card.getAttribute('data-category');
            const text = card.querySelector('.task-text').textContent.toLowerCase();
            
            const matchesSearch = text.includes(searchTerm);
            const matchesCat = filterCat === 'all' || cat === filterCat;
            
            if (matchesSearch && matchesCat) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

searchInput.addEventListener('input', applyFilters);
filterCategory.addEventListener('change', applyFilters);

// Clear All Logic
clearAllBtn.addEventListener('click', () => {
    if(confirm('Are you sure you want to clear all tasks?')) {
        tasks = [];
        saveToLocalStorage();
        
        const allCards = document.querySelectorAll('.task-card');
        allCards.forEach(card => card.removeAttribute('data-id')); 
        
        taskList.innerHTML = ''; 
        updateCounters();
    }
});

// Init app
renderInitialTasks();