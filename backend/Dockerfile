# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY . .

# Install dependencies
RUN npm install

# Expose port 80
EXPOSE 3000

# Start nginx
CMD ["node", "index.js"]