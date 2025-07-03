# 🤖 ChatBot AI Pro

A modern, responsive chatbot web application powered by Google Gemini AI. Built with Flask backend and vanilla JavaScript frontend.

## ✨ Features

- 🤖 **AI-Powered Conversations** - Powered by Google Gemini AI
- 💬 **Real-time Chat** - Instant responses with typing indicators
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Clean, professional interface
- 📝 **Markdown Support** - Bold text, code blocks, and bullet points
- 💾 **Session Management** - Conversation history persistence
- 🔄 **Chat Templates** - Quick templates for common requests
- 📥 **Export Chat** - Download conversation history
- 🔧 **Easy Setup** - Simple installation and configuration

## 🚀 Quick Start

### Prerequisites

- Python 3.7+
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chatbot-ai.git
   cd chatbot-ai
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 🛠️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API Key | Required |
| `FLASK_ENV` | Flask environment | `development` |
| `DEBUG` | Enable debug mode | `True` |
| `SECRET_KEY` | Flask secret key | Generated |
| `PORT` | Server port | `5000` |

### Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## 📁 Project Structure

```
chatbot-ai/
├── app.py                 # Flask backend
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
├── README.md             # This file
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── style.css     # Stylesheet
    └── js/
        └── script.js     # JavaScript functionality
```

## 🎯 Usage

### Basic Chat
- Type your message in the input field
- Press Enter or click Send
- AI will respond with formatted text

### Templates
Use quick templates for common requests:
- **Explain** - Ask AI to explain something
- **Summarize** - Request a summary
- **Translate** - Translate text
- **Code** - Ask for code examples

### Features
- **Clear Chat** - Reset conversation history
- **Export Chat** - Download conversation as text file
- **Mobile Support** - Responsive design for all devices

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main chat interface |
| `/api/chat` | POST | Send message to AI |
| `/api/history/<session_id>` | GET | Get chat history |
| `/api/clear/<session_id>` | DELETE | Clear chat history |
| `/api/health` | GET | Health check |

## 🎨 Customization

### Styling
Edit `static/css/style.css` to customize the appearance:
- Colors and themes
- Typography
- Layout and spacing
- Responsive breakpoints

### Functionality
Modify `static/js/script.js` to add features:
- Custom message formatting
- New templates
- Additional UI interactions

## 📋 Requirements

- Flask==3.1.1
- flask-cors==5.0.0
- google-generativeai==0.8.5
- python-dotenv==1.1.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for the powerful language model
- Flask for the web framework
- Font Awesome for icons
- Inter font for typography

## 📞 Support

If you have questions or need help:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

---

**Made with ❤️ by [Your Name]**
