# Specify a base image
FROM node:16

# WORKDIR /usr/app

# Install some depenendencies
COPY ./ ./
RUN npm install

# Default command
CMD ["npm", "start"]
