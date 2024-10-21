import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './Normalize.css'

import MyContextProvider from './components/MyContextProvider';
import SearchFile from './components/SearchFile';
import PdfViewer from './components/test'
import FileDatabase from './components/FileDatabase';
function App() {

  return (
    <>
      <MyContextProvider >
        {/* <SearchFile /> */}
        <FileDatabase />
        <PdfViewer />
       
      </MyContextProvider>
    </>
  )
}

export default App
