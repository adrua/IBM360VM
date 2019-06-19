FROM alpine:3.1

# Update
RUN apk add --update nodejs

# Install app dependencies
COPY package.json /src/package.json
RUN npm -g install npm@latest-2
RUN cd /src; npm install

# Bundle app source
COPY ./build/es6-unbundled /src

EXPOSE  8080
CMD ["node", "/src/src/app.js"]