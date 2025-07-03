FROM node:20 AS backend
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv ffmpeg build-essential
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .
RUN python3 -m venv /app/venv
RUN /app/venv/bin/pip install --upgrade pip
COPY requirements.txt .
RUN /app/venv/bin/pip install -r requirements.txt
EXPOSE 3000
CMD ["npm", "run", "dev"]