// Traduction automatique et affichage d'une bulle popup identique à la fenêtre extension
const BACKEND_URL = "http://localhost:3000/translate";
const DEFAULT_TARGET_LANG = "FR";

// Variables globales
let bubble = null;
let translateButton = null;
let currentTranslation = '';
let currentSelectedText = '';
let isClickingButton = false;

// Injection des styles
function injectBubbleStyle() {
    if (document.getElementById('translate-bubble-style')) return;

    const style = document.createElement('style');
    style.id = 'translate-bubble-style';
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap');
        
        .translate-bubble {
            position: fixed;
            z-index: 99999;
            background: #f5f0ff;
            color: #2d1e4a;
            border: 2.5px solid #7c3aed;
            border-radius: 18px;
            box-shadow: 0 4px 24px rgba(124, 58, 237, 0.13);
            padding: 20px 18px 14px 18px;
            font-size: 1em;
            max-width: 400px;
            min-width: 140px;
            max-height: 60vh;
            overflow-y: auto;
            pointer-events: auto;
            transition: opacity 0.2s;
            opacity: 0.98;
            cursor: default;
            display: none;
            font-family: 'Quicksand', Arial, sans-serif;
        }
        
        .translate-bubble .close-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 24px;
            height: 24px;
            background: #f5f0ff;
            border: 2px solid #7c3aed;
            border-radius: 50%;
            color: #7c3aed;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 100;
            transition: all 0.2s ease;
            padding: 0;
            line-height: 1;
        }

        .translate-bubble .close-btn:hover {
            background: #7c3aed;
            color: #fff;
            transform: scale(1.1);
        }

        .translate-bubble h3 {
            margin: 0 0 12px 0;
            font-size: 1.25em;
            color: #7c3aed;
            letter-spacing: 0.5px;
            font-weight: 700;
            display: flex;
            align-items: center;
        }

        .translate-bubble .fa-language {
            margin-right: 8px;
            font-size: 1.2em;
            color: #5b21b6;
        }

        .translate-bubble label {
            display: block;
            font-size: 0.95em;
            color: #6d5a99;
            margin-bottom: 4px;
        }

        .translate-bubble select {
            width: 100%;
            padding: 7px 10px;
            border-radius: 8px;
            border: 1.5px solid #e9d5ff;
            background: #fff;
            margin-bottom: 14px;
            font-size: 0.95em;
            color: #2d1e4a;
            font-family: inherit;
        }

        .translate-bubble .selected-text {
            background: #fff7e6;
            border-radius: 8px;
            border: 1.5px solid #ffd580;
            padding: 10px 12px;
            margin-bottom: 10px;
            font-size: 0.95em;
            color: #2d1e4a;
            word-break: break-word;
        }

        .translate-bubble .result {
            background: #fff;
            border-radius: 8px;
            border: 1.5px solid #e9d5ff;
            padding: 12px 14px;
            min-height: 32px;
            font-size: 1em;
            color: #5b21b6;
            box-shadow: 0 1px 6px rgba(124, 58, 237, 0.07);
            margin-bottom: 8px;
            word-break: break-word;
        }

        .translate-bubble .copy-btn {
            display: inline-block;
            background: #7c3aed;
            color: #fff;
            border: none;
            border-radius: 7px;
            padding: 7px 18px;
            font-size: 0.95em;
            cursor: pointer;
            font-family: inherit;
            font-weight: 500;
            letter-spacing: 0.2px;
            transition: all 0.2s ease;
        }

        .translate-bubble .copy-btn:hover {
            background: #6d28d9;
            transform: translateY(-1px);
        }

        .translate-bubble .source-lang {
            font-size: 0.9em;
            color: #6d5a99;
            margin-bottom: 4px;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
}

// Gestion du bouton Traduire
function showTranslateButton(x, y) {
    if (!translateButton) {
        translateButton = document.createElement('button');
        translateButton.textContent = 'Traduire';
        Object.assign(translateButton.style, {
            position: 'fixed',
            zIndex: '999999',
            background: '#7c3aed',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: "'Quicksand', Arial, sans-serif",
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
            transition: 'all 0.2s ease',
            display: 'none'
        });
        document.body.appendChild(translateButton);

        // Effet hover
        translateButton.addEventListener('mouseenter', () => {
            translateButton.style.background = '#6d28d9';
            translateButton.style.transform = 'translateY(-1px)';
            translateButton.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.4)';
        });
        translateButton.addEventListener('mouseleave', () => {
            translateButton.style.background = '#7c3aed';
            translateButton.style.transform = 'none';
            translateButton.style.boxShadow = '0 2px 8px rgba(124, 58, 237, 0.3)';
        });

        // Events
        translateButton.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            isClickingButton = true;
        });

        translateButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            translateAndShowBubble(currentSelectedText, x + 20, y + 20);
            hideTranslateButton();
        });
    }

    translateButton.style.left = (x + 5) + 'px';
    translateButton.style.top = (y + 5) + 'px';
    translateButton.style.display = 'block';
}

function hideTranslateButton() {
    if (translateButton) {
        translateButton.style.display = 'none';
    }
}

// Gestion de la bulle de traduction
function showBubble(selectedText, x, y, translation = '', sourceLang = '', targetLang = DEFAULT_TARGET_LANG) {
    injectBubbleStyle();

    if (!bubble) {
        bubble = document.createElement('div');
        bubble.className = 'translate-bubble';
        document.body.appendChild(bubble);
    }

    bubble.innerHTML = `
        <button class="close-btn" title="Fermer">&times;</button>
        <h3><i class="fa-solid fa-language"></i>Traduction</h3>
        <label for="bubble-lang-select">Langue cible :</label>
        <select id="bubble-lang-select">
            <option value="FR">🇫🇷 Français</option>
            <option value="EN">🇬🇧 Anglais</option>
            <option value="ES">🇪🇸 Espagnol</option>
            <option value="DE">🇩🇪 Allemand</option>
            <option value="IT">🇮🇹 Italien</option>
            <option value="PT">🇵🇹 Portugais</option>
            <option value="NL">🇳🇱 Néerlandais</option>
            <option value="PL">🇵🇱 Polonais</option>
            <option value="RU">🇷🇺 Russe</option>
            <option value="JA">🇯🇵 Japonais</option>
            <option value="ZH">🇨🇳 Chinois</option>
        </select>
        <div class="selected-text">${selectedText}</div>
        <div class="source-lang" style="${sourceLang ? '' : 'display:none'}">${sourceLang ? `Langue détectée : ${sourceLang}` : ''}</div>
        <div class="result">${translation || 'Traduction en cours…'}</div>
        <button class="copy-btn" style="${translation ? '' : 'display:none'}">Copier la traduction</button>
    `;

    // Event listeners
    bubble.addEventListener('mousedown', e => e.stopPropagation());
    bubble.addEventListener('click', e => e.stopPropagation());

    const closeBtn = bubble.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            isClickingButton = true;
        });
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            hideBubble();
            window.getSelection().removeAllRanges();
        });
    }

    const langSelect = bubble.querySelector('#bubble-lang-select');
    langSelect.value = targetLang;
    langSelect.addEventListener('change', () => {
        translateAndShowBubble(selectedText, x, y, langSelect.value);
    });

    const copyBtn = bubble.querySelector('.copy-btn');
    if (copyBtn && translation) {
        copyBtn.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            isClickingButton = true;
        });
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            navigator.clipboard.writeText(translation);
            copyBtn.textContent = 'Copié !';
            setTimeout(() => { copyBtn.textContent = 'Copier la traduction'; }, 1200);
        });
    }

    // Positionnement
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
    bubble.style.display = 'block';

    // Ajustement si débordement
    setTimeout(() => {
        const rect = bubble.getBoundingClientRect();
        let newLeft = x, newTop = y;

        if (rect.right > window.innerWidth) {
            newLeft = window.innerWidth - rect.width - 10;
        }
        if (rect.bottom > window.innerHeight) {
            newTop = window.innerHeight - rect.height - 10;
        }

        bubble.style.left = Math.max(10, newLeft) + 'px';
        bubble.style.top = Math.max(10, newTop) + 'px';
    }, 0);
}

function hideBubble() {
    if (bubble) {
        bubble.style.display = 'none';
    }
}

// Traduction
async function translateAndShowBubble(selectedText, x, y, targetLang = DEFAULT_TARGET_LANG) {
    showBubble(selectedText, x, y, '', '', targetLang);

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: selectedText, target_lang: targetLang })
        });

        const data = await response.json();

        if (data.translation) {
            currentTranslation = data.translation;
            showBubble(selectedText, x, y, data.translation, data.source_lang, targetLang);
        } else {
            currentTranslation = '';
            showBubble(selectedText, x, y, 'Erreur de traduction', '', targetLang);
        }
    } catch (e) {
        currentTranslation = '';
        showBubble(selectedText, x, y, 'Erreur de connexion', '', targetLang);
    }
}

// Event listener principal
document.addEventListener('mouseup', function (event) {
    if (isClickingButton) {
        isClickingButton = false;
        return;
    }

    const selection = window.getSelection().toString().trim();

    if (selection.length > 0) {
        currentSelectedText = selection;
        showTranslateButton(event.clientX, event.clientY);
    } else {
        hideTranslateButton();
        if (!event.target.closest('.translate-bubble')) {
            hideBubble();
        }
    }
});
