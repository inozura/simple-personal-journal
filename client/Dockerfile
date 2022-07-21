# Pull latest official node image
FROM node:latest

RUN mkdir /frontend
WORKDIR /frontend

# Install the application's dependencies into the node_modules's cache directory.
COPY package.json ./
COPY package-lock.json ./
RUN npm install