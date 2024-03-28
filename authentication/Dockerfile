# Utilisation d'une image Node.js spécifique comme base
FROM node:20.11.1-bullseye-slim

# Définition du répertoire de travail dans l'image
WORKDIR /app

# Copie du dossier shared
COPY ../shared /shared

# Copier le package.json et le package-lock.json dans le conteneur
COPY package.json package-lock.json /app/

# Installation des dépendances du projet
RUN npm install

# Copie des fichiers du projet dans l'image
COPY . /app/

# Utilisation du port 3000
EXPOSE 3000

# Commande de démarrage de l'application
CMD ["node", "app.js"]