import MyContext from './MyContext';
import React, { useState } from 'react';

const MyContextProvider = ({ children }) => {
  const [endpoint, setEndpoint] = useState('https://tom-letter-app.onrender.com');
  // const [apiKey, setApiKey] = useState(import.meta.env.VITE_API_KEY)
  const apiKey = import.meta.env.VITE_API_KEY;
  return (
    <MyContext.Provider value={{ apiKey, endpoint, setEndpoint }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;
