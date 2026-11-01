'use client';

import { useState, KeyboardEvent } from 'react';
import { EventPlan } from '@/schemas/planSchemas';
import { translations, Language } from '@/lib/translations';

interface PlanDisplayProps {
  plan: EventPlan;
  language: Language;
}

type TabId = 'budget' | 'timeline' | 'vendors' | 'ideas';

export default function PlanDisplay({ plan, language }: PlanDisplayProps) {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<TabId>('budget');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'budget', label: t.plan.budget },
    { id: 'timeline', label: t.plan.timeline },
    { id: 'vendors', label: t.plan.vendors },
    { id: 'ideas', label: t.plan.ideas }
  ];

  const handleTabClick = (tabId: TabId): void => {
    setActiveTab(tabId);
  };

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, tabId: TabId): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(tabId);
    }
  };

  const handleChatSubmit = async (): Promise<void> => {
    if (!chatMessage.trim() || isStreaming) return;

    const userMessage = chatMessage.trim();
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.planId,
          message: userMessage,
          language
        })
      });

      if (!response.ok) throw new Error('Chat failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      if (reader) {
        setChatHistory(prev => [...prev, { role: 'assistant', content: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = {
                      role: 'assistant',
                      content: accumulatedText
                    };
                    return newHistory;
                  });
                }
              } catch {
                // Ignore parse errors
              }
            }
          }
        }
      }
    } catch (error) {
      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: t.errors.generic }
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleChatKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleChatSubmit();
    }
  };

  return (
    <div className="plan-display">
      <div className="plan-header">
        <h2 className="plan-title">{t.plan.title}</h2>
        <div className="plan-summary">
          <p>{plan.eventSummary}</p>
        </div>
      </div>

      <div className="tabs-container">
        <div role="tablist" className="tabs" aria-label={t.plan.title}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-panels">
          {activeTab === 'budget' && (
            <div
              role="tabpanel"
              id="panel-budget"
              aria-labelledby="tab-budget"
              className="tab-panel"
            >
              <div className="budget-list">
                {plan.budgetBreakdown.map((item, idx) => (
                  <div key={idx} className="budget-item">
                    <div className="budget-item-header">
                      <h3>{item.category}</h3>
                      <span className={`priority priority-${item.priority}`}>
                        {t.plan.priority[item.priority]}
                      </span>
                    </div>
                    <p>{item.description}</p>
                    <p className="budget-cost">
                      ₹{item.estimatedCost.toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div
              role="tabpanel"
              id="panel-timeline"
              aria-labelledby="tab-timeline"
              className="tab-panel"
            >
              <div className="timeline-list">
                {plan.timeline.map((item, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-marker">
                      <span className="timeline-days">T-{item.daysBeforeEvent}</span>
                      <span className="timeline-label">{t.plan.daysBeforeEvent}</span>
                    </div>
                    <div className="timeline-content">
                      <h3>{item.task}</h3>
                      <p>{item.description}</p>
                      {item.responsible && (
                        <p className="timeline-responsible">
                          {item.responsible}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div
              role="tabpanel"
              id="panel-vendors"
              aria-labelledby="tab-vendors"
              className="tab-panel"
            >
              <div className="vendor-list">
                {plan.vendorChecklist.map((vendor, idx) => (
                  <div key={idx} className="vendor-item">
                    <h3>{vendor.category}</h3>
                    <p><strong>{vendor.type}</strong></p>
                    <p>{vendor.estimatedCost}</p>
                    <p><em>{vendor.whenToBook}</em></p>
                    <p className="vendor-tips">{vendor.tips}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ideas' && (
            <div
              role="tabpanel"
              id="panel-ideas"
              aria-labelledby="tab-ideas"
              className="tab-panel"
            >
              <div className="ideas-list">
                {plan.personalizedIdeas.map((idea, idx) => (
                  <div key={idx} className="idea-item">
                    <span className="idea-category">{idea.category}</span>
                    <h3>{idea.title}</h3>
                    <p>{idea.description}</p>
                  </div>
                ))}
              </div>

              <div className="tips-section">
                <h3>{t.plan.tips}</h3>
                <ul className="tips-list">
                  {plan.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="chat-section">
        <h3>{t.plan.chat}</h3>
        <div className="chat-history" role="log" aria-live="polite" aria-atomic="false">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`chat-message chat-${msg.role}`}>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={handleChatKeyDown}
            placeholder={t.plan.chatPlaceholder}
            className="chat-input"
            disabled={isStreaming}
            aria-label={t.plan.chat}
          />
          <button
            onClick={() => void handleChatSubmit()}
            disabled={isStreaming || !chatMessage.trim()}
            className="chat-send"
            aria-label={t.plan.send}
          >
            {t.plan.send}
          </button>
        </div>
      </div>
    </div>
  );
}
