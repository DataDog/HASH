FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies

# RUN npm install -g nodemon

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm i

# Bundle app source
COPY . .

RUN chmod +x ./bin/hash-honeypot

CMD ["sleep", "infinity"]