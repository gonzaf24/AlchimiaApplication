import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Error, Image, Form, Div, Link, Link1 } from "./styles";
import { Helmet } from "react-helmet";
import { SubmitButton } from "../SubmitButton";
import { useInputValue } from "../../hooks/useInputValue";
import LogoAlchimia from "../../assets/alchimia_logo.png";
import RecuperarLogo from "../3d/Recuperar";
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

export const Recuperar = ({ error, disabled, onSubmit }) => {
  const email = useInputValue("");
  const classes = useStyles();

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      email: email.value,
      password: "xxxxxxxxxxxxxxx",
    });
  };

  return (
    <>
      <Helmet>
        <title>Recover | Alchimia </title>
        <meta
          name="description"
          content={"recuperar la password en alchimia"}
        />
      </Helmet>
      <Container>
        <Div>
          <Box display="flex" justifyContent="center">
            <RecuperarLogo />
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
            <br />
            {error && <Error>{error}</Error>}
            <br />
            <br />

            <SubmitButton disabled={disabled}>recover</SubmitButton>
            <br />
            <br />
            <Grid>
              <div
                className={classes.link}
                onClick={() => {
                  navigate("/login");
                }}
              >
                go to
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
