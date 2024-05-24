import React, { useState, useEffect } from "react";
import '../../styles/Chat.css';
import rexImage from '../../assets/Kai.avif';
import backIcon from '../../assets/back.png';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Grid, CircularProgress, Typography } from '@mui/material';
import ChatActivityGraph from "../../components/ChatActivityGraph";

const Activity = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate('/');
  };

  useEffect(() => {
    axios.get('http://localhost:3500/sessions')
      .then(response => {
        setSessions(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching sessions:', error);
        setLoading(false);
      });
  }, []);

  const graphData = sessions.map(session => ({
    date: new Date(session.date).toLocaleDateString(),
    messagesCount: session.messages.length,
  }));

  return (
    <div className='activity'>
      <div className='activity-nav'>
        <h2>Chat Activity</h2>
        <img src={backIcon} width="25px" height="20px" alt="" onClick={handleReturn} className="back-icon" />
      </div>
      <div className='chat-activity'>
        {loading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : (
          <>
            <ChatActivityGraph data={graphData} loading={loading} />
            {sessions.map((session) => (
              <div className="session" key={session.id}>
                <img src={rexImage} width="40px" height="40px" alt=""/>
                <div className="session-info">
                  <h3>ReX - {new Date(session.date).toLocaleDateString()}</h3>
                  <p>{session.messages.length} Messages</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Activity;
