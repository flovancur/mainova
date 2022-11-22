FROM node:18-alpine3.16 AS builder

WORKDIR /build

#Set Proxy Server and disable strict ssl if needed
ARG HTTP_PROXY
ARG HTTPS_PROXY

RUN echo $HTTP_PROXY
RUN echo $HTTPS_PROXY

RUN if [[ -n "$HTTP_PROXY" ]] || [[ -n "$HTTPS_PROXY" ]] ; then echo "Proxy is set, setting strict-ssl to false...." && npm config set strict-ssl false && npm config set registry http://registry.npmjs.org; fi

# install dependencies
COPY package*.json ./
RUN npm ci
COPY . .

# build and install only production dependencies
RUN npm run build
RUN npm ci --only=production


######################################################################

FROM node:18-alpine3.16

WORKDIR /app

MAINTAINER Nico W. <info@ni-wa.de>

EXPOSE 8080

# copy files from build stage
COPY --from=builder /build/dist/ dist/
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/node_modules/ node_modules/

ENTRYPOINT ["node", "."]
