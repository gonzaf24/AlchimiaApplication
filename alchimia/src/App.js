import React, { useContext } from "react";
import { GlobalStyle } from "./styles/GlobalStyles";
import { Home } from "./pages/Home";
import { Detail } from "./pages/Detail";
import { Adm } from "./pages/Adm";
import { Search } from "./pages/Search";
import { Mensajes } from "./pages/Mensajes";
import { User } from "./pages/User";
import { NotFound } from "./pages/NotFound";
import { Router, Redirect } from "@reach/router";
import { Context } from "./Context";
import { Inicio } from "./pages/Inicio";
import { Album } from "./pages/Album";
import { Podcast } from "./pages/Podcast";
import { Actividad } from "./pages/Actividad";
import { Login } from "./pages/Login";
import { Registro } from "./pages/Registro";
import { Recuperar } from "./pages/Recuperar";
import { Paso1 } from "./pages/Paso1";
import { Paso2 } from "./pages/Paso2";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import pink from "@material-ui/core/colors/pink";
import "@babel/polyfill";
import { Reproductor } from "./components/Reproductor/index";
import { createBrowserHistory } from "history";

const theme = createMuiTheme({
  palette: {
    primary: pink,
    secondary: {
      main: "#311b92",
    },
  },
});
const history = createBrowserHistory();

export const App = () => {
  const { isAuth, notificar } = useContext(Context);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Reproductor></Reproductor>
        <Router>
          <NotFound default />
          <NotFound path="/notFound/:type" />
          <Inicio path="/" />
          <Album path="/album/:id" />
          <Podcast path="/podcast/:id" />
          <Actividad path="/actividad/:id" />
          <Login path="/login" />
          <Login path="/login/:id" />
          <Registro path="/registro" />
          <Recuperar path="/recuperar" />

          {!isAuth && <Redirect from="/home/:id" to="/login/:id" />}
          {!isAuth && <Redirect from="/adm/:id" to="/login/:id" />}
          {!isAuth && <Redirect from="/search/:id" to="/login/:id" />}
          {!isAuth && <Redirect from="/mensajes/:id" to="/login/:id" />}
          {!isAuth && <Redirect from="/user" to="/login" />}
          {!isAuth && <Redirect from="/pet" to="/login" />}
          {!isAuth && <Redirect from="/paso1" to="/login" />}
          {!isAuth && <Redirect from="/paso2" to="/login" />}

          <Paso1 path="/paso1" />
          <Paso2 path="/paso2" />
          <Home path="/home/:id" />
          <Detail path="/detail/:detailId" />
          <Adm path="/adm/:id" />
          <Search path="/search/:id" />
          <Mensajes path="/mensajes/:id" />
          <User path="/user/:id" />
        </Router>
      </ThemeProvider>
    </div>
  );
};
