import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io.connect('http://localhost:4000');

export default function App() {
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  const handleInput = (e) => {
    setInputMessage(e.target.value);
  }

  const handleUserNameInput = (e) => {
    setUserName(e.target.value);
  }

  const handleSetUsername = () => {
    if (userName.trim() !== '') {
      setIsUsernameSet(true);
      socket.emit('join', userName);
    }
  }

  const sendMessage = () => {
    const messageObject = {
      userName: userName,
      message: inputMessage,
    };
    socket.emit('send-message', messageObject);
    setInputMessage('');
  }

  useEffect(() => {
    const handleReceivedMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('recieved-message', handleReceivedMessage);

    return () => {
      socket.off('recieved-message', handleReceivedMessage);
    };
  }, [socket, userName]);

  return (
    <div className='container'>
      <div className='chat-window'>
        {!isUsernameSet ? (
          <div className='set-username'>
            <input
              type="text"
              value={userName}
              onChange={handleUserNameInput}
              placeholder='Enter your username'
              className='form-control'
            />
            <br/>
            <button onClick={handleSetUsername} className='btn btn-primary'>Set Username</button>
          </div>
        ) : (
          <>
            <div className='chat-messages'>
              {messages.map((message, index) => (
                <div key={index} className='message'>
                  <strong>{message.userName}:</strong> {message.message}
                </div>
              ))}
            </div>

            <div className='message-input'>
              <input
                type="text"
                value={inputMessage}
                onChange={handleInput}
                placeholder='Type your message...'
                className='form-control'
              />
              <button onClick={sendMessage} className='btn btn-primary'>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
