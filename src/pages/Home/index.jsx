import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import rexImage from '../../assets/Kai.avif';
import activityIcon from '../../assets/activity.png'
import '../../styles/Home.css';

const Home = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/newchat');
  };

  const handleSessionClick = (session) => {
    navigate(`/chat/${session.id}`);
  };

  const handleAllClick = () => {
    navigate('/allchats')
  }
  const handleActivityClick = () => {
    navigate('/activity')
  }

  useEffect(() => {
    axios.get('http://localhost:3500/sessions')
      .then(response => {
        setSessions(response.data);
      })
      .catch(error => {
        console.error('Error fetching sessions:', error);
      });
  }, []);

  return (
    <div className="home">
      <div className="nav">
        <h2>ReXBot</h2>
        <img src={rexImage} width="100px" height="100px" alt="" className='rex-image'/>
        <img src={activityIcon} width="30px" height="30px" alt="" onClick={handleActivityClick} className='activity-icon'/>
      </div>
      <div className='home-text'>
        <p>Your own personal career advice assistant! Start a new chat to get started!</p>
      </div>
      <div className="prev-sessions">
        <h2>Active Chats</h2>
        {sessions.filter(session => !session.isSessionEnded).map((session) => (
          <div className="session" key={session.id} onClick={() => handleSessionClick(session)}>
            <img src={rexImage} width="40px" height="40px" alt=""/>
            {session.messages.length > 0 ? session.messages[session.messages.length - 1].text.substring(0, 20) + '...' : 'No messages'}
          </div>
        ))}
        <p onClick={handleAllClick}>See Ended Chats</p>
      </div>
      <button onClick={handleClick}>Start a chat!</button>
    </div>
  );
};

export default Home;