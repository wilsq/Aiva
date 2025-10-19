//Komponentti chatbotin ikkunalle, jossa keskustelu käydään
//Botille oma ikoni ja puhekupla (chat-message bot) ja käyttäjälle puhekupla (chat-message user)

import React, { useState, useEffect } from "react";

import "./ChatWindow.css";

//Alikomponentit
import ChatForm from "./ChatForm.jsx";
import ChatMessage from "./ChatMessage.jsx";

//Sivulla käytetyt kuvat ja ikonit
import { SlArrowDown } from "react-icons/sl";
import aivaIcon from "../images/aiva.png";

function ChatWindow() {

  //keskusteluikkunan pienentäminen ja laajentaminen
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  }

  //Muuttuja keskusteluhistorialle 
  const [chatHistory, setChatHistory] = useState([]);

    //haetaan backendin OpenAi apin kautta vastauksia tekoälyltä
    const generateBotResponse = async (userMessage) => {
      try {
        const response = await fetch("http://localhost:5000/api/openai/ping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        });

        //Tekoälyn vastaus ja jos tulee virhe, niin tulostetaan virheviesti
        const data = await response.json();
        return data.reply
      } catch (error) {
        console.error("Virhe OpenAi-yhteydessä", error);
        return "Virhe yhteydessä palvelimeen";
      }
};

  return (
    //Chat-ikkunan div, voidaan pienentää ja laajentaa keskustelualue
    <div className={`chat-window ${isCollapsed ? "collapsed" : ""}`}>
      <div className="chat-header">
        <h2 id="chat-h2">AIVA-chatbot</h2>

        <button className="chat-window-button" onClick={toggleCollapse}>
          {isCollapsed ? (
            <img src={aivaIcon} alt="Aiva-bot" className="chat-button-icon" /> ) : (
            <SlArrowDown />
          )}
        </button>

      </div>

      {/* Keskustelun viestialue ja aloitusviesti*/}
      <div className="chat-body">
        <div className="chat-message bot">
          <img src={aivaIcon} alt="aiva-bot" className="chat-icon" />
          <div className="chat-bubble bot-bubble">
            Hei! Miten voin auttaa sinua tänään?
          </div>
        </div>

        {/* Keskusteluhistorian renderöinti ja hyödynnetään ChatMessage-alakomponentin tietoja keskustelukuplien luomisessa*/}      
        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>

      {/* Keskustelualueen alaosassa on input-alue*/}
      <div className="chat-footer">
        <ChatForm
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          generateBotResponse={generateBotResponse}
        />
      </div>
    </div>
  );
}

export default ChatWindow;
