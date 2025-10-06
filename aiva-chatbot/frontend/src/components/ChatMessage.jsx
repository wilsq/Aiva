import React from "react";
import aivaIcon from "../images/aiva.png";  

const ChatMessage = ({chat}) => {
    return (
        <div className={`chat-message ${chat.role === "model" ? 'bot' : 'user'}`}>
            {chat.role === "model" && <img src={aivaIcon} alt="aiva-bot" className="chat-icon" />}
            <div className={`chat-bubble ${chat.role === "model" ? 'bot-bubble' : 'user-bubble'}`}>{chat.text}</div>
        </div>
    );
};

export default ChatMessage;