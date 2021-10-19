import React from "react";
import LogoAlchimia from "../../assets/alchimia_logo-blanco.png";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { navigate } from "@reach/router";

const useStyles = makeStyles((theme) => ({
  link: {
    alignItems: "center",
    color: "#888",
    display: "inline-flex",
    height: "100%",
    justifyContent: "center",
    textDecoration: "none",
    width: "100%",
  },
  link2: {
    justifyContent: "flex-end",
    marginRight: "15px",
    color: "#888",
    display: "inline-flex",
    height: "100%",
    textDecoration: "none",
    width: "100%",
  },
  image: {
    marginLeft: "15px",
  },
  button: {
    color: "white !important",
    textTransform: "lowercase !important",
  },
  nav: {
    background: "#fcfcfc",
    borderBottom: "0px",
    top: 0,
    display: "flex",
    height: "40px",
    left: 0,
    margin: "0px auto",
    maxWidth: "500px",
    position: "fixed",
    right: 0,
    width: "100%",
    zIndex: 1000,
    backgroundColor: "#e91e63",
    justifyContent: "space-around",
    alignItems: "center",
  },
}));

export const NavBarPublic = () => {
  const classes = useStyles();

  return (
    <nav className={classes.nav}>
      <div className={classes.link}>
        <img className={classes.image} src={LogoAlchimia} />
      </div>
      <div className={classes.link2}>
        <Button
          className={classes.button}
          onClick={() => {
            navigate("/login");
          }}
        >
          sign in
        </Button>
      </div>
    </nav>
  );
};
