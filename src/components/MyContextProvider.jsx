import MyContext from './MyContext';
import React, { useState } from 'react';

const MyContextProvider = ({ children }) => {
  // const [endpoint, setEndpoint] = useState('https://tom-letter-app.onrender.com');
  const [DBUpdated, setDBUpdated] = useState(false);
  const [endpoint, setEndpoint] = useState('http://localhost:5000');
  // const [apiKey, setApiKey] = useState(import.meta.env.VITE_API_KEY)
  const apiKey = import.meta.env.VITE_API_KEY;
  
  return (
    <MyContext.Provider value={{DBUpdated, setDBUpdated, apiKey, endpoint, setEndpoint }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;
