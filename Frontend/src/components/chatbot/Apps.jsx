import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import './App.css';

// IMPORTANT: In a real application, never expose your API key on the frontend.
// This should be moved to a secure backend server.
const API_KEY = "YOUR_GROQKEY";

const SPEECH_LANG_MAP = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Telugu: 'te-IN',
  Kannada: 'kn-IN'
};

const createSystemMessage = (language) => ({
  role: "system",
  content: `You are SAHAAYAK, an AI Legal Assistant specialized in Indian laws, rights, regulations, and legal news.

Your only role is to answer strictly law-related questions.

You must respond only in ${language}.

After providing the answer, suggest three relevant follow-up questions a user might ask.

Format them at the very end of your response, starting with:
---Suggested Questions---

and list them.`
});

function Chatbot() {
  const location = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      message:
        "Hello, I am SAHAAYAK! Ask me about legal rights, laws, or regulations in India.",
      sentTime: "just now",
      sender: "LEGALASSISTANT",
      messageLang: "English"
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('English');
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [speechError, setSpeechError] = useState(null);

  const synthRef = useRef(null);
  const utteranceRef = useRef(null);
  const userCancelledRef = useRef(false);

  useEffect(() => {
    if (location.state?.initialMessage) {
      setInputValue(location.state.initialMessage);

      navigate(location.pathname, {
        replace: true
      });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !window.speechSynthesis
    ) {
      setSpeechError(
        'Text-to-speech is not supported in this browser.'
      );
      return;
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  const cancelSpeech = () => {
    if (synthRef.current?.speaking) {
      userCancelledRef.current = true;
      synthRef.current.cancel();
    }
  };

  const handleReadAloud = (message, index) => {
    if (!message?.message || !synthRef.current) {
      setSpeechError(
        'Text-to-speech is unavailable on this device.'
      );
      return;
    }

    if (speakingIndex === index) {
      cancelSpeech();
      setSpeechError(null);
      setSpeakingIndex(null);
      utteranceRef.current = null;
      return;
    }

    cancelSpeech();

    const targetLanguage = message.messageLang || language;
    const lang = SPEECH_LANG_MAP[targetLanguage] || 'en-IN';

    const utterance = new SpeechSynthesisUtterance(
      message.message
    );

    utterance.lang = lang;

    utterance.onend = () => {
      userCancelledRef.current = false;

      setSpeakingIndex((prev) =>
        prev === index ? null : prev
      );

      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      const userStopped =
        userCancelledRef.current &&
        ['interrupted', 'canceled'].includes(event.error);

      userCancelledRef.current = false;

      if (userStopped) {
        return;
      }

      console.error(
        'Speech synthesis error:',
        event.error
      );

      setSpeechError(
        'Unable to play audio. Please try again.'
      );

      setSpeakingIndex(null);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    userCancelledRef.current = false;

    setSpeechError(null);
    setSpeakingIndex(index);

    synthRef.current.speak(utterance);
  };

  const handleSend = async (message) => {
    if (!message.trim()) return;

    const newMessage = {
      message,
      direction: 'outgoing',
      sender: 'user',
      messageLang: language
    };

    const newMessages = [
      ...messages,
      newMessage
    ];

    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);
    setSuggestedQuestions([]);

    await processMessageToChatBOT(newMessages);
  };

  const processMessageToChatBOT = async (chatMessages) => {
    const apiMessages = chatMessages.map(
      (messageObject) => ({
        role:
          messageObject.sender === 'LEGALASSISTANT'
            ? 'assistant'
            : 'user',
        content: messageObject.message
      })
    );

    const systemMessage =
      createSystemMessage(language);

    const apiRequestBody = {
      model: 'openai/gpt-oss-120b',
      messages: [
        systemMessage,
        ...apiMessages
      ]
    };

    try {
      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(apiRequestBody)
        }
      );

      const data = await response.json();

      const botResponse =
        data?.choices?.[0]?.message?.content ||
        'Sorry, I encountered an error.';

      const separator =
        '---Suggested Questions---';

      let mainMessage = botResponse;

      if (botResponse.includes(separator)) {
        const parts =
          botResponse.split(separator);

        mainMessage = parts[0].trim();

        const questionsText =
          parts[1].trim();

        const questions = questionsText
          .split('\n')
          .map((q) =>
            q.replace(/^\d+\.\s*/, '').trim()
          )
          .filter(Boolean);

        setSuggestedQuestions(questions);
      }

      setMessages([
        ...chatMessages,
        {
          message: mainMessage,
          sender: 'LEGALASSISTANT',
          messageLang: language
        }
      ]);
    } catch (error) {
      console.error(
        'Error processing message:',
        error
      );

      setMessages([
        ...chatMessages,
        {
          message:
            "Sorry, I'm having trouble connecting. Please try again later.",
          sender: 'LEGALASSISTANT',
          messageLang: language
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSummarize = async () => {
    setIsTyping(true);
    setSuggestedQuestions([]);

    const conversation = messages
      .map(
        (m) =>
          `${m.sender}: ${m.message}`
      )
      .join('\n');

    const summaryPrompt = {
      role: 'user',

      content: `Create a brief, narrative summary of the entire conversation below.

The summary should explain the main legal topic discussed by integrating the user's key questions and the assistant's core answers.

The goal is to capture the full context of what was asked and what was learned.

Please provide the summary in ${language}:

${conversation}`
    };

    const apiRequestBody = {
      model: 'openai/gpt-oss-120b',
      messages: [
        createSystemMessage(language),
        summaryPrompt
      ]
    };

    try {
      const response = await fetch(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(apiRequestBody)
        }
      );

      const data = await response.json();

      const summary =
        data?.choices?.[0]?.message?.content ||
        'Could not generate summary.';

      setMessages([
        ...messages,
        {
          message:
            `CONVERSATION SUMMARY:\n${summary}`,
          sender: 'LEGALASSISTANT',
          messageLang: language
        }
      ]);
    } catch (error) {
      console.error(
        'Error summarizing:',
        error
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="assistant-app">

      <div className="assistant-toolbar">

        <div className="assistant-toolbar__group">
          <span className="assistant-label">
            Language
          </span>

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
            className="assistant-select"
          >
            <option value="English">
              English
            </option>

            <option value="Hindi">
              Hindi
            </option>

            <option value="Telugu">
              Telugu
            </option>

            <option value="Kannada">
              Kannada
            </option>
          </select>
        </div>

        <button
          className="assistant-btn primary"
          onClick={handleSummarize}
        >
          Summarize Conversation
        </button>

      </div>

      <div className="assistant-chatzone">

        <MainContainer>

          <ChatContainer>

            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="...typing" />
                ) : null
              }
            >

              {messages.map((message, i) => (
                <div
                  key={i}
                  className="assistant-message-block"
                >

                  <Message
                    model={{
                      ...message,
                      direction:
                        message.sender === 'user'
                          ? 'outgoing'
                          : 'incoming'
                    }}
                  />

                  {message.sender ===
                    'LEGALASSISTANT' && (
                    <div className="assistant-readaloud">

                      <button
                        type="button"
                        onClick={() =>
                          handleReadAloud(
                            message,
                            i
                          )
                        }
                        aria-pressed={
                          speakingIndex === i
                        }
                      >
                        <span aria-hidden="true">
                          🔈
                        </span>

                        {speakingIndex === i
                          ? 'Stop audio'
                          : 'Read aloud'}
                      </button>

                    </div>
                  )}

                </div>
              ))}

            </MessageList>

            <MessageInput
              placeholder="Type message here"
              value={inputValue}
              onChange={(val) =>
                setInputValue(val)
              }
              onSend={handleSend}
              attachButton={false}
            />

          </ChatContainer>

        </MainContainer>

      </div>

      {speechError && (
        <div
          className="assistant-error"
          role="alert"
        >
          {speechError}
        </div>
      )}

      {suggestedQuestions.length > 0 && (
        <div className="assistant-suggestions">

          <span>
            Suggested follow-ups:
          </span>

          <div className="assistant-suggestions__chips">

            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() =>
                  handleSend(q)
                }
              >
                {q}
              </button>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default Chatbot;
