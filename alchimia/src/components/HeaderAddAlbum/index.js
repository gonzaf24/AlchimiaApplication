import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CrearAlbum } from "../Modales/Album/CrearAlbum";
import { NewAlbumMutation } from "../../container/AlbumMutation";
import { Context } from "../../Context";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    fontFamily: "Gotham SSm, Helvetica, Arial, sans-serif",
    letterSpacing: "3px",
    color: "#575a5a",
    fontSize: "1.6em",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: "none",
  },
  tete: {
    backgroundColor: "#0000001a",
  },
}));

export const HeaderAddAlbum = ({ titulo, userId }) => {
  const classes = useStyles();
  const { setAlbums, albums, actualizoAlbum, setActualizoAlbum } = useContext(
    Context
  );

  return (
    <>
      <NewAlbumMutation>
        {(newAlbum, { data, loading, error }) => {
          const submitAlbum = ({
            titulo,
            subtitulo,
            fotoPortada,
            contenido,
            autor,
            fotos,
            likes,
          }) => {
            const input = {
              titulo,
              subtitulo,
              fotoPortada,
              contenido,
              autor,
              fotos,
              likes,
            };
            const variables = { input };
            newAlbum({ variables }).then(({ data }) => {
              const { newAlbum } = data;
              albums.push(input);
              setAlbums(albums);
              if (actualizoAlbum == true) {
                setActualizoAlbum(false);
              } else {
                setActualizoAlbum(true);
              }
            });
          };

          const okMessage = data && "album creado con éxito";

          const errorMsg = error && "hubo error al crear el album." + error;
          return (
            <div className={classes.root}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs={2}>
                  <Paper className={classes.paper}></Paper>
                </Grid>
                <Grid item xs={8}>
                  <Paper className={classes.paper}>{titulo}</Paper>
                </Grid>
                <Grid item xs={2}>
                  <CrearAlbum
                    submitAlbum={submitAlbum}
                    okMessage={okMessage}
                    errorMsg={errorMsg}
                    loadingStep={loading}
                    uid={userId}
                  />
                </Grid>
              </Grid>
              <br />
            </div>
          );
        }}
      </NewAlbumMutation>
    </>
  );
};
