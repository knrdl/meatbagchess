FROM node:22.7.0-alpine3.20 AS client_builder

WORKDIR /app

COPY client .

RUN npm install && \
    npm run check && \
    npm run build


FROM node:22.7.0-alpine3.20

WORKDIR /app

COPY server .

RUN npm install

COPY --from=client_builder /app/dist /app/www

EXPOSE 8000

CMD ["npm", "start"]

