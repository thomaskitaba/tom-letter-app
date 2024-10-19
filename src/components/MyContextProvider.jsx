import MyContext from './MyContext';
import React, { useState } from 'react';

const MyContextProvider = ({ children }) => {
  const [endpoint, setEndpoint] = useState('https://tom-letter-app.onrender.com');
  const apiKey = import.meta.env.VITE_API_KEY;
  return (
    <MyContext.Provider value={{ apikey, endpoint, setEndpoint }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;
