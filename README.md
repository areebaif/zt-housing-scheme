This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started 

Note: These commands are for Mac computer

### Connect to the planetscale database
- Install Planetscale CLI: (This is the database for this project) 
- ```brew install planetscale/tap/pscale```
- Open a terminal and connect to the database from your computer with the following command:
- ```pscale connect zt-housing-scheme development --port 3309```
- Note: When running the command for the first time, it will ask for authentication. Contact admin for auth-login credentials

### Define environment variables for local development
- Create .env.local file in the root of the project and have the following environemnt variablee defined.

1) ```DATABASE_URL = 'mysql://root@127.0.0.1:3309/<DATABASE_NAME>'``` 
Note: In the .env.local file, 3309 is the port number and it is the same port number you used to connect to the planetscale database

2) `NEXTAUTH_SECRET=`[ Open your terminal adn use this command to generate a secret `openssl rand -base64 32`]
3) `EMAIL_SERVER_HOST=smtp.sendgrid.net`
4) `EMAIL_FROM=zt.housing.scheme@gmail.com`
5) `EMAIL_SERVER_PORT=587`
6) `EMAIL_SERVER_USER=[Contact admin for credentials]`
7) `EMAIL_SERVER_PASSWORD=[Contact admin for credentials]`

### Install dependencies
- In your terminal, in the root of the project run `npm install`

### Start development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

Prisma ORM
- To use the prisma command with your terminal prefix prisma command with npx since we installed prisma with package manager
- prisma command: ```npx prisma generate client```


