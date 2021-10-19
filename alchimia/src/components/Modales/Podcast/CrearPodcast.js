import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useInputValue } from "../../../hooks/useInputValue";
import AddAPhoto from "@material-ui/icons/AddAPhoto";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import { uploadFile, deleteFile } from "react-s3";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import Paper from "@material-ui/core/Paper";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import AudioPlayer from "material-ui-audio-player";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { CONFIG_PODCAST_PORTADA, CONFIG_PODCAST_AUDIO } from "../../../config";

var uniqid = require("uniqid");

const muiTheme = createMuiTheme({});

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Roboto, Helvetica, Arial, sansSerif",
    width: "100%",
    textAlign: "center",
    margin: "0px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  textArea: {
    fontFamily: "Roboto, Helvetica, Arial, sansSerif",
    width: "100%",
    fontSize: "1rem",
  },
  root1: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  stepper: {
    margin: 0,
    padding: 0,
  },
  header: {
    width: "100%",
    textAlign: "center",
    padding: 0,
    marginTop: 10,
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  spinner: {
    justifyContent: "center",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  toprightA: {
    cursor: "pointer",
    position: "absolute",
    right: "25px",
  },
  topPaddin10: {
    paddingTop: "10px",
  },
  table: {
    minWidth: "100%",
  },
  msgError: {
    color: "red",
  },
  okMsg: {
    color: "green",
  },
  paper: {
    fontFamily: "Gotham SSm, Helvetica, Arial, sans-serif",
    letterSpacing: "3px",
    color: "#575a5a",
    fontSize: "1.6em",
    fontWeight: "bold",
    textAlign: "center",
    boxShadow: "none",
  },
  tete: {
    backgroundColor: "#0000001a",
  },

  loopIcon: {
    color: "#3f51b5",
    "&.selected": {
      color: "#0921a9",
    },
    "&:hover": {
      color: "#7986cb",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  playIcon: {
    color: "#f50057",
    "&:hover": {
      color: "#ff4081",
    },
  },
  replayIcon: {
    color: "#e6e600",
  },
  pauseIcon: {
    color: "#0099ff",
  },
  volumeIcon: {
    color: "rgba(0, 0, 0, 0.54)",
  },
  volumeSlider: {
    color: "black",
  },
  progressTime: {
    color: "rgba(0, 0, 0, 0.54)",
  },
  mainSlider: {
    color: "#3f51b5",
    "& .MuiSlider-rail": {
      color: "#7986cb",
    },
    "& .MuiSlider-track": {
      color: "#3f51b5",
    },
    "& .MuiSlider-thumb": {
      color: "#303f9f",
    },
  },
}));

export const CrearPodcast = ({
  submitPodcast,
  okMessage,
  errorMsg,
  loadingStep,
  uid,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPodcast, setLoadingPodcast] = useState(false);
  const [urlPortada, setUrlPortada] = useState("");
  const [nombrePortada, setNombrePortada] = useState("");
  const [msgError, setMsgError] = useState("");
  const [audio, setAudio] = useState("");
  const [nombreAudio, setNombreAudio] = useState("");

  var titulo = useInputValue("");
  var contenido = useInputValue("");
  var autor = useInputValue("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const cerrar = () => {
    setOpen(false);
  };

  const handleClose = (src) => {
    if (src === "delay") {
      setOpen(false);
      setTimeout(function () {}, 4000);
    } else {
      resetFormOnClose();
      setOpen(false);
    }
  };

  const resetFormularioOnSubmit = () => {
    try {
      titulo.reset();
      contenido.reset();
      autor.reset();
      setAudio("");
      setUrlPortada("");
    } catch (error) {
      console.log(error);
    }
  };

  const resetFormOnClose = async () => {
    urlPortada && (await deleteFileFormA(CONFIG_PODCAST_PORTADA, urlPortada));
    audio && (await deleteFileFormA(CONFIG_PODCAST_AUDIO, audio));
    resetFormularioOnSubmit();
  };

  const confirmar = async (event) => {
    setMsgError("");
    event.preventDefault();
    var likes = [];
    likes.push(uid);
    try {
      await submitPodcast({
        titulo: titulo.value,
        fotoPortada: urlPortada,
        contenido: contenido.value,
        autor: autor.value,
        audio: audio,
        likes: likes,
      });
      resetFormularioOnSubmit();
      handleClose("delay");
    } catch {
      return setMsgError("hubo error al crear el Podcast, intente mas tarde");
    }
  };

  const onSelectFilePortada = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoading(true);
      var file = e.target.files[0];
      var nameFilePortadaShow = e.target.files[0].name;
      const name = e.target.files[0].name;
      const lastDot = name.lastIndexOf(".");
      const ext = name.substring(lastDot + 1);
      const fileName = uniqid() + "-" + uid + "." + ext;
      if (nameFilePortadaShow.length > 10) {
        nameFilePortadaShow = nameFilePortadaShow
          .substring(0, 8)
          .concat(" ... " + ext);
      }

      setNombrePortada(nameFilePortadaShow);

      var data = new FormData();
      data.append("file", file, fileName);
      await uploadFile(data.get("file"), CONFIG_PODCAST_PORTADA)
        .then((result) => {
          setLoading(false);
          const url = result.location;
          setUrlPortada(url);
        })
        .catch((error) => {
          setLoading(false);
          console.log("ERRRRRRORRRR : " + error);
        });
    }
  };

  const onSelectFilePodcast = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoadingPodcast(true);
      var file = e.target.files[0];
      var nameFilePodcastShow = e.target.files[0].name;
      const name = e.target.files[0].name;
      const lastDot = name.lastIndexOf(".");
      const ext = name.substring(lastDot + 1);
      const fileName = uniqid() + "-" + uid + "." + ext;
      if (nameFilePodcastShow.length > 10) {
        nameFilePodcastShow = nameFilePodcastShow
          .substring(0, 8)
          .concat(" ... " + ext);
      }
      setNombreAudio(nameFilePodcastShow);
      var data = new FormData();
      data.append("file", file, fileName);
      await uploadFile(data.get("file"), CONFIG_PODCAST_AUDIO)
        .then((result) => {
          setLoadingPodcast(false);
          const url = result.location;
          setAudio(url);
        })
        .catch((error) => {
          setLoadingPodcast(false);
          console.log("ERRRRRRORRRR : " + error);
        });
    }
  };

  const onDeleteFilePortada = async () => {
    setLoading(true);
    const filename = urlPortada.substring(urlPortada.lastIndexOf("/") + 1);
    await deleteFile(filename, CONFIG_PODCAST_PORTADA)
      .then((response) => {
        setLoading(false);
        setUrlPortada(null);
      })
      .catch((err) => {
        setLoading(false);
        console.log("ERRRRRRORRRR : " + err);
        console.error(err);
      });
  };

  const onDeleteFilePodcast = async () => {
    setLoadingPodcast(true);
    const filename = audio.substring(audio.lastIndexOf("/") + 1);
    await deleteFile(filename, CONFIG_PODCAST_AUDIO)
      .then((response) => {
        setLoadingPodcast(false);
        setAudio(null);
      })
      .catch((err) => {
        setLoadingPodcast(false);
        console.log("ERRRRRRORRRR : " + err);
        console.error(err);
      });
  };

  const deleteFileFormA = async (configParam, src) => {
    const filename = src.substring(src.lastIndexOf("/") + 1);
    await deleteFile(filename, configParam)
      .then((response) => {})
      .catch((err) => {
        console.log("ERRRRRRORRRR : " + err);
      });
  };

  return (
    <div>
      <Paper className={classes.paper}>
        <IconButton className={classes.tete} aria-label="add. nuevo">
          <AddCircleOutlineIcon color="primary" onClick={handleClickOpen} />
        </IconButton>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle className={classes.header} id="form-dialog-title">
          New Podcast
        </DialogTitle>
        <DialogActions>
          {!loadingStep && (
            <>
              <form className={classes.root} onSubmit={confirmar}>
                <TextField
                  className={classes.topPaddin10}
                  margin="normal"
                  required
                  type="text"
                  fullWidth
                  id="titulo"
                  label="Title"
                  name="titulo"
                  value={""}
                  autoFocus
                  {...titulo}
                />
                {!loading && !urlPortada && (
                  <Box justifyContent="center" marginTop="15px">
                    <div>foto portada</div>
                    <label htmlFor="contained-button-file">
                      <input
                        style={{ display: "none" }}
                        accept="image/*"
                        type="file"
                        id="contained-button-file"
                        onChange={onSelectFilePortada}
                      ></input>
                      <Fab component="span">
                        <AddAPhoto />
                      </Fab>
                    </label>
                  </Box>
                )}
                {loading && (
                  <div className={classes.spinner}>
                    <CircularProgress />
                  </div>
                )}
                {urlPortada && (
                  <>
                    Cover : {nombrePortada}
                    <DeleteForeverOutlinedIcon
                      style={{ color: "deeppink" }}
                      fontSize="small"
                      onClick={onDeleteFilePortada}
                    ></DeleteForeverOutlinedIcon>
                    <br />
                    <div>
                      <Box id="prueba" justifyContent="center" marginTop="15px">
                        <img
                          height="150"
                          src={urlPortada}
                          alt="imagenPortada"
                        />
                      </Box>
                    </div>
                  </>
                )}
                <br />
                {!loadingPodcast && !audio && (
                  <Box justifyContent="center">
                    <div>add podcast</div>
                    <label htmlFor="contained-button-file1">
                      <input
                        style={{ display: "none" }}
                        accept="audio/mp3"
                        type="file"
                        id="contained-button-file1"
                        onChange={onSelectFilePodcast}
                      ></input>
                      <Fab component="span">
                        <AudiotrackIcon />
                      </Fab>
                    </label>
                  </Box>
                )}
                {loadingPodcast && (
                  <div className={classes.spinner}>
                    <CircularProgress />
                  </div>
                )}
                {audio && (
                  <>
                    <br />
                    <Box
                      className={classes.root}
                      id="prueba"
                      justifyContent="center"
                      marginTop="15px"
                    >
                      Podcast : {nombreAudio}
                      <DeleteForeverOutlinedIcon
                        style={{ color: "deeppink" }}
                        fontSize="small"
                        onClick={onDeleteFilePodcast}
                      ></DeleteForeverOutlinedIcon>
                      <br /> <br />
                      <div className={classes.spinner}>
                        <ThemeProvider theme={muiTheme}>
                          <AudioPlayer useStyles={useStyles} src={audio} />
                        </ThemeProvider>
                      </div>
                    </Box>
                  </>
                )}
                <TextField
                  className={classes.topPaddin10}
                  margin="normal"
                  required
                  type="text"
                  fullWidth
                  id="contenido"
                  label="Content"
                  name="contenido"
                  {...contenido}
                />
                <TextField
                  className={classes.topPaddin10}
                  margin="normal"
                  required
                  type="text"
                  fullWidth
                  id="autor"
                  label="Author"
                  name="autor"
                  {...autor}
                />
                <br /> <br />
                <div className={classes.root}>
                  <Button onClick={handleClose} className={classes.backButton}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Confirm
                  </Button>
                </div>
              </form>
            </>
          )}
          {loadingStep && (
            <div className={classes.root}>
              <div className={classes.spinner}>
                <CircularProgress />
              </div>
            </div>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};
