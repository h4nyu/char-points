FROM debian:bullseye-slim
RUN apt-get update \
    && apt-get install --no-install-recommends -y wait-for-it python3 make gcc g++ libvips-dev libglib2.0-dev \
    && rm -rf /var/lib/apt/lists/*
# WORKDIR /srv
# COPY . .
# RUN yarn install \
#     && yarn build \
#     && rm -rf node_modules \
#     && yarn install --prod \
#     && yarn cache clean
