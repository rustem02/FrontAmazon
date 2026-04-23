import React, { useContext, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import AuthContext from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function SupportChat() {
  const { authTokens } = useContext(AuthContext);
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I can help with booking, documents, and payments.' },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }
    const userText = message.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setMessage('');
    setLoading(true);
    try {
      const response = await axios.post(
        'chatbot/query/',
        { message: userText },
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      setMessages((prev) => [...prev, { role: 'assistant', text: response.data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Failed to get reply from support bot.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='rooms'>
      <Navbar />
      <div className='rooms-container'>
        <section className='dorm-information'>
          <header className='dorm-information-header'>
            <div className='title-main'>
              <h1>{t('chat.title')}</h1>
              <p>Ask your questions about documents, room booking, and payments.</p>
            </div>
          </header>
        </section>

        <section style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '360px', overflowY: 'auto' }}>
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                style={{
                  alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start',
                  background: item.role === 'user' ? '#dbeafe' : '#f3f4f6',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  maxWidth: '70%'
                }}
              >
                {item.text}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t('chat.placeholder')}
              style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #d1d5db' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{ padding: '12px 18px', border: 'none', borderRadius: '10px', background: '#1f3a8a', color: '#fff', cursor: 'pointer' }}
            >
              {loading ? '...' : t('chat.send')}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
