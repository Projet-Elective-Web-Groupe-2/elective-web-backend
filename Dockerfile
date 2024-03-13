# Utilisation d'une image Node.js spécifique comme base
FROM node:20.11.1-bullseye-slim

# Définition du répertoire de travail dans l'image
WORKDIR /app

# Copie des fichiers du projet dans l'image
COPY . .

# Installation des dépendances du projet
RUN npm install

# Utilisation du port 3000
EXPOSE 3000

# Commande de démarrage de l'application
CMD ["npm", "start"]