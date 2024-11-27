import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './Normalize.css'

import MyContextProvider from './components/MyContextProvider';
import SearchFile from './components/SearchFile';
import PdfViewer from './components/test';
import FileDatabase from './components/FileDatabase';
import FileDB from './components/FileDB';
import Upload from './components/Upload';
import TestTailwind from './components/TestTailwind';


function App() {

  return (
    <>
      <MyContextProvider >
        <Upload />
        
        {/* <SearchFile /> */}
        {/* <FileDB /> */}
        <FileDatabase />
        {/* <PdfViewer /> */}
        {/* <TestTailwind /> */}
      </MyContextProvider>
    </>
  )
}

export default App
