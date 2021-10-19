import React, { useContext, Fragment, useEffect } from "react";
import { Helmet, renderStatic } from "react-helmet";
import { render } from "react-dom";
import { Context } from "../../Context";
import {
  DivBody,
  Title,
  Subtitle,
  DivHeader,
  Image,
  Link,
  DivHeader1,
} from "./styles";
import { useMutation } from "@apollo/react-hooks";
import { NavBar } from "../NavBar";
import Box from "@material-ui/core/Box";
import LogoAlchimia from "../../assets/alchimia_logo-blanco.png";
import { GET_USER_BY_ID } from "../../container/UsuarioMutation";
import { navigate } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "35px",
    height: "35px",
    float: "right",
    zIndex: "9",
    marginTop: "-29px",
    marginRight: "10px",
  },
  prue: {
    width: "100%",
    textAlign: "center",
  },
}));

export function Layout({ children, title, id }) {
  const classes = useStyles();

  const {
    userAuth,
    user,
    actualizoUsuario,
    setActualizoUsuario,
    setAbrirReproductor,
    setAudio,
    audioSource,
  } = useContext(Context);

  const [getUsuarioMutation, { loadingA, errorA }] = useMutation(
    GET_USER_BY_ID
  );

  const enviarAbrirAudio = (audioSource, titulo, autor) => {
    const audio = {
      audio: audioSource,
      titulo: titulo,
      autor: autor,
    };
    setAudio(audio);
    setAbrirReproductor(true);
  };

  useEffect(() => {
    async function fetchData() {
      const userA = await getUsuarioMutation({
        variables: { userId: id },
      });
      const { usuario } = userA.data;
      userAuth(usuario);
    }
    if (user && user.uid === id) {
      fetchData();
    }
  }, [actualizoUsuario, id]);

  return (
    <Fragment>
      <Helmet>{title && <title> ALCHIMIA </title>}</Helmet>
      <DivHeader>
        {user && user.uid ? (
          <div className={classes.prue}>
            <div className={classes.prue}>
              <Image
                src={LogoAlchimia}
                onClick={() => {
                  navigate(`/home/${user.uid}`);
                }}
              />
            </div>
            <div className={classes.prue}>
              <Image
                className={classes.root}
                src="https://alchimia.s3.us-east-2.amazonaws.com/utils/logo_ok.png"
                onClick={() => {
                  enviarAbrirAudio(
                    "http://37.187.93.104:8451/stream.mp3?ver=583634",
                    "LaRadio.live",
                    "LaRadio.live"
                  );
                }}
              />
            </div>
          </div>
        ) : (
          <Box display="flex" justifyContent="center">
            <Image
              src={LogoAlchimia}
              onClick={() => {
                navigate("/");
              }}
            />
          </Box>
        )}
      </DivHeader>
      <DivHeader1 />
      <DivBody>
        {title && <Title>{title}</Title>}
        {children}
      </DivBody>

      <NavBar />
    </Fragment>
  );
}
