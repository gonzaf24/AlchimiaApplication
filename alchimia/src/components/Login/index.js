import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Error, Image, Form, Div, Link1, Link } from "./styles";
import { Helmet } from "react-helmet";
import { SubmitButton } from "../SubmitButton";
import { useInputValue } from "../../hooks/useInputValue";
import LogoAlchimia from "../../assets/alchimia_logo.png";
import Isesion from "../3d/Isesion";
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

export const Login = ({ error, disabled, onSubmit }) => {
  const email = useInputValue("");
  const password = useInputValue("");
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
        <title>Sign in | Alchimia </title>
        <meta name="description" content={"iniciar sesion en alchimia"} />
      </Helmet>
      <Container>
        <Div>
          <Box display="flex" justifyContent="center">
            <Isesion />
          </Box>
          <Form disabled={disabled} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              type="email"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              disabled={disabled}
              {...email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              disabled={disabled}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...password}
            />
            <br />
            {error && <Error>{error}</Error>}
            <br />
            <br />
            <SubmitButton disabled={disabled}>sign in</SubmitButton>
            <br />
            <br />
            <Grid>
              <div
                className={classes.link}
                onClick={() => {
                  navigate("/registro");
                }}
              >
                Doesn't have an account?{" "}
              </div>
              <div
                className={classes.link1}
                onClick={() => {
                  navigate("/registro");
                }}
              >
                Sign up
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
        Alchimia
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
