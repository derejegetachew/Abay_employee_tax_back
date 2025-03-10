# Use the official Node.js image as a base image
FROM node:16-alpine 
# We use nodemon to restart the server every time there's a change
RUN npm install -g nodemon
# Set the working directory
WORKDIR /backendApi

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8090

# Start the Node.js application
CMD ["node", "server.js"]
