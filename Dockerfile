FROM node:18

WORKDIR /app

COPY package.json ./
# Use npm install instead of npm ci to generate a new package-lock.json
RUN npm install

COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" npx next build

EXPOSE $PORT

CMD ["sh", "-c", "npx next start -p ${PORT:-3001}"]
