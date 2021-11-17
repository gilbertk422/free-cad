FROM phusion/baseimage:0.11
MAINTAINER Matthew Rayner <hello@rayner.io>
ENV REFRESHED_AT 2019-03-12

# based on dgraziotin/lamp
# MAINTAINER Daniel Graziotin <daniel@ineed.coffee>

ENV DOCKER_USER_ID 501
ENV DOCKER_USER_GID 20

ENV BOOT2DOCKER_ID 1000
ENV BOOT2DOCKER_GID 50


# Tweaks to give Apache/PHP write permissions to the app
RUN usermod -u ${BOOT2DOCKER_ID} www-data && \
    usermod -G staff www-data

RUN groupmod -g $(($BOOT2DOCKER_GID + 10000)) $(getent group $BOOT2DOCKER_GID | cut -d: -f1)
RUN groupmod -g ${BOOT2DOCKER_GID} staff

# Install packages
ENV DEBIAN_FRONTEND noninteractive
RUN add-apt-repository -y ppa:ondrej/php && \
  apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 4F4EA0AAE5267A6C && \
  apt-get update && \
  apt-get -y upgrade && \
  apt-get -y install supervisor wget git apache2 php-xdebug libapache2-mod-php pwgen php-apcu php7.1-mcrypt php-gd php-xml php-mbstring php-gettext zip unzip php-zip curl php-curl && \
  apt-get -y autoremove && \
  echo "ServerName localhost" >> /etc/apache2/apache2.conf


# Set PHP timezones to Europe/London
RUN sed -i "s/;date.timezone =/date.timezone = Europe\/London/g" /etc/php/7.3/apache2/php.ini
RUN sed -i "s/;date.timezone =/date.timezone = Europe\/London/g" /etc/php/7.3/cli/php.ini

# Add composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php && \
    php -r "unlink('composer-setup.php');" && \
    mv composer.phar /usr/local/bin/composer

# config to enable .htaccess
RUN a2enmod rewrite


#Environment variables to configure php
ENV PHP_UPLOAD_MAX_FILESIZE 10M
ENV PHP_POST_MAX_SIZE 10M

COPY default.conf /etc/apache2/sites-enabled/000-default.conf


COPY init.sh /usr/local/bin/dockerInit.sh

RUN chmod +x /usr/local/bin/dockerInit.sh

WORKDIR /var/www/app

CMD ["/bin/bash", "/usr/local/bin/dockerInit.sh"]

EXPOSE 80