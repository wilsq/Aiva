//ChatMessage-komponentti määrittää, miten  yksittäinen chat-viesti näytetään keskustelualueella

import React from "react";
import aivaIcon from "../images/aiva.png";  

const ChatMessage = ({chat}) => {
    return (
        <div className={`chat-message ${chat.role === "bot" ? 'bot' : 'user'}`}>

            {/* Jos rooli on bot, näytetään Aiva-ikoni */}
            {chat.role === "bot" && <img src={aivaIcon} alt="aiva-bot" className="chat-icon" />}
            
            {/* määritellään viestikupla roolin mukaan, ja chatWindow.css:ssä on tarkemmin määritelty viestikuplien visuaaliset ohjeet */}
            <div className={`chat-bubble ${chat.role === "bot" ? 'bot-bubble' : 'user-bubble'}`}>{chat.text}</div>
        </div>
    );
};

export default ChatMessage;