FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

RUN npm install
COPY . .
RUN npx nx build back-end --prod

EXPOSE 3000
CMD ["node", "dist/apps/back-end/main.js"]