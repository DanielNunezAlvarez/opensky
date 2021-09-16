FROM node:10

WORKDIR /usr/src/app/frontend

COPY . ./

RUN npm install -g @angular/cli @angular-devkit/build-angular --unsafe-perm=true && npm install --unsafe-perm=true

EXPOSE 4200

CMD ["npm","start"]
