FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm ci && \
    echo "All dependencies installed"

EXPOSE 3000

CMD ["node", "index.js"]

