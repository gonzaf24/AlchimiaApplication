import React, { useContext, Fragment, useEffect, useState } from "react";
import { ActividadesPreview, ActividadPortada } from "../ActividadesPreview";
import { HeaderAddActividad } from "../HeaderAddActividad";
import { List, Item } from "./styles";
import { useMutation } from "@apollo/react-hooks";
import { Context } from "../../Context";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { GET_ACTIVIDADES } from "../../container/ActividadMutation";

const useStyles = makeStyles((theme) => ({
  spinner: {
    justifyContent: "center",
    textAlign: "center",
    marginBottom: "20px",
  },
  expand: {
    textAlign: "center",
    transform: "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(0deg)",
  },
  empty: {
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
  },
  tete: {
    backgroundColor: "#0000001a",
    padding: 0,
  },
}));

export const ListOfActividades = ({ userId, type }) => {
  const classes = useStyles();
  const [actividad, setActividad] = useState("");
  const [loaded, setLoaded] = useState(false);

  const {
    actualizoActividad,
    setActualizoActividad,
    setActividades,
    actividades,
  } = useContext(Context);
  const [actividadesPublic, setActividadesPublic] = useState([actividades]);
  const [obtenerActividades, { dataB, loading, error }] = useMutation(
    GET_ACTIVIDADES
  );
  useEffect(() => {
    async function fetchData() {
      const dataA = await obtenerActividades({
        variables: { userId: userId },
      });

      if (dataA) {
        const { data } = dataA;
        const { actividades } = data;
        setActividadesPublic(actividades);
        setActividades(actividades);
        setActividad(null);
        setLoaded(true);
      }
    }
    fetchData();
  }, [actualizoActividad, userId]);

  const renderList = (fixed) => (
    <>
      {!loaded ? (
        <div className={classes.spinner}>
          <CircularProgress />
        </div>
      ) : (
        <List fixed={fixed}>
          {actividadesPublic &&
            actividadesPublic.map((actividad) => (
              <Item
                key={actividad.uid + "1"}
                onClick={async () => {
                  //await setActividad(null);
                  setActividad(actividad);
                }}
              >
                <ActividadesPreview key={actividad.uid + "2"} {...actividad} />
              </Item>
            ))}
          {actividadesPublic.length == 0 && type === "private" && (
            <div className={classes.empty}>
              aún no has creado actividades,
              <br />
              pulsa el botón
              <IconButton className={classes.tete}>
                <AddCircleOutlineIcon color="primary" />
              </IconButton>
              para crear una.
            </div>
          )}
        </List>
      )}
    </>
  );

  const renderPortada = () => {
    return (
      actividad && (
        <ActividadPortada
          key={actividad.uid + "3"}
          {...actividad}
          type={type}
        />
      )
    );
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setActividad(null);
  };

  return (
    <>
      {actividadesPublic && (
        <Fragment>
          {type === "private" && (
            <HeaderAddActividad
              titulo={"Activities"}
              userId={userId}
            ></HeaderAddActividad>
          )}

          {loaded && actividadesPublic.length != 0 && type === "public" && (
            <h3 className={classes.spinner}>Activities</h3>
          )}
          {renderList()}
          <br />
          {renderPortada()}
          {actividad && (
            <div className={classes.spinner}>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </div>
          )}
        </Fragment>
      )}
    </>
  );
};
