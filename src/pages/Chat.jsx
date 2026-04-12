import { useState } from 'react';
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile, ChevronLeft } from 'lucide-react';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import './Chat.css';

const DEMO_CONVERSATIONS = [
  { id: 1, name: 'Ashan Madusanka', lastMsg: 'I can come tomorrow at 10 AM. Works?', time: '2m ago', unread: 2, online: true },
  { id: 2, name: 'Kamal Dissanayake', lastMsg: 'The repair is completed. Please check.', time: '1h ago', unread: 0, online: false },
  { id: 3, name: 'Saman Kumara', lastMsg: 'Sure, I\'ll send you the portfolio.', time: '3h ago', unread: 1, online: true },
  { id: 4, name: 'Dilshan Fernando', lastMsg: 'The website design is ready for review.', time: 'Yesterday', unread: 0, online: false },
];

const DEMO_MESSAGES = [
  { id: 1, senderId: 'other', text: 'Hello! I saw your request for home cleaning service.', time: '10:30 AM' },
  { id: 2, senderId: 'other', text: 'I\'m available this week. Would you like to schedule a visit?', time: '10:31 AM' },
  { id: 3, senderId: 'me', text: 'Hi! Yes, that would be great. What days work for you?', time: '10:45 AM' },
  { id: 4, senderId: 'other', text: 'I can come tomorrow (Tuesday) or Thursday. Morning or afternoon works for me.', time: '10:48 AM' },
  { id: 5, senderId: 'me', text: 'Tomorrow morning would be perfect. Around 10 AM?', time: '10:52 AM' },
  { id: 6, senderId: 'other', text: 'I can come tomorrow at 10 AM. Works?', time: '10:53 AM' },
];

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(DEMO_CONVERSATIONS[0]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const { currentUser } = useAuth();

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessage('');
  };

  const filteredConversations = DEMO_CONVERSATIONS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-page page-content">
      <div className="chat-container">
        {/* Sidebar */}
        <div className={`chat-sidebar ${showSidebar ? '' : 'chat-sidebar-hidden'}`}>
          <div className="chat-sidebar-header">
            <h2>Messages</h2>
          </div>
          <div className="chat-sidebar-search">
            <Search size={18} className="chat-sidebar-search-icon" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="chat-conversations">
            {filteredConversations.map(conv => (
              <div
                key={conv.id}
                className={`chat-conversation ${selectedChat?.id === conv.id ? 'active' : ''}`}
                onClick={() => { setSelectedChat(conv); setShowSidebar(false); }}
              >
                <Avatar name={conv.name} size="md" status={conv.online ? 'online' : 'offline'} />
                <div className="chat-conv-info">
                  <div className="chat-conv-top">
                    <span className="chat-conv-name">{conv.name}</span>
                    <span className="chat-conv-time">{conv.time}</span>
                  </div>
                  <div className="chat-conv-bottom">
                    <span className="chat-conv-msg">{conv.lastMsg}</span>
                    {conv.unread > 0 && (
                      <span className="chat-conv-unread">{conv.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-main">
          {selectedChat ? (
            <>
              <div className="chat-main-header">
                <button className="chat-back-btn" onClick={() => setShowSidebar(true)}>
                  <ChevronLeft size={22} />
                </button>
                <Avatar name={selectedChat.name} size="sm" status={selectedChat.online ? 'online' : 'offline'} />
                <div className="chat-main-header-info">
                  <h4>{selectedChat.name}</h4>
                  <span className="chat-main-status">{selectedChat.online ? 'Online' : 'Offline'}</span>
                </div>
                <div className="chat-main-header-actions">
                  <button><Phone size={18} /></button>
                  <button><Video size={18} /></button>
                  <button><MoreVertical size={18} /></button>
                </div>
              </div>

              <div className="chat-messages">
                {DEMO_MESSAGES.map(msg => (
                  <div key={msg.id} className={`chat-message ${msg.senderId === 'me' ? 'sent' : 'received'}`}>
                    <div className="chat-bubble">
                      <p>{msg.text}</p>
                      <span className="chat-time">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <form className="chat-input-area" onSubmit={handleSend}>
                <button type="button" className="chat-input-btn"><Paperclip size={20} /></button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="chat-input"
                />
                <button type="button" className="chat-input-btn"><Smile size={20} /></button>
                <button type="submit" className="chat-send-btn" disabled={!message.trim()}>
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty">
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
