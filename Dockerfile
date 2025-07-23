# Stage 1: Build React app
FROM node:20.18.0 AS build
WORKDIR /app

# 👈 Quan trọng
COPY .env.production .env 

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép mã nguồn của frontend vào container
COPY . /app

# Build ứng dụng React
RUN npm run build

# Stage 2: Dùng Nginx để phục vụ ứng dụng React
FROM nginx:alpine

# Sao chép các file build từ stage 1 vào thư mục của Nginx để phục vụ
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80 để phục vụ ứng dụng
EXPOSE 80

#ENVIRONMENT NGINX_HOST=localhost

# Chạy Nginx trong container
CMD ["nginx", "-g", "daemon off;"]
