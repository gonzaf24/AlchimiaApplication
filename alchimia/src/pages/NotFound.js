import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { navigate } from "@reach/router";
import Box from "@material-ui/core/Box";
import LogoAlchimia from "../assets/alchimia_logo.png";
import { Context } from "../Context";

const useStyles = makeStyles((theme) => ({
  textNotFound: {
    color: "white",
    marginTop: "50px",
    textAlign: "center",
  },
  buttonsClass: {
    width: "100%",
    textAlign: "center",
    marginTop: "80px",
  },
  atras: {
    width: "100%",
    textAlign: "center",
    marginTop: "80px",
  },
  btnLeft: {
    float: "left",
    marginLeft: "35px",
  },
  btnRight: {
    float: "right",
    marginRight: "35px",
  },
  image: {
    width: "200px",
    height: "200px",
    textAlign: "center",
    marginTop: "100px",
  },
}));

export const NotFound = ({ type }) => {
  const classes = useStyles();
  const { user, removeAuth } = useContext(Context);

  return (
    <>
      <Box display="flex" justifyContent="center">
        <img className={classes.image} src={LogoAlchimia} />
      </Box>
      {!type && (
        <h1 className={classes.textNotFound}>This page does not exist! :(</h1>
      )}
      {type && <h1 className={classes.textNotFound}>{type} not exist! :(</h1>}

      {user && user.uid && (
        <div className={classes.atras}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              window.history.go(-2);
            }}
          >
            back
          </Button>
        </div>
      )}

      {!user && (
        <div className={classes.buttonsClass}>
          <Button
            className={classes.btnLeft}
            variant="outlined"
            color="primary"
            onClick={() => {
              navigate("/login");
            }}
          >
            Sign in
          </Button>
          <Button
            className={classes.btnRight}
            variant="outlined"
            color="primary"
            onClick={() => {
              navigate("/registro");
            }}
          >
            Sign up
          </Button>
        </div>
      )}
    </>
  );
};
