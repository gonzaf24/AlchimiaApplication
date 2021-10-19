import React, { useState, useEffect, useContext } from "react";
import { Layout } from "../components/Layout";
import { Usuario } from "../components/Usuario";
import { useMutation } from "@apollo/react-hooks";
import { GET_USER_BY_ID } from "../container/UsuarioMutation";
import { makeStyles } from "@material-ui/core/styles";
import { Context } from "../Context";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  spinner: {
    justifyContent: "center",
    textAlign: "center",
    paddingTop: "300px",
  },
}));

export const User = ({ id }) => {
  const classes = useStyles();
  const [usr, setUser] = useState();
  const [getUsuarioMutation, {}] = useMutation(GET_USER_BY_ID);
  const [loading, setLoading] = useState(true);
  const { actualizoUsuario, user, userAuth } = useContext(Context);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const userSalida = await getUsuarioMutation({
        variables: { userId: id },
      });
      const { usuario } = userSalida.data;
      if (usuario.seguidores) {
        usuario.seguidores.splice(usuario.seguidores.indexOf(usuario.uid), 1);
      }
      if (usuario.seguidos) {
        usuario.seguidos.splice(usuario.seguidos.indexOf(usuario.uid), 1);
      }

      if (user && user.uid === id) {
        userAuth(usuario);
        setUser(usuario);
        setLoading(false);
      } else {
        setUser(usuario);
        setLoading(false);
      }
    }
    fetchData();
  }, [actualizoUsuario, id]);

  return (
    <Layout id={id}>
      {loading ? (
        <div className={classes.spinner}>
          <CircularProgress size={150} />
        </div>
      ) : (
        <Usuario userId={id} usr={usr} />
      )}
    </Layout>
  );
};
