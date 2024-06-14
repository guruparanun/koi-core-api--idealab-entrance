# Use the official Node.js 14 Alpine image as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install dependencies
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3030

# Run the app
CMD ["npm", "start"]
