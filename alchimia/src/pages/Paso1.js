import React, { useContext } from "react";
import { Context } from "../Context";
import { Paso1 as Paso1Component } from "../components/Pasos/1";
import { EditarUsuario } from "../container/UsuarioMutation";
import { navigate } from "@reach/router";

export const Paso1 = () => {
  const { user, userAuth } = useContext(Context);

  return (
    <EditarUsuario>
      {(editarUsuario, { data, loading, error }) => {
        const onSubmit = ({
          sexo,
          nombre,
          apellido,
          fechaNacimiento,
          telefono,
          pais,
          estadoCiudad,
          profesiones,
          intereses,
          seguidores,
          seguidos,
          nomRef1,
          linkRef1,
        }) => {
          const input = {
            uid: user.uid,
            sexo,
            nombre,
            apellido,
            fechaNacimiento,
            telefono,
            pais,
            estadoCiudad,
            profesiones,
            intereses,
            seguidores,
            seguidos,
            nomRef1,
            linkRef1,
          };
          const variables = { input };
          editarUsuario({ variables }).then(({ data }) => {
            const { editarUsuario } = data;
            userAuth(editarUsuario);
            navigate("/paso2");
          });
        };

        const errorMsg = error && " : - hubo error al procesar la solicitud";

        return (
          <Paso1Component
            disabled={loading}
            error={errorMsg}
            onSubmit={onSubmit}
            userID={user.uid}
          />
        );
      }}
    </EditarUsuario>
  );
};
