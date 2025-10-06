import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;
        inputRef.current.value = "";

        //Päivittää chatkeskustelun käyttäjän syötteellä
        setChatHistory((history) => [...history, { role: "user", text: userMessage}]);

        //Asettaa botin vastauksen, tällä hetkellä placeholder-teksti
        setTimeout(() => {
            setChatHistory((history) => [...history, {role: "model", text: "Anna kun mietin hetken..." }]);
            //funktio botin vastauksen hakemiseksi, nyt vielä ei ole tehty
            generateBotResponse([...chatHistory, { role: "user", text: userMessage}]);
        }, 600);
    };

    return (
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input ref={inputRef} type="text" placeholder="Kirjoita kysymys" className="message-input" required />
            <button className="chat-button"><span className="material-icons">arrow_upward</span></button>
        </form>
    );
};

export default ChatForm;
