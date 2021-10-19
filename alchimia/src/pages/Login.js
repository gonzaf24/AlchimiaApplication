import React, { useContext } from "react";
import Container from "@material-ui/core/Container";
import { Context } from "../Context";
import { Login as LoginComponent } from "../components/Login";
import { LoginMutation } from "../container/LoginMutation";
import { navigate } from "@reach/router";

export const Login = () => {
  const { activateAuth, removeAuth } = useContext(Context);

  return (
    <>
      <LoginMutation>
        {(login, { data, loading, error }) => {
          const onSubmit = ({ email, password }) => {
            removeAuth();
            const input = { email, password };
            const variables = { input };
            login({ variables }).then(({ data }) => {
              const { login } = data;
              activateAuth(login);
              window.localStorage.setItem("user", login);
              login.notificar
                ? navigate("/paso1")
                : navigate(`/home/${login.uid}`);
            });
          };
          const errorMsg = error && "user does not exist or wrong password.";
          return (
            <Container>
              <LoginComponent
                disabled={loading}
                error={errorMsg}
                onSubmit={onSubmit}
              ></LoginComponent>
            </Container>
          );
        }}
      </LoginMutation>
    </>
  );
};
