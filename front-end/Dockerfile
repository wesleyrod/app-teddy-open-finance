# -------- Build stage --------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY front-end/ front-end/

RUN npm ci --legacy-peer-deps
RUN npx nx build front-end --configuration=production

# -------- Production stage --------
FROM nginx:stable-alpine

# Copy custom nginx config
COPY front-end/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/front-end/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
