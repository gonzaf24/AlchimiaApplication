import React, { useState, useContext, useEffect } from "react";
import { Context } from "../Context";
import { GET_PODCAST_BY_ID } from "../container/PodcastMutation";
import { Layout } from "../components/Layout";
import { useMutation } from "@apollo/react-hooks";
import { Podcast as PodcastPublic } from "../components/Podcast/index";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  spinner: {
    justifyContent: "center",
    textAlign: "center",
    paddingTop: "300px",
  },
}));

export const Podcast = ({ id }) => {
  const classes = useStyles();
  const { user } = useContext(Context);
  const [obtenerPodcast, {}] = useMutation(GET_PODCAST_BY_ID);
  const [podcast, setPodcast] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await obtenerPodcast({
        variables: { podcastId: id },
      });
      if (result) {
        const { podcast } = result.data;
        setPodcast(podcast);
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
          <PodcastPublic loading={loading} podcast={podcast} />
        )}
      </Layout>
    </>
  );
};
