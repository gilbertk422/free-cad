#!/usr/bin/env bash
composer install -d /var/www/app

if [ ! -f "/var/www/app/.env" ]; then
    cp /var/www/app/.env.example /var/www/app/.env
    echo "Rewrite ENV file"
fi

chmod -R 777 /var/www/app/storage
chmod -R 777 /var/www/app/bootstrap
php /var/www/app/artisan key:generate
/usr/sbin/apache2ctl -D FOREGROUND

echo "backend started"

while true; do
  sleep 1000
done