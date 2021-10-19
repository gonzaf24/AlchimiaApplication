import React, { useContext } from "react";
import { Nav, TextoMove } from "./styles";
import AudioPlayer from "material-ui-audio-player";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { MdHighlightOff } from "react-icons/md";
import { Context } from "../../Context";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "auto",
    position: "absolute",
    right: 0,
    left: 0,
    textAlign: "center",
    margin: "0px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    height: "-webkit-fill-available",
    borderRadius: "0px",
  },
  textoMueve: {
    whiteSpace: "nowrap",
    background: "transparent",
    boxShadow: "none",
    marginRight: "15px",
  },
  textoMueveA: {
    whiteSpace: "nowrap",
    background: "transparent",
    boxShadow: "none",
    zIndex: 1500,
  },
}));

const SIZE = "32px";

export const Reproductor = () => {
  const { setAbrirReproductor, audio, setAudio } = useContext(Context);

  const cierroAudio = () => {
    setAudio("");
    setAbrirReproductor(false);
  };
  const classes = useStyles();

  return !audio || !audio.audio ? (
    ""
  ) : (
    <>
      {audio.titulo && (
        <Nav>
          <div className={classes.textoMueveA}>
            <Grid container spacing={0}>
              <Grid item xs={11} sm={11}>
                <Paper className={classes.textoMueve}>
                  <TextoMove>
                    {audio.autor}
                    {" - "} {audio.titulo}
                  </TextoMove>
                </Paper>
              </Grid>
              <Grid item xs={1} sm={1} className={classes.textoMueveA}>
                <Paper className={classes.textoMueveA}>
                  <button>
                    <MdHighlightOff
                      size={SIZE}
                      onClick={() => {
                        cierroAudio();
                      }}
                      float="right"
                      cursor="pointer"
                    />
                  </button>
                </Paper>
              </Grid>
            </Grid>
          </div>
          <AudioPlayer
            preload="metadata"
            variation="primary"
            useStyles={useStyles}
            src={audio.audio}
            elevation={5}
            width="100%"
            controls={true}
          />
        </Nav>
      )}
    </>
  );
};
