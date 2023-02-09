# Specify a base image
FROM node:16
RUN npm install -g nodemon
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]


# Install some depenendencies
# COPY ./ ./
RUN npm install

COPY . .

# Default command
CMD ["npm", "start"]
