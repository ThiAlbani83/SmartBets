# Usar uma imagem Node.js como base
FROM node:20-alpine

# Instalar dependências necessárias (OpenSSL e outras bibliotecas)
RUN apk add --no-cache openssl libssl3 libcrypto3

# Definir o diretório de trabalho dentro do container
WORKDIR /tropicalize-app

# Copiar os arquivos de dependências
COPY package.json package-lock.json* ./

# Instalar as dependências
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Mudar o diretório de trabalho para /app/server
WORKDIR /tropicalize-app/server

# Gerar o cliente do Prisma
RUN npx prisma generate

# Voltar ao diretório raiz do projeto
WORKDIR /tropicalize-app

# Expor a porta que o servidor usa
EXPOSE 5002

# Comando para rodar o servidor
CMD ["npm", "run", "dev"]