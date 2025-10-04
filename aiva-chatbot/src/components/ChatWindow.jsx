//Komponentti chatbotin ikkunalle, jossa keskustelu käydään
//Botille oma ikoni ja puhekupla (chat-message bot) ja käyttäjälle puhekupla (chat-message user)

import React, { useState, useEffect } from "react";
import aivaIcon from "../images/aiva.png";  
import "./ChatWindow.css"

function ChatWindow() {
    return (
        <div className="chat-window">
            <div className="chat-message bot">
                <img src={aivaIcon} alt="aiva-bot" className="chat-icon" />
                <div className="chat-bubble bot-bubble">Hei! Miten voin auttaa sinua tänään?</div>
            </div>
            <div className="chat-message user">
                <div className="chat-bubble user-bubble">Etsin uutta telkkaria</div>
                <img src={aivaIcon} alt="aiva-bot" className="chat-icon" />
            </div>
        </div>
    );
}

export default ChatWindow;