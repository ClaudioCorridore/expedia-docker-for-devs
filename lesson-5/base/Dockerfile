FROM node:7-alpine

RUN npm install -g pm2 \
    && mkdir -p /var/www \
    && mkdir -p /var/db \
    && chown -hR node:node /var/db \
    && chown -hR node:node /var/www

ONBUILD COPY . /var/www/

USER node
WORKDIR /var/www

ENTRYPOINT ["pm2-docker", "start", "npm", "--"]
CMD ["start"]
