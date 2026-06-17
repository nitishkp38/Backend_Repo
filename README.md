# Backend Scaffold

This is a simple Node.js backend scaffold prepared for development and deployment to Render.

## Available commands

- `npm install` - install dependencies
- `npm run dev` - start development server with nodemon
- `npm start` - start production server

## Endpoints

- `GET /` - root endpoint returning a welcome message
- `GET /health` - health check endpoint

## Notes

Render will automatically use `npm start` if you deploy this project as a Node.js service.

This backend also exposes a `baseUrl` value at `GET /`, and it defaults to `https://backend-repo-izx5.onrender.com` unless overridden by the `BASE_URL` environment variable.
