FROM node:20 AS frontend
WORKDIR /app
COPY package*.json ./
# Xóa cache và cài đặt dependencies
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]