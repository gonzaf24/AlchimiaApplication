import React, { useContext, Fragment, useEffect, useState } from "react";
import { AlbumPreview, AlbumPortada } from "../AlbumPreview";
import { HeaderAddAlbum } from "../HeaderAddAlbum";
import { List, Item } from "./styles";
import { useMutation } from "@apollo/react-hooks";
import { Context } from "../../Context";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { GET_ALBUMS } from "../../container/AlbumMutation";

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
  colorEdit: {
    color: "#E91E63",
    backgroundColor: "#1914154a",
    borderRadius: "100%",
    padding: "10px",
  },
}));

export const ListOfAlbums = ({ userId, type }) => {
  const classes = useStyles();
  const [album, setAlbum] = useState("");
  const [loaded, setLoaded] = useState(false);
  const { albums, setAlbums, actualizoAlbum } = useContext(Context);
  const [albumsPublic, setAlbumsPublic] = useState([albums]);
  const [obtenerAlbums, { data, loading, error }] = useMutation(GET_ALBUMS);
  const [expanded, setExpanded] = React.useState(false);

  useEffect(() => {
    async function fetchData() {
      const result = await obtenerAlbums({
        variables: { userId: userId },
      });
      const { albums } = result.data;

      if (error) {
      }
      setAlbumsPublic(albums);
      setAlbums(albums);
      setAlbum(null);
      setLoaded(true);
    }
    fetchData();
  }, [actualizoAlbum, userId]);

  const renderList = (fixed) => (
    <>
      {!loaded ? (
        <div className={classes.spinner}>
          <CircularProgress />
        </div>
      ) : (
        <List fixed={fixed}>
          {albumsPublic &&
            albumsPublic.map((album) => (
              <Item
                key={album.uid + "1"}
                onClick={async () => {
                  await setAlbum(null);
                  setAlbum(album);
                }}
              >
                <AlbumPreview key={album.uid + "2"} {...album} />
              </Item>
            ))}
          {albumsPublic.length == 0 && type === "private" && (
            <div className={classes.empty}>
              aún no has creado albums,
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

  const handleExpandClick = () => {
    setAlbum(null);
  };

  const renderPortada = () => {
    return (
      album && <AlbumPortada key={album.uid + "3"} {...album} type={type} />
    );
  };

  return (
    <>
      {albumsPublic && (
        <Fragment>
          {type === "private" && (
            <HeaderAddAlbum titulo={"My Art+"} userId={userId}></HeaderAddAlbum>
          )}
          {loaded && albumsPublic.length != 0 && type === "public" && (
            <h3 className={classes.spinner}>My Art+</h3>
          )}
          {renderList()}
          <br />
          {renderPortada()}
          {album && (
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
