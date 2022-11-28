FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./
COPY prisma ./primsa/

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "up"]




