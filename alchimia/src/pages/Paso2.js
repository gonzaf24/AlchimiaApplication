import React, { useContext } from "react";
import { Context } from "../Context";
import { Paso2 as Paso2Component } from "../components/Pasos/2";
import { uploadFile } from "react-s3";
import { navigate } from "@reach/router";
import { useMutation } from "@apollo/react-hooks";
import { CONFIG_AVATAR } from "../config";
import { EDIT_USER } from "../container/UsuarioMutation";
import Spinner from "react-spinner-material";

export const Paso2 = () => {
  const { user, userAuth } = useContext(Context);
  const [editUserMutation, { loading, error }] = useMutation(EDIT_USER);
  var errorMsg = error && " : - hubo error al procesar la solicitud";
  const onSubmitPaso2 = async ({ file }) => {
    var input = "";
    await uploadFile(file, CONFIG_AVATAR)
      .then((result) => {
        const avatar = result.location;
        input = {
          uid: user.uid,
          avatar,
          notificar: false,
          nomRef1: "",
          linkRef1: "",
        };
      })
      .catch((error) => {
        errorMsg = error;
      });
    const { data, error } = await editUserMutation({
      variables: { input },
    });

    if (data) {
      const { editarUsuario } = data;
      userAuth(editarUsuario);
      navigate(`/home/${editarUsuario.uid}`);
    }
  };

  if (loading) return <Spinner size={220} color={"#c2185b"} visible={true} />;

  if (error) return <p>An error has occurred{error}</p>;

  return (
    <>
      <Paso2Component
        disabled={loading}
        error={errorMsg}
        onSubmit={onSubmitPaso2}
      />
    </>
  );
};
