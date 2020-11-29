# Run the Angular app in production mode
### STAGE 1: Build production code for the app ###

# Use a node image with minimum content
FROM node:alpine AS build

# Create a app folder under /usr as working directory
WORKDIR /usr/app

# Prepare for npm install
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of app source code
COPY . .

# Build the app in production mode
# This will generate /usr/app/dist with static SPA resource
RUN npm run production

### STAGE 2: use nginx as our web server ###
FROM nginx:alpine
# Use the default setting of nginx is quite enorugh for now, default port: 80
# COPY nginx.conf /etc/nginx/nginx.conf

# Copy the production build from the first stage to the default location in nginx
COPY --from=build /usr/app/dist /usr/share/nginx/html