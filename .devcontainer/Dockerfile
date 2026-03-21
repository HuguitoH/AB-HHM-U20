# stock-manager
################
## Base image installing common dependencies
################
FROM node:24-alpine 

RUN apk update && apk add --no-cache \
    curl \
    openssh-client \
    git

# Actual UID, GID on Linux if not the default 1000
ARG USERUID=1000
ARG USERGID=$USERUID

RUN deluser --remove-home node \
  && addgroup -S node -g $USERGID \
  && adduser -s /bin/sh -S -G node -u $USERUID node

WORKDIR /app

RUN mkdir -p /app/var/tmp

RUN npm install -g tsx
