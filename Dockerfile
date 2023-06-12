# Specify a base image
FROM node:16
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/



# Install some depenendencies
# COPY ./ ./
RUN npm install

COPY . .

# Default command
CMD ["npm", "start"]
