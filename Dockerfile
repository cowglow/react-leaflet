FROM node:18 as BUILDER
WORKDIR /app
COPY . /app

FROM node:18 as DEVELOPMENT
RUN mkdir /app
COPY --from=BUILDER /app /app
RUN cd /app
RUN yarn cache clean
WORKDIR /app
