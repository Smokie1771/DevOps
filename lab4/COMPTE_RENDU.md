# Compte-Rendu - Lab 4 : Continuous Testing

## Objectif du Lab

L'objectif de ce lab était d'apprendre et de pratiquer le **Test-Driven Development (TDD)** dans le contexte d'une application Node.js avec une API REST. Plus précisément :

1. **Utiliser une application User API préparée** et exécuter les tests existants
2. **Créer une fonctionnalité GET user** en utilisant l'approche TDD :
   - Écrire les tests unitaires AVANT d'implémenter le code
   - Créer les tests d'intégration pour l'API REST
   - Implémenter le code pour faire passer les tests

## Application dans le Monde Réel

Le **Continuous Testing** et le **TDD** sont essentiels dans le monde professionnel :

- **Qualité du code** : Les tests garantissent que le code fonctionne comme prévu et préviennent les régressions
- **Documentation vivante** : Les tests servent de documentation du comportement attendu
- **Confiance dans les déploiements** : Avec une suite de tests complète, on peut déployer en production avec confiance
- **Collaboration d'équipe** : Les tests permettent à plusieurs développeurs de travailler sur le même code sans casser les fonctionnalités existantes
- **Refactoring sécurisé** : On peut améliorer le code en sachant que les tests détecteront les problèmes

**Exemples concrets** :
- APIs bancaires où chaque endpoint doit être rigoureusement testé
- Applications e-commerce avec des fonctionnalités critiques (panier, paiement)
- Microservices où les contrats d'API doivent être respectés

## Étape dans le Cycle DevOps

Le **Continuous Testing** se situe dans la phase **CI/CD (Continuous Integration / Continuous Delivery)** du cycle DevOps.

**Justification** :
- **Intégration Continue (CI)** : Les tests sont exécutés automatiquement à chaque commit/push
- **Position dans le pipeline** : 
  ```
  Code → Build → TEST → Deploy → Monitor
  ```
- **Feedback rapide** : Les développeurs sont informés immédiatement si leurs changements cassent quelque chose
- **Gate de qualité** : Aucun code ne peut être mergé ou déployé si les tests échouent

Le testing est le **gardien de la qualité** entre le développement et le déploiement.

## Problèmes Rencontrés et Résolutions

### Problème 1 : Redis non disponible

**Message d'erreur** :
```
Error: Redis connection in broken state: retry aborted.
AbortError: FLUSHDB can't be processed. The connection is already closed.
```

**Analyse** :
- L'application nécessite une base de données Redis pour fonctionner
- Sur Windows, Redis n'est pas installé nativement
- Les tests échouaient car ils ne pouvaient pas se connecter à Redis

**Résolution** :
1. Vérifié que Docker était installé : `docker --version`
2. Lancé un conteneur Docker Redis : `docker run --name redis-lab4 -d -p 6379:6379 redis`
3. Le conteneur expose le port 6379 (port par défaut de Redis)
4. Vérifié la connexion en relançant les tests

**Liens consultés** :
- Documentation Redis : https://redis.io/docs/
- Docker Hub Redis : https://hub.docker.com/_/redis
- Instructions Windows du lab : https://redis.com/ebook/appendix-a/a-3-installing-on-windows/

### Problème 2 : Implémentation TDD de la méthode GET

**Défi** : Implémenter la méthode `get` en suivant l'approche TDD (écrire les tests AVANT le code)

**Processus de résolution** :
1. **Analyse des TODOs** dans le code source pour identifier les emplacements exacts
2. **Étape 1 - Tests unitaires AVANT le code** (`test/user.controller.js`) :
   - Test 1 : `get a user by username` - Créer un utilisateur puis le récupérer
   - Test 2 : `cannot get a user when it does not exist` - Vérifier l'erreur pour un utilisateur inexistant
3. **Étape 2 - Implémentation du contrôleur** (`src/controllers/user.js`) :
   - Utilisation de `db.hgetall(username)` pour récupérer les données Redis
   - Gestion du cas où l'utilisateur n'existe pas (res null)
   - Retour d'erreur appropriée
4. **Étape 3 - Tests API AVANT la route** (`test/user.router.js`) :
   - Test 1 : `successfully get user` - POST pour créer, puis GET pour récupérer (status 200)
   - Test 2 : `cannot get a user when it does not exist` - GET sur utilisateur inexistant (status 404)
5. **Étape 4 - Implémentation de la route REST** (`src/routes/user.js`) :
   - Route `GET /user/:username` avec paramètre URL
   - Appel du contrôleur et gestion des réponses HTTP appropriées

## Finalité du Lab

### ✅ L'objectif du lab est ENTIÈREMENT REMPLI

**Résultats des tests** :
```
Configure
  ✔ load default json configuration file
  ✔ load custom configuration

Redis
  ✔ should connect to Redis

User
  Create
    ✔ create a new user
    ✔ passing wrong user parameters
  Get
    ✔ get a user by username
    ✔ cannot get a user when it does not exist

User REST API
  POST /user
    ✔ create a new user
    ✔ pass wrong parameters
  GET /user
    ✔ successfully get user
    ✔ cannot get a user when it does not exist

11 passing (59ms)
```

**Pourquoi l'objectif est rempli** :

### ✅ Objectif 1 : Utiliser l'application User API préparée et exécuter les tests
- Application installée avec `npm install`
- Tests existants exécutés avec `npm test`
- Serveur démarré avec `npm start` sur port 3000

### ✅ Objectif 2 : Créer la fonctionnalité GET user avec TDD

**2.1 - Contrôleur `get` avec 2 tests unitaires** :
- ✅ Test : "get a user by username" - Vérifie la récupération d'un utilisateur existant
- ✅ Test : "cannot get a user when it does not exist" - Vérifie l'erreur pour utilisateur inexistant
- ✅ Méthode `get(username, callback)` implémentée dans `src/controllers/user.js`

**2.2 - Route GET REST API avec 2 tests d'intégration** :
- ✅ Test : "successfully get user" - Teste GET /user/:username avec succès (HTTP 200)
- ✅ Test : "cannot get a user when it does not exist" - Teste GET avec utilisateur inexistant (HTTP 404)
- ✅ Route `GET /user/:username` implémentée dans `src/routes/user.js`

**Approche TDD respectée** : Tests écrits AVANT le code pour chaque fonctionnalité

## Code Implémenté

### Contrôleur (`src/controllers/user.js`)
```javascript
get: (username, callback) => {
  if(!username)
    return callback(new Error("Username must be provided"), null)
  db.hgetall(username, (err, res) => {
    if (err) return callback(err, null)
    if (res)
      callback(null, res)
    else
      callback(new Error("User not found"), null)
  })
}
```

### Route (`src/routes/user.js`)
```javascript
.get('/:username', (req, resp, next) => {
  const username = req.params.username
  userController.get(username, (err, res) => {
    let respObj
    if(err) {
      respObj = {
        status: "error",
        msg: err.message
      }
      return resp.status(404).json(respObj)
    }
    respObj = {
      status: "success",
      msg: res
    }
    resp.status(200).json(respObj)
  })
})
```

---
**Date** : 4 février 2026  
**Lab** : Continuous Testing - ECE DevOps 2026
