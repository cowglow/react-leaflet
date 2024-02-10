FROM node:18 as BUILDER
WORKDIR /app
COPY . /app

FROM node:18 as DEVELOPMENT
RUN mkdir /app
COPY --from=BUILDER /app /app
WORKDIR /app
RUN yarn cache clean
