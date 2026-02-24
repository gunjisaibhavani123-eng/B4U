import { useState } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const QUICK_QUESTIONS = [
  'How much did I spend this month?',
  'Am I on budget?',
  'How can I save more?',
  'What should I invest in?',
];

export default function ChatHome() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your B4U financial advisor. Ask me anything about your finances. 🤖" },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (text) => {
    const q = text || input;
    if (!q.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: q },
      { role: 'bot', text: "Thanks for your question! This feature is coming soon. In the meantime, check out the Learn section for financial tips. 📚" },
    ]);
    setInput('');
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="px-4 pt-3 pb-2 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">Chat Advisor</h1>
        <p className="text-xs text-gray-400">AI-powered financial guidance</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-green-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick questions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="whitespace-nowrap text-xs px-3 py-2 rounded-full border border-green-200 bg-green-50 text-green-700 cursor-pointer flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-gray-100 flex gap-2">
        <Input
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={() => sendMessage()}
          className="rounded-full"
        />
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          onClick={() => sendMessage()}
        />
      </div>
    </div>
  );
}
