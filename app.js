// Game State
let gameState = {
    questions: [],
    teams: [],
    currentQuestionIndex: 0,
    currentTeamIndex: 0,
    pointsPerQuestion: 10,
    negativeMarking: false,
    selectedAnswer: null
};

// Funny messages
const funnyMessages = [
    "🧠 Brain cells activated!",
    "🤔 Thinking caps on!",
    "🎯 Let's see if you're smarter than a 5th grader!",
    "🚀 To infinity and beyond... or just the next question!",
    "🎪 The circus is in town and it's quiz time!",
    "🦸 Time to unleash your inner genius!",
    "🎲 May the odds be ever in your favor!",
    "🌟 Shine bright like a diamond... or at least try!",
    "🎭 Drama! Suspense! Trivia!",
    "🔥 Things are heating up!",
    "💡 Lightbulb moment incoming!",
    "🎉 Party time! But make it educational!",
    "🦄 Believe in yourself like you believe in unicorns!",
    "🍕 This question is cheesier than pizza!",
    "🎸 Rock on, quiz master!"
];

const wrongAnswerMessages = [
    "😅 Oops! Better luck next time!",
    "🙈 So close, yet so far!",
    "🤦 That's not it, chief!",
    "💔 Wrong answer, but we still love you!",
    "🎪 Nice try, but no cigar!",
    "🌈 Every mistake is a rainbow to success!",
    "🦖 Even dinosaurs got things wrong sometimes!",
    "🎯 Missed the target, but great effort!",
    "🍌 Oops! You slipped on that one!",
    "🎨 Creative answer, but not quite right!"
];

const correctAnswerMessages = [
    "🎉 Nailed it! You're on fire!",
    "⭐ Brilliant! Einstein would be proud!",
    "🏆 Correct! You're a trivia champion!",
    "💯 Perfect! Give yourself a high five!",
    "🎊 Yes! That's the right answer!",
    "🌟 Spectacular! You're a genius!",
    "🚀 Boom! Correct answer!",
    "🎯 Bullseye! Right on target!",
    "👑 Royally correct! You rule!",
    "🦸 Superhero answer! POW!"
];

// Utility Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showFunnyPopup(message) {
    const popup = document.getElementById('funny-popup');
    const popupText = document.getElementById('popup-text');
    popupText.textContent = message;
    popup.classList.add('show');
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}

function getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
}

// Question Creation
function showCreateQuestions() {
    showScreen('create-questions-screen');
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    addQuestionForm();
}

function addQuestionForm() {
    const container = document.getElementById('questions-container');
    const questionNum = container.children.length + 1;
    
    const formHTML = `
        <div class="question-form">
            <h4>Question ${questionNum}</h4>
            <input type="text" class="input-field question-input" placeholder="Enter question" required>
            <input type="text" class="input-field option-input" placeholder="Option A" required>
            <input type="text" class="input-field option-input" placeholder="Option B" required>
            <input type="text" class="input-field option-input" placeholder="Option C" required>
            <input type="text" class="input-field option-input" placeholder="Option D" required>
            <select class="input-field correct-answer-select">
                <option value="0">Correct Answer: A</option>
                <option value="1">Correct Answer: B</option>
                <option value="2">Correct Answer: C</option>
                <option value="3">Correct Answer: D</option>
            </select>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', formHTML);
}

function saveQuestions() {
    const forms = document.querySelectorAll('.question-form');
    const questions = [];
    
    forms.forEach(form => {
        const questionText = form.querySelector('.question-input').value;
        const options = Array.from(form.querySelectorAll('.option-input')).map(input => input.value);
        const correctAnswer = parseInt(form.querySelector('.correct-answer-select').value);
        
        if (questionText && options.every(opt => opt)) {
            questions.push({
                question: questionText,
                options: options,
                correctAnswer: correctAnswer
            });
        }
    });
    
    if (questions.length === 0) {
        alert('Please add at least one complete question!');
        return;
    }
    
    gameState.questions = questions;
    document.getElementById('question-count').textContent = questions.length;
    document.getElementById('questions-preview').style.display = 'block';
    showScreen('setup-screen');
    showFunnyPopup('📝 Questions saved! Ready to rumble!');
}

// File Upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.questions && Array.isArray(data.questions)) {
                gameState.questions = data.questions;
                document.getElementById('question-count').textContent = data.questions.length;
                document.getElementById('questions-preview').style.display = 'block';
                showFunnyPopup('📁 File loaded successfully!');
            } else {
                alert('Invalid file format. Please check the JSON structure.');
            }
        } catch (error) {
            alert('Error reading file: ' + error.message);
        }
    };
    reader.readAsText(file);
}

// Team Setup
function setupTeams() {
    const teamCount = parseInt(document.getElementById('team-count').value);
    
    if (!gameState.questions || gameState.questions.length === 0) {
        alert('Please create or import questions first!');
        return;
    }
    
    if (teamCount < 2 || teamCount > 10) {
        alert('Please enter between 2 and 10 teams!');
        return;
    }
    
    const container = document.getElementById('teams-container');
    container.innerHTML = '';
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'];
    
    for (let i = 0; i < teamCount; i++) {
        const teamHTML = `
            <div class="team-form">
                <h4>Team ${i + 1}</h4>
                <input type="text" class="input-field team-name" placeholder="Team Name" value="Team ${i + 1}" required>
                <input type="text" class="input-field team-players" placeholder="Player names (comma separated)">
                <label style="color: white; display: block; margin: 10px 0;">Team Color:</label>
                <input type="color" class="color-picker team-color" value="${colors[i % colors.length]}">
            </div>
        `;
        container.insertAdjacentHTML('beforeend', teamHTML);
    }
    
    showScreen('team-setup-screen');
    showFunnyPopup(getRandomMessage(funnyMessages));
}

// Start Game
function startGame() {
    const teamForms = document.querySelectorAll('.team-form');
    gameState.teams = [];
    
    teamForms.forEach(form => {
        const name = form.querySelector('.team-name').value;
        const players = form.querySelector('.team-players').value.split(',').map(p => p.trim()).filter(p => p);
        const color = form.querySelector('.team-color').value;
        
        gameState.teams.push({
            name: name,
            players: players,
            color: color,
            score: 0
        });
    });
    
    gameState.pointsPerQuestion = parseInt(document.getElementById('points-per-question').value);
    gameState.negativeMarking = document.getElementById('negative-marking').checked;
    gameState.currentQuestionIndex = 0;
    gameState.currentTeamIndex = 0;
    
    showScreen('game-screen');
    updateScoreboard();
    displayQuestion();
    showFunnyPopup('🎮 Game on! Let the battle begin!');
}

// Game Logic
function updateScoreboard() {
    const container = document.getElementById('scoreboard-teams');
    container.innerHTML = '';
    
    gameState.teams.forEach((team, index) => {
        const isActive = index === gameState.currentTeamIndex;
        const scoreHTML = `
            <div class="score-item ${isActive ? 'active' : ''}" style="border-color: ${team.color}">
                <h4>${team.name}</h4>
                <p>${team.score}</p>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', scoreHTML);
    });
}

function displayQuestion() {
    const question = gameState.questions[gameState.currentQuestionIndex];
    const currentTeam = gameState.teams[gameState.currentTeamIndex];
    
    document.getElementById('current-question-num').textContent = gameState.currentQuestionIndex + 1;
    document.getElementById('total-questions').textContent = gameState.questions.length;
    document.getElementById('current-team-name').textContent = currentTeam.name;
    document.getElementById('current-team-name').style.backgroundColor = currentTeam.color;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionHTML = `
            <button class="option-btn" onclick="selectAnswer(${index})">${option}</button>
        `;
        optionsContainer.insertAdjacentHTML('beforeend', optionHTML);
    });
    
    document.getElementById('answer-reveal').style.display = 'none';
    gameState.selectedAnswer = null;
}

function selectAnswer(answerIndex) {
    if (gameState.selectedAnswer !== null) return;
    
    gameState.selectedAnswer = answerIndex;
    const question = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = answerIndex === question.correctAnswer;
    
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.correctAnswer) {
            btn.classList.add('correct');
        } else if (index === answerIndex && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    // Update score
    if (isCorrect) {
        gameState.teams[gameState.currentTeamIndex].score += gameState.pointsPerQuestion;
        showFunnyPopup(getRandomMessage(correctAnswerMessages));
    } else {
        if (gameState.negativeMarking) {
            gameState.teams[gameState.currentTeamIndex].score -= 1;
        }
        showFunnyPopup(getRandomMessage(wrongAnswerMessages));
    }
    
    updateScoreboard();
    
    // Show reveal
    setTimeout(() => {
        const revealTitle = document.getElementById('reveal-title');
        const revealText = document.getElementById('reveal-text');
        
        if (isCorrect) {
            revealTitle.textContent = '✅ Correct!';
            revealTitle.style.color = '#4caf50';
        } else {
            revealTitle.textContent = '❌ Wrong!';
            revealTitle.style.color = '#f44336';
        }
        
        revealText.textContent = `The correct answer is: ${question.options[question.correctAnswer]}`;
        document.getElementById('answer-reveal').style.display = 'block';
    }, 1500);
}

function nextQuestion() {
    gameState.currentTeamIndex = (gameState.currentTeamIndex + 1) % gameState.teams.length;
    
    if (gameState.currentTeamIndex === 0) {
        gameState.currentQuestionIndex++;
    }
    
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        showResults();
    } else {
        displayQuestion();
        updateScoreboard();
    }
}

// Results
function showResults() {
    showScreen('results-screen');
    
    // Sort teams by score
    const sortedTeams = [...gameState.teams].sort((a, b) => b.score - a.score);
    
    // Display podium (top 3)
    const podiumContainer = document.getElementById('podium');
    podiumContainer.innerHTML = '';
    
    const medals = ['🥇', '🥈', '🥉'];
    const places = ['first', 'second', 'third'];
    
    sortedTeams.slice(0, 3).forEach((team, index) => {
        const podiumHTML = `
            <div class="podium-place ${places[index]}">
                <div class="medal">${medals[index]}</div>
                <h3>${team.name}</h3>
                <div class="podium-box">
                    <h2>${team.score}</h2>
                    <p>points</p>
                </div>
            </div>
        `;
        podiumContainer.insertAdjacentHTML('beforeend', podiumHTML);
    });
    
    // Display all results
    const allResultsContainer = document.getElementById('all-results');
    allResultsContainer.innerHTML = '<h3>All Teams</h3>';
    
    sortedTeams.forEach((team, index) => {
        const resultHTML = `
            <div class="result-item">
                <span><strong>#${index + 1}</strong> ${team.name}</span>
                <span><strong>${team.score}</strong> points</span>
            </div>
        `;
        allResultsContainer.insertAdjacentHTML('beforeend', resultHTML);
    });
    
    showFunnyPopup('🎊 What a game! You all rock!');
}

// Initialize
showFunnyPopup('🎉 Welcome to Trivia Night!');
