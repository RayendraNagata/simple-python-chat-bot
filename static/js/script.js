class ChatBotPro {
    constructor() {
        this.sessionId = localStorage.getItem('chatSessionId') || this.generateSessionId();
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.apiUrl = '/api/chat';
        this.isFirstMessage = true;
        
        this.init();
    }

    generateSessionId() {
        const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chatSessionId', sessionId);
        return sessionId;
    }

    init() {
        this.setupEventListeners();
        this.loadChatHistory();
        this.checkServerStatus();
        this.setupTextareaAutoResize();
    }

    setupEventListeners() {
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        this.messageInput.focus();
    }

    setupTextareaAutoResize() {
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
        });
    }

    async checkServerStatus() {
        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            
            const indicator = document.querySelector('.status-indicator');
            const statusText = document.querySelector('.status-text');
            
            if (data.status === 'healthy') {
                indicator.style.background = 'var(--success-color)';
                statusText.textContent = 'System Online';
            } else {
                indicator.style.background = 'var(--error-color)';
                statusText.textContent = 'System Error';
            }
        } catch (error) {
            document.querySelector('.status-indicator').style.background = 'var(--error-color)';
            document.querySelector('.status-text').textContent = 'Connection Error';
        }
    }

    async loadChatHistory() {
        try {
            const response = await fetch(`/api/history/${this.sessionId}`);
            const data = await response.json();
            
            if (data.history && data.history.length > 0) {
                this.clearWelcomeMessage();
                data.history.forEach(msg => {
                    this.addMessage(msg.user, 'user', msg.timestamp);
                    this.addMessage(msg.bot, 'bot', msg.timestamp);
                });
                this.isFirstMessage = false;
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    }

    clearWelcomeMessage() {
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        if (this.isFirstMessage) {
            this.clearWelcomeMessage();
            this.isFirstMessage = false;
        }

        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.setLoading(true);

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: this.sessionId
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.addMessage(data.response, 'bot');
            } else {
                this.addErrorMessage(data.error || 'Terjadi kesalahan');
            }
        } catch (error) {
            this.addErrorMessage('Tidak dapat terhubung ke server');
        } finally {
            this.setLoading(false);
        }
    }

    addMessage(message, type, timestamp = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();
        const avatar = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${avatar}
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    ${this.formatMessage(message)}
                </div>
                <div class="message-time">${timeStr}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        this.chatMessages.appendChild(errorDiv);
        this.scrollToBottom();
    }

    formatMessage(message) {
        let formatted = message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/^\* (.+)$/gm, '• $1')
            .replace(/\n/g, '<br>');
        
        return formatted;
    }

    setLoading(loading) {
        this.sendButton.disabled = loading;
        this.messageInput.disabled = loading;
        
        if (loading) {
            this.typingIndicator.classList.add('show');
        } else {
            this.typingIndicator.classList.remove('show');
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.chatbot = new ChatBotPro();
});

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

function showHistory() {
    alert('History feature coming soon!');
}

function showSettings() {
    alert('Settings feature coming soon!');
}

async function clearChat() {
    if (confirm('Are you sure you want to clear all conversations?')) {
        try {
            await fetch(`/api/clear/${window.chatbot.sessionId}`, {
                method: 'DELETE'
            });
            
            document.getElementById('chatMessages').innerHTML = `
                <div class="welcome-message">
                    <div class="welcome-icon">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="welcome-title">Chat Cleared</div>
                    <div class="welcome-subtitle">
                        Your conversation has been cleared. How can I help you today?
                    </div>
                </div>
            `;
            
            window.chatbot.isFirstMessage = true;
        } catch (error) {
            alert('Failed to clear chat');
        }
    }
}

function exportChat() {
    const messages = document.querySelectorAll('.message');
    let chatText = 'ChatBot AI Pro - Conversation Export\n';
    chatText += '=' + '='.repeat(50) + '\n\n';
    
    messages.forEach(msg => {
        const type = msg.classList.contains('user') ? 'You' : 'AI Assistant';
        const text = msg.querySelector('.message-bubble').textContent.trim();
        const time = msg.querySelector('.message-time').textContent;
        chatText += `[${time}] ${type}: ${text}\n\n`;
    });
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chatbot_conversation_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function insertTemplate(type) {
    const input = document.getElementById('messageInput');
    const templates = {
        'Explain': 'Please explain: ',
        'Summarize': 'Please summarize: ',
        'Translate': 'Please translate this to Indonesian: ',
        'Code': 'Please write code for: '
    };
    
    input.value = templates[type] || '';
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}
