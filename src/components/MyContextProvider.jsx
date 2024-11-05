import MyContext from './MyContext';
import React, { useState } from 'react';

const MyContextProvider = ({ children }) => {
  // const [endpoint, setEndpoint] = useState('https://tom-letter-app.onrender.com');
  const [endpoint, setEndpoint] = useState('http://localhost:5000');
  const apiKey = import.meta.env.VITE_API_KEY;
  
  return (
    <MyContext.Provider value={{ apiKey, endpoint, setEndpoint }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;
