import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { LanguageContext } from '../context/LanguageContext.jsx';
import API from '../services/api.js';
import { 
  MessageSquare, Send, Mic, MicOff, Volume2, VolumeX, 
  HelpCircle, Sparkles, CornerDownLeft, RefreshCw 
} from 'lucide-react';

const AIChat = () => {
  const { user } = useContext(AuthContext);
  const { t, lang } = useContext(LanguageContext);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your AgriVision AI assistant. How can I help you manage your farm, fertilize your soil, or diagnose crop issues today?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Voice Input States
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Voice Output (Speech Synthesis) States
  const [soundEnabled, setSoundEnabled] = useState(true);

  const chatEndRef = useRef(null);

  // Suggested Questions chips
  const suggestedQuestions = [
    t('whyLeavesYellow'),
    t('bestFertilizerWheat'),
    t('increaseRiceYield')
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputValue(transcript);
        }
      };
      rec.onerror = (err) => {
        console.error('Speech recognition error:', err);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    // Scroll to bottom
    scrollToBottom();
  }, []);

  // Update speech recognition language when app language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : lang === 'es' ? 'es-ES' : 'en-US';
    }
  }, [lang]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const speakText = (text) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // stop previous speech
      const cleanText = text.replace(/[*#_`]/g, ''); // strip markdown chars
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'es' ? 'es-ES' : 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis error:', err);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInputValue('');
    setLoading(true);

    try {
      // Map context to server schema: role must be 'user' or 'model'
      const formattedHistory = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content
      }));

      const res = await API.post('/chat', {
        message: text,
        history: formattedHistory
      });

      const reply = res.data.response;
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      
      // Auto text-to-speech speak reply
      speakText(reply);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Sorry, I had trouble communicating with the server. Please check your connection.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeechToggle = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInputValue('');
      recognitionRef.current.start();
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Container card */}
      <div className="rounded-2xl bg-white shadow-lg border border-slate-100 dark:bg-slate-900 dark:border-slate-800 flex flex-col h-[75vh]">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest text-white">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">{t('voiceAssistant')}</h3>
              <span className="text-[10px] text-slate-400">Gemini-powered farming intelligence</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Audio Toggle button */}
            <button
              onClick={() => {
                const updated = !soundEnabled;
                setSoundEnabled(updated);
                if (!updated) stopSpeaking();
              }}
              className={`p-2 rounded-lg transition ${
                soundEnabled 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-leaf' 
                  : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
              }`}
              title={soundEnabled ? 'Speech Output Active' : 'Speech Output Muted'}
            >
              {soundEnabled ? <Volume2 className="h-4.5 w-4.5" /> : <VolumeX className="h-4.5 w-4.5" />}
            </button>
            
            {/* Reset button */}
            <button
              onClick={() => {
                stopSpeaking();
                setMessages([{
                  role: 'assistant',
                  content: 'Chat history cleared. How can I assist you with your crops now?'
                }]);
              }}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Clear Chat"
            >
              <RefreshCw className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Suggested questions chips */}
        <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 shrink-0 flex items-center uppercase tracking-wider">
            <HelpCircle className="h-3 w-3 mr-1" /> Suggestions:
          </span>
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              disabled={loading}
              className="shrink-0 text-xs bg-slate-50 border border-slate-200 text-slate-700 py-1 px-3 rounded-full hover:bg-forest/5 hover:border-forest/30 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-leaf/5 transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message view */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-forest text-white rounded-br-none'
                    : 'bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-bl-none text-slate-800 dark:text-slate-200'
                }`}
              >
                {/* Parse bullet items and basic bold markings in chat response */}
                <div className="space-y-1">
                  {m.content.split('\n').map((line, i) => {
                    let parsedLine = line;
                    
                    // Simple replacement for bullet marks
                    if (parsedLine.trim().startsWith('* ') || parsedLine.trim().startsWith('- ')) {
                      return (
                        <li key={i} className="list-disc pl-2 ml-4">
                          {parsedLine.replace(/^[*-\s]+/, '')}
                        </li>
                      );
                    }
                    
                    // Render line
                    return <p key={i}>{parsedLine}</p>;
                  })}
                </div>

                {/* Read out loud button for assistant messages */}
                {m.role === 'assistant' && soundEnabled && (
                  <button 
                    onClick={() => speakText(m.content)}
                    className="mt-2 text-slate-400 hover:text-forest dark:hover:text-leaf transition"
                    title="Listen to response"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Assistant is writing loader */}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-bl-none text-slate-400 flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 animate-bounce"></span>
                <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 animate-bounce delay-75"></span>
                <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 animate-bounce delay-150"></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Inputs */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl shadow-inner"
          >
            {/* Voice Input Microphone Button */}
            {speechSupported ? (
              <button
                type="button"
                onClick={handleSpeechToggle}
                className={`p-2.5 rounded-xl transition ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isListening ? t('speakNow') : t('clickToSpeak')}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            ) : null}

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow bg-transparent text-sm text-slate-950 dark:text-white outline-none px-2 py-1 placeholder:text-slate-400"
              placeholder={isListening ? t('speakNow') : "Ask AgriVision AI about fertilizers, yields, pruning..."}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="rounded-xl bg-forest p-2.5 text-white hover:bg-forest-dark transition disabled:opacity-40"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 px-1">
            <span>Press Enter to send</span>
            <span className="flex items-center">
              <CornerDownLeft className="h-2.5 w-2.5 mr-0.5" /> WebSpeech API Active
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AIChat;
