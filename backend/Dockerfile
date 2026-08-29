### Development image (used by docker-compose for local full-stack dev) ###
FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN mkdir -p uploads

EXPOSE 5000
CMD ["npm", "run", "dev"]

### Production image ###
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN mkdir -p uploads

EXPOSE 5000
CMD ["node", "server.js"]
