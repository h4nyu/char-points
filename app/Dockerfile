FROM node:15-slim
WORKDIR /srv
COPY . .
RUN yarn install \
    && yarn build \
    && rm -rf node_modules \
    && yarn install --production
