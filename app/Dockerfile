FROM node:15-alpine
WORKDIR /srv
COPY . .
RUN yarn install \
    && yarn build \
    && rm -rf node_modules \
    && yarn install --prod \
    && yarn cache clean
