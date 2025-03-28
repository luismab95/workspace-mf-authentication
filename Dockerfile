FROM node:22.14.0-bullseye as builder

RUN npm i -g @angular/cli@19.2.5

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=builder /app/dist/mf-authentication /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
