FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" npx next build

EXPOSE $PORT

CMD ["sh", "-c", "npx next start -p ${PORT:-3001}"]
