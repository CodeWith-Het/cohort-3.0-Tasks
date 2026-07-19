document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SAFE DATA LOADING ---
    let todos = [];
    let goals = [];
    let planner = {};
    
    try { todos = JSON.parse(localStorage.getItem("todos")) || []; } catch(e) { todos = []; }
    try { goals = JSON.parse(localStorage.getItem("goals")) || []; } catch(e) { goals = []; }
    try { planner = JSON.parse(localStorage.getItem("planner")) || {}; } catch(e) { planner = {}; }

    // Initialize App Features
    initTheme();
    startDateTime();
    updateDynamicBackground();
    fetchWeather();
    
    renderTodos();
    renderGoals();
    renderPlanner();

    // --- 2. NAVIGATION (Dashboard <--> Features) ---
    const allSections = document.querySelectorAll(".view-section");
    const dashCards = document.querySelectorAll(".dash-card");
    const backBtns = document.querySelectorAll(".back-btn");

    function navigateTo(targetId) {
        // Remove 'active' class from all sections
        allSections.forEach(section => {
            section.classList.remove("active");
        });
        
        // Add 'active' to the target section
        const targetSection = document.getElementById(targetId);
        if(targetSection) {
            targetSection.classList.add("active");
        }

        // Special triggers when opening specific pages
        if (targetId === "view-motivation") {
            fetchQuote();
        }
    }

    // Add click event to all Dashboard Cards
    dashCards.forEach(card => {
        card.addEventListener("click", () => {
            const target = card.getAttribute("data-target");
            navigateTo(target);
        });
    });

    // Add click event to all Back Buttons
    backBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            navigateTo("view-dashboard");
        });
    });

    // --- 3. TODO LIST ---
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");

    function renderTodos() {
        todoList.innerHTML = "";
        todos.forEach((todo, index) => {
            const li = document.createElement("li");
            if (todo.completed) li.classList.add("completed");
            if (todo.important) li.classList.add("important");
            
            li.innerHTML = `
                <span>${todo.text}</span>
                <div class="list-actions">
                    <button class="btn-important" data-index="${index}"><i class="fas fa-exclamation-circle"></i></button>
                    <button class="btn-complete" data-index="${index}"><i class="fas fa-check"></i></button>
                    <button class="btn-delete" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            todoList.appendChild(li);
        });
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text: text, completed: false, important: false });
            todoInput.value = "";
            renderTodos();
        }
    });

    todoList.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const index = btn.dataset.index;

        if (btn.classList.contains("btn-complete")) {
            todos[index].completed = !todos[index].completed;
        } else if (btn.classList.contains("btn-important")) {
            todos[index].important = !todos[index].important;
        } else if (btn.classList.contains("btn-delete")) {
            todos.splice(index, 1);
        }
        renderTodos();
    });

    // --- 4. DAILY GOALS ---
    const goalForm = document.getElementById("goal-form");
    const goalInput = document.getElementById("goal-input");
    const goalList = document.getElementById("goal-list");
    const goalCountDisplay = document.getElementById("goal-count");

    function renderGoals() {
        goalList.innerHTML = "";
        let completedCount = 0;
        
        goals.forEach((goal, index) => {
            if (goal.completed) completedCount++;
            
            const li = document.createElement("li");
            if (goal.completed) li.classList.add("completed");
            
            li.innerHTML = `
                <span>${goal.text}</span>
                <div class="list-actions">
                    <button class="btn-complete" data-index="${index}"><i class="fas fa-check"></i></button>
                    <button class="btn-delete" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            goalList.appendChild(li);
        });
        
        goalCountDisplay.textContent = `${completedCount} of ${goals.length}`;
        localStorage.setItem("goals", JSON.stringify(goals));
    }

    goalForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = goalInput.value.trim();
        if (text) {
            goals.push({ text: text, completed: false });
            goalInput.value = "";
            renderGoals();
        }
    });

    goalList.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const index = btn.dataset.index;

        if (btn.classList.contains("btn-complete")) {
            goals[index].completed = !goals[index].completed;
        } else if (btn.classList.contains("btn-delete")) {
            goals.splice(index, 1);
        }
        renderGoals();
    });

    // --- 5. DAILY PLANNER ---
    const plannerContainer = document.getElementById("planner-container");
    const scheduleHours = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"];

    function renderPlanner() {
        plannerContainer.innerHTML = "";
        scheduleHours.forEach(hour => {
            const row = document.createElement("div");
            row.className = "planner-slot";
            
            row.innerHTML = `
                <div class="planner-time">${hour}</div>
                <input type="text" class="planner-input" placeholder="Type your plan here..." value="${planner[hour] || ''}">
            `;
            
            // Auto-save typing to local storage
            const inputField = row.querySelector("input");
            inputField.addEventListener("input", (e) => {
                planner[hour] = e.target.value;
                localStorage.setItem("planner", JSON.stringify(planner));
            });
            
            plannerContainer.appendChild(row);
        });
    }

    // --- 6. POMODORO TIMER ---
    let timerInterval = null;
    let timeLeft = 25 * 60; // 25 Minutes

    const timeDisplay = document.getElementById("pomodoro-time");
    const btnStart = document.getElementById("pom-start");
    const btnPause = document.getElementById("pom-pause");
    const btnReset = document.getElementById("pom-reset");
    const pomSession = document.getElementById("pomodoro-session");

    function updateTimerDisplay() {
        const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const secs = (timeLeft % 60).toString().padStart(2, '0');
        timeDisplay.textContent = `${mins}:${secs}`;
    }

    btnStart.addEventListener("click", () => {
        if (timerInterval) clearInterval(timerInterval); // prevent multiple clicks
        pomSession.textContent = "Work Session (Focus)";
        
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                pomSession.textContent = "Session Complete!";
                alert("Time is up! Great job focusing.");
                timeLeft = 25 * 60; 
                updateTimerDisplay();
            }
        }, 1000);
    });

    btnPause.addEventListener("click", () => {
        clearInterval(timerInterval);
    });

    btnReset.addEventListener("click", () => {
        clearInterval(timerInterval);
        timeLeft = 25 * 60;
        pomSession.textContent = "Work Session (25 Min)";
        updateTimerDisplay();
    });

    // --- 7. MOTIVATION QUOTE API ---
    const quoteBtn = document.getElementById("new-quote-btn");
    
    async function fetchQuote() {
        const loading = document.getElementById("quote-loading");
        const content = document.getElementById("quote-content");
        
        loading.style.display = "block";
        content.style.display = "none";

        try {
            const res = await fetch("https://dummyjson.com/quotes/random");
            const data = await res.json();
            
            document.getElementById("quote-text").textContent = `"${data.quote}"`;
            document.getElementById("quote-author").textContent = `- ${data.author}`;
            
            loading.style.display = "none";
            content.style.display = "block";
        } catch (err) {
            loading.style.display = "none";
            content.style.display = "block";
            document.getElementById("quote-text").textContent = `"Keep pushing forward. You're doing great!"`;
            document.getElementById("quote-author").textContent = "- Productivity Dashboard";
        }
    }
    
    quoteBtn.addEventListener("click", fetchQuote);

    // --- 8. GLOBAL WIDGETS (Theme, Time, Background, Weather) ---
    function initTheme() {
        const savedTheme = localStorage.getItem("theme") || "light";
        document.documentElement.setAttribute("data-theme", savedTheme);
        
        document.getElementById("theme-switch").addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme");
            const newTheme = current === "light" ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }

    function startDateTime() {
        function update() {
            const now = new Date();
            document.getElementById("time-display").textContent = now.toLocaleTimeString([], { hour12: true });
            document.getElementById("date-display").textContent = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
        }
        update(); 
        setInterval(update, 1000);
    }

    function updateDynamicBackground() {
        const hour = new Date().getHours();
        document.body.className = ''; 
        if (hour >= 5 && hour < 12) document.body.classList.add("morning");
        else if (hour >= 12 && hour < 17) document.body.classList.add("afternoon");
        else if (hour >= 17 && hour < 21) document.body.classList.add("evening");
        else document.body.classList.add("night");
    }

    async function fetchWeather() {
        try {
            // Weather fetch based on Ahmedabad, Gujarat
            const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=23.0225&longitude=72.5714&current_weather=true");
            const data = await res.json();
            const weather = data.current_weather;

            document.getElementById("w-temp").textContent = `${weather.temperature}°C`;
            
            // Basic weather codes
            let condition = "Clear";
            if (weather.weathercode > 0 && weather.weathercode <= 3) condition = "Cloudy";
            if (weather.weathercode >= 51 && weather.weathercode <= 67) condition = "Rainy";
            document.getElementById("w-condition").textContent = condition;

            document.querySelector(".weather-loading").style.display = "none";
            document.querySelector(".weather-content").style.display = "block";
        } catch (err) {
            document.querySelector(".weather-loading").textContent = "Weather offline";
        }
    }
});