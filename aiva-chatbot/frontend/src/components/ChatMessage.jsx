//ChatMessage-komponentti määrittää, miten  yksittäinen chat-viesti näytetään keskustelualueella

import React from "react";
import aivaIcon from "../images/aiva.png";  
import ProductList from "./ProductList";

const ChatMessage = ({chat}) => {
    return (
        <div className={`chat-message ${chat.role === "bot" ? 'bot' : 'user'}`}>

            {/* Jos rooli on bot, näytetään Aiva-ikoni */}
            {chat.role === "bot" && <img src={aivaIcon} alt="aiva-bot" className="chat-icon" />}
            
            {/* määritellään viestikupla roolin mukaan, ja chatWindow.css:ssä on tarkemmin määritelty viestikuplien visuaaliset ohjeet */}
            <div className={`chat-bubble ${chat.role === "bot" ? 'bot-bubble' : 'user-bubble'}`}>{chat.text}
                {/*Jos vastauksessa palautetaan tuotteita, niin ne näytetään ProductListin mukaisesti*/}
                {chat.products && chat.products.length > 0 && (
                /*<div>*/
                    <ProductList products={chat.products} />
                /*</div>*/
                )}
            </div>
        </div>
    );
};

export default ChatMessage;