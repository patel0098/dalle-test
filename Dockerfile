FROM node:alpine3.15

WORKDIR /var/app


COPY . .

CMD ["node",  "index.js"]
