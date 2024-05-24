import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import '../../styles/Chat.css';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import rexImage from '../../assets/Kai.avif';
import backIcon from '../../assets/back.png';
import { TypingIndicator } from "@chatscope/chat-ui-kit-react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import trashIcon from '../../assets/trash.png';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [typing, setTyping] = useState(false);

    const { id } = useParams();
    const newID = () => ({ id: '_' + Math.random().toString(36).substr(2, 9), date: new Date().toISOString() }); // Generate a new ID and date for the session
    const [session, setSession] = useState(id ? { id, date: '' } : { ...newID(), messages: [], isSessionEnded: false });

    const navigate = useNavigate();

    const handleReturn = () => {
        navigate('/');
    };

    const handleEndSession = () => {
        setSession(prevSession => ({ ...prevSession, isSessionEnded: true }));
        axios.post('http://localhost:3500/end-session', { id: session.id })
            .then(response => {
                console.log('Session ended:', response.data);
                navigate('/');
            })
            .catch(error => {
                console.error('There was an error ending the session!', error);
            });
    };

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:3500/sessions/${id}`)
                .then(response => {
                    const prevSession = response.data;
                    setSession(prevSession);
                    setMessages(prevSession.messages);
                })
                .catch(error => {
                    console.error('Error fetching session:', error);
                });
        }
    }, [id]);

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
        
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('ai-response', (newMessages) => {
                setMessages(newMessages);
                setTyping(false);
                updateSession(newMessages);
            });
        }
        return () => {
            if (socket) {
                socket.off('ai-response');
            }
        };
    }, [socket]);

    const handleSendMessage = () => {
        setTyping(true);
        const newMessage = {
            text: inputMessage,
            type: 'outgoing', 
        };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setInputMessage('');
        socket.emit('chat-message', newMessages);
        updateSession(newMessages);
    };

    const updateSession = (newMessages) => {
        // Create a new session object with updated messages and the preserved date
        const updatedSession = { ...session, messages: newMessages };
        // Preserve the existing date if it's available, otherwise set the current date
        const updatedSessionWithDate = {
            ...updatedSession,
            date: session.date || new Date().toISOString()
        };
        // Update the session state with the new session object
        setSession(updatedSessionWithDate);
        // Save the updated session to the backend
        saveSession(updatedSessionWithDate);
    };

    const saveSession = (session) => {
        axios.post('http://localhost:3500/save-session', session)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error saving the session!', error);
            });
    };

    return (
        <div className="chat-page">
            <div className="chat">
                <div className="chat-header">
                    <img src={backIcon} width="25px" height="20px" alt="" onClick={handleReturn} className="back-icon" />
                    <h1>ReX</h1>
                    <img src={rexImage} width="100px" height="100px" alt="" className="rex-image"/>
                    <img onClick={handleEndSession} className="end-session" src={trashIcon} alt="" width="20px" height="20px"/>
                </div>
                <div className="message-container">
                    {messages.map((message, index) => (
                        <div key={index} className={message.type === 'incoming' ? 'incoming-message' : 'outgoing-message'}>
                            {message.text}
                        </div>
                    ))}
                </div>
                {typing ? <TypingIndicator content="Rex is typing" className="typing-indicator" /> : null}
                <input
                    className="user-input"
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;