import React, { useState, useContext, useEffect } from "react";
import { Context } from "../Context";
import { GET_ALBUM_POR_ID } from "../container/AlbumMutation";
import { Layout } from "../components/Layout";
import { useMutation } from "@apollo/react-hooks";
import { Album as AlbumPublic } from "../components/Album/index";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  spinner: {
    justifyContent: "center",
    textAlign: "center",
    paddingTop: "300px",
  },
}));

export const Album = ({ id }) => {
  const classes = useStyles();
  const { user } = useContext(Context);
  const [obtenerAlbum, {}] = useMutation(GET_ALBUM_POR_ID);
  const [album, setAlbum] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await obtenerAlbum({
        variables: { albumId: id },
      });
      if (result) {
        const { album } = result.data;
        setAlbum(album);
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
          <AlbumPublic loading={loading} album={album} />
        )}
      </Layout>
    </>
  );
};
