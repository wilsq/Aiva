//Komponentti chatbotin ikkunalle, jossa keskustelu käydään
//Botille oma ikoni ja puhekupla (chat-message bot) ja käyttäjälle puhekupla (chat-message user)

import React, { useState, useEffect } from "react";
import aivaIcon from "../images/aiva.png";
import "./ChatWindow.css";
import ChatForm from "./ChatForm.jsx";
import ChatMessage from "./ChatMessage.jsx";

function ChatWindow() {


  const [chatHistory, setChatHistory] = useState([]);

  const generateBotResponse = () => {};

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>AIVA-chatbot</h2>
      </div>
      <div className="chat-body">
        <div className="chat-message bot">
          <img src={aivaIcon} alt="aiva-bot" className="chat-icon" />
          <div className="chat-bubble bot-bubble">
            Hei! Miten voin auttaa sinua tänään?
          </div>
        </div>


        {chatHistory.map((chat, index) => (
          <ChatMessage key={index} chat={chat} />
        ))}
      </div>

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
