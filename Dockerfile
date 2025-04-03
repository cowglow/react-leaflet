FROM node:22 as BUILDER
WORKDIR /app
COPY . /app

FROM node:22 as DEVELOPMENT
RUN mkdir /app
COPY --from=BUILDER /app /app
WORKDIR /app
RUN yarn cache clean
