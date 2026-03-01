# Usando a versão estável do Node
FROM node:20-alpine

WORKDIR /usr/src/app

# Copiando apenas os arquivos de pacotes primeiro para otimizar o cache
COPY package*.json ./
RUN npm install

# Copia todo o código do workspace Nx
COPY . .

# Build da aplicação específica
RUN npx nx build back-end

# Porta de exposição definida no main.ts
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/apps/back-end/main.js"]