import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { UserRole } from '../types';
import { translations, LanguageCode } from '../data/translations';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface ChatCompanionProps {
  userRole: UserRole;
  currentLang?: LanguageCode;
}

export default function ChatCompanion({ userRole, currentLang = 'FR' }: ChatCompanionProps) {
  const t = translations[currentLang];

  const getWelcomeMessage = (lang: LanguageCode) => {
    switch (lang) {
      case 'EN':
        return "Marhaban! I am **JMMI** (Moroccan Darija for **Buddy**), your ultimate voice-enabled smart municipal guide. \n\n🎤 **Vocal Command Activated:** Speak or shout **'JMMI'** at any time to wake me up! Try saying: \n*\"JMMI, recommend the best upcoming cultural events!\"*";
      case 'AR':
        return "مرحباً بك! أنا **جْمي** (الصديق بالدارجة المغربية)، دليلك الذكي للبلدية المدعوم بالصوت. \n\n🎤 **التحكم الصوتي مفعل:** انطق كلمة **'جْمي'** لتفعيل المساعد وطرح سؤالك مباشرة! جرب أن تقول: \n*\"جْمي، اقترح عليا أفضل الفعاليات هذا الأسبوع\"*";
      default:
        return "Marhaban ! Je suis **JMMI** (mot Darija pour **Buddy / Mon Pote**), votre guide municipal intelligent à commande vocale. \n\n🎤 **Commande Vocale Active :** Dites à haute voix **'JMMI'** à tout moment pour m'interpeller ! Essayez de dire : \n*\"JMMI, recommande-moi les meilleurs événements de la semaine !\"*";
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [showWakeWordToast, setShowWakeWordToast] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const recognitionRef = useRef<any>(null);

  // Set initial welcome message correctly on mount or language switch
  useEffect(() => {
    setMessages([
      {
        role: 'model',
        text: getWelcomeMessage(currentLang)
      }
    ]);
  }, [currentLang]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Vocal Response Text-To-Speech (Sovereign Voice feedback)
  const speakResponse = (text: string) => {
    if (!isSoundEnabled) return;
    try {
      // Remove markdown formatting tags from speech translation string
      const cleanText = text
        .replace(/[*#`_\-]/g, '')
        .replace(/assistant/gi, 'Jmmi')
        .substring(0, 200); // Guard long speeches in case of limit

      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (currentLang === 'AR') {
        utterance.lang = 'ar-MA'; // Moroccan Arabic locale!
      } else {
        utterance.lang = 'fr-FR';
      }
      window.speechSynthesis.cancel(); // Stop any pending speech
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis not supported or interrupted:', e);
    }
  };

  // Setup Web Speech API for Vocal Commands
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      
      // Configure Moroccan optimization locale parameters
      rec.lang = currentLang === 'AR' ? 'ar-MA' : 'fr-FR';

      rec.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      rec.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const transcript = finalTranscript || interimTranscript;
        if (transcript.trim()) {
          setDetectedText(transcript);
          handleVoiceInput(transcript, event.results[event.results.length - 1].isFinal);
        }
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setVoiceError(currentLang === 'AR' ? 'الميكروفون محجوب.' : 'Microphone bloqué dans le navigateur.');
        } else if (event.error === 'no-speech') {
          // Ignore harmless timeouts
        } else {
          setVoiceError(`Erreur: ${event.error}`);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentLang]);

  // Handle Vocal parsed input and extract the wake-word "JMMI" / "جْمي"
  const handleVoiceInput = (rawTranscript: string, isFinal: boolean) => {
    const text = rawTranscript.trim();
    if (!text) return;

    const normalized = text.toLowerCase();
    
    // Arabic, French and phonetic variants of JMMI (meaning Buddy in Casablanca slang, pronounced JMMI)
    const wakeWords = ['jmmi', 'jmi', 'جْمي', 'جمي'];
    
    // Check if the current phrase contains any wake word triggers
    const triggerMatched = wakeWords.some(word => normalized.includes(word));

    if (triggerMatched) {
      if (isFinal) {
        // Trigger alert bubble
        setShowWakeWordToast(true);
        setTimeout(() => setShowWakeWordToast(false), 3000);

        // Find the text following the matched wake word
        let commandQuery = '';
        for (const word of wakeWords) {
          const index = normalized.indexOf(word);
          if (index !== -1) {
            const rawAfter = text.substring(index + word.length).replace(/^[,.\s?!\-أو]+/, '').trim();
            if (rawAfter.length > commandQuery.length) {
              commandQuery = rawAfter;
            }
          }
        }

        if (commandQuery) {
          // Immediately send the query voice payload to the server
          setMessages(prev => [...prev, { role: 'user', text: `🎙️ "${text}"` }]);
          setInputMessage('');
          handleSendMessage(commandQuery);
        } else {
          // Spoken only the wake word! Respond back in native friendly Moroccan style
          const responseText = currentLang === 'AR'
            ? "أهلاً عشيري! 🤝 أنا كنسمع ليك دابا يا جْمي. قول ليا شنو بغيتي تسولني عليه بخصوص كازا؟"
            : currentLang === 'EN'
              ? "Marhaban Buddy! 🤝 This is JMMI active. I am listening to you! What do you need about Casablanca?"
              : "Salam mon pote / Buddy ! 🤝 JMMI à l'écoute. Dis-moi ce dont tu as besoin pour Casablanca ?";
          
          setMessages(prev => [
            ...prev,
            { role: 'user', text: `🎙️ "${text}"` },
            { role: 'model', text: responseText }
          ]);
          speakResponse(responseText);
        }
        setDetectedText('');
      } else {
        // Highlighting user that JMMI wake word is caught in real-time stream!
        setShowWakeWordToast(true);
      }
    } else if (isFinal) {
      // General dictation update (appended to input box)
      setInputMessage(prev => prev ? `${prev} ${text}` : text);
      setDetectedText('');
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setVoiceError(currentLang === 'AR' 
        ? "متصفحك لا يدعم التعرف على الصوت. المرجو استعمال Chrome أو Safari."
        : "Reconnaissance vocale non supportée sur ce navigateur. Utilisez Google Chrome."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        setVoiceError(null);
        recognitionRef.current.start();
      } catch (err) {
        console.error("Vocal start crash:", err);
      }
    }
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend };
    // Only append user message if not already done via voice transcript wrapping
    if (!customMessage) {
      setMessages(prev => [...prev, userMsg]);
      setInputMessage('');
    }
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          userRole: userRole,
          lang: currentLang
        })
      });

      if (!response.ok) {
        throw new Error('Erreur de communication avec le serveur API.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
      
      // Auto speech response
      speakResponse(data.reply);
    } catch (error: any) {
      console.error(error);
      const fallbackText = currentLang === 'FR' 
        ? `⚠️ **Service temporairement indisponible** : ${error.message || 'Impossible de contacter le serveur MyCity'}.`
        : currentLang === 'AR'
          ? `⚠️ **الخدمة غير متوفرة مؤقتاً** : ${error.message || 'فشل الاتصال بالخادم الرئيسي للمدينة'}.`
          : `⚠️ **Service temporarily unavailable**: ${error.message || 'Unable to reach MyCity node'}.`;

      setMessages(prev => [...prev, { role: 'model', text: fallbackText }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getQuickQueries = (lang: LanguageCode) => {
    switch (lang) {
      case 'EN':
        return [
          { label: "📍 Event Curation", text: "Recommend the best upcoming events scheduled in Casablanca this week." },
          { label: "🔒 CNDP 09-08 Privacy", text: "How does MyCity guarantee compliance with the Moroccan CNDP 09-08 law on protecting personal data?" },
          { label: "💡 File a Breakdown", text: "How can I report a faulty public street light to the municipality?" }
        ];
      case 'AR':
        return [
          { label: "📍 فعاليات الأسبوع", text: "اقترح عليّ أفضل الفعاليات والأنشطة المقررة في الدار البيضاء هذا الأسبوع." },
          { label: "🔒 الخصوصية وحماية المعطيات", text: "كيف يضمن تطبيق MyCity الامتثال لقانون حماية المعطيات الشخصية المغربي CNDP 09-08؟" },
          { label: "💡 الإبلاغ عن عطل", text: "كيف يمكنني تقديم شكوى أو إخطار عن عطل في الإنارة العمومية إلى الجماعة الحضرية؟" }
        ];
      default:
        return [
          { label: "📍 Curation événementielle", text: "Recommande-moi les meilleurs événements prévus à Casablanca cette semaine." },
          { label: "🔒 Confidentialité CNDP 09-08", text: "Comment MyCity garantit la conformité avec la loi marocaine CNDP 09-08 de protection des données personnelles ?" },
          { label: "💡 Signaler une panne", text: "Comment soumettre une réclamation d'éclairage public défectueux à la commune ?" }
        ];
    }
  };

  const quickQueries = getQuickQueries(currentLang);

  return (
    <div id="ai-chat-companion-card" className="flex flex-col h-full rounded-xl glass-panel border border-white/5 overflow-hidden relative">
      
      {/* Wake Word Detection Notification Toast */}
      {showWakeWordToast && (
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white font-mono text-[10px] font-bold py-1 px-3.5 rounded-full shadow-2xl flex items-center gap-1.5 animate-bounce z-50 border border-indigo-400">
          <span className="flex h-1.5 w-1.5 bg-green-400 rounded-full animate-ping"></span>
          <span>🎙️ COMMANDE VOCALE "JMMI" (جْمي) CAPTÉE !</span>
        </div>
      )}

      {/* Header */}
      <div className="px-4 py-3 bg-[#1e2030] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-title font-bold text-xs text-white">JMMI AI Voice Companion</h3>
            <span className="font-mono text-[9px] text-[#A78BFA] uppercase tracking-widest">
              Sovereign Darija-Aware Smart Bot
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Read back speaking toggle button */}
          <button
            id="chat-toggle-sound-btn"
            onClick={() => {
              setIsSoundEnabled(prev => !prev);
              if (!isSoundEnabled) {
                speakResponse("Lecture vocale activée");
              } else {
                window.speechSynthesis.cancel();
              }
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isSoundEnabled 
                ? 'bg-green-600/20 border-green-500/40 text-green-400' 
                : 'bg-neutral-800/60 border-white/5 text-gray-500 hover:text-gray-300'
            }`}
            title={isSoundEnabled ? "Désactiver la voix" : "Activer la réponse vocale"}
          >
            {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          
          <div className="flex items-center gap-1 bg-indigo-950/40 border border-indigo-800/30 px-2 py-0.5 rounded text-[9px] font-mono text-indigo-400">
            <Sparkles className="w-3 h-3 text-indigo-300" />
            <span>{userRole}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Sound Wave & Wake word prompt instruction bar */}
      <div className="px-4 py-1.5 bg-[#121422] border-b border-white/5 flex items-center justify-between font-mono text-[9px] text-gray-400">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${isListening ? 'bg-indigo-500 animate-ping' : 'bg-neutral-700'}`}></span>
          <span>
            {isListening 
              ? `${currentLang === 'AR' ? 'جْمي يستمع ...' : 'JMMI écoute... dites "JMMI [votre question]"'}` 
              : `Microphone inactif`
            }
          </span>
        </div>
        
        {isListening && (
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 bg-indigo-400 animate-[pulse_0.6s_infinite_alternate]" style={{ height: '60%' }}></span>
            <span className="w-0.5 bg-indigo-500 animate-[pulse_0.4s_infinite_alternate_0.1s]" style={{ height: '90%' }}></span>
            <span className="w-0.5 bg-indigo-300 animate-[pulse_0.8s_infinite_alternate_0.2s]" style={{ height: '40%' }}></span>
            <span className="w-0.5 bg-indigo-600 animate-[pulse_0.5s_infinite_alternate_0.15s]" style={{ height: '100%' }}></span>
          </div>
        )}
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[360px] min-h-[220px]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-[#6c3cff]' : 'bg-neutral-800'
            }`}>
              {msg.role === 'user' ? (
                <User className="w-3.5 h-3.5 text-white" />
              ) : (
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
              )}
            </div>
            
            <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 rounded-tr-none' 
                : 'bg-[#161821] border border-white/5 text-gray-300 rounded-tl-none'
            }`}>
              <div className="whitespace-pre-line prose prose-invert prose-xs text-justify">
                {msg.text.split('**').map((chunk, i) => {
                  if (i % 2 === 1) {
                    return <strong key={i} className="text-white font-bold">{chunk}</strong>;
                  }
                  return chunk;
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-2.5 mr-auto">
            <div className="w-6 h-6 rounded-md bg-neutral-800 flex items-center justify-center animate-bounce">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="bg-[#161821] border border-white/5 rounded-xl rounded-tl-none px-3 py-2.5 text-xs text-gray-400 flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.15s' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              <span>{t.aiChatThinking}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Transcription Indicator Stream */}
      {isListening && detectedText && (
        <div className="px-4 py-1.5 bg-indigo-950/20 border-t border-white/5 text-[10px] font-mono text-indigo-300 italic flex items-center gap-2">
          <span>🎙️ {currentLang === 'AR' ? ' جاري الترجمة:' : 'Transcription:'}</span>
          <span className="text-white not-italic">"{detectedText}"</span>
        </div>
      )}

      {/* Voice Warning/Error indicator if permission is blocked */}
      {voiceError && (
        <div className="px-4 py-1.5 bg-red-950/40 border-t border-red-900/30 text-[10px] font-mono text-red-400 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{voiceError}</span>
        </div>
      )}

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-white/5 bg-[#0f111a] flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth">
        {quickQueries.map((q, i) => (
          <button
            key={i}
            id={`chat-quick-query-${i}`}
            onClick={() => handleSendMessage(q.text)}
            className="px-2.5 py-1 rounded bg-[#161821] hover:bg-[#1f212f] border border-white/5 text-[9px] hover:border-[#6c3cff]/50 font-mono text-gray-400 hover:text-white transition-all cursor-pointer inline-block"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Input container */}
      <div className="p-3 border-t border-white/5 bg-[#161821] flex gap-2">
        {/* Toggle continuous buddy listening button */}
        <button
          id="chat-voice-activation-btn"
          onClick={toggleListening}
          className={`p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer relative group ${
            isListening 
              ? 'bg-red-600/20 border-red-500/40 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.25)] animate-pulse' 
              : 'bg-black/35 border-white/5 text-gray-400 hover:text-white'
          }`}
          title="Activer la commande vocale (JMMI)"
        >
          {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
          
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-[9px] border border-white/10 rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            {isListening ? `${currentLang === 'AR' ? 'إيقاف الميكروفون' : 'Arrêter l\'écoute'}` : `Dites "JMMI" / Parler`}
          </span>
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder={isListening ? "Parlez maintenant ou tapez votre question..." : t.aiChatInputPlaceholder}
          className="flex-1 bg-black/40 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6c3cff] transition-colors font-mono"
        />
        
        <button
          id="chat-send-msg-btn"
          onClick={() => handleSendMessage()}
          disabled={!inputMessage.trim() || isLoading}
          className="px-3 bg-[#6c3cff] hover:bg-[#562ee6] disabled:bg-neutral-800 disabled:text-gray-500 rounded-lg text-white font-medium text-xs flex items-center justify-center transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
