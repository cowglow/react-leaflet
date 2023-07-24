FROM node:18
WORKDIR /app
COPY ./package.json /app
#COPY ./yarn.lock /app

RUN yarn run install --mutex file:/usr/local/share/.cache/yarn/.yarn-mutex

COPY . ./
ENV PORT=3000
ENV NODE_ENV=development

EXPOSE 3000
CMD ["yarn","dev"]