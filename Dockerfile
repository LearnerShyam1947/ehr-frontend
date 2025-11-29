
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_API_KEY
ENV VITE_API_KEY=$VITE_API_KEY

ARG VITE_JWT
ENV VITE_JWT=$VITE_JWT

ARG VITE_GATEWAY
ENV VITE_GATEWAY=$VITE_GATEWAY

ARG VITE_API_SECRET
ENV VITE_API_SECRET=$VITE_API_SECRET

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
