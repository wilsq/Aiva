// Tämä komponentti renderöi chatin asetuspainikkeet chat-header-osioon
// Stateless-komponentti, jonka logiikka ja tila hallitaan ChatWindow-komponentissa.

// Tärkeää: jos saat varoituksen puuttuvista React-importeista, niin käytä npm install puuttuvien pakettien asentamiseen.
import React from 'react';
import { FaExpand, FaCompress } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import { SlArrowDown } from 'react-icons/sl';

export default function ChatSettings({
  isCollapsed,
  onToggleCollapse,
  isFullscreen,
  onToggleFullscreen,
  theme,
  onToggleTheme,
}) {
  // Renderöi kolme painiketta: teeman vaihtaminen, keskusteluikkunan kutistaminen/laajentaminen ja koko näytön tila.
  // aria-pressed merkinnät ovat näytönlukijoita varten
  return (
    <div className="chat-settings" role="group" aria-label="Chat settings">
      <button
        type="button"
        className="chat-settings-btn"
        onClick={onToggleTheme}
        aria-pressed={theme === 'light'}
        aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
      >
        {theme === 'light' ? <FiMoon /> : <FiSun />}
      </button>

      <button
        type="button"
        className={`chat-settings-btn ${isFullscreen ? 'hide-settings' : ''}`}
        onClick={onToggleCollapse}
        aria-pressed={isCollapsed}
        aria-label={isCollapsed ? 'Expand chat' : 'Collapse chat'}
        title={isCollapsed ? 'Expand chat' : 'Collapse chat'}
      >
        <SlArrowDown />
      </button>

      <button
        type="button"
        className="chat-settings-btn"
        onClick={onToggleFullscreen}
        aria-pressed={isFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <FaCompress /> : <FaExpand />}
      </button>
    </div>
  );
}
