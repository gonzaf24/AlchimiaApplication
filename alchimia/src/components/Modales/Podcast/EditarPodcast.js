import React, { useState, useContext } from "react";
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
import { Context } from "../../../Context";
import { useMutation } from "@apollo/react-hooks";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ConfirmDialog from "../../ConfirmDialog/index";
import {
  EDIT_PODCAST,
  DELETE_PODCAST,
} from "../../../container/PodcastMutation";
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
  botonSetting: {
    cursor: "pointer",
    position: "absolute",
    right: 20,
    top: 10,
    zIndex: "2",
    fontSize: 30,
    color: "#E91E63 !important",
    backgroundColor: "#191415c2 !important",
    borderRadius: "100%",
    padding: "10px",
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
    textAlign: "center",
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

const ITEM_HEIGHT = 40;

const options = ["Ver", "Editar", "Eliminar"];

export const EditarPodcast = ({
  okMessage,
  errorMsg,
  loadingStep,

  tituloA,
  fotoPortadaA,
  contenidoA,
  autorA,
  audioA,
  uid,
  fechaCreacion,
  likes,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPodcast, setLoadingPodcast] = useState(false);
  const [urlPortada, setUrlPortada] = useState(fotoPortadaA);
  const [nombrePortada, setNombrePortada] = useState(() => {
    return fotoPortadaA
      ? fotoPortadaA.substring(fotoPortadaA.lastIndexOf("/") + 1)
      : "";
  });

  const [msgError, setMsgError] = useState("");
  const [audio, setAudio] = useState(audioA);
  const [nombreAudio, setNombreAudio] = useState(() => {
    return audioA ? audioA.substring(audioA.lastIndexOf("/") + 1) : "";
  });

  var titulo = useInputValue(tituloA);
  var contenido = useInputValue(contenidoA);
  var autor = useInputValue(autorA);

  const { actualizoPodcast, setActualizoPodcast } = useContext(Context);
  const [editarPodcast, { data, loadingA, error }] = useMutation(EDIT_PODCAST);

  const [eliminarPodcast, { dataB, loadingB, errorB }] = useMutation(
    DELETE_PODCAST
  );

  const [anchorEl, setAnchorEl] = useState(null);

  const openMenu = Boolean(anchorEl);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
    if (event === "Editar") {
      setOpen(true);
      setAnchorEl(null);
    } else if (event === "Eliminar") {
      setConfirmOpen(true);
    } else if (event === "Ver") {
    }
  };

  const confirmDelete = async () => {
    const dataA = await eliminarPodcast({
      variables: { podcastId: uid },
    });
    if (actualizoPodcast == true) {
      setActualizoPodcast(false);
    } else {
      setActualizoPodcast(true);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClose = (src) => {
    if (src === "delay") {
      setOpen(false);
      setTimeout(function () {}, 4000);
    } else {
      resetFormOnClose();
      setOpen(false);
    }
    if (actualizoPodcast == true) {
      setActualizoPodcast(false);
    } else {
      setActualizoPodcast(true);
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
    //urlPortada && (await deleteFileFormA(config, urlPortada));
    //audio && (await deleteFileFormA(configAudio, audio));
    resetFormularioOnSubmit();
  };

  const confirmar = async (event) => {
    event.preventDefault();
    setMsgError("");
    if (!audio || audio === "") {
      setMsgError(" *Debe agregar un podcast.");
    } else {
      try {
        const input = {
          titulo: titulo.value,
          fotoPortada: urlPortada,
          contenido: contenido.value,
          autor: autor.value,
          audio: audio,
          uid: uid,
          fechaCreacion: fechaCreacion,
          likes: likes,
        };
        const dataA = await editarPodcast({
          variables: { input },
        });
        if (actualizoPodcast == true) {
          setActualizoPodcast(false);
        } else {
          setActualizoPodcast(true);
        }
        resetFormularioOnSubmit();
        handleClose("delay");
      } catch {
        return setMsgError("hubo error al crear el Podcast, intente mas tarde");
      }
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
        <IconButton
          className={classes.botonSetting}
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClickMenu}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={openMenu}
          onClose={handleCloseMenu}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "9ch",
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option}
              onClick={() => {
                handleClickMenu(option);
              }}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </Paper>

      <div>
        <ConfirmDialog
          title="ELIMINAR PODCAST"
          open={confirmOpen}
          setOpen={setConfirmOpen}
          onConfirm={confirmDelete}
          state={"delete"}
        >
          ¿delete podcast?
        </ConfirmDialog>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle className={classes.header} id="form-dialog-title">
          Edit Podcast
        </DialogTitle>
        {msgError && <div className={classes.msgError}>{msgError}</div>}

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
                    <div>cover photo</div>
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
                    Portada : {nombrePortada}
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
