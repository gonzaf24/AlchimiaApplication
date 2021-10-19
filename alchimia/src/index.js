import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import Context from "./Context";
import { InMemoryCache } from "apollo-cache-inmemory";
import { App } from "./App";
import { navigate } from "@reach/router";

const firebaseApp = require("firebase/app");

require("firebase/database");

firebaseApp.initializeApp(firebaseConfig);

const client = new ApolloClient({
  // aca va la direccion de mi servidor graphQL el cual me brinda un unico punto de acceso , easy no ?
  //uri: "http://localhost:5001/alchimiaapi/us-central1/api/graphql",
  uri: "https://us-central1-alchimiaapi.cloudfunctions.net/api/graphql",
  cache: new InMemoryCache(),
  request: (operation) => {
    const token = window.localStorage.getItem("token");
    const authorization = token ? `Bearer ${token}` : "";
    //cada vez que vaya hacer un request , voy a pedir el token guadado en mi local storage y se lo seteare
    // al header de la invocacion, de esta manera estando autenticado podemos consultar a nuestra API backend
    operation.setContext({
      headers: {
        authorization,
      },
    });
  },
  onError: (error) => {
    const { networkError } = error;

    console.log(
      "¡+++++++ ERROR CONTEXT +++++++" + JSON.stringify(networkError)
    );
    if (networkError && networkError.result.code === "invalid_token") {
      window.localStorage.removeItem("token");
      navigate("/login");
    }

    const errorCode = error.graphQLErrors ? error.graphQLErrors[0].message : "";
    if (errorCode) {
      var code = errorCode.substring(0, errorCode.lastIndexOf("-"));
      var message = errorCode.substring(
        errorCode.lastIndexOf("-") + 1,
        errorCode.length
      );
      if (code && code === "404") {
        navigate(`/notFound/${message}`);
      }
    }
  },
});

ReactDOM.render(
  <Context.Provider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Context.Provider>,
  document.getElementById("app")
);
