import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";
import { Context } from "../Context";
import { Usuario } from "../components/Usuario";

export const EDIT_USER = gql`
  mutation editarUsuario($input: UsuarioInput!) {
    editarUsuario(input: $input) {
      apellido
      avatar
      email
      estadoCiudad
      fechaCreacion
      fechaNacimiento
      nombre
      notificar
      pais
      profesiones
      intereses
      sexo
      status
      telefono
      uid
      seguidores
      seguidos
      nomRef1
      linkRef1
    }
  }
`;

export const EditarUsuario = ({ children }) => {
  return <Mutation mutation={EDIT_USER}>{children}</Mutation>;
};

export const GET_USER_BY_ID = gql`
  mutation usuario($userId: ID!) {
    usuario(userId: $userId) {
      apellido
      avatar
      email
      estadoCiudad
      fechaCreacion
      fechaNacimiento
      nombre
      notificar
      pais
      profesiones
      intereses
      sexo
      status
      telefono
      uid
      seguidores
      seguidos
      nomRef1
      linkRef1
    }
  }
`;

export const FOLLOW = gql`
  mutation follow($input: ParamFollow!) {
    follow(input: $input) {
      seguidor {
        uid
        email
        fechaCreacion
        notificar
        status
        sexo
        nombre
        apellido
        fechaNacimiento
        telefono
        pais
        estadoCiudad
        profesiones
        intereses
        avatar
        seguidores
        seguidos
      }
      seguido {
        uid
        email
        fechaCreacion
        notificar
        status
        sexo
        nombre
        apellido
        fechaNacimiento
        telefono
        pais
        estadoCiudad
        profesiones
        intereses
        avatar
        seguidores
        seguidos
      }
    }
  }
`;

export const VER_PERFILES = gql`
  mutation perfiles($input: IdsInput!) {
    perfiles(input: $input) {
      email
      nombre
      apellido
      avatar
      uid
    }
  }
`;

const GET_USER_BY_ID_QUERY = gql`
  query getUserById($userId: ID!) {
    usuarioQuery(userId: $userId) {
      apellido
      avatar
      email
      estadoCiudad
      fechaCreacion
      fechaNacimiento
      nombre
      notificar
      pais
      profesiones
      intereses
      sexo
      status
      telefono
      uid
      seguidores
      seguidos
      nomRef1
      linkRef1
    }
  }
`;

const renderProp = ({ loading, error, data }) => {
  const { userAuth } = useContext(Context);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (data) {
    const { usuarioQuery } = data;
    return <Usuario loading={loading} usuario={usuarioQuery} />;
  }
  return "";
};

export const ObtenerUsuarioById = ({ userId }) => {
  return (
    <Query query={GET_USER_BY_ID_QUERY} variables={{ userId }}>
      {renderProp}
    </Query>
  );
};
