import React, { createContext } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";

export const Context = createContext();

const Provider = ({ children }) => {
  const [isAuth, setIsAuth] = useLocalStorage("isAuth", false);
  const [notificar, setNotificar] = useLocalStorage("notificar", false);
  const [user, setUser] = useLocalStorage("user", false);

  const [albums, setAlbums] = useLocalStorage("albums", false);
  const [podcasts, setPodcasts] = useLocalStorage("podcasts", false);
  const [actividades, setActividades] = useLocalStorage("actividades", false);
  const [abrir, setAbrirReproductor] = useLocalStorage("abrir", false);
  const [audio, setAudio] = useLocalStorage("audio", false);
  const [actualizoAlbum, setActualizoAlbum] = useLocalStorage(
    "actualizoAlbum",
    false
  );
  const [actualizoUsuario, setActualizoUsuario] = useLocalStorage(
    "actualizoUsuario",
    false
  );
  const [actualizoActividad, setActualizoActividad] = useLocalStorage(
    "actualizoActividad",
    false
  );
  const [actualizoPodcast, setActualizoPodcast] = useLocalStorage(
    "actualizoPodcast",
    false
  );
  const value = {
    user,
    albums,
    podcasts,
    actividades,
    notificar,
    isAuth,
    abrir,
    audio,
    actualizoUsuario,
    actualizoAlbum,
    actualizoActividad,
    actualizoPodcast,
    setActualizoUsuario: (actualizoUsuario) => {
      setActualizoUsuario(actualizoUsuario);
    },
    setActualizoPodcast: (actualizoPodcast) => {
      setActualizoPodcast(actualizoPodcast);
    },
    setActualizoActividad: (actualizoActividad) => {
      setActualizoActividad(actualizoActividad);
    },
    setActualizoAlbum: (actualizoAlbum) => {
      setActualizoAlbum(actualizoAlbum);
    },
    setAudio: (audio) => {
      setAudio(audio);
    },
    setAbrirReproductor: (abrir) => {
      setAbrirReproductor(abrir);
    },
    setPodcasts: (podcasts) => {
      setPodcasts(podcasts);
    },
    setActividades: (actividades) => {
      setActividades(actividades);
    },
    setAlbums: (albums) => {
      setAlbums(albums);
    },
    userAuth: (user) => {
      setUser(user);
    },
    activateAuth: (user) => {
      setIsAuth(true);
      setNotificar(user.notificar);
      setUser(user);
      window.localStorage.setItem("token", user.token);
    },
    removeAuth: () => {
      console.log(
        " ---------------------- LOG OUT -----------------> al CONTEXT : "
      );
      setIsAuth(false);
      setNotificar(null);
      setUser(null);
      setAlbums(null);
      setPodcasts(null);
      setActividades(null);
      window.localStorage.removeItem("token");
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default {
  Provider,
  Consumer: Context.Consumer,
};
