# 💳 Payment Microservice – Hotel Management System
## 📌 Description
Ce microservice gère les paiements dans un système de gestion hôtelière basé sur une architecture microservices et la méthodologie Domain-Driven Design (DDD).  

Il permet :
-Effectuer un paiement
-Consulter un paiement
-Gérer le statut du paiement

## 🛠️ Technologies utilisées

- Python 3.x
- Flask
- Flask-Restx (Swagger)
- MongoDB (Atlas ou Local)
- PyMongo

## ⚙️ Installation complète (Step by Step)
### 1️⃣ Installer Python

#### ➡️ Vérifier Python :
```bash
python --version
```

#### 4️⃣ Installer Flask
```bash
pip install flask
```

#### 5️⃣ Installer Flask-Restx (Swagger)
```bash
pip install flask-restx
```

➡️ Swagger sera disponible automatiquement dans le navigateur.

#### 6️⃣ Installer PyMongo (MongoDB Driver)
```bash
pip install pymongo
```
#### Installer les packages nécessaires pour l'intégration JWT et sécurité
```bash
pip install Flask-JWT-Extended bcrypt python-dotenv cryptography
```
▶️ Lancer le microservice
```bash
python app.py
```

✅ Service lancé sur :
```bash
http://localhost:8090
```

##### 📘 Swagger (Documentation API)

Swagger est déjà intégré via Flask-Restx.

##### ➡️ Ouvrir dans le navigateur :

```bash
http://localhost:8090
```



