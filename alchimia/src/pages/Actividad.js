import React, { useState, useContext, useEffect } from "react";
import { Context } from "../Context";
import { GET_ACTIVIDAD_POR_ID } from "../container/ActividadMutation";
import { Layout } from "../components/Layout";
import { useMutation } from "@apollo/react-hooks";
import { Actividad as ActividadPublic } from "../components/Actividad/index";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  spinner: {
    justifyContent: "center",
    textAlign: "center",
    paddingTop: "300px",
  },
}));

export const Actividad = ({ id }) => {
  const classes = useStyles();
  const { user } = useContext(Context);
  const [obtenerActividad, {}] = useMutation(GET_ACTIVIDAD_POR_ID);
  const [actividad, setActividad] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await obtenerActividad({
        variables: { actividadId: id },
      });
      if (result) {
        const { actividad } = result.data;
        setActividad(actividad);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  return (
    <>
      <Layout id={user ? user.uid : ""}>
        {loading ? (
          <div className={classes.spinner}>
            <CircularProgress size={150} />
          </div>
        ) : (
          <ActividadPublic loading={loading} actividad={actividad} />
        )}
      </Layout>
    </>
  );
};
