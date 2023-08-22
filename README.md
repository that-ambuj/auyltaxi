# Auyltaxi

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Preparation

**IMPORTANT**

Make sure the database is up to date by settings `DATABASE_URL` in .env file
(see `./.env.example` for example) and by running the migrations with below commands.

```bash
$ yarn prisma db push

$ yarn prisma generate
```

You'll need to run `prisma db push` every time the `./prisma/schema.prisma` is updated.

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# PRODUCTION MODE
$ yarn run start:prod
```

## Production mode

The production mode can be enabled by setting `NODE_ENV=production` or by running below commands:

```bash
$ yarn build
$ yarn start:prod
```

It disables the `/api` endpoint for **Swagger UI**
