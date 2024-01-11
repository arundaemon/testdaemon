FROM  node:16

WORKDIR /app

COPY package.json .
#COPY package-lock.json .
RUN rm -rf package-lock.json

#RUN npm install --global yarn
# RUN yarn
COPY . .
ARG DOCKER_ENV
ENV REACT_APP_ENV=${DOCKER_ENV}
# RUN wget -O /app/src/config/settings/local.jsx https://test-datalakeconstants.extramarks.com/${DOCKER_ENV}/local.jsx
RUN echo node -v
RUN echo npm -v
RUN npm i --legacy-peer-deps
RUN npm i -g serve --legacy-peer-deps
#RUN npm i react-dnd-html5-backend
RUN npm run build
# RUN yarn build
EXPOSE 3000
CMD [ "serve", "-s", "build", "-l", "3000" ]
