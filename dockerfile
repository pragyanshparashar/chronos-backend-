# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally (for dev only, optional)
RUN npm install -g nodemon

# Copy rest of the project
COPY . .

# Expose port
EXPOSE 8000

# Default command (production mode)
CMD ["npm", "start"]

