# Esse é um pequeno projeto fetio para aprimorar minhas habilidades com docker

### Assim e como o projeto se parece
<div align="center">
<img src="https://github.com/GuilhermeW1/dokerized-fullstack/assets/88466173/0533c89c-a1d1-485a-a8ec-d5069c546435"/>
</div>

## Para iniciar o projeto voce precisar

ter o [Docker](https://docs.docker.com/engine/install/) e [Docker compose](https://docs.docker.com/compose/install/)
além disso tera de configurar uma .env file no root do projeto 
Aqui existem duas possibilidades você ira rodar o projeto com docker compose ou em localhost manualmente

### Docker compose
Com o docker compose voce ira adicionar essa linhha dentro do .env
``DATABASE_URL="postgresql://postgres:admin@ngdatabase:5432/postgres?schema=public"``
#### Depois disso e so rodar o docker
``docker-compose up -d``
quando terminar o o app ficara disponivel em [localhost](http://localhost:5173)


### Local Host
Primeiro voce devera criar um banco de dados para o projeto com o qual preferir ou criar usando o docker 
``docker run --name postgres-to-teste -e POSTGRES_PASSWORD=admin -p 5430:5430 postgres``
Note que estou mapeando o banco para porta 5430 isso evita conflitos com o proprio postgres se o tiver instalado
#### Depois é so adicionar essa linha dentro do .env
``DATABASE_URL="postgresql://postgres:admin@localhost:5430/postgres?schema=public"``
e entrar dentro dos dois diretorios web e api e rodar o comando 
``npm run dev``
em cada
o app ficara disponivel em [localhost](http://localhost:5173)

