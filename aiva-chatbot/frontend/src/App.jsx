import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import ChatWindow from "./components/ChatWindow";
import ProductSearch from "./components/ProductSearch";
import Footer from "./components/footer";

import Veera_avatar from "./images/Veera_avatar.png";
import viljami_avatar from "./images/viljami_avatar.jpg";
import mikael_avatar from "./images/mikael_avatar.png";
import team_member from "./images/team_member.png"

function App() {
  return (
    <div className="App">
      <Navbar />

      <div id="projekti">
        <div id="esittelykappale">
          <h2>Projekti:<br></br> Tekoälyavusteinen chatbot tuotteiden hakemiseen</h2>
          <p>
            Ryhmämme ViVeMiKa valitsi sovelluskehitysprojektin aiheeksi
            tekoälyavusteisen chatbotin tuotteiden hakemiseen, sillä halusimme
            harjoitella chatbotin tekemisstä ja tekoälyn hyödyntämistä sovelluksissa.
          </p>
        </div>
        <div id="ryhma">
          <h2>Tiimi: ViVeMiKa</h2>
          <p>ViVeMiKa koostuu neljästä it-tradenomi-opiskelijasta.</p>
          <ul className="ryhmalaiset">
            <li className="hlo">
              <h3>Viljami</h3>
              <p className="esittelyteksti">
                Olen Viljami Viinikainen, yrittäjätaustainen IT-alan opiskelija.
                Tässä projektissa vastuullani oli tietokanta ja backend sekä
                autoin pienissä määrin myös frontendissä. Tavoitteenani on
                kehittyä ohjelmistokehittäjänä ja työllistyä IT-alalle.
              </p>
              <img src={viljami_avatar} alt="kuva" className="hlo_kuva" />
            </li>
            <li className="hlo">
              <h3>Veera</h3>
              <p className="esittelyteksti">
                Olen wannabe-it-nörtti sosiaalialalta, joka vasta ihmettelee ja
                opettelee koodaamista. Tällä hetkellä erikoisalana on
                spaghettikoodin tekeminen ja toimivien ratkaisujen rikkominen.
                Tulevaisuudessa tavoitteeni on kehittää digitaalisia palveluita
                ja sovelluksia, jotka helpottavat sote-alan työtä.
              </p>
              <img
                src={Veera_avatar}
                alt="blond-haired woman coding"
                className="hlo_kuva"
              />
            </li>
            <li className="hlo">
              <h3>Mikael</h3>
              <p className="esittelyteksti">Myyntitaustainen tulevaisuuden IT-osaaja.
                Olen fronttimielinen koodaajan alku, joka huomaa löytävänsä itsensä
                yhä useammin backendin puolelta. Tavoitteenani on kehittää ammatillisia
                taitojani ja osaamistani käytännönläheisissä projekteissa, 
                monipuolistaen IT-alan taitojani.
              </p>
              <img src={mikael_avatar} alt="Picture of a man working on a computer" className="hlo_kuva" />
            </li>
            <li className="hlo">
              <h3>Kauri</h3>
              <p className="esittelyteksti">Olen IT-tradenomiopiskelija, jolla on kovasti kiinnostusta webdevauksen suuntaan.
                Tässä projektissa työskentelin frontin puolella, tavoitteenani tuottaa responsiivinen ja toimiva sivusto.
                Kehitän yhä taitojani ja projektin aikana tuli opittua paljon uutta!
              </p>
              <img src={team_member} alt="Image of an anonymous user" className="hlo_kuva" />
            </li>
          </ul>
        </div>
        <div className="perustuotehaku">
        <h3>
          Täällä voit testata tuotteiden hakemista nimellä
          harjoittelutietokannasta:
        </h3>
        <ProductSearch />
        </div>
      
      </div>



      <ChatWindow />

      <Footer />
    </div>
  );
}

export default App;
