FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps && npm run build

EXPOSE $PORT

CMD npm run preview -- --host 0.0.0.0 --port $PORT
