// Traduction automatique et affichage d'une bulle popup identique à la fenêtre extension
const BACKEND_URL = "http://localhost:3000/translate";
const DEFAULT_TARGET_LANG = "FR";

let bubble = null;
let currentTranslation = '';
let currentSelectedText = '';

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
        box-shadow: 0 4px 24px #7c3aed22;
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
        display: block;
        font-family: 'Quicksand', Arial, sans-serif !important;
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
        }
        .translate-bubble h3 {
            margin-top: 0;
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
            font-size: 1em;
            color: #6d5a99;
            margin-bottom: 2px;
        }
        .translate-bubble select {
            width: 100%;
            padding: 7px 10px;
            border-radius: 8px;
            border: 1.5px solid #e9d5ff;
            background: #fff;
            margin-bottom: 14px;
            font-size: 1.05em;
            color: #2d1e4a;
            font-family: inherit;
        }
        .translate-bubble .selected-text {
            background: #fff7e6;
            border-radius: 8px;
            border: 1.5px solid #ffd580;
            padding: 10px 12px;
            margin-bottom: 10px;
            font-size: 1.04em;
            color: #2d1e4a;
            word-break: break-word;
        }
        .translate-bubble .result {
            background: #fff;
            border-radius: 8px;
            border: 1.5px solid #e9d5ff;
            padding: 12px 14px;
            min-height: 32px;
            font-size: 1.12em;
            color: #5b21b6;
            box-shadow: 0 1px 6px #7c3aed11;
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
            font-size: 1em;
            cursor: pointer;
            font-family: inherit;
            font-weight: 500;
            letter-spacing: 0.2px;
            transition: background 0.2s;
            margin-bottom: 2px;
        }
        .translate-bubble .copy-btn:hover {
            background: #5b21b6;
        }
        .translate-bubble .source-lang {
            font-size: 0.97em;
            color: #5b21b6;
            margin-bottom: 2px;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
}

function showBubble(selectedText, x, y, translation = '', sourceLang = '', targetLang = DEFAULT_TARGET_LANG) {
    injectBubbleStyle();
    if (!bubble) {
        bubble = document.createElement('div');
        bubble.className = 'translate-bubble';
        bubble.onmousedown = e => e.stopPropagation();
        bubble.onclick = e => e.stopPropagation();
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
    // Bouton fermer
    const closeBtn = bubble.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.onmousedown = (e) => {
            e.stopPropagation();
            isClickingButton = true;
        };
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            bubble.style.display = 'none';
            window.getSelection().removeAllRanges();
        };
    }
    // Positionnement intelligent pour rester dans la fenêtre
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
    bubble.style.display = 'block';
    // Après affichage, ajuste si déborde
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

    // Langue select event
    const langSelect = bubble.querySelector('#bubble-lang-select');
    langSelect.value = targetLang;
    langSelect.onchange = () => {
        translateAndShowBubble(selectedText, x, y, langSelect.value);
    };

    // Copier bouton event
    const copyBtn = bubble.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.onmousedown = (e) => {
            e.stopPropagation();
            isClickingButton = true;
        };
        copyBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            navigator.clipboard.writeText(translation);
            copyBtn.textContent = 'Copié !';
            setTimeout(() => { copyBtn.textContent = 'Copier la traduction'; }, 1200);
            window.getSelection().removeAllRanges();
        };
    }
}

function hideBubble() {
    if (bubble) bubble.style.display = 'none';
}

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
let isClickingButton = false;

document.addEventListener('mouseup', function (event) {
    if (isClickingButton) {
        isClickingButton = false;
        return;
    }
    const selection = window.getSelection().toString().trim();
    if (selection.length > 0) {
        const x = event.clientX + 10;
        const y = event.clientY + 10;
        translateAndShowBubble(selection, x, y);
    } else {
        hideBubble();
    }
});
