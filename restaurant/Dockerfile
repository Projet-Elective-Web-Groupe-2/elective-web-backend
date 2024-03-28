# Utilisation d'une image Node.js spécifique comme base
FROM node:20.11.1-bullseye-slim

# Définition du répertoire de travail dans l'image
WORKDIR /app

# Copier le package.json et le package-lock.json dans le conteneur
COPY package.json package-lock.json ./

# Installation des dépendances du projet
RUN npm install

# Copie des fichiers du projet dans l'image
COPY . .

# Utilisation du port 3002
EXPOSE 3002

# Commande de démarrage de l'application
CMD ["node", "app.js"]