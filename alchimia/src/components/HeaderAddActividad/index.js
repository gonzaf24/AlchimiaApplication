import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import React, { useContext } from "react";
import { Context } from "../../Context";
import { makeStyles } from "@material-ui/core/styles";
import { CrearActividad } from "../Modales/actividad/CrearActividad";
import { NewActividadMutation } from "../../container/ActividadMutation";

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

export const HeaderAddActividad = ({ userId, titulo = "" }) => {
  const classes = useStyles();
  const { actualizoActividad, setActualizoActividad, user } = useContext(
    Context
  );
  return (
    <>
      <NewActividadMutation>
        {(newActividad, { data, loading, error }) => {
          const submitActividad = ({
            titulo,
            fechaInicio,
            fechaFin,
            fotoPortada,
            horaInicio,
            horaFin,
            pais,
            estadoCiudad,
            direccion,
            tags,
            contenido,
            apuntados,
            likes,
          }) => {
            const input = {
              titulo,
              fechaInicio,
              fechaFin,
              fotoPortada,
              horaInicio,
              horaFin,
              pais,
              estadoCiudad,
              direccion,
              tags,
              contenido,
              apuntados,
              likes,
            };
            const variables = { input };
            newActividad({ variables }).then(({ data }) => {
              const { newActividad } = data;
              if (actualizoActividad == true) {
                setActualizoActividad(false);
              } else {
                setActualizoActividad(true);
              }
            });
          };

          const okMessage = data && "actividad creada con éxito";

          const errorMsg = error && "hubo error al crear actividad." + error;

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
                  <CrearActividad
                    submitActividad={submitActividad}
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
      </NewActividadMutation>
    </>
  );
};
