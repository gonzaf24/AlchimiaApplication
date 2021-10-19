import React, { Fragment, useContext } from "react";
import { Context } from "../Context";
import { Layout } from "../components/Layout";
import { ListOfAlbums } from "../components/ListOfAlbums";
import { ListOfPodcasts } from "../components/ListOfPodcasts";
import { ListOfActividades } from "../components/ListOfActividades";
import { DivHeader1 } from "../components/Layout/styles";

export const Adm = ({ id }) => {
  const { removeAuth } = useContext(Context);

  return (
    <Layout>
      <br />
      <ListOfAlbums userId={id} type={"private"} />
      <br />
      <br />
      <DivHeader1 />
      <br />
      <br />
      <ListOfPodcasts userId={id} type={"private"} />
      <br />
      <br />
      <DivHeader1 />
      <br />
      <br />
      <ListOfActividades userId={id} type={"private"} />
      <br />
      <br />
      <DivHeader1 />
      <br />
      <br />
      <br />
    </Layout>
  );
};
