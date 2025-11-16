import { useState } from 'react'
import './App.css';
import Navbar from "./components/Navbar"
import ChatWindow from "./components/ChatWindow"
import ProductSearch from './components/ProductSearch';
import Footer from './components/footer';

import Veera_avatar from "./images/Veera_avatar.png";

function App(){
  return (
    <div className='App'>
      <Navbar/>

      <div id='projekti'>
      <div id='esittelykappale'>
      <h2>Projekti: Tekoälyavusteinen chatbot tuotteiden hakemiseen</h2>
      <p>Ryhmämme ViVeMiKa valitsi sovelluskehitysprojektin aiheeksi tekoälyavusteisen chatbotin tuotteiden hakemiseen, sillä halusimme harjoitella chatbotin tekemisstä ja tekoälyn hyödyntämistä chatbotissa.</p>
      </div>
      <div id='ryhma'>
        <h2>Tiimi: ViVeMiKa</h2>
        <p>ViVeMiKa koostuu neljästä it-tradenomi-opiskelijasta.</p>
        <ul className='ryhmalaiset'>
          <li className='hlo'>
            <h3>Viljami</h3>
            <p className='esittelyteksti'>Esittelyteksti</p>
            <img src='#' alt='kuva' className='hlo_kuva' />
          </li>
          <li className='hlo'>
            <h3>Veera</h3>
            <p className='esittelyteksti'>Olen wannabe-it-nörtti sosiaalialalta, joka vasta ihmettelee ja opettelee koodaamista. Tällä hetkellä erikoisalana on spaghettikoodin tekeminen ja toimivien ratkaisujen rikkominen. Tulevaisuudessa tavoitteeni on kehittää digitaalisia palveluita ja sovelluksia, jotka helpottavat sote-alan työtä.</p>
            <img src={Veera_avatar} alt='blond-haired woman coding' className='hlo_kuva' />          
          </li>
          <li className='hlo'>
            <h3>Mikael</h3>
            <p className='esittelyteksti'>Esittelyteksti</p>
            <img src='#' alt='kuva' className='hlo_kuva' />
          </li>
          <li className='hlo'>
            <h3>Kauri</h3>
            <p className='esittelyteksti'>Esittelyteksti</p>
            <img src='#' alt='kuva' className='hlo_kuva' />
          </li>
        </ul>
      </div>
      </div>

      <div className='perustuotehaku'>
        <h3>Täällä voit testata tuotteiden hakemista nimellä harjoittelutietokannasta:</h3>
        <ProductSearch />
      </div>

      <ChatWindow />


      <Footer />
    </div>
  );
}

export default App;
