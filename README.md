# API Documentation

## Introduction
Cette API permet la gestion des utilisateurs, des matchs et des actualités. Elle comprend des endpoints pour l'authentification, la gestion des utilisateurs, la création et la modification des matchs, ainsi que la gestion des actualités.

## Base URL
```
http://localhost:PORT
```

## Authentification

### Inscription
**POST** `/auth/register`

**Body:**
```json
{
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "password": "string"
}
```

### Connexion
**POST** `/auth/login`

**Body:**
```json
{
    "email": "string",
    "password": "string"
}
```

## Utilisateurs

### Récupérer tous les utilisateurs
**GET** `/users`

### Récupérer un utilisateur par ID
**GET** `/users/:id_user`

### Ajouter un utilisateur (optionnel pour un admin)
**POST** `/users/addUser`

### Valider un utilisateur
**POST** `/users/validateUser/:id_user`

**Body:**
```json
{
    "role": "string"
}
```

## Matchs

### Créer un match
**POST** `/matchs/create`

**Body:**
```json
{
    "date": "DATE",
    "opponent": "string"
}
```

### Mettre à jour un match
**PATCH** `/matchs/update/:id`

**Body:**
```json
{
    "date": "DATE",
    "opponent": "string",
    "score": "string"
}
```

### Récupérer tous les matchs
**GET** `/matchs`

### Récupérer un match par ID
**GET** `/matchs/:id`

### Rejoindre un match
**POST** `/matchs/:matchId/join`

### Quitter un match
**DELETE** `/matchs/:matchId/leave/:userId`

## Actualités

### Créer une actualité
**POST** `/news/create`

**Body:**
```json
{
    "date": "DATE",
    "title": "string",
    "content": "string"
}
```

### Récupérer toutes les actualités
**GET** `/news`

### Récupérer une actualité par ID
**GET** `/news/:id`

---

## Notes
- Assurez-vous d'envoyer les données au format JSON.
- Les routes nécessitant une authentification doivent inclure un token d'autorisation (à préciser selon l'implémentation).
- Les dates doivent être au format ISO 8601 ou un format attendu par le serveur.

---

## Auteur
Développé par DEZITTER Mathys
