import React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";

export const WALL = gql`
  mutation wall($userId: ID!) {
    wall(userId: $userId) {
      uid
      fechaCreacion
      contenido
      titulo
      fechaFin
      fechaInicio
      fotoPortada
      horaFin
      horaInicio
      pais
      estadoCiudad
      tags
      apuntados
      likes
      like
      type
      email
      autor
      audio
      nombre
      apellido
      avatar
      subtitulo
      fotos
      profesiones
      intereses
    }
  }
`;

export const SEARCH_WALL = gql`
  mutation searchWall($input: Search!) {
    searchWall(input: $input) {
      uid
      fechaCreacion
      contenido
      titulo
      fechaFin
      fechaInicio
      fotoPortada
      horaFin
      horaInicio
      pais
      estadoCiudad
      tags
      apuntados
      likes
      like
      type
      email
      autor
      audio
      nombre
      apellido
      avatar
      subtitulo
      fotos
      profesiones
      intereses
    }
  }
`;
