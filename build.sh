#!/bin/shell

docker buildx build --platform linux/arm/v7,linux/arm64,linux/amd64 --tag $DOCKER_REGISTRY/sivic/app --push ./app
