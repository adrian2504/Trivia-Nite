// Game State
let gameState = {
    questions: [],
    teams: [],
    currentQuestionIndex: 0,
    currentTeamIndex: 0,
    pointsPerQuestion: 10,
    negativeMarking: false,
    selectedAnswer: null,
    questionWrongAttempts: 0,
    teamsAttemptedThisQuestion: []
};

// Funny messages
const funnyMessages = [
    "Brain cells activated!",
    "Thinking caps on!",
    "Let's see if you're smarter than a 5th grader!",
    "To infinity and beyond... or just the next question!",
    "The circus is in town and it's quiz time!",
    "Time to unleash your inner genius!",
    "May the odds be ever in your favor!",
    "Shine bright like a diamond... or at least try!",
    "Drama! Suspense! Trivia!",
    "Things are heating up!",
    "Lightbulb moment incoming!",
    "Party time! But make it educational!",
    "Believe in yourself like you believe in unicorns!",
    "This question is cheesier than pizza!",
    "Rock on, quiz master!"
];

const wrongAnswerMessages = [
    "Oops! Better luck next time!",
    "So close, yet so far!",
    "That's not it, chief!",
    "Wrong answer, but we still love you!",
    "Nice try, but no cigar!",
    "Every mistake is a rainbow to success!",
    "Even dinosaurs got things wrong sometimes!",
    "Missed the target, but great effort!",
    "Oops! You slipped on that one!",
    "Creative answer, but not quite right!"
];

const correctAnswerMessages = [
    "Nailed it! You're on fire!",
    "Brilliant! Einstein would be proud!",
    "Correct! You're a trivia champion!",
    "Perfect! Give yourself a high five!",
    "Yes! That's the right answer!",
    "Spectacular! You're a genius!",
    "Boom! Correct answer!",
    "Bullseye! Right on target!",
    "Royally correct! You rule!",
    "Superhero answer! POW!"
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
                <option value="0">A</option>
                <option value="1">B</option>
                <option value="2">C</option>
                <option value="3">D</option>
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
    showFunnyPopup('Questions saved! Ready to rumble!');
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
                showFunnyPopup('File loaded successfully!');
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
let currentTeamSetupIndex = 0;
let totalTeamsToSetup = 0;
let tempTeams = [];
let currentPlayers = [];

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
    
    totalTeamsToSetup = teamCount;
    currentTeamSetupIndex = 0;
    tempTeams = [];
    
    showScreen('team-setup-screen');
    displayTeamSetupForm();
    showFunnyPopup(getRandomMessage(funnyMessages));
}

function displayTeamSetupForm() {
    const container = document.getElementById('teams-container');
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'];
    
    // Load existing players if going back
    if (tempTeams[currentTeamSetupIndex]) {
        currentPlayers = [...tempTeams[currentTeamSetupIndex].players];
    } else {
        currentPlayers = [];
    }
    
    container.innerHTML = `
        <div class="team-form-single">
            <h3>Team ${currentTeamSetupIndex + 1} of ${totalTeamsToSetup}</h3>
            <input type="text" id="current-team-name" class="input-field" placeholder="Team Name" value="${tempTeams[currentTeamSetupIndex]?.name || 'Team ' + (currentTeamSetupIndex + 1)}" required>
            
            <div class="player-input-section">
                <label style="color: #333; display: block; margin: 15px 0 10px 0;">Add Players:</label>
                <div style="display: flex; gap: 10px; justify-content: center; align-items: center;">
                    <input type="text" id="player-name-input" class="input-field" placeholder="Player name" style="max-width: 300px;">
                    <button class="btn btn-secondary" onclick="addPlayer()" style="margin: 0;">+ Add</button>
                </div>
                <div id="players-list" class="players-list"></div>
            </div>
            
            <label style="color: #333; display: block; margin: 20px 0 10px 0;">Team Color:</label>
            <input type="color" id="current-team-color" class="color-picker" value="${tempTeams[currentTeamSetupIndex]?.color || colors[currentTeamSetupIndex % colors.length]}">
            
            <div class="team-nav-buttons">
                ${currentTeamSetupIndex > 0 ? '<button class="btn btn-secondary" onclick="previousTeam()">Previous</button>' : ''}
                ${currentTeamSetupIndex < totalTeamsToSetup - 1 ? '<button class="btn btn-primary" onclick="nextTeam()">Next</button>' : '<button class="btn btn-primary" onclick="finishTeamSetup()">Finish Setup</button>'}
            </div>
        </div>
    `;
    
    updatePlayersList();
    
    // Add enter key support
    document.getElementById('player-name-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addPlayer();
        }
    });
}

function addPlayer() {
    const input = document.getElementById('player-name-input');
    const playerName = input.value.trim();
    
    if (playerName) {
        currentPlayers.push(playerName);
        input.value = '';
        updatePlayersList();
    }
}

function removePlayer(index) {
    currentPlayers.splice(index, 1);
    updatePlayersList();
}

function updatePlayersList() {
    const container = document.getElementById('players-list');
    
    if (currentPlayers.length === 0) {
        container.innerHTML = '<p style="color: rgba(255,255,255,0.6); margin-top: 10px;">No players added yet</p>';
    } else {
        container.innerHTML = currentPlayers.map((player, index) => `
            <div class="player-tag">
                <span>${player}</span>
                <button onclick="removePlayer(${index})" class="remove-player-btn">×</button>
            </div>
        `).join('');
    }
}

function nextTeam() {
    saveCurrentTeam();
    currentTeamSetupIndex++;
    displayTeamSetupForm();
}

function previousTeam() {
    saveCurrentTeam();
    currentTeamSetupIndex--;
    displayTeamSetupForm();
}

function saveCurrentTeam() {
    const name = document.getElementById('current-team-name').value;
    const color = document.getElementById('current-team-color').value;
    
    tempTeams[currentTeamSetupIndex] = {
        name: name,
        players: [...currentPlayers],
        color: color,
        score: 0
    };
}

function finishTeamSetup() {
    saveCurrentTeam();
    gameState.teams = tempTeams;
    
    gameState.pointsPerQuestion = parseInt(document.getElementById('points-per-question').value);
    gameState.negativeMarking = document.getElementById('negative-marking').checked;
    gameState.currentQuestionIndex = 0;
    gameState.currentTeamIndex = 0;
    gameState.questionWrongAttempts = 0;
    gameState.teamsAttemptedThisQuestion = [];
    
    showScreen('game-screen');
    updateScoreboard();
    displayQuestion();
    showFunnyPopup('Game on! Let the battle begin!');
}



// Game Logic
function updateScoreboard() {
    const container = document.getElementById('scoreboard-teams');
    container.innerHTML = '';
    
    gameState.teams.forEach((team, index) => {
        const isActive = index === gameState.currentTeamIndex;
        const playersText = team.players.length > 0 ? `<p class="team-players">${team.players.join(', ')}</p>` : '';
        const scoreHTML = `
            <div class="score-item ${isActive ? 'active' : ''}" style="border-color: ${team.color}">
                <h4>${team.name}</h4>
                ${playersText}
                <p class="team-score">${team.score}</p>
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
    optionButtons.forEach(btn => btn.disabled = true);
    
    if (isCorrect) {
        // Correct answer - award points and move to next question
        gameState.teams[gameState.currentTeamIndex].score += gameState.pointsPerQuestion;
        showFunnyPopup(getRandomMessage(correctAnswerMessages));
        
        // Highlight correct answer
        optionButtons[question.correctAnswer].classList.add('correct');
        
        updateScoreboard();
        
        // Show reveal and move to next question
        setTimeout(() => {
            const revealTitle = document.getElementById('reveal-title');
            const revealText = document.getElementById('reveal-text');
            
            revealTitle.textContent = 'Correct!';
            revealTitle.style.color = '#4caf50';
            revealText.textContent = `The correct answer is: ${question.options[question.correctAnswer]}`;
            document.getElementById('answer-reveal').style.display = 'block';
            
            setTimeout(() => {
                moveToNextQuestion();
            }, 1500);
        }, 800);
        
    } else {
        // Wrong answer - apply negative marking and move to next team
        if (gameState.negativeMarking) {
            gameState.teams[gameState.currentTeamIndex].score -= 5;
        }
        
        gameState.teamsAttemptedThisQuestion.push(gameState.currentTeamIndex);
        gameState.questionWrongAttempts++;
        
        showFunnyPopup(getRandomMessage(wrongAnswerMessages));
        
        // Highlight correct answer
        optionButtons[question.correctAnswer].classList.add('correct');
        optionButtons[answerIndex].classList.add('incorrect');
        
        updateScoreboard();
        
        setTimeout(() => {
            const revealTitle = document.getElementById('reveal-title');
            const revealText = document.getElementById('reveal-text');
            
            revealTitle.textContent = 'Wrong!';
            revealTitle.style.color = '#f44336';
            revealText.textContent = `The correct answer is: ${question.options[question.correctAnswer]}`;
            document.getElementById('answer-reveal').style.display = 'block';
            
            setTimeout(() => {
                // Check if 2 teams have answered wrong
                if (gameState.questionWrongAttempts >= 2) {
                    // Move to next question with next team
                    moveToNextQuestion();
                } else {
                    // Move to next team with same question
                    moveToNextTeam();
                }
            }, 1500);
        }, 800);
    }
}

function moveToNextTeam() {
    // Move to next team
    gameState.currentTeamIndex = (gameState.currentTeamIndex + 1) % gameState.teams.length;
    gameState.selectedAnswer = null;
    
    displayQuestion();
    updateScoreboard();
}

function moveToNextQuestion() {
    // Reset for new question
    gameState.questionWrongAttempts = 0;
    gameState.teamsAttemptedThisQuestion = [];
    gameState.currentQuestionIndex++;
    
    // Move to next team
    gameState.currentTeamIndex = (gameState.currentTeamIndex + 1) % gameState.teams.length;
    gameState.selectedAnswer = null;
    
    if (gameState.currentQuestionIndex >= gameState.questions.length) {
        showResults();
    } else {
        displayQuestion();
        updateScoreboard();
    }
}

function nextQuestion() {
    moveToNextQuestion();
}

// Results
function showResults() {
    showScreen('results-screen');
    
    // Sort teams by score
    const sortedTeams = [...gameState.teams].sort((a, b) => b.score - a.score);
    
    // Display podium (top 3)
    const podiumContainer = document.getElementById('podium');
    podiumContainer.innerHTML = '';
    
    const medals = ['1st', '2nd', '3rd'];
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
    
    showFunnyPopup('What a game! You all rock!');
}

// Initialize
showFunnyPopup('Welcome to Trivia Night!');
