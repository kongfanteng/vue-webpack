FROM node
LABEL name="vue-back"
LABEL . /app
COPY . /app
RUN npm install
EXPOSE 3000
CMD npm start