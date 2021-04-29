FROM debian:bullseye-slim
RUN apt-get update \
    && apt-get install --no-install-recommends -y curl wait-for-it nodejs ca-certificates gnupg \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt update \
    && apt-get install --no-install-recommends -y yarn  \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /srv
COPY . .
RUN yarn install \
    && yarn build \
    && rm -rf node_modules \
    && yarn install --prod \
    && yarn cache clean
