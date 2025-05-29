# StreamManagerMVP

Une application web sécurisée pour gérer et visionner des streams Twitch, avec authentification via fonctions serverless.

## Fonctionnalités

- Authentification sécurisée via Twitch OAuth avec backend serverless
- Gestion des tokens d'accès côté serveur pour une sécurité accrue
- Affichage d'une liste de streamers prédéfinis
- Intégration du lecteur Twitch et du chat pour chaque streamer
- Rotation automatique entre les streams toutes les 20 secondes
- Volume du lecteur automatiquement réglé à 5%
- Stockage des données utilisateur avec Supabase

## Technologies utilisées

- HTML, CSS, JavaScript
- API Twitch
- Netlify Functions (serverless)
- Supabase pour le stockage des données
- Déployé sur Netlify

## Installation et développement local

1. Clonez ce dépôt
2. Installez les dépendances avec `npm install`
3. Copiez `.env.example` vers `.env` et remplissez les variables d'environnement
4. Lancez le serveur de développement avec `npm run dev`

## Configuration des variables d'environnement

Les variables d'environnement suivantes sont nécessaires pour le fonctionnement de l'application :

- `SUPABASE_URL` : URL de votre projet Supabase
- `SUPABASE_ANON_KEY` : Clé anonyme de votre projet Supabase
- `TWITCH_CLIENT_ID` : ID client de votre application Twitch
- `TWITCH_CLIENT_SECRET` : Secret client de votre application Twitch
- `REDIRECT_URI` : URL de redirection après authentification Twitch
- `FRONTEND_URL` : URL de votre application frontend

## Déploiement

Le projet est configuré pour être déployé sur Netlify. Un fichier `netlify.toml` est inclus pour faciliter le déploiement.

1. Connectez votre dépôt GitHub à Netlify
2. Configurez les variables d'environnement dans les paramètres du projet Netlify
3. Déployez avec `netlify deploy --prod` ou utilisez le déploiement continu via GitHub

## Architecture

L'application utilise une architecture JAMstack avec :
- Frontend statique en HTML/CSS/JavaScript
- Fonctions serverless Netlify pour l'authentification sécurisée
- Supabase comme backend pour le stockage des données

## Licence

MIT
