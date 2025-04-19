# SynapseOS - Système de suivi de bien-être personnel

SynapseOS est une application de suivi de bien-être personnel qui collecte des données via Telegram et les présente dans une interface web intuitive.

## Architecture

Le projet est divisé en deux parties principales :

1. **Backend (FastAPI)** : API REST connectée à MongoDB qui expose les données collectées
2. **Frontend (ReactJS)** : Interface utilisateur pour visualiser les données et les statistiques

### Flux de données

```
Telegram Bot -> n8n workflows -> MongoDB <- FastAPI <- React Frontend
```

## Configuration

### Prérequis

- Python 3.7+
- Node.js 14+
- MongoDB (local ou distant)

### Variables d'environnement

Backend (fastapi/.env) :
```
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=SynapseOS
```

Frontend (front/.env) :
```
REACT_APP_API_URL=http://localhost:8000
```

## Installation

### Backend

```bash
cd fastapi
pip install -r requirements.txt
uvicorn main:app --reload
```

L'API sera disponible sur http://localhost:8000

### Frontend

```bash
cd front
npm install
npm start
```

L'interface sera disponible sur http://localhost:3000

## Structure des données

SynapseOS utilise trois collections MongoDB :

1. **SynapseOS** : Entrées brutes de Telegram
2. **SynapseOS-notation** : Notes journalières par catégorie
3. **SynapseOS-output** : Recommandations générées par l'IA

## API Endpoints

### Notations

- `GET /notations/{name}` - Récupérer les notations d'un utilisateur
- `POST /notations/` - Créer une nouvelle notation
- `GET /notations/stats/{name}` - Obtenir des statistiques sur les notations

### Inputs

- `GET /inputs/{name}` - Récupérer les entrées brutes d'un utilisateur
- `POST /inputs/` - Créer une nouvelle entrée
- `GET /inputs/latest/{name}` - Obtenir la dernière entrée d'un utilisateur

### AI Outputs

- `GET /ai-output/{name}` - Récupérer les recommandations IA pour un utilisateur
- `POST /ai-output/` - Créer une nouvelle recommandation IA
- `GET /ai-output/latest/{name}` - Obtenir la dernière recommandation IA pour un utilisateur

## Fonctionnalités Front-end

- Graphique radar des notes du jour
- Graphiques de tendance pour chaque catégorie
- Affichage des recommandations IA
- Journal des entrées brutes de Telegram 