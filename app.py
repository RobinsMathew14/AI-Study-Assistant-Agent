"""AI Study Assistant - Flask Backend API
Built for Kaggle Agents Intensive Capstone Project
Author: Robins Mathew
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'your-api-key-here')
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

# Store chat history in memory (for demo purposes)
chat_sessions = {}

@app.route('/')
def home():
    """Serve the main frontend page"""
    return render_template('home.html')
# Multi-page routes
@app.route('/dashboard')
def dashboard():
    """Main application dashboard"""
    return render_template('index.html')  # Keep existing app as dashboard

@app.route('/about')
def about():
    """About page"""
    return render_template('about.html')

@app.route('/features')
def features():
    """Features page"""
    return render_template('features.html')

@app.route('/contact')
def contact():
    """Contact page"""
    return render_template('contact.html')


@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages with AI assistant"""
    try:
        data = request.json
        user_message = data.get('message', '')
        session_id = data.get('session_id', 'default')
        
        # Initialize chat session if needed
        if session_id not in chat_sessions:
            chat_sessions[session_id] = model.start_chat(history=[])
        
        # Get response from Gemini
        chat = chat_sessions[session_id]
        response = chat.send_message(user_message)
        
        return jsonify({
            'success': True,
            'response': response.text,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/study-plan', methods=['POST'])
def generate_study_plan():
    """Generate personalized study plan"""
    try:
        data = request.json
        subject = data.get('subject', '')
        duration = data.get('duration', 7)  # days
        hours_per_day = data.get('hours_per_day', 2)
        
        prompt = f"""Create a detailed {duration}-day study plan for {subject}.
        Student has {hours_per_day} hours per day to study.
        Include:
        - Daily topics to cover
        - Specific learning objectives
        - Practice exercises
        - Time allocation
        Format as a structured daily plan."""
        
        response = model.generate_content(prompt)
        
        return jsonify({
            'success': True,
            'study_plan': response.text,
            'subject': subject,
            'duration': duration
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/quiz', methods=['POST'])
def generate_quiz():
    """Generate quiz questions for a topic"""
    try:
        data = request.json
        topic = data.get('topic', '')
        num_questions = data.get('num_questions', 5)
        difficulty = data.get('difficulty', 'medium')
        
        prompt = f"""Generate {num_questions} {difficulty} difficulty multiple-choice questions about {topic}.
        For each question provide:
        - Question text
        - 4 options (A, B, C, D)
        - Correct answer
        - Brief explanation
        Format as JSON array."""
        
        response = model.generate_content(prompt)
        
        return jsonify({
            'success': True,
            'quiz': response.text,
            'topic': topic,
            'num_questions': num_questions
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/explain', methods=['POST'])
def explain_concept():
    """Explain a concept in detail"""
    try:
        data = request.json
        concept = data.get('concept', '')
        level = data.get('level', 'beginner')  # beginner, intermediate, advanced
        
        prompt = f"""Explain {concept} at a {level} level.
        Include:
        - Simple definition
        - Real-world examples
        - Key points to remember
        - Common misconceptions
        Use clear, student-friendly language."""
        
        response = model.generate_content(prompt)
        
        return jsonify({
            'success': True,
            'explanation': response.text,
            'concept': concept
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/code-review', methods=['POST'])
def review_code():
    """Review and provide feedback on code"""
    try:
        data = request.json
        code = data.get('code', '')
        language = data.get('language', 'python')
        
        prompt = f"""Review this {language} code and provide feedback:
        
        ```{language}
        {code}
        ```
        
        Provide:
        - Code quality assessment
        - Potential bugs or issues
        - Performance improvements
        - Best practice suggestions
        - Corrected version if needed"""
        
        response = model.generate_content(prompt)
        
        return jsonify({
            'success': True,
            'review': response.text,
            'language': language
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/resources', methods=['POST'])
def find_resources():
    """Find learning resources for a topic"""
    try:
        data = request.json
        topic = data.get('topic', '')
        resource_type = data.get('type', 'all')  # videos, articles, books, all
        
        prompt = f"""Recommend learning resources for {topic}.
        Focus on: {resource_type}
        Include:
        - Resource name
        - Brief description
        - Why it's useful
        - Difficulty level
        Prioritize free and widely available resources."""
        
        response = model.generate_content(prompt)
        
        return jsonify({
            'success': True,
            'resources': response.text,
            'topic': topic
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
