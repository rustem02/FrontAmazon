#!/bin/bash

echo "deleting old app"
sudo rm -rf /var/www/

echo "creating app folder"
sudo mkdir -p /var/www/frontamazon

echo "moving files to app folder"
sudo mv  * /var/www/frontamazon

# Navigate to the app directory
cd /var/www/frontamazon/
sudo mv env .env


sudo rm -f /etc/nginx/sites-available/myapp

# Check if Node.js is installed, install if not
if ! command -v node > /dev/null; then
    echo "Installing Node.js..."
    sudo apt-get install -y nodejs
fi

# Check if NPM is installed, install if not
if ! command -v npm > /dev/null; then
    echo "Installing npm..."
    sudo apt-get install -y npm
fi


echo "Installing server dependencies..."
sudo npm install -g serve

echo "Installing PM2..."
sudo npm install -g pm2

echo "Installing application dependencies..."
sudo npm install


# Update and install Nginx if not already installed
if ! command -v nginx > /dev/null; then
    echo "Installing Nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Configure Nginx to serve the React application
# if [ ! -f /etc/nginx/sites-available/myapp ]; then
#     sudo rm -f /etc/nginx/sites-enabled/default
#     sudo bash -c 'cat > /etc/nginx/sites-available/myapp <<EOF
# server {
#     listen 80;
#     server_name _;

#     location / {
#         root /var/www/html/myapp;
#         try_files \$uri /index.html;
#     }
# }
# EOF'
#     sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled
#     sudo systemctl restart nginx
# else
#     echo "Nginx configuration already exists."
# fi

# Configure Nginx to act as a reverse proxy if not already configured
if [ ! -f /etc/nginx/sites-available/myapp ]; then
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo bash -c 'cat > /etc/nginx/sites-available/myapp <<EOF
server {
    listen 80;
    server_name _;

    location / {
        include proxy_params;
        proxy_pass http://unix:/var/www/langchain-app/myapp.sock;
    }
}
EOF'

    sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled
    sudo systemctl restart nginx
else
    echo "Nginx reverse proxy configuration already exists."
fi


echo "Starting Node.js app with PM2..."
sudo pm2 start app.js --name "myapp"

echo "Setting up PM2 to restart on system boot..."
sudo pm2 save
sudo pm2 startup systemd

sudo pm2 start serve --name "react-app" -- -s build -l 3000

sudo pm2 save
sudo pm2 startup



echo "Deployment is completed 🚀"
