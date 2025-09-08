# Instant Translate Selection 🌍

Une extension de navigateur élégante pour traduire instantanément le texte sélectionné sans quitter votre page.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Fonctionnalités

- 🚀 Traduction instantanée du texte sélectionné
- 🎯 Interface minimaliste et élégante
- 🔄 Détection automatique de la langue source
- 📋 Copie rapide de la traduction
- 🎨 Design moderne avec thème violet
- 🌐 Support de multiples langues :
  - 🇫🇷 Français
  - 🇬🇧 Anglais
  - 🇪🇸 Espagnol
  - 🇩🇪 Allemand
  - 🇮🇹 Italien
  - 🇵🇹 Portugais
  - 🇳🇱 Néerlandais
  - 🇵🇱 Polonais
  - 🇷🇺 Russe
  - 🇯🇵 Japonais
  - 🇨🇳 Chinois

## 🚀 Installation

1. Clonez ce dépôt :
```bash
git clone https://github.com/PASCAL-ION/translate_plugin.git
```

2. Installez les dépendances du backend :
```bash
cd translate_plugin/backend
npm install
```

3. Configurez vos variables d'environnement :
   - Créez un fichier `.env` dans le dossier `backend`
   - Ajoutez votre clé API DeepL :
```env
DEEPL_API_KEY=votre_clé_api_ici
```

4. Lancez le serveur backend :
```bash
npm start
```

5. Chargez l'extension dans votre navigateur :
   - Ouvrez Chrome/Edge
   - Allez dans le gestionnaire d'extensions
   - Activez le "Mode développeur"
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier du projet

## 🎯 Utilisation

1. Sélectionnez n'importe quel texte sur une page web
2. Une bulle de traduction apparaîtra automatiquement
3. Choisissez la langue cible dans le menu déroulant
4. Utilisez le bouton de copie pour copier la traduction
5. Fermez la bulle avec le bouton × quand vous avez terminé

## 🛠 Technologies Utilisées

- Frontend :
  - JavaScript vanilla
  - CSS3 avec Flexbox
  - Police Quicksand de Google Fonts

- Backend :
  - Node.js
  - Express
  - API DeepL pour les traductions

## 🎨 Personnalisation

Le design utilise une palette de couleurs violettes modernes :
- Principal : `#7c3aed`
- Secondaire : `#5b21b6`
- Fond : `#f5f0ff`
- Texte : `#2d1e4a`

## 📝 License

MIT License - Copyright (c) 2025

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou proposer une pull request.

## 🔮 Prochaines Fonctionnalités

- [ ] Support de langues additionnelles
- [ ] Historique des traductions
- [ ] Mode sombre
- [ ] Raccourcis clavier personnalisables

---

Créé par PASCAL-ION
