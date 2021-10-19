import React, { useContext } from "react";
import { Context } from "../Context";
import { Recuperar as RecuperarComponent } from "../components/Recuperar";
import { RecoverMutation } from "../container/RegisterMutation";
import Container from "@material-ui/core/Container";

export const Recuperar = () => {
  const { activateAuth } = useContext(Context);

  return (
    <>
      <RecoverMutation>
        {(recuperarPsw, { data, loading, error }) => {
          const onSubmit = ({ email, password }) => {
            const input = { email, password };
            const variables = { input };
            recuperarPsw({ variables }).then(({ data }) => {
              //console.log("esto llega de la respuesta : " + data.value);
            });
          };

          const errorMsg = error && "usuario no existe o password incorrecta.";

          return (
            <Container>
              <RecuperarComponent
                disabled={loading}
                error={errorMsg}
                onSubmit={onSubmit}
              ></RecuperarComponent>
            </Container>
          );
        }}
      </RecoverMutation>
    </>
  );
};
