import React, { useContext } from "react";
import { Context } from "../Context";
import { Registro as RegistroComponent } from "../components/Registro";
import { RegisterMutation } from "../container/RegisterMutation";
import { navigate } from "@reach/router";
import Container from "@material-ui/core/Container";

export const Registro = () => {
  const { activateAuth } = useContext(Context);

  return (
    <>
      <RegisterMutation>
        {(signup, { data, loading, error }) => {
          const onSubmit = ({ email, password }) => {
            const input = { email, password };
            const variables = { input };
            signup({ variables }).then(({ data }) => {
              const { signup } = data;
              navigate("/login");
            });
          };
          const okMessage = data && "User created successfully!. Haz login.";

          const errorMsg = error && "User does not exist or wrong password.";
          return (
            <Container>
              <RegistroComponent
                disabled={loading}
                error={errorMsg}
                okMessage={okMessage}
                onSubmit={onSubmit}
              ></RegistroComponent>
            </Container>
          );
        }}
      </RegisterMutation>
    </>
  );
};
