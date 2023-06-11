FROM nginx:alpine

# Copy the build folder to the nginx html folder
COPY ./build /usr/share/nginx/html

# Use specified nginx config if necessary
# COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80