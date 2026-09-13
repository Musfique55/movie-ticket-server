FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
RUN npm run build

# Stage 2: Create the final image
FROM node:24-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000
CMD ["npm", "start"]
