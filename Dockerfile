FROM node:18
WORKDIR /app
COPY ./package.json /app
COPY ./yarn.lock /app

RUN yarn install --mutex file:/usr/local/share/.cache/yarn/.yarn-mutex

COPY . ./
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000
CMD ["yarn", "dev"]