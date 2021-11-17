#!/usr/bin/env bash

a2enmod expires
a2enmod headers
service apache2 reload

echo "frontend started"

while true; do
  sleep 10000
done