import React, { useState, useContext, useEffect } from "react";
import { Context } from "../Context";
import { WALL } from "../container/WallMutation";
import { Wall as Muro } from "../components/Wall/index";
import { Layout } from "../components/Layout";
import { useMutation } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  spinner: {
    justifyContent: "center",
    textAlign: "center",
    paddingTop: "300px",
  },
}));
export const Home = ({ id }) => {
  const classes = useStyles();
  const { user } = useContext(Context);

  const [wallMutation, {}] = useMutation(WALL);
  const [loading, setLoading] = useState(true);
  const [wall, setWall] = useState();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await wallMutation({
        variables: { userId: id },
      });
      if (result) {
        const { wall } = result.data;
        setWall(wall);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  return (
    <>
      <Layout id={id} title="">
        {loading ? (
          <div className={classes.spinner}>
            <CircularProgress size={150} />
          </div>
        ) : (
          <Muro loading={loading} wall={wall} />
        )}
      </Layout>
      ;
    </>
  );
};
