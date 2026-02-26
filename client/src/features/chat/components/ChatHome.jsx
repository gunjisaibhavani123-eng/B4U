import { useEffect, useRef, useState } from 'react';
import { Button, Input, Modal, Spin } from 'antd';
import { DeleteOutlined, SendOutlined } from '@ant-design/icons';
import {
  useGetChatHistoryQuery,
  useSendMessageMutation,
  useClearHistoryMutation,
} from '@features/chat/services/chatApi';

const QUICK_QUESTIONS = [
  'How much did I spend this month?',
  'Am I on budget?',
  'How are my savings goals?',
  'What challenges am I in?',
];

// Animated typing indicator shown while bot is "thinking"
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
          isUser
            ? 'bg-green-500 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-800 rounded-bl-sm'
        }`}
      >
        {msg.content ?? msg.text}
      </div>
    </div>
  );
}

export default function ChatHome() {
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const { data: historyData, isLoading: historyLoading } = useGetChatHistoryQuery(50);
  const [sendMessage] = useSendMessageMutation();
  const [clearHistory] = useClearHistoryMutation();

  // Sync history from server into local state on first load
  useEffect(() => {
    if (historyData?.messages) {
      setLocalMessages(historyData.messages);
    }
  }, [historyData]);

  // Auto-scroll to bottom whenever messages or typing state change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages, isTyping]);

  const handleSend = async (text) => {
    const content = (text ?? input).trim();
    if (!content) return;

    setInput('');

    // Optimistically show user message
    const optimisticUser = { role: 'user', content, id: `opt-${Date.now()}` };
    setLocalMessages((prev) => [...prev, optimisticUser]);
    setIsTyping(true);

    try {
      const result = await sendMessage(content).unwrap();
      // result is [userMsg, botMsg] from the API
      setLocalMessages((prev) => {
        // Replace the optimistic user message with the real ones
        const without = prev.filter((m) => m.id !== optimisticUser.id);
        return [...without, ...result];
      });
    } catch {
      setLocalMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Sorry, something went wrong. Please try again.', id: `err-${Date.now()}` },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    Modal.confirm({
      title: 'Clear chat history?',
      content: 'This will permanently delete all messages in this conversation.',
      okText: 'Clear',
      okButtonProps: { danger: true },
      onOk: async () => {
        await clearHistory().unwrap();
        setLocalMessages([]);
      },
    });
  };

  const showQuickChips = !historyLoading && localMessages.length === 0;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Chat Advisor</h1>
          <p className="text-xs text-gray-400">Personalized financial guidance</p>
        </div>
        {localMessages.length > 0 && (
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={handleClear}
            className="text-gray-400"
            title="Clear history"
          />
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {historyLoading ? (
          <div className="flex justify-center pt-10">
            <Spin />
          </div>
        ) : localMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <span className="text-4xl">💬</span>
            <p className="text-sm">Ask me anything about your finances</p>
          </div>
        ) : (
          localMessages.map((msg, i) => <MessageBubble key={msg.id ?? i} msg={msg} />)
        )}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Quick question chips — only when history is empty */}
      {showQuickChips && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="whitespace-nowrap text-xs px-3 py-2 rounded-full border border-green-200 bg-green-50 text-green-700 cursor-pointer flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="p-3 border-t border-gray-100 flex gap-2">
        <Input
          placeholder="Ask anything about your finances..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={() => handleSend()}
          className="rounded-full"
          disabled={isTyping}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          onClick={() => handleSend()}
          disabled={isTyping || !input.trim()}
        />
      </div>
    </div>
  );
}
