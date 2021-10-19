import React, { useContext, Fragment, useEffect, useState } from "react";
import { PodcastsPreview, PodcastPortada } from "../PodcastsPreview";
import { HeaderAddPodcast } from "../HeaderAddPodcast";
import { List, Item } from "./styles";
import { useMutation } from "@apollo/react-hooks";
import { Context } from "../../Context";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { GET_PODCASTS } from "../../container/PodcastMutation";

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

export const ListOfPodcasts = ({ userId, type }) => {
  const classes = useStyles();
  const [podcast, setPodcast] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [podcasts, setPodcasts] = useState([]);
  const { actualizoPodcast, setActualizoPodcast } = useContext(Context);

  const [obtenerPodcasts, { data, loading, error }] = useMutation(GET_PODCASTS);
  useEffect(() => {
    async function fetchData() {
      const dataA = await obtenerPodcasts({
        variables: { userId: userId },
      });
      const { data } = dataA;
      const { podcasts } = data;
      setPodcasts(podcasts);
      setPodcast(null);
      setLoaded(true);
    }
    fetchData();
  }, [actualizoPodcast, userId]);

  const renderList = (fixed) => (
    <>
      {!loaded ? (
        <div className={classes.spinner}>
          <CircularProgress />
        </div>
      ) : (
        <List fixed={fixed}>
          {podcasts &&
            podcasts.map((podcast) => (
              <Item
                key={podcast.uid + "1"}
                key={podcast.uid}
                onClick={async () => {
                  await setPodcast(null);
                  setPodcast(podcast);
                }}
              >
                <PodcastsPreview key={podcast.uid + "2"} {...podcast} />
              </Item>
            ))}
          {podcasts.length == 0 && type === "private" && (
            <div className={classes.empty}>
              aún no has creado podcasts,
              <br />
              pulsa el botón
              <IconButton className={classes.tete}>
                <AddCircleOutlineIcon color="primary" />
              </IconButton>
              para crear uno.
            </div>
          )}
        </List>
      )}
    </>
  );

  const renderPortada = () => {
    return (
      podcast && (
        <PodcastPortada key={podcast.uid + "3"} {...podcast} type={type} />
      )
    );
  };

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setPodcast(null);
  };

  return (
    <>
      {podcasts && (
        <Fragment>
          {type === "private" && (
            <HeaderAddPodcast
              titulo={"Podcasts"}
              userId={userId}
            ></HeaderAddPodcast>
          )}
          {loaded && podcasts.length != 0 && type === "public" && (
            <h3 className={classes.spinner}>Podcast</h3>
          )}
          {renderList()}
          <br />
          {renderPortada()}
          {podcast && (
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
