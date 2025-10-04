
import './App.css';
import Navbar from "./components/Navbar"
import ChatWindow from "./components/ChatWindow"

function App(){
  return (
    <div className='App'>
      <Navbar />

      <div className='tervetuloa'>
      <h1>AIVA</h1>
      <p>Kysy Aivalta apua tuotteisiin liittyen. Aiva auttaa mielellään.</p>
      </div>
      <ChatWindow />



    </div>
  );
}

export default App;
