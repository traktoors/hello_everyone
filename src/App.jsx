import { useState, useEffect } from 'react'
import Message from './components/Message'
import NavBar from './components/NavBar'
import {
  db,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from './firebase.js';

function sanitize(input) {
  // Simple HTML escaping to avoid injection
  return input.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}

function App() {
  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 1000;
  const MAX_USERNAME_LENGTH = 50;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    }, (err) => {
      console.error("Error fetching messages: ", err);
      setError("Failed to load messages.");
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    setError(null);
    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }
    setSending(true);

    try {
      await addDoc(collection(db, 'messages'), {
        title: sanitize(title.trim()),
        content: sanitize(content.trim()),
        username: sanitize(username.trim() || 'Anonymous'),
        createdAt: serverTimestamp()
      });

      setTitle('');
      setContent('');
      setUsername('');
    } catch (e) {
      console.error("Error sending message:", e);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className='center-w h-90 p-25 flex-r'>
        <div id="new-msg-div" className='elevated-card flex-c gap-10'>
          <h1>Share What’s On Your Mind Today</h1>
          <hr />
          {error && <p style={{color: 'red'}}>{error}</p>}
          <div className='flex-c'>
            <input
              type="text"
              placeholder="Enter a title for your message..."
              value={title}
              maxLength={MAX_TITLE_LENGTH}
              onChange={(e) => setTitle(e.target.value)}
              disabled={sending}
            />
            <p className='letter-count-p'>{title.length} / {MAX_TITLE_LENGTH}</p>
          </div>
          <div className='flex-c h-90'>
            <textarea
              className='h-90'
              placeholder="Write your message here..."
              value={content}
              maxLength={MAX_CONTENT_LENGTH}
              onChange={(e) => setContent(e.target.value)}
              disabled={sending}
            />
            <p className='letter-count-p'>{content.length} / {MAX_CONTENT_LENGTH}</p>
          </div>
          <div className='flex-c'>
            <input
              type="text"
              placeholder="Your name (optional)"
              value={username}
              maxLength={MAX_USERNAME_LENGTH}
              onChange={(e) => setUsername(e.target.value)}
              disabled={sending}
            />
            <p className='letter-count-p'>{username.length} / {MAX_USERNAME_LENGTH}</p>
          </div>
          <button id='btn-send' onClick={handleSend} disabled={sending}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
        <div id="msg-list-div" className='elevated-card flex-c gap-10'>
          <h1>What Others Are Saying</h1>
          <hr />
          {messages.length > 0 ? (
            messages.map((msg) => (
              <Message
                key={msg.id}
                title={msg.title}
                username={msg.username}
                content={msg.content}
                date={msg.createdAt ? msg.createdAt.toDate().toLocaleDateString() : ''}
              />
            ))
          ) : (
            <p>No messages yet. Be the first to share!</p>
          )}
        </div>
      </div>
    </>
  )
}

export default App;
