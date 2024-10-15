import MyContext from './MyContext';
import React, { useState } from 'react';

const MyContextProvider = ({ children }) => {
  const [endpoint, setEndpoint] = useState('https://tom-letter-app.onrender.com');
  
  return (
    <MyContext.Provider value={{ endpoint, setEndpoint }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContextProvider;
