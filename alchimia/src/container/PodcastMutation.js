import React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";

const NEW_PODCAST = gql`
  mutation newPodcast($input: Podcast!) {
    newPodcast(input: $input)
  }
`;

export const NewPodcastMutation = ({ children }) => {
  return <Mutation mutation={NEW_PODCAST}>{children}</Mutation>;
};

export const LIKE_PODCAST = gql`
  mutation likePodcast($input: ParamPodcast!) {
    likePodcast(input: $input) {
      likes
    }
  }
`;

export const GET_PODCASTS = gql`
  mutation podcasts($userId: ID!) {
    podcasts(userId: $userId) {
      titulo
      fotoPortada
      contenido
      autor
      audio
      uid
      fechaCreacion
      likes
    }
  }
`;

export const EDIT_PODCAST = gql`
  mutation editarPodcast($input: Podcast!) {
    editarPodcast(input: $input)
  }
`;

export const DELETE_PODCAST = gql`
  mutation eliminarPodcast($podcastId: ID!) {
    eliminarPodcast(podcastId: $podcastId)
  }
`;

export const GET_PODCAST_BY_ID = gql`
  mutation podcast($podcastId: ID!) {
    podcast(podcastId: $podcastId) {
      titulo
      fotoPortada
      contenido
      autor
      audio
      uid
      fechaCreacion
      likes
      email
      nombre
      apellido
      pais
      estadoCiudad
      avatar
    }
  }
`;
