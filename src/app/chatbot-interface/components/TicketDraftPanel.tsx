'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';

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

interface TicketDraftPanelProps {
  draft: TicketDraft | null;
  kbArticles: KBArticle[];
}

type FormData = {
  title: string;
  requester: string;
  email: string;
  department: string;
  priority: string;
  category: string;
  description: string;
  urgency: string;
};

export default function TicketDraftPanel({ draft, kbArticles }: TicketDraftPanelProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      title: '',
      requester: 'Marcus Reynolds',
      email: 'marcus.reynolds@itservicedesk.io',
      department: 'IT Infrastructure',
      priority: 'P3',
      category: '',
      description: '',
      urgency: 'normal',
    },
  });

  useEffect(() => {
    if (draft) {
      setValue('title', draft.title);
      setValue('category', draft.category);
      setValue('priority', draft.priority);
      setValue('description', draft.description);
      setSubmitted(false);
    }
  }, [draft, setValue]);

  const onSubmit = async (data: FormData) => {
    // Backend integration: POST /api/tickets
    await new Promise((r) => setTimeout(r, 1000));
    const id = `TKT-${1053 + Math.floor(Math.random() * 50)}`;
    setSubmittedId(id);
    setSubmitted(true);
    toast.success(`Ticket ${id} created successfully`);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-6 flex flex-col items-center justify-center text-center gap-4 h-full min-h-[300px]">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <Icon name="CheckCircleIcon" size={28} className="text-green-600" />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">Ticket Submitted!</p>
          <p className="text-sm text-slate-500 mt-1">Your ticket has been created and assigned to the queue.</p>
        </div>
        <div className="bg-slate-50 rounded-xl px-6 py-4 w-full">
          <p className="text-xs text-slate-500 mb-1">Ticket ID</p>
          <p className="font-mono text-xl font-bold text-blue-600">{submittedId}</p>
          <p className="text-xs text-slate-400 mt-1">You'll receive email updates on progress</p>
        </div>
        <div className="flex gap-2 w-full">
          <button
            onClick={() => { setSubmitted(false); reset(); }}
            className="btn-secondary flex-1 text-sm"
          >
            Create Another
          </button>
          <button className="btn-primary flex-1 text-sm">
            <Icon name="ExternalLinkIcon" size={14} />
            View Ticket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Ticket Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <Icon name="TicketIcon" size={16} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            {draft ? 'Review & Submit Ticket' : 'Create Ticket Manually'}
          </h3>
          {draft && (
            <span className="ml-auto badge bg-blue-100 text-blue-700 text-[10px]">
              AI Pre-filled
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Issue Title <span className="text-red-500">*</span></label>
            <input
              {...register('title', { required: 'Title is required' })}
              placeholder="Brief description of the issue"
              className="input-field text-sm py-2"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Priority <span className="text-red-500">*</span></label>
              <select {...register('priority', { required: true })} className="input-field text-sm py-2">
                <option value="P1">P1 — Critical</option>
                <option value="P2">P2 — High</option>
                <option value="P3">P3 — Medium</option>
                <option value="P4">P4 — Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
              <select {...register('category', { required: 'Required' })} className="input-field text-sm py-2">
                <option value="">Select…</option>
                {['Network','Hardware','Software','Identity & Access','Email / Messaging','Security','Database','Printing','Storage'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Requester</label>
            <input {...register('requester')} className="input-field text-sm py-2 bg-slate-50 text-slate-500" readOnly />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
            <select {...register('department')} className="input-field text-sm py-2">
              {['IT Infrastructure','Engineering','Finance','HR','Legal','Marketing','Operations','Sales'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Add details: affected users, error messages, steps already tried…"
              className="input-field text-sm py-2 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Urgency</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'low', label: 'Low', sub: 'Can wait' },
                { value: 'normal', label: 'Normal', sub: 'Business impact' },
                { value: 'urgent', label: 'Urgent', sub: 'Blocking work' },
              ].map((u) => (
                <label key={u.value} className="relative cursor-pointer">
                  <input type="radio" {...register('urgency')} value={u.value} className="sr-only peer" />
                  <div className="border border-slate-200 rounded-lg p-2.5 text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-blue-300 transition-all">
                    <p className="text-xs font-medium text-slate-700 peer-checked:text-blue-700">{u.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{u.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full text-sm py-2.5">
            {isSubmitting ? (
              <><Icon name="Loader2Icon" size={15} className="animate-spin" />Submitting ticket…</>
            ) : (
              <><Icon name="SendIcon" size={15} />Submit Ticket</>
            )}
          </button>
        </form>
      </div>

      {/* KB Articles Panel */}
      {kbArticles.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
            <Icon name="BookOpenIcon" size={15} className="text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-900">Self-Service Articles</h3>
            <span className="ml-auto badge bg-slate-100 text-slate-600">{kbArticles.length}</span>
          </div>
          <div className="divide-y divide-slate-100">
            {kbArticles.map((kb) => (
              <div key={kb.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group">
                <Icon name="FileTextIcon" size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{kb.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[10px] text-slate-400">{kb.id}</span>
                    <span className="text-[10px] text-slate-400">{kb.views.toLocaleString()} views</span>
                    <span className="text-[10px] text-green-600 font-medium">{kb.helpful}% helpful</span>
                  </div>
                </div>
                <Icon name="ArrowRightIcon" size={13} className="text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Resolving via KB article? <button className="text-blue-600 font-medium hover:text-blue-700">Mark as self-resolved</button>
            </p>
          </div>
        </div>
      )}

      {/* No draft state */}
      {!draft && kbArticles.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center">
          <Icon name="MessageSquareIcon" size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">Start a conversation</p>
          <p className="text-xs text-slate-400 mt-1">Describe your issue in the chat and the AI will help pre-fill this form</p>
        </div>
      )}
    </div>
  );
}