FROM node:15-slim
RUN apt-get update \
    && apt-get install -y wait-for-it \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /srv
COPY . .
RUN yarn install \
    && yarn build \
    && rm -rf node_modules \
    && yarn install --prod \
    && yarn cache clean
