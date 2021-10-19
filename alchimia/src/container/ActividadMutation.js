import React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { Actividad } from "../components/Actividad/index";

const NEW_ACTIVIDAD = gql`
  mutation newActividad($input: Actividad!) {
    newActividad(input: $input)
  }
`;

export const NewActividadMutation = ({ children }) => {
  return <Mutation mutation={NEW_ACTIVIDAD}>{children}</Mutation>;
};

export const GET_ACTIVIDADES = gql`
  mutation actividades($userId: ID!) {
    actividades(userId: $userId) {
      titulo
      fechaInicio
      fechaFin
      fotoPortada
      fechaCreacion
      horaInicio
      horaFin
      pais
      direccion
      estadoCiudad
      tags
      contenido
      uid
      apuntados
      likes
    }
  }
`;

export const EDIT_ACTIVIDAD = gql`
  mutation editarActividad($input: Actividad!) {
    editarActividad(input: $input)
  }
`;

export const DELETE_ACTIVIDAD = gql`
  mutation eliminarActividad($actividadId: ID!) {
    eliminarActividad(actividadId: $actividadId)
  }
`;

export const APUNTARSE_ACTIVIDAD = gql`
  mutation apuntarseActividad($input: ParamActividad!) {
    apuntarseActividad(input: $input) {
      apuntados
    }
  }
`;

export const LIKE_ACTIVIDAD = gql`
  mutation likeActividad($input: ParamActividad!) {
    likeActividad(input: $input) {
      likes
    }
  }
`;

const GET_ACTIVIDAD_BY_ID = gql`
  query getActividadById($actividadId: ID!) {
    actividad(actividadId: $actividadId) {
      titulo
      fechaInicio
      fechaFin
      fotoPortada
      horaInicio
      horaFin
      fechaCreacion
      pais
      direccion
      estadoCiudad
      tags
      contenido
      uid
      email
      nombre
      apellido
      pais
      estadoCiudad
      avatar
      apuntados
      likes
    }
  }
`;

export const GET_ACTIVIDAD_POR_ID = gql`
  mutation actividad($actividadId: ID!) {
    actividad(actividadId: $actividadId) {
      titulo
      fechaInicio
      fechaFin
      fotoPortada
      horaInicio
      horaFin
      fechaCreacion
      pais
      direccion
      estadoCiudad
      tags
      contenido
      uid
      email
      nombre
      apellido
      pais
      estadoCiudad
      avatar
      apuntados
      likes
    }
  }
`;

const renderProp = ({ loading, error, data }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (data) {
    const { actividad } = data;
    return <Actividad loading={loading} actividad={actividad} />;
  }
  return "";
};

export const ObtenerActividadPorId = ({ actividadId }) => {
  return (
    <Query query={GET_ACTIVIDAD_BY_ID} variables={{ actividadId }}>
      {renderProp}
    </Query>
  );
};
