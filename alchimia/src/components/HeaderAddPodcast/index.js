import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Context } from "../../Context";
import { makeStyles } from "@material-ui/core/styles";
import { CrearPodcast } from "../Modales/Podcast/CrearPodcast";
import { NewPodcastMutation } from "../../container/PodcastMutation";

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

export const HeaderAddPodcast = ({ userId, titulo = "" }) => {
  const classes = useStyles();
  const { actualizoPodcast, setActualizoPodcast, user } = useContext(Context);

  return (
    <>
      <NewPodcastMutation>
        {(newPodcast, { data, loading, error }) => {
          const submitPodcast = ({
            titulo,
            fotoPortada,
            contenido,
            autor,
            audio,
            likes,
          }) => {
            const input = {
              titulo,
              fotoPortada,
              contenido,
              autor,
              audio,
              likes,
            };
            const variables = { input };
            newPodcast({ variables }).then(({ data }) => {
              const { newPodcast } = data;
              if (actualizoPodcast == true) {
                setActualizoPodcast(false);
              } else {
                setActualizoPodcast(true);
              }
            });
          };

          const okMessage = data && "podcast creado con éxito";

          const errorMsg = error && "hubo error al crear el Podcast." + error;
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
                  <CrearPodcast
                    submitPodcast={submitPodcast}
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
      </NewPodcastMutation>
    </>
  );
};
