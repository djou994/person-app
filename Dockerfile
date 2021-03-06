# Imagem de Origem
FROM node:13-alpine
# Diretório de trabalho(é onde a aplicação ficará dentro do container).
WORKDIR /person-app
# Adicionando `/app/node_modules/.bin` para o $PATH
ENV PATH /person-app/node_modules/.bin:$PATH
# Instalando dependências da aplicação e armazenando em cache.
COPY package.json /person-app/package.json
RUN npm install --silent
RUN npm install react-scripts@4.0.3 -g --silent
# Inicializa a aplicação
CMD ["npm", "start"]