// requiere tanto el paquete de funciones de Firebase para definir la función // comportamiento como la función de configuración del servidor local
const functions = require("firebase-functions");

// requerir todas las dependencias para configurar el servidor
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
//cors permite que nuestro servidor acepte solicitudes de diferentes orígenes
const { resolvers, typeDefs } = require("./schema");
const jwt = require("express-jwt");

const PORT = process.env.PORT || 3500;
process.env.JWT_SECRET = process.env.JWT_SECRET || "gon11gon";
const cors = require("cors");

// invoca express para crearlo
const app = express();

//usa cors para poder ser accedido desde fuera.
app.use(cors());

// auth de middleware
const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
});

const server = new ApolloServer({
  introspection: true, // solo para desarrollo , habiliar el playgrund
  playground: true, // solo para desarrollo , habiliar el playgrund
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { uid, email } = req.user || {};
    return { uid, email };
  },
});

app.use(auth);

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const { status } = err;
  return res.status(status).json(err);
};

app.use(errorHandler);

// now we take our newly instantiated ApolloServer and apply the   // previously configured express application
server.applyMiddleware({ app });

// creo y exporto la api
const api = functions.https.onRequest(app);
module.exports = { api };
