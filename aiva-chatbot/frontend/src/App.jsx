import { useState } from 'react'
import './App.css';
import Navbar from "./components/Navbar"
import ChatWindow from "./components/ChatWindow"
import ProductSearch from './components/ProductSearch';
import Footer from './components/footer';

function App(){
  return (
    <div className='App'>
      <Navbar/>

      <div className='tervetuloa'>
      <h1>Tuotteet</h1>
      <p>Etsi sinulle sopivia telkkareita.</p>
      <ProductSearch />
      <p>Aiva-avustajamme auttaa sinua mielellään kaikissa kysymyksissä!</p>
      </div>

      <ChatWindow />


      <Footer />
    </div>
  );
}

export default App;
