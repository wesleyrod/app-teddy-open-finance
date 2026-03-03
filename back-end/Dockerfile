FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
COPY apps/back-end/package.json ./apps/back-end/ 

RUN npm install

COPY . .

RUN npx nx build back-end

EXPOSE 3000

CMD ["node", "dist/apps/back-end/main.js"]