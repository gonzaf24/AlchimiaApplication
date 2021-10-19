import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { OKMessage, Error, Image, Form, Div, Link, Link1 } from "./styles";
import { Helmet } from "react-helmet";
import { SubmitButton } from "../SubmitButton";
import { useInputValue } from "../../hooks/useInputValue";
import LogoAlchimia from "../../assets/alchimia_logo.png";
import Register from "../3d/Register";
import { navigate } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  link: {
    color: "rgba(0, 0, 0, 0.65) !important",
    fontSize: "11px",
  },
  link1: {
    color: "green !important",
    fontSize: "11px",
  },
}));

export const Registro = ({ error, disabled, okMessage, onSubmit }) => {
  const email = useInputValue("");
  const password = useInputValue("");
  const password1 = useInputValue("");
  const classes = useStyles();

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      email: email.value,
      password: password.value,
    });
  };

  return (
    <>
      <Helmet>
        <title>Sign up | Alchimia </title>
        <meta name="description" content={"registrarse en alchimia"} />
      </Helmet>
      <Container>
        <Div>
          <Box display="flex" justifyContent="center">
            <Register />
          </Box>
          <Form disabled={disabled} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="email"
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              {...email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...password}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password1"
              label="Repetir Password"
              type="password"
              id="password1"
              autoComplete="current-password"
              {...password1}
            />
            <br />
            <br />
            <Typography
              style={{
                fontSize: "9px",
              }}
            >
              <span fontSize="9px">
                Confirm your majority of
                <br />
                age and accept the
                <a className="text-warning"> terms of use </a>
                <br />
                and
                <a className="text-warning"> Privacy Policy </a>.
              </span>
            </Typography>
            <br />
            {error && (
              <Error>
                {" "}
                {error}
                <br />
              </Error>
            )}
            {okMessage && (
              <OKMessage>
                {" "}
                {okMessage}
                <br />
              </OKMessage>
            )}
            <SubmitButton disabled={disabled}>sign up</SubmitButton>
            <br />
            <br />
            <Grid>
              <div
                className={classes.link}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Have an account?{" "}
              </div>
              <div
                className={classes.link1}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Sign in
              </div>
            </Grid>
            <br />
            <Grid>
              <div
                className={classes.link}
                onClick={() => {
                  navigate("/recuperar");
                }}
              >
                recover
              </div>
            </Grid>
          </Form>
          <Box mt={2}>
            <Copyright />
          </Box>
        </Div>
      </Container>
    </>
  );
};

function Copyright() {
  return (
    <Typography
      style={{
        fontSize: "10px",
      }}
      variant="body2"
      color="textSecondary"
      align="center"
    >
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        gonza
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
