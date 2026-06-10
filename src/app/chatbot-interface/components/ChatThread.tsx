'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';
import { useChat } from '@/lib/hooks/useChat';

type MessageRole = 'user' | 'bot';
type IntentType = 'create_ticket' | 'check_status' | 'kb_search' | 'general' | 'greeting';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  intent?: IntentType;
  suggestions?: string[];
  ticketDraft?: TicketDraft;
  kbArticles?: KBArticle[];
}

interface TicketDraft {
  title: string;
  category: string;
  priority: string;
  description: string;
}

interface KBArticle {
  id: string;
  title: string;
  views: number;
  helpful: number;
}

interface AIResponse {
  intent: IntentType;
  content: string;
  suggestions?: string[];
  ticketDraft?: TicketDraft;
  kbArticles?: KBArticle[];
}

const quickActions = [
  { label: 'Report an issue', icon: 'AlertCircleIcon', intent: 'I need to report a technical issue' },
  { label: 'Check ticket status', icon: 'SearchIcon', intent: 'What is the status of my ticket?' },
  { label: 'Request software', icon: 'PackageIcon', intent: 'I need to request new software' },
  { label: 'Reset password', icon: 'KeyIcon', intent: 'I need help resetting my password' },
  { label: 'VPN / Network help', icon: 'WifiIcon', intent: 'I am having network or VPN connectivity issues' },
  { label: 'Hardware request', icon: 'MonitorIcon', intent: 'I need new hardware or equipment' },
];

const SYSTEM_PROMPT = `You are an ITServiceDesk AI Assistant. Your job is to help users create IT support tickets, check ticket status, and find self-service answers.

When a user sends a message, analyze their intent and respond with a JSON object (no markdown, no code blocks — raw JSON only) in this exact format:
{
  "intent": "<one of: create_ticket | check_status | kb_search | general | greeting>",
  "content": "<your conversational response to the user>",
  "suggestions": ["<optional follow-up suggestion 1>", "<optional suggestion 2>"],
  "ticketDraft": {
    "title": "<concise ticket title>",
    "category": "<one of: Network | Hardware | Software | Identity & Access | Email / Messaging | Security | Database | Printing | Storage>",
    "priority": "<one of: P1 | P2 | P3 | P4>",
    "description": "<pre-filled description with details from the user's message>"
  },
  "kbArticles": [
    { "id": "KB-XXXX", "title": "<relevant article title>", "views": <number>, "helpful": <percentage 0-100> }
  ]
}

Rules:
- Include "ticketDraft" only when intent is "create_ticket" or when the user clearly describes a problem that needs a ticket. - Include"kbArticles" (1-3 items) when there are likely self-service solutions. Use realistic KB IDs and plausible view counts.
- "suggestions" should be 2-4 short follow-up actions the user might want.
- Priority guide: P1=critical/outage, P2=high/major impact, P3=medium/single user, P4=low/request.
- Keep "content" conversational, helpful, and concise.
- Always respond with valid JSON only — no extra text before or after.`;

const initialMessages: Message[] = [
  {
    id: 'init-1',
    role: 'bot',
    content: "Hello! I'm the ITServiceDesk AI Assistant. I can help you create tickets, check status, or find self-service answers. What can I help you with today?",
    timestamp: new Date(Date.now() - 60000),
    intent: 'greeting',
    suggestions: ['Report a technical issue', 'Check ticket status', 'Request software or hardware', 'Search knowledge base'],
  },
];

interface ChatThreadProps {
  onTicketDraft: (draft: TicketDraft | null) => void;
  onKBArticles: (articles: KBArticle[]) => void;
}

export default function ChatThread({ onTicketDraft, onKBArticles }: ChatThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { response, isLoading, error, sendMessage: sendToAI } = useChat('OPEN_AI', 'gpt-4o', false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (error) {
      toast.error('AI Assistant error: ' + error.message);
      setIsTyping(false);
    }
  }, [error]);

  // Process AI response when it arrives
  useEffect(() => {
    if (!response || isLoading) return;

    let parsed: AIResponse;
    try {
      // Strip markdown code fences if present
      const cleaned = response.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback: treat raw text as a general response
      parsed = {
        intent: 'general',
        content: response,
        suggestions: ['Report a technical issue', 'Check ticket status', 'Search knowledge base'],
      };
    }

    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      role: 'bot',
      content: parsed.content,
      timestamp: new Date(),
      intent: parsed.intent,
      suggestions: parsed.suggestions,
      ticketDraft: parsed.ticketDraft,
      kbArticles: parsed.kbArticles,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);

    // Update conversation history with assistant reply
    setConversationHistory((prev) => [...prev, { role: 'assistant', content: response }]);

    if (parsed.ticketDraft) onTicketDraft(parsed.ticketDraft);
    if (parsed.kbArticles && parsed.kbArticles.length > 0) onKBArticles(parsed.kbArticles);
  }, [response, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping || isLoading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const newHistory = [...conversationHistory, { role: 'user', content: text }];
    setConversationHistory(newHistory);

    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...newHistory,
    ];

    sendToAI(apiMessages, { max_completion_tokens: 800 });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-slate-800 mb-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('• ')) {
        return <li key={i} className="ml-3 text-slate-700 list-disc list-inside text-sm">{line.replace(/^• /, '').replace(/\*\*(.*?)\*\*/g, '$1')}</li>;
      }
      if (line === '') return <div key={i} className="h-1.5" />;
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className="text-sm text-slate-700 leading-relaxed">
          {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="font-semibold text-slate-900">{part}</strong> : part)}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
          <Icon name="BotIcon" size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">ITServiceDesk AI Assistant</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <p className="text-xs text-slate-500">Online · Powered by OpenAI GPT-4o</p>
          </div>
        </div>
        <button
          onClick={() => {
            setMessages(initialMessages);
            setConversationHistory([]);
            onTicketDraft(null);
            onKBArticles([]);
          }}
          className="ml-auto p-1.5 hover:bg-white/80 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          title="Start new conversation"
        >
          <Icon name="RefreshCwIcon" size={15} />
        </button>
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <p className="text-xs font-medium text-slate-500 mb-2">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((qa) => (
              <button
                key={qa.label}
                onClick={() => sendMessage(qa.intent)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
              >
                <Icon name={qa.icon as any} size={12} />
                {qa.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} fade-in`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
              {msg.role === 'bot' ? (
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Icon name="BotIcon" size={14} className="text-white" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                  MR
                </div>
              )}
            </div>

            <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                {msg.role === 'bot' ? (
                  <div className="space-y-0.5">{formatContent(msg.content)}</div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>

              {/* KB Articles */}
              {msg.kbArticles && msg.kbArticles.length > 0 && (
                <div className="w-full space-y-1.5">
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Icon name="BookOpenIcon" size={12} />
                    Related knowledge base articles
                  </p>
                  {msg.kbArticles.map((kb) => (
                    <div key={kb.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-2.5 hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer transition-all">
                      <div>
                        <p className="text-xs font-medium text-slate-800">{kb.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-slate-400">{kb.id}</span>
                          <span className="text-[10px] text-slate-400">{kb.views.toLocaleString()} views</span>
                          <span className="text-[10px] text-green-600">{kb.helpful}% helpful</span>
                        </div>
                      </div>
                      <Icon name="ExternalLinkIcon" size={12} className="text-slate-400 flex-shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              )}

              {/* Ticket Draft Preview */}
              {msg.ticketDraft && (
                <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon name="TicketIcon" size={13} className="text-blue-600" />
                    <p className="text-xs font-semibold text-blue-700">Ticket Draft Ready</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex gap-2 text-xs">
                      <span className="text-slate-500 w-16 flex-shrink-0">Title:</span>
                      <span className="text-slate-800 font-medium">{msg.ticketDraft.title}</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="text-slate-500 w-16 flex-shrink-0">Category:</span>
                      <span className="text-slate-700">{msg.ticketDraft.category}</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="text-slate-500 w-16 flex-shrink-0">Priority:</span>
                      <span className={`badge text-[10px] ${msg.ticketDraft.priority === 'P1' ? 'badge-p1' : msg.ticketDraft.priority === 'P2' ? 'badge-p2' : msg.ticketDraft.priority === 'P3' ? 'badge-p3' : 'badge-p4'}`}>
                        {msg.ticketDraft.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-blue-600 mt-2">Review and submit in the panel on the right →</p>
                </div>
              )}

              {/* Suggestion chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {msg.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-[10px] text-slate-400">
                {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {(isTyping || isLoading) && (
          <div className="flex gap-3 items-start fade-in">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Icon name="BotIcon" size={14} className="text-white" />
            </div>
            <div className="chat-bubble-bot flex items-center gap-1 py-3 px-4">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your issue or ask a question…"
              className="input-field pr-10 py-2.5 text-sm"
              disabled={isTyping || isLoading}
            />
            <button
              onClick={() => toast.info('File attachment coming soon')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <Icon name="PaperclipIcon" size={15} />
            </button>
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping || isLoading}
            className="btn-primary px-3 py-2.5 disabled:opacity-40"
          >
            <Icon name="SendIcon" size={16} />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          AI responses are suggestions — always review before submitting tickets
        </p>
      </div>
    </div>
  );
}