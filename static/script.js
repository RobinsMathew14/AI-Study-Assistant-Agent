// API Base URL
const API_BASE = window.location.origin;

// Utility Functions
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function displayError(containerId, message) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}

function displaySuccess(containerId, content) {
    const container = document.getElementById(containerId);
    container.innerHTML = content;
    container.style.display = 'block';
}

// Chat Functionality
async function sendChat() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const messagesContainer = document.getElementById('chatMessages');
    
    // Add user message
    messagesContainer.innerHTML += `
        <div class="message user-message">
            <i class="fas fa-user"></i>
            <p>${message}</p>
        </div>
    `;
    
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        if (data.success) {
            messagesContainer.innerHTML += `
                <div class="message ai-message">
                    <i class="fas fa-robot"></i>
                    <p>${data.response}</p>
                </div>
            `;
        } else {
            messagesContainer.innerHTML += `
                <div class="message error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error: ${data.error}</p>
                </div>
            `;
        }
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
        messagesContainer.innerHTML += `
            <div class="message error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error: ${error.message}</p>
            </div>
        `;
    } finally {
        hideLoading();
    }
}

// Allow Enter key to send chat
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChat();
            }
        });
    }
});

// Study Plan Generator
async function generateStudyPlan() {
    const topic = document.getElementById('studyTopic').value.trim();
    const duration = parseInt(document.getElementById('studyDuration').value);
    const dailyHours = parseFloat(document.getElementById('studyHours').value);
    const currentLevel = document.getElementById('currentLevel').value;
    
    if (!topic) {
        displayError('studyPlanResult', 'Please enter a topic');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/api/study-plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic,
                duration,
                daily_hours: dailyHours,
                current_level: currentLevel
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const formattedPlan = data.study_plan.replace(/\n/g, '<br>');
            displaySuccess('studyPlanResult', `
                <div class="result-card">
                    <h3><i class="fas fa-calendar-check"></i> Your Personalized Study Plan</h3>
                    <div class="plan-content">${formattedPlan}</div>
                </div>
            `);
        } else {
            displayError('studyPlanResult', data.error);
        }
    } catch (error) {
        displayError('studyPlanResult', error.message);
    } finally {
        hideLoading();
    }
}

// Quiz Generator
async function generateQuiz() {
    const topic = document.getElementById('quizTopic').value.trim();
    const numQuestions = parseInt(document.getElementById('numQuestions').value);
    const difficulty = document.getElementById('quizDifficulty').value;
    
    if (!topic) {
        displayError('quizResult', 'Please enter a topic');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/api/quiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic,
                num_questions: numQuestions,
                difficulty
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const formattedQuiz = data.quiz.replace(/\n/g, '<br>');
            displaySuccess('quizResult', `
                <div class="result-card">
                    <h3><i class="fas fa-clipboard-check"></i> Your Quiz</h3>
                    <div class="quiz-content">${formattedQuiz}</div>
                </div>
            `);
        } else {
            displayError('quizResult', data.error);
        }
    } catch (error) {
        displayError('quizResult', error.message);
    } finally {
        hideLoading();
    }
}

// Concept Explainer
async function explainConcept() {
    const concept = document.getElementById('explainConcept').value.trim();
    const level = document.getElementById('explainLevel').value;
    
    if (!concept) {
        displayError('explainResult', 'Please enter a concept');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/api/explain`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                concept,
                level
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const formattedExplanation = data.explanation.replace(/\n/g, '<br>');
            displaySuccess('explainResult', `
                <div class="result-card">
                    <h3><i class="fas fa-lightbulb"></i> Explanation: ${concept}</h3>
                    <div class="explanation-content">${formattedExplanation}</div>
                </div>
            `);
        } else {
            displayError('explainResult', data.error);
        }
    } catch (error) {
        displayError('explainResult', error.message);
    } finally {
        hideLoading();
    }
}

// Code Review
async function reviewCode() {
    const code = document.getElementById('codeInput').value.trim();
    const language = document.getElementById('codeLanguage').value;
    
    if (!code) {
        displayError('codeReviewResult', 'Please enter some code');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/api/code-review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code,
                language
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const formattedReview = data.review.replace(/\n/g, '<br>');
            displaySuccess('codeReviewResult', `
                <div class="result-card">
                    <h3><i class="fas fa-code"></i> Code Review Results</h3>
                    <div class="review-content">${formattedReview}</div>
                </div>
            `);
        } else {
            displayError('codeReviewResult', data.error);
        }
    } catch (error) {
        displayError('codeReviewResult', error.message);
    } finally {
        hideLoading();
    }
}

// Resource Finder
async function findResources() {
    const topic = document.getElementById('resourceTopic').value.trim();
    const resourceType = document.getElementById('resourceType').value;
    
    if (!topic) {
        displayError('resourcesResult', 'Please enter a topic');
        return;
    }
    
    showLoading();
    
    try {
        const response = await fetch(`${API_BASE}/api/resources`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic,
                resource_type: resourceType
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            const formattedResources = data.resources.replace(/\n/g, '<br>');
            displaySuccess('resourcesResult', `
                <div class="result-card">
                    <h3><i class="fas fa-book"></i> Learning Resources for ${topic}</h3>
                    <div class="resources-content">${formattedResources}</div>
                </div>
            `);
        } else {
            displayError('resourcesResult', data.error);
        }
    } catch (error) {
        displayError('resourcesResult', error.message);
    } finally {
        hideLoading();
    }
}

// Smooth scroll for navigation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
