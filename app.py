from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from datetime import datetime
import uuid

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app)

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

class ChatBot:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.conversations = {}  # Store conversations by session_id
        
    def get_response(self, message, session_id=None):
        """Get response from Gemini API"""
        try:
            if session_id and session_id in self.conversations:
                # Get conversation history
                history = self.conversations[session_id]
                
                # Create context from history
                context = "Previous conversation:\n"
                for msg in history[-5:]:  # Last 5 messages for context
                    context += f"User: {msg['user']}\nBot: {msg['bot']}\n"
                context += f"\nCurrent message: {message}"
                
                response = self.model.generate_content(context)
            else:
                response = self.model.generate_content(message)
            
            bot_response = response.text
            
            # Store conversation
            if session_id:
                if session_id not in self.conversations:
                    self.conversations[session_id] = []
                
                self.conversations[session_id].append({
                    'user': message,
                    'bot': bot_response,
                    'timestamp': datetime.now().isoformat()
                })
            
            return bot_response
            
        except Exception as e:
            return f"Maaf, terjadi kesalahan: {str(e)}"
    
    def get_conversation_history(self, session_id):
        """Get conversation history for a session"""
        return self.conversations.get(session_id, [])
    
    def clear_conversation(self, session_id):
        """Clear conversation history for a session"""
        if session_id in self.conversations:
            del self.conversations[session_id]

# Initialize chatbot
chatbot = ChatBot()

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        session_id = data.get('session_id', str(uuid.uuid4()))
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get response from chatbot
        response = chatbot.get_response(message, session_id)
        
        return jsonify({
            'response': response,
            'session_id': session_id,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history/<session_id>', methods=['GET'])
def get_history(session_id):
    """Get conversation history"""
    history = chatbot.get_conversation_history(session_id)
    return jsonify({'history': history})

@app.route('/api/clear/<session_id>', methods=['DELETE'])
def clear_history(session_id):
    """Clear conversation history"""
    chatbot.clear_conversation(session_id)
    return jsonify({'message': 'Conversation cleared'})

@app.route('/api/sessions', methods=['GET'])
def get_sessions():
    """Get all active sessions"""
    sessions = list(chatbot.conversations.keys())
    return jsonify({'sessions': sessions})

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'gemini_configured': bool(os.getenv('GEMINI_API_KEY'))
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)