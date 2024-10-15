import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './Normalize.css'

import MyContextProvider from './components/MyContextProvider';
import SearchFile from './components/SearchFile';

function App() {

  return (
    <>
      <MyContextProvider >
        <SearchFile />
      </MyContextProvider>
    </>
  )
}

export default App
