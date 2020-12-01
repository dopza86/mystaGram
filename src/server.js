import dotenv from "dotenv";
import "./env";
import { GraphQLServer } from "graphql-yoga";
import logger from "morgan";
import schema from "./schema";
import passport from "passport";
import "./passport";
import { authenticateJwt } from "./passport";
import { isAuthenticated } from "./middlewares";

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request, isAuthenticated }),
});

server.express.use(logger("dev"));
server.express.use(authenticateJwt);

server.start({ port: PORT }, () =>
  console.log(`http://localhost:${PORT} 에서 서버구동`)
);
