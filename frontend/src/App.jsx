import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// 1. Use the CURRENT ngrok URL for listening
const socket = io('https://ccd7acd799a0.ngrok-free.app');

const solanaGradient = 'linear-gradient(135deg, #9945FF 0%, #14F195 50%, #00FFD0 100%)';

const styles = {
    app: {
        minHeight: '100vh',
        background: '#0a0f1c',
        color: '#e0e0e0',
        fontFamily: 'Fira Mono, monospace',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0',
    },
    header: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        background: solanaGradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '0.5rem',
        letterSpacing: '2px',
        textShadow: '0 0 10px #14F195, 0 0 20px #9945FF',
    },
    sub: {
        color: '#14F195',
        marginBottom: '2rem',
        fontSize: '1.2rem',
        textShadow: '0 0 5px #00FFD0',
    },
    terminal: {
        background: 'rgba(20, 30, 40, 0.95)',
        border: '2px solid #9945FF',
        borderRadius: '10px',
        boxShadow: '0 0 30px #14F19544, 0 0 10px #9945FF44',
        width: '400px',
        maxWidth: '90vw',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    chatWindow: {
        background: 'rgba(10, 20, 30, 0.8)',
        borderRadius: '6px',
        padding: '1rem',
        height: '200px',
        overflowY: 'auto',
        fontSize: '1rem',
        color: '#00FFD0',
        boxShadow: '0 0 8px #14F19555',
        marginBottom: '0.5rem',
    },
    inputRow: {
        display: 'flex',
        gap: '0.5rem',
    },
    input: {
        flex: 1,
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        border: '1px solid #14F195',
        background: '#181c2f',
        color: '#fff',
        fontSize: '1rem',
        outline: 'none',
    },
    button: {
        padding: '0.5rem 1.2rem',
        borderRadius: '4px',
        border: 'none',
        background: 'linear-gradient(90deg, #9945FF 0%, #14F195 100%)',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.2s',
        boxShadow: '0 0 8px #9945FF55',
    }
};

function App() {
    const [messages, setMessages] = useState([
        { user: 'system', text: 'Welcome to the Beast Terminal. Type your message below.' }
    ]);
    const [input, setInput] = useState('');

    // Listen for new messages from Discord
    useEffect(() => {
        // Function to handle new messages from the backend
        const handleNewMessage = (message) => {
            setMessages(msgs => [...msgs, message]);
        };

        // Set up the listener
        socket.on('newDiscordMessage', handleNewMessage);

        // Clean up the listener when the component unmounts
        return () => {
            socket.off('newDiscordMessage', handleNewMessage);
        };
    }, []); // The empty array ensures this runs only once

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        // Add message locally (from you)
        setMessages(msgs => [...msgs, { user: 'you', text: input }]);
        try {
            // 2. Add the correct API path to the fetch URL for sending
            await fetch('https://ccd7acd799a0.ngrok-free.app/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });
        } catch (err) {
            setMessages(msgs => [...msgs, { user: 'system', text: 'Failed to send to backend.' }]);
        }
        setInput('');
    };

    return (
        <div style={styles.app}>
            <h1 style={styles.header}>Beast Terminal</h1>
            <p style={styles.sub}>Solana Matrix Chat UI</p>
            <div style={styles.terminal}>
                <div style={styles.chatWindow}>
                    {messages.map((msg, idx) => (
                        <div key={idx}>
                            <span style={{ color: msg.user === 'system' ? '#9945FF' : '#14F195', fontWeight: 'bold' }}>
                                {msg.user}:
                            </span>{' '}
                            <span>{msg.text}</span>
                        </div>
                    ))}
                </div>
                <form style={styles.inputRow} onSubmit={handleSend}>
                    <input
                        style={styles.input}
                        type="text"
                        placeholder="Type a message..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <button style={styles.button} type="submit">Send</button>
                </form>
            </div>
        </div>
    );
}

export default App;

