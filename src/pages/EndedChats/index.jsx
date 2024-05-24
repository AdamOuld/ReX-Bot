import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import rexImage from '../../assets/Kai.avif';
import trashIcon from '../../assets/trash.png'
import backIcon from '../../assets/back.png';
import '../../styles/EndedChats.css'


const EndedChats = () => {

    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3500/sessions')
          .then(response => {
            setSessions(response.data);
          })
          .catch(error => {
            console.error('Error fetching sessions:', error);
          });
      }, []);

      const handleDeleteSession = (session) => {
        const id = session.id
        const sessionIndex = sessions.findIndex((session) => session.id === id);
        if (sessionIndex !== -1) {
            let updatedSessions = [...sessions]
            updatedSessions.splice(sessionIndex, 1)
            setSessions(updatedSessions)
        }
        axios.post('http://localhost:3500/delete-session', { id: session.id })
            .then(response => {
                console.log('Session deleted:', response.data);
            })
            .catch(error => {
                console.error('There was an error deleting the session!', error);
            });
    };

    const handleReturn = () => {
        navigate('/');
      };

    
  return (
    <div className="ended-chats">
      <div className="all-nav">
        <h2>RexBot</h2>
        <img src={rexImage} width="100px" height="100px" alt=""/>
        <img src={backIcon} width="25px" height="20px" alt="" onClick={handleReturn} className="back-icon" />
      </div>
      <div className="ended-sessions">
        <h2>Ended Chats</h2>
        {sessions.filter(session => session.isSessionEnded).map((session) => (
          <div className="ended-session" key={session.id} >
            <img src={rexImage} width="40px" height="40px" alt="" className='rex-image'/>
            {session.messages.length > 0 ? session.messages[session.messages.length - 1].text.substring(0, 20) + '...' : 'No messages'}
            <img onClick={() => handleDeleteSession(session)} className="delete-session" src = {trashIcon} alt = "" width="20px" height="20px"/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EndedChats