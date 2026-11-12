# Lemme

Application mobile (PWA) pour apprendre et réviser les mathématiques des concours
(CPGE, agrégation) : découverte des théorèmes, hypothèses, démonstrations, pièges,
puis révision espacée quotidienne avec série de jours.

État : **prototype jouable**, deux chapitres : réduction des endomorphismes, puis suites et séries
de fonctions (34 fiches, 102 questions de cours, 22 exercices à étapes, une leçon de prérequis par chapitre).
Le contenu est en attente de relecture par un enseignant.

## Lancer l'application

Aucune installation, aucune étape de compilation.

```bash
python3 -m http.server 8000     # depuis ce dossier
# puis ouvrir http://localhost:8000 (sur téléphone : même réseau, adresse IP de l'ordinateur)
```

Pour l'installer sur l'écran d'accueil et l'utiliser hors ligne, le dossier doit être servi
en HTTPS (n'importe quel hébergement de fichiers statiques convient).

## Organisation

| Dossier ou fichier | Rôle |
| --- | --- |
| `index.html` | Coquille de la page : en-tête, zone d'écran, onglets |
| `css/app.css` | Styles, thèmes clair et sombre |
| `js/engine.js` | Moteur pur : espacement des révisions, série et gels, fusion de progressions |
| `js/text.js` | Mise en forme des textes et des formules (KaTeX) |
| `js/store.js` | Stockage local et synchronisation (adaptateur remplaçable) |
| `js/config.js` | Adresse et clé publique du service de comptes (vides = comptes désactivés) |
| `js/sync-supabase.js` | Connexion par code e-mail et synchronisation avec un projet Supabase |
| `supabase/schema.sql` | Table et règles d'accès de la base de synchronisation |
| `js/app.js` | Interface : écrans, séances, correction |
| `content-src/<chapitre>/cours.js` | **Contenu à éditer** : fiches, leçons et questions de cours |
| `content-src/<chapitre>/complements.js` | Exemples, prérequis et démonstrations complètes de chaque fiche |
| `content-src/<chapitre>/prerequis.js` | Leçon facultative de prérequis du chapitre |
| `content-src/<chapitre>/exercices.js` | Exercices d'application à étapes, par niveau croissant |
| `content/` | Contenu généré, tous chapitres réunis (`contenu.json` pour l'échange, `contenu.js` chargé par la page) |
| `tools/build-content.js` | Vérifie le contenu (structure, LaTeX) et génère `content/` |
| `tests/engine.test.js` | Tests automatiques du moteur |
| `.github/workflows/` | Intégration continue (tests, contenu) et déploiement sur GitHub Pages |
| `sw.js`, `manifest.webmanifest`, `icons/` | Installation et fonctionnement hors ligne |
| `vendor/katex/` | KaTeX 0.16, embarqué pour le hors-ligne |

## Commandes

```bash
node --test                    # tests du moteur
node tools/build-content.js    # après toute modification de content-src/
```

Après une modification du code ou du contenu, changer `VERSION` dans `sw.js`
pour que les appareils déjà installés récupèrent la nouvelle version.

## Ajouter du contenu

Tout se passe dans `content-src/` (le format est décrit en tête de chaque fichier).
Règles :

- chaque notion cite sa source (`source`) ; chaque question renvoie à une notion ;
- les identifiants ne changent jamais une fois publiés : la progression des utilisateurs y est attachée ;
- pour un nouveau chapitre : créer son dossier dans `content-src/`, préfixer tous ses identifiants,
  puis l'ajouter à la liste `CHAPTERS` de `tools/build-content.js` ;
- `node tools/build-content.js` refuse tout contenu invalide (identifiant en double,
  réponse hors limites, formule LaTeX qui ne compile pas).

## Synchronisation

`js/store.js` écrit d'abord sur l'appareil, puis fusionne avec le compte quand un service de
synchronisation est branché. Tant que `js/config.js` est vide, les comptes sont désactivés et la
progression reste sur l'appareil.

### Activer la synchronisation

Le service utilisé est Supabase (base PostgreSQL et comptes), avec un projet hébergé en Europe.

1. Créer un projet sur supabase.com en choisissant une région européenne (Paris, Francfort…).
2. Dans l'éditeur SQL du projet, exécuter le contenu de `supabase/schema.sql`.
3. Dans Authentication > URL Configuration, mettre l'adresse du site dans « Site URL »
   (par exemple `https://ealemun.github.io/lemme/`) : c'est là que le lien de connexion ramène.
4. Dans Project Settings > API, copier l'adresse du projet et la clé publique dans `js/config.js`.
   Ne jamais y mettre la clé `service_role` / `secret`.

La connexion se fait sans mot de passe, par un e-mail contenant un lien : en l'ouvrant, on revient
sur l'application, connecté. À la première connexion, la progression de l'appareil est fusionnée
avec celle du compte.

Le lien ouvre le navigateur par défaut : sur iPhone, une application installée sur l'écran
d'accueil ne partage pas sa session avec Safari. Pour ce cas, l'application accepte aussi un code
à saisir : il suffit que le modèle d'e-mail « Magic Link » contienne `{{ .Token }}` (modification
du modèle possible seulement avec un service d'envoi d'e-mails personnalisé sur l'offre gratuite).

Limites à connaître : l'envoi d'e-mails intégré à Supabase est limité à quelques messages par
heure (brancher un service d'envoi pour un usage réel) ; la suppression complète d'un compte se
fait depuis le tableau de bord Supabase.

Pour brancher un autre serveur, fournir à `LemmeStore.init()` un adaptateur à trois fonctions :
`connect()`, `pull()`, `push()`.

## Intégration et déploiement continus

- `ci.yml` : à chaque envoi et à chaque demande de fusion, lance les tests du moteur, vérifie le
  contenu (structure et LaTeX) et contrôle que `content/` est bien à jour.
- `deploy.yml` : à chaque envoi sur `main`, publie le site sur GitHub Pages
  (à activer une fois dans Settings > Pages > Source : « GitHub Actions »).

## Limites connues du lot 0

- Stockage local dans `localStorage` (IndexedDB prévu ensuite).
- Pas encore de notifications de rappel, de mode examen, ni de bouton de signalement.
- Formats de questions disponibles : choix unique, choix multiples, vrai ou faux,
  démonstration à ordonner, carte de restitution, exercice à étapes.
- Effacer la progression n'efface pas celle d'un autre appareil non synchronisé depuis.
