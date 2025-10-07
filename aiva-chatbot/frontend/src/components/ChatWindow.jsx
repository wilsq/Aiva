//Komponentti chatbotin ikkunalle, jossa keskustelu käydään
//Botille oma ikoni ja puhekupla (chat-message bot) ja käyttäjälle puhekupla (chat-message user)

import React, { useState, useEffect } from "react";
import aivaIcon from "../images/aiva.png";
import "./ChatWindow.css";
import ChatForm from "./ChatForm.jsx";
import ChatMessage from "./ChatMessage.jsx";

function ChatWindow() {
  {
    /* DEMO usestate */
  }
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const [chatHistory, setChatHistory] = useState([]);

  const generateBotResponse = () => {};

  {
    /* DEMO funktio */
  }
  async function handleFetch() {
    try {
      const res = await fetch(
        `http://localhost:5000/api/product/${encodeURIComponent(input)}`
      );
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ message: "Virhe haussa" });
    }
  }

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

        {/* DEMO */}

        {result && Array.isArray(result) && result.length > 0 ? (
          <div className="mt-4 p-4 border rounded result-box">
            <h2>{result[0].name}</h2>
            <p>{result[0].description}</p>
            <p>Hinta: {result[0].price} €</p>
          </div>
        ) : result && result.message ? (
          <div className="mt-4 p-4 border rounded result-box">
            <p>{result.message}</p>
          </div>
        ) : null}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Kirjoita tuotteen nimi"
          className="border p-2 m-2"
        />
        <button onClick={handleFetch} className="bg-blue-500 text-white p-2">
          Hae tuote
        </button>
        {/* DEMO */}

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
