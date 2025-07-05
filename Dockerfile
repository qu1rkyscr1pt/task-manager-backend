# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# Expose the port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
