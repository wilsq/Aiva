//Chat-form-komponentti tallentaa käyttäjän syötteen ja hakee tekoälyltä tietoa
import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
    const inputRef = useRef(); //UseRef viittaa input-kenttään

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        //haetaan käyttäjän syöte input-kentästä 
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;

        //tyhjentää inputin
        inputRef.current.value = "";

        //Päivittää chatkeskustelun käyttäjän syötteellä
        setChatHistory((prev) => [...prev, { role: "user", text: userMessage}]);

        //Asettaa botin vastauksen
        //Aiva miettii hetken, asetetaan miettimisviesti keskusteluhistoriaan
        const miettiiViesti = { role: "bot", text: "Anna kun mietin hetken..."}
        setChatHistory((prev) => [...prev, miettiiViesti]);

        //funktio botin vastauksen hakemiseksi tekoälyltä
        const tekoalyVastaus = await generateBotResponse(userMessage); 

        //korvataan keskusteluhistoriassa miettii-teksti ai:n vastauksella, jottei miettii-viesti jäisi keskusteluun pysyvästi näkyville
        setChatHistory((prev) => {
            const updated = [...prev];
            updated[updated.length -1] = { role: "bot", text: tekoalyVastaus };
            return updated;
        });

    };

    return (
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input ref={inputRef} type="text" placeholder="Kirjoita kysymys" className="message-input" required />
            <button className="chat-button"><span className="material-icons">arrow_upward</span></button>
        </form>
    );
};

export default ChatForm;
