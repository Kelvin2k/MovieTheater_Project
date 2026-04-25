# build build folder 
FROM node:20-alpine AS builder

WORKDIR /project_movie

COPY package.json yarn.lock* ./

RUN yarn config set network-timeout 3000000

RUN yarn install

COPY . .

RUN yarn build

# build image 
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /project_movie/build .

EXPOSE 80