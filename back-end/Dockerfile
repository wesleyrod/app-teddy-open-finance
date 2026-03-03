FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/back-end ./apps/back-end

RUN npm install

COPY . .

RUN npx nx build back-end

EXPOSE 3000

CMD ["node", "dist/apps/back-end/main.js"]