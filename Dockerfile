# 多阶段构建，前端用 node 构建，生产用 nginx 静态服务
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]