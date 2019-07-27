FROM node:4.2.4-wheezy
MAINTAINER Dewald Viljoen <dewaldv@thoughtworks.com>

RUN npm install -g npm grunt-cli && npm cache clean

COPY package.json /sb-ui/
WORKDIR /sb-ui
RUN npm install && npm cache clean

COPY entrypoint.sh /entrypoint.sh

EXPOSE 8080

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "grunt", "test:docker" ]
