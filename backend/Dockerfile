FROM node:18

WORKDIR /app

COPY package.json ./
# Installeer SendGrid mail module expliciet
RUN npm install && npm install @sendgrid/mail

COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" npx next build

EXPOSE $PORT

CMD ["sh", "-c", "npx next start -p ${PORT:-3001}"]
