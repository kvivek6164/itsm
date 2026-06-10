'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import ChatThread from './components/ChatThread';
import TicketDraftPanel from './components/TicketDraftPanel';

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

export default function ChatbotInterfacePage() {
  const [ticketDraft, setTicketDraft] = useState<TicketDraft | null>(null);
  const [kbArticles, setKbArticles] = useState<KBArticle[]>([]);

  return (
    <AppLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">AI Assistant</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Create tickets, check status, and find self-service answers through conversation
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 2xl:grid-cols-5 gap-4" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
          {/* Chat Thread — 3 cols */}
          <div className="xl:col-span-3 h-full">
            <ChatThread onTicketDraft={setTicketDraft} onKBArticles={setKbArticles} />
          </div>

          {/* Ticket Draft + KB Panel — 2 cols */}
          <div className="xl:col-span-2 overflow-y-auto scrollbar-thin pr-1">
            <TicketDraftPanel draft={ticketDraft} kbArticles={kbArticles} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}