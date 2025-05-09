# Use Node 21 with Alpine as the base image
FROM node:21-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if exists)
COPY package*.json .

# Install dependencies while bypassing peer dependency checks
RUN npm install --legacy-peer-deps   # Ensure we install with legacy peer dependencies

# Copy the rest of the application files into the container
COPY . .

# Expose the application port (default for Vite is 3000)
EXPOSE 3000

# Set the command to start the development server
CMD ["npm", "run", "dev"]
