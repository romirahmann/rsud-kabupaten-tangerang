# Gunakan image Node.js resmi
FROM node:22

# Tentukan working directory
WORKDIR /app

# Copy package.json dan install dependency
COPY package*.json ./
RUN npm install

# Copy semua file backend
COPY . .

# Jalankan server
EXPOSE 3091
CMD ["npm", "start"]
