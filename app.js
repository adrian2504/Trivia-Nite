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
let allPlayersList = [];

function setupTeams() {
    const teamCount = parseInt(document.getElementById('team-count')?.value || 3);
    
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
        container.innerHTML = '<p style="color: #333; margin-top: 10px;">No players added yet</p>';
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
    
    // Set the in-game negative marking checkbox to match setup
    document.getElementById('game-negative-marking').checked = gameState.negativeMarking;
    
    updateScoreboard();
    displayQuestion();
    showFunnyPopup('Game on! Let the battle begin!');
}

function toggleNegativeMarking() {
    gameState.negativeMarking = document.getElementById('game-negative-marking').checked;
}

function confirmEndGame() {
    // Create confirmation popup
    const popup = document.createElement('div');
    popup.className = 'confirmation-popup';
    popup.innerHTML = `
        <div class="confirmation-content">
            <h3>End Game?</h3>
            <p>Are you sure you want to end the game now and see the final results?</p>
            <div class="confirmation-buttons">
                <button class="btn btn-primary" onclick="endGameNow()">Yes, End Game</button>
                <button class="btn btn-ghost" onclick="cancelEndGame()">Continue Playing</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
}

function endGameNow() {
    // Remove confirmation popup
    const popup = document.querySelector('.confirmation-popup');
    if (popup) {
        popup.remove();
    }
    
    showResults();
}

function cancelEndGame() {
    // Remove confirmation popup
    const popup = document.querySelector('.confirmation-popup');
    if (popup) {
        popup.remove();
    }
}

// Add Players & Randomize Method
function showAddPlayersScreen() {
    if (!gameState.questions || gameState.questions.length === 0) {
        alert('Please create or import questions first!');
        return;
    }
    
    allPlayersList = [];
    showScreen('add-players-screen');
    updateAllPlayersList();
    showFunnyPopup('Add all players first!');
}

function addPlayerToList() {
    const input = document.getElementById('player-name-input-main');
    const playerName = input.value.trim();
    
    if (playerName && !allPlayersList.includes(playerName)) {
        allPlayersList.push(playerName);
        input.value = '';
        updateAllPlayersList();
    }
}

function addBulkPlayers() {
    const textarea = document.getElementById('bulk-players-input');
    const bulkText = textarea.value.trim();
    
    if (!bulkText) return;
    
    // Split by commas or new lines and clean up
    const newPlayers = bulkText
        .split(/[,\n]/)
        .map(name => name.trim())
        .filter(name => name && !allPlayersList.includes(name));
    
    if (newPlayers.length === 0) {
        alert('No new players to add (duplicates or empty names)');
        return;
    }
    
    // Add all new players
    allPlayersList.push(...newPlayers);
    textarea.value = '';
    
    // Update display
    updateAllPlayersList();
    
    showFunnyPopup(`Added ${newPlayers.length} players!`);
}

function clearAllPlayers() {
    if (allPlayersList.length === 0) return;
    
    if (confirm(`Are you sure you want to remove all ${allPlayersList.length} players?`)) {
        allPlayersList = [];
        updateAllPlayersList();
        showFunnyPopup('All players cleared!');
    }
}

// Add enter key support only once
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('player-name-input-main');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addPlayerToList();
            }
        });
    }
});

function removePlayerFromList(index) {
    allPlayersList.splice(index, 1);
    updateAllPlayersList();
}

function updateAllPlayersList() {
    const container = document.getElementById('all-players-list');
    const countText = document.getElementById('player-count');
    
    if (allPlayersList.length === 0) {
        container.innerHTML = '<p style="color: #333;">No players added yet</p>';
    } else {
        // Use DocumentFragment for better performance with many players
        const fragment = document.createDocumentFragment();
        
        allPlayersList.forEach((player, index) => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player-tag';
            playerDiv.innerHTML = `
                <span>${player}</span>
                <button onclick="removePlayerFromList(${index})" class="remove-player-btn">×</button>
            `;
            fragment.appendChild(playerDiv);
        });
        
        container.innerHTML = '';
        container.appendChild(fragment);
    }
    
    countText.textContent = `${allPlayersList.length} players added`;
}

function randomizeTeams() {
    const teamCount = parseInt(document.getElementById('random-team-count').value);
    
    if (allPlayersList.length < teamCount) {
        alert(`You need at least ${teamCount} players for ${teamCount} teams!`);
        return;
    }
    
    if (teamCount < 2 || teamCount > 10) {
        alert('Please enter between 2 and 10 teams!');
        return;
    }
    
    // Show loading message for large player lists
    if (allPlayersList.length > 20) {
        showFunnyPopup('Randomizing teams... Please wait!');
    }
    
    // Use setTimeout to prevent UI blocking with large lists
    setTimeout(() => {
        // Shuffle players using Fisher-Yates algorithm for better randomization
        const shuffled = [...allPlayersList];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // Create teams
        tempTeams = [];
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'];
        
        for (let i = 0; i < teamCount; i++) {
            tempTeams.push({
                name: `Team ${i + 1}`,
                players: [],
                color: colors[i % colors.length],
                score: 0
            });
        }
        
        // Distribute players evenly
        shuffled.forEach((player, index) => {
            tempTeams[index % teamCount].players.push(player);
        });
        
        showScreen('random-teams-screen');
        displayRandomTeamsForm();
        showFunnyPopup('Teams randomized! Customize them now.');
    }, 100);
}

function displayRandomTeamsForm() {
    const container = document.getElementById('random-teams-container');
    
    container.innerHTML = tempTeams.map((team, index) => `
        <div class="team-form">
            <h4>${team.name}</h4>
            <input type="text" class="input-field random-team-name" data-index="${index}" placeholder="Team Name" value="${team.name}">
            <p style="color: #333; margin: 10px 0;">Players: ${team.players.join(', ')}</p>
            <label style="color: #333; display: block; margin: 10px 0;">Team Color:</label>
            <input type="color" class="color-picker random-team-color" data-index="${index}" value="${team.color}">
        </div>
    `).join('');
}

function finishRandomTeams() {
    // Save team names and colors
    const nameInputs = document.querySelectorAll('.random-team-name');
    const colorInputs = document.querySelectorAll('.random-team-color');
    
    nameInputs.forEach((input, index) => {
        if (tempTeams[index]) {
            tempTeams[index].name = input.value;
        }
    });
    
    colorInputs.forEach((input, index) => {
        if (tempTeams[index]) {
            tempTeams[index].color = input.value;
        }
    });
    
    gameState.teams = tempTeams;
    
    gameState.pointsPerQuestion = parseInt(document.getElementById('points-per-question').value);
    gameState.negativeMarking = document.getElementById('negative-marking').checked;
    gameState.currentQuestionIndex = 0;
    gameState.currentTeamIndex = 0;
    gameState.questionWrongAttempts = 0;
    gameState.teamsAttemptedThisQuestion = [];
    
    showScreen('game-screen');
    
    // Set the in-game negative marking checkbox to match setup
    document.getElementById('game-negative-marking').checked = gameState.negativeMarking;
    
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
        // Correct answer - award points and show result
        gameState.teams[gameState.currentTeamIndex].score += gameState.pointsPerQuestion;
        showFunnyPopup(getRandomMessage(correctAnswerMessages));
        
        // Only highlight correct answer in green when answered correctly
        optionButtons[question.correctAnswer].classList.add('correct');
        
        updateScoreboard();
        
        // Show reveal and wait for user to click
        const revealTitle = document.getElementById('reveal-title');
        const revealText = document.getElementById('reveal-text');
        const nextButton = document.querySelector('#answer-reveal .btn');
        
        revealTitle.textContent = 'Correct!';
        revealTitle.style.color = '#4caf50';
        revealText.textContent = `The correct answer is: ${question.options[question.correctAnswer]}`;
        nextButton.textContent = 'Next Question';
        document.getElementById('answer-reveal').style.display = 'block';
        
    } else {
        // Wrong answer - apply negative marking if enabled
        if (gameState.negativeMarking) {
            gameState.teams[gameState.currentTeamIndex].score -= 5;
        }
        
        // Track this team's attempt
        gameState.teamsAttemptedThisQuestion.push(gameState.currentTeamIndex);
        gameState.questionWrongAttempts++;
        
        // Only shake the incorrect answer, don't highlight anything in green
        optionButtons[answerIndex].classList.add('incorrect');
        
        showFunnyPopup(getRandomMessage(wrongAnswerMessages));
        updateScoreboard();
        
        const revealTitle = document.getElementById('reveal-title');
        const revealText = document.getElementById('reveal-text');
        const nextButton = document.querySelector('#answer-reveal .btn');
        
        // Check if this is the second wrong attempt
        if (gameState.questionWrongAttempts >= 2) {
            revealTitle.textContent = 'Question Skipped!';
            revealTitle.style.color = '#ff9800';
            revealText.textContent = `Two teams answered incorrectly. The correct answer is: ${question.options[question.correctAnswer]}`;
            nextButton.textContent = 'Next Question';
            document.getElementById('answer-reveal').style.display = 'block';
        } else {
            revealTitle.textContent = 'Wrong Answer!';
            revealTitle.style.color = '#f44336';
            revealText.textContent = `Passing to the next team...`;
            nextButton.textContent = 'Continue';
            document.getElementById('answer-reveal').style.display = 'block';
        }
    }
}

function moveToNextTeamSameQuestion() {
    // Find next team that hasn't attempted this question yet
    let nextTeamIndex = (gameState.currentTeamIndex + 1) % gameState.teams.length;
    
    // Skip teams that have already attempted this question
    while (gameState.teamsAttemptedThisQuestion.includes(nextTeamIndex) && 
           gameState.teamsAttemptedThisQuestion.length < gameState.teams.length) {
        nextTeamIndex = (nextTeamIndex + 1) % gameState.teams.length;
    }
    
    gameState.currentTeamIndex = nextTeamIndex;
    gameState.selectedAnswer = null;
    
    displayQuestion();
    updateScoreboard();
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
    const question = gameState.questions[gameState.currentQuestionIndex];
    const isCorrect = gameState.selectedAnswer === question.correctAnswer;
    
    if (isCorrect) {
        // If correct, move to next question
        moveToNextQuestion();
    } else {
        // If wrong, check if we need to pass to next team or move to next question
        if (gameState.questionWrongAttempts >= 2) {
            // Two teams answered wrong, move to next question
            moveToNextQuestion();
        } else {
            // Pass to next team with same question
            moveToNextTeamSameQuestion();
        }
    }
}

// Results
function showResults() {
    showScreen('results-screen');
    
    // Add confetti animation
    createConfetti();
    
    // Sort teams by score (highest to lowest)
    const sortedTeams = [...gameState.teams].sort((a, b) => b.score - a.score);
    
    // Display podium (top 3)
    const podiumContainer = document.getElementById('podium');
    podiumContainer.innerHTML = '';
    
    const medals = ['🥇 1st', '🥈 2nd', '🥉 3rd'];
    const places = ['first', 'second', 'third'];
    const celebrationEmojis = ['🎉', '🎊', '💃', '🕺', '🎈', '🌟', '✨', '🎆'];
    
    sortedTeams.slice(0, 3).forEach((team, index) => {
        const teamMembers = team.players && team.players.length > 0 
            ? team.players.join(', ') 
            : 'No members';
        
        const randomEmojis = Array.from({length: 3}, () => 
            celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)]
        ).join('');
        
        const podiumHTML = `
            <div class="podium-place ${places[index]}">
                <div class="medal">${medals[index]}</div>
                <h3>${team.name}</h3>
                <div class="team-members">${teamMembers}</div>
                <div class="celebration-emoji">${randomEmojis}</div>
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
    allResultsContainer.innerHTML = '<h3>Final Rankings</h3>';
    
    sortedTeams.forEach((team, index) => {
        const teamMembers = team.players && team.players.length > 0 
            ? team.players.join(', ') 
            : 'No members';
        
        const resultHTML = `
            <div class="result-item">
                <div class="result-team-info">
                    <div><strong>#${index + 1}</strong> ${team.name}</div>
                    <div class="result-team-members">${teamMembers}</div>
                </div>
                <div class="result-score">${team.score} points</div>
            </div>
        `;
        allResultsContainer.insertAdjacentHTML('beforeend', resultHTML);
    });
    
    showFunnyPopup('What a game! You all rock!');
}

function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a', '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e2'];
    
    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.className = 'confetti-piece';
        confettiPiece.style.left = Math.random() * 100 + '%';
        confettiPiece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confettiPiece.style.animationDelay = Math.random() * 3 + 's';
        confettiPiece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confettiContainer.appendChild(confettiPiece);
    }
    
    // Remove confetti after 5 seconds
    setTimeout(() => {
        if (confettiContainer.parentNode) {
            confettiContainer.parentNode.removeChild(confettiContainer);
        }
    }, 5000);
}

// Initialize
showFunnyPopup('Welcome to Trivia Night!');
