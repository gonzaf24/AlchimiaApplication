import React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { Album } from "../components/Album/index";

const NEW_ALBUM = gql`
  mutation newAlbum($input: Album!) {
    newAlbum(input: $input)
  }
`;

export const NewAlbumMutation = ({ children }) => {
  return <Mutation mutation={NEW_ALBUM}>{children}</Mutation>;
};

export const GET_ALBUMS = gql`
  mutation albums($userId: ID!) {
    albums(userId: $userId) {
      autor
      contenido
      fechaCreacion
      fotoPortada
      fotos
      subtitulo
      titulo
      uid
      likes
    }
  }
`;

export const LIKE_ALBUM = gql`
  mutation likeAlbum($input: ParamAlbum!) {
    likeAlbum(input: $input) {
      likes
    }
  }
`;

export const EDIT_ALBUM = gql`
  mutation editarAlbum($input: Album!) {
    editarAlbum(input: $input)
  }
`;

export const DELETE_ALBUM = gql`
  mutation eliminarAlbum($albumId: ID!) {
    eliminarAlbum(albumId: $albumId)
  }
`;

const GET_ALBUM_BY_ID = gql`
  query getAlbumById($albumId: ID!) {
    album(albumId: $albumId) {
      autor
      contenido
      fechaCreacion
      fotoPortada
      fotos
      subtitulo
      titulo
      uid
      email
      nombre
      apellido
      pais
      estadoCiudad
      avatar
      likes
    }
  }
`;

export const GET_ALBUM_POR_ID = gql`
  mutation album($albumId: ID!) {
    album(albumId: $albumId) {
      autor
      contenido
      fechaCreacion
      fotoPortada
      fotos
      subtitulo
      titulo
      uid
      email
      nombre
      apellido
      pais
      estadoCiudad
      avatar
      likes
    }
  }
`;

const renderProp = ({ loading, error, data }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (data) {
    const { album } = data;
    return <Album loading={loading} album={album} />;
  }
  return "";
};

export const ObtenerAlbumPorId = ({ albumId }) => {
  return (
    <Query query={GET_ALBUM_BY_ID} variables={{ albumId }}>
      {renderProp}
    </Query>
  );
};
