//Komponentti chatbotin ikkunalle, jossa keskustelu käydään
//Botille oma ikoni ja puhekupla (chat-message bot) ja käyttäjälle puhekupla (chat-message user)

import React, { useState, useEffect, useRef } from "react";

import "./ChatWindow.css";

//Alikomponentit
import ChatForm from "./ChatForm.jsx";
import ChatMessage from "./ChatMessage.jsx";
import ChatSettings from "./ChatSettings";
import { useTheme } from "../hooks/useTheme";

//Sivulla käytetyt kuvat ja ikonit
import { SlArrowDown } from "react-icons/sl";
import aivaIcon from "../images/aiva.png";

function ChatWindow() {
  // Autoscroll sentinel
  const bottomOfChat = useRef(null);

  //keskusteluikkunan pienentäminen ja laajentaminen
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Fullscreen
  const rootRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = async () => {
    const el = rootRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.warn("exitFullscreen failed", err);
        el.classList.remove("cw-fullscreen");
        document.body.classList.remove("chat-window-fullscreen");
        setIsFullscreen(false);
      }
      return;
    }

    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen();
        setIsFullscreen(true);
        setIsCollapsed(false);
        return;
      } catch (err) {
        console.warn("requestFullscreen failed, falling back to CSS", err);
      }
    }

    // CSS fallback fullscreenille - tätä käytetään, jos Fullscreen API ei ole saatavilla tai epäonnistuu
    el.classList.add("cw-fullscreen");
    document.body.classList.add("chat-window-fullscreen");
    setIsFullscreen(true);
    setIsCollapsed(false);
  };

  //Muuttuja keskusteluhistorialle
  const [chatHistory, setChatHistory] = useState([]);

  // Autoscroll whenever chatHistory updates
  useEffect(() => {
    if (bottomOfChat && bottomOfChat.current) {
      bottomOfChat.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatHistory]);

  // teema light dark hook
  const { theme, toggleTheme } = useTheme();

  // UUsi API URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  //haetaan backendin OpenAi apin kautta vastauksia tekoälyltä
  const generateBotResponse = async (userMessage) => {
    try {
      const response = await fetch(`${API_URL}/api/chat/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      //Tekoälyn vastaus ja jos tulee virhe, niin tulostetaan virheviesti
      const data = await response.json();
      const { criteria, count, products = [], domainMessage } = data;
      console.log("Hakusanat backendistä: ", criteria);

      // Jos ei yksikään kriteeri täyty, palautetaan domainMessage
      if (domainMessage) {
        return domainMessage;
      }

      // jos ei brändiä tunnistettu
      /*if (!criteria?.brand) {
          return "En tunnistanut brändiä. Kokeile esim. 'Näytä LG:n televisiot'.";
        }*/

      //jos ei tunnista hakusanoja tai millään hakusanalla ei löydy tuotteita
      if (!criteria) {
        return "En tunnistanut antamiasia hakuehtoja. Kokeile esim. 'Näytä xxxx'.";
      }
      if (count === 0) {
        let hakusanat = [];
        if (criteria.brand) hakusanat.push(criteria.brand);
        if (criteria.budgetMax) hakusanat.push(`alle ${criteria.budgetMax} €`);
        //tuumakokojen tulostuslogiikka, onko haku tietyltä väliltä vai onko onko tietty koko
        if (criteria.sizeMin && criteria.sizeMax) {
          if (criteria.sizeMin === criteria.sizeMax) {
            hakusanat.push(`koko ${criteria.sizeMin}”`);
          } else {
            hakusanat.push(`koko ${criteria.sizeMin}”-${criteria.sizeMax}”`);
          } 
        } else if (criteria.sizeMin) {
            hakusanat.push(`koko yli ${criteria.sizeMin}”`);
          } else if (criteria.sizeMax) {
            hakusanat.push(`koko alle ${criteria.sizeMax}”`);
          }

        return `Ei löytynyt tuotteita (${hakusanat.join(", ")}).`;
      }

      //hakusanat
      let hakusanat = [];
      if (criteria.brand) hakusanat.push(criteria.brand);
      if (criteria.budgetMax) hakusanat.push(`alle ${criteria.budgetMax} €`);
      if (criteria.sizeMin && criteria.sizeMax) {
      if (criteria.sizeMin === criteria.sizeMax) {
        hakusanat.push(`koko ${criteria.sizeMin}”`);
      } else {
        hakusanat.push(`koko ${criteria.sizeMin}”-${criteria.sizeMax}”`);
      }
    } else if (criteria.sizeMin) {
      hakusanat.push(`koko yli ${criteria.sizeMin}”`);
    } else if (criteria.sizeMax) {
      hakusanat.push(`koko alle ${criteria.sizeMax}”`);
    }

      // asetetaan tekstivastaus
      // const examples = products.slice(0, 2).map((p) => `${p.name} (${p.price} €)`);
      const text = `Löytyi ${count} tuotetta (${hakusanat.join(
        ", "
      )}). Tuotteet näkyvät alla olevassa listassa.`;

      //palautetaan objekti, jossa tekstivastaus ja tuotteet
      return { text, products };
    } catch (error) {
      console.error("Virhe OpenAi-yhteydessä", error);
      return "Virhe yhteydessä palvelimeen";
    }
  };

  return (
    //Chat-ikkunan div, voidaan pienentää ja laajentaa keskustelualue
    <div
      ref={rootRef}
      className={`chat-window ${isCollapsed ? "collapsed" : ""} ${
        isFullscreen ? "is-fullscreen" : ""
      }`}
    >
      <div className="chat-header">
        <h2 id="chat-h2">AIVA-chatbot</h2>

        <ChatSettings
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
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

        {/* Autoscroll sentinel div, this should be invisible */}
        <div ref={bottomOfChat} />
      </div>

      {/* Keskustelualueen alaosassa on input-alue*/}
      <div className="chat-footer">
        <ChatForm
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          generateBotResponse={generateBotResponse}
        />
      </div>
      {/* Chatin avaamispainike kun suljettu - käyttää Aiva-ikonia. */}
      {isCollapsed && (
        <button
          className="chat-open-button"
          onClick={toggleCollapse}
          aria-label="Open chat"
          title="Open chat"
        >
          <img src={aivaIcon} alt="Open chat" className="chat-open-icon" />
        </button>
      )}
    </div>
  );
}

export default ChatWindow;
