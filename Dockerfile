# Set the base image to use to Ubuntu
FROM ubuntu:14.04

MAINTAINER Omeyimi Sanni

RUN apt-get update
RUN apt-get -qq update

# Install postgres and RabbitMQ
RUN apt-get install -y postgresql postgresql-contrib rabbitmq-server

RUN update-rc.d postgresql enable

# Install Node.js and npm
RUN apt-get install -y nodejs npm

RUN ln -s /usr/bin/nodejs /usr/bin/node 

# Install gulp and bower
RUN npm install -g gulp bower loadtest

ADD . /src

RUN cd /src; chmod +x start.sh &&  npm install && bower install --allow-root;

EXPOSE  7000

CMD ["src/start.sh"]


