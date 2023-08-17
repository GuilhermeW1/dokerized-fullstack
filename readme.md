# Esse é um pequeno projeto fetio para aprimorar minhas habilidades com docker

### Assim e como o projeto se parece
<div align="center">
<img src="https://github.com/GuilhermeW1/dokerized-fullstack/assets/88466173/0533c89c-a1d1-485a-a8ec-d5069c546435"/>
</div>
## Para iniciar o projeto voce precisa ter instalado [Docker](https://docs.docker.com/engine/install/) e [Docker compose](https://docs.docker.com/compose/install/)

you have to configure the .env file in the api
if you tryng to running the app without docker compose you have to somthing like this

DATABASE_URL="postgresql://postgres:admin@localhost:5430/postgres?schema=public" 
where the name of the database is set to the localhost


disclaimer: note that in localhost im using port 5430 this is because if you have postgres instaled in your machine it 
wont work, in the docker-compose i have mapped the port 5432 to 5430 that prevent port conflitcs 
## Depois de ter o docker e o docker compse instalado voce deve configurar o .env dentro da api e dpois rodar o comando abaixo na pasta onde o arquivo docker-compose.yaml estiver

create a .env file inside the root of api and paste this
DATABASE_URL="postgresql://postgres:admin@ngdatabase:5432/postgres?schema=public" 

then type this in the root of the project
`` docker-compose up -d ``

and then acess the page on the web in the following link
# http://localhost:5173

# to stop the container you can type this
`` docker-compose down ``


para parar a aplicação e so rodar

# docker compose down

para rodar localmente voce devera rodar npm i tanto na pasta web quanto na pasta teste
e devera subir um banco de dados

``docker run --name some-postgres -e POSTGRES_PASSWORD=admin -p 5432:5432  -d postgres`
