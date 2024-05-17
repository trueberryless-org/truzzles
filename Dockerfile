# Use the official Nginx image as the base image
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/

# Copy the static content into the Nginx document root directory
COPY src/ /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Command to run Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
