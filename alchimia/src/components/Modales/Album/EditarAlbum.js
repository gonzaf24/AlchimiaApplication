import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useInputValue } from "../../../hooks/useInputValue";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import AddAPhoto from "@material-ui/icons/AddAPhoto";
import Fab from "@material-ui/core/Fab";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import { uploadFile, deleteFile } from "react-s3";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import { useMutation } from "@apollo/react-hooks";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Context } from "../../../Context";
import CloseIcon from "@material-ui/icons/Close";
import ConfirmDialog from "../../ConfirmDialog/index";
import { EDIT_ALBUM, DELETE_ALBUM } from "../../../container/AlbumMutation";
import { CONFIG_ALBUM } from "../../../config";

var uniqid = require("uniqid");

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Roboto, Helvetica, Arial, sansSerif",
    width: "100%",
    textAlign: "center",
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
    top: 10,
    right: 20,
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
  modal: {
    position: "fixed",
    zIndex: 1,
    maxWidth: "290px",
    maxHeight: "500px",
    top: "25%",
    overflow: "auto",
    backgroundColor: "#fefefe",
    border: "3px solid #e91e63",
  },
  modalContent: {
    backgroundColor: "#fefefe",
    display: "grid",
    justifyItems: "center",
    margin: "20px",
  },
  closeModalPreview: {
    textAlign: "right",
    color: "#e91e63",
    fontWeight: "bold",
  },
  pointer: {
    cursor: "pointer",
  },
}));

function getSteps() {
  return ["Cover", "Photos", "Content"];
}

const ITEM_HEIGHT = 40;
const options = ["Watch", "Edit", "Delete"];

export const EditarAlbum = ({
  okMessage,
  errorMsg,
  loadingStep,
  tituloA,
  subtituloA,
  fotoPortadaA,
  contenidoA,
  autorA,
  fotosA,
  uid,
  fechaCreacion,
  likes,
}) => {
  const [rows, setRows] = useState(() => {
    var prueba = [];
    if (fotosA) {
      for (let i = 0; i < fotosA.length; i++) {
        const filename = fotosA[i].substring(fotosA[i].lastIndexOf("/") + 1);
        prueba.push({ nombre: filename, accion: fotosA[i] });
      }
    }
    return prueba;
  });
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [urlPortada, setUrlPortada] = useState(fotoPortadaA);
  const [nombrePortada, setNombrePortada] = useState("");
  const [msgError, setMsgError] = useState("");
  const steps = getSteps();

  var titulo = useInputValue(tituloA);
  var subtitulo = useInputValue(subtituloA);
  var contenido = useInputValue(contenidoA);
  var autor = useInputValue(autorA);

  const { actualizoAlbum, setActualizoAlbum } = useContext(Context);
  const [editarAlbum, { data, loadingA, error }] = useMutation(EDIT_ALBUM);

  const [eliminarAlbum, { dataB, loadingB, errorB }] = useMutation(
    DELETE_ALBUM
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
    if (event === "Editar") {
      setOpen(true);
      setActiveStep(0);
      setAnchorEl(null);
    } else if (event === "Eliminar") {
      setConfirmOpen(true);
    } else if (event === "Ver") {
    }
  };

  const confirmDelete = async () => {
    const dataA = await eliminarAlbum({
      variables: { albumId: uid },
    });
    if (actualizoAlbum == true) {
      setActualizoAlbum(false);
    } else {
      setActualizoAlbum(true);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const cerrar = () => {
    setOpen(false);
    setActiveStep(0);
  };

  const handleClose = (src) => {
    if (src === "delay") {
      setTimeout(function () {
        setOpen(false);
        setActiveStep(0);
      }, 4000);
    } else {
      resetFormOnClose();
      setOpen(false);
      setActiveStep(0);
    }
    if (actualizoAlbum == true) {
      setActualizoAlbum(false);
    } else {
      setActualizoAlbum(true);
    }
  };

  const onSelectFilesAlbum = async (e) => {
    setMsgError("");
    e.persist();
    if (
      e.target.files.length > 5 ||
      rows.length > 5 ||
      e.target.files.length + rows.length > 5
    ) {
      return setMsgError("No se puede agregar mas de 5 fotos");
    }

    if (e.target.files && e.target.files.length > 0) {
      for (var i = 0; i < e.target.files.length; i++) {
        setLoading(true);
        var file = e.target.files[i];
        var nameFile = file.name;
        const name = file.name;
        const lastDot = name.lastIndexOf(".");
        const ext = name.substring(lastDot + 1);
        const fileName = uniqid() + "-" + uid + "." + ext;
        if (nameFile.length > 10) {
          nameFile = nameFile.substring(0, 8).concat(" ... " + ext);
        }
        var data = new FormData();
        data.append("file", file, fileName);
        await uploadFile(data.get("file"), CONFIG_ALBUM)
          .then((result) => {
            const url = result.location;
            rows.push({ nombre: nameFile, accion: url });
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            console.log("ERRRRRRORRRR : " + error);
          });
      }
    }
  };

  const resetFormularioOnSubmit = () => {
    try {
      titulo.reset();
      subtitulo.reset();
      contenido.reset();
      autor.reset();
      rows = [];
      setUrlPortada("");
    } catch (error) {
      console.log(error);
    }
  };

  const resetFormOnClose = async () => {
    titulo.reset();
    subtitulo.reset();
    contenido.reset();
    autor.reset();
    rows = [];
    setUrlPortada("");
    setActiveStep(0);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const submitPortada = (event) => {
    event.preventDefault();
    handleNext();
  };

  const submitImagenes = (event) => {
    event.preventDefault();
    setMsgError("");
    if (rows.length == 0) {
      return setMsgError("debe agregar alguna foto al album");
    } else {
      handleNext();
    }
  };

  const confirmar = async (event) => {
    setMsgError("");
    event.preventDefault();
    try {
      var fotosSource = [];
      rows.map((item) => {
        fotosSource.push(item.accion);
      });
      const input = {
        titulo: titulo.value,
        subtitulo: subtitulo.value,
        fotoPortada: urlPortada,
        contenido: contenido.value,
        autor: autor.value,
        fotos: fotosSource,
        uid: uid,
        fechaCreacion: fechaCreacion,
        likes: likes,
      };
      const dataA = await editarAlbum({
        variables: { input },
      });
      if (actualizoAlbum == true) {
        setActualizoAlbum(false);
      } else {
        setActualizoAlbum(true);
      }
      resetFormularioOnSubmit();
      handleNext();
      handleClose("delay");
    } catch {
      return setMsgError("hubo error al crear el album, intente mas tarde");
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
      await uploadFile(data.get("file"), CONFIG_ALBUM)
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

  const onDeleteFilePortada = async () => {
    setLoading(true);
    const filename = urlPortada.substring(urlPortada.lastIndexOf("/") + 1);
    await deleteFile(filename, CONFIG_ALBUM)
      .then((response) => {
        setLoading(false);
        setUrlPortada(null);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const deleteFileFormA = async (src) => {
    const filename = src.substring(src.lastIndexOf("/") + 1);
    await deleteFile(filename, CONFIG_ALBUM)
      .then((response) => {})
      .catch((err) => {
        console.log("ERRRRRRORRRR : " + err);
      });
  };

  const onDeleteFile = async (src) => {
    setMsgError("");
    setLoadingTable(true);
    const filename = src.substring(src.lastIndexOf("/") + 1);
    await deleteFile(filename, CONFIG_ALBUM)
      .then((response) => {
        var prueba = [];
        prueba = rows.filter((item) => item.accion !== src);
        setRows(prueba);
        setLoadingTable(false);
      })
      .catch((err) => {
        setLoadingTable(false);
        console.log("ERRRRRRORRRR : " + err);
      });
  };

  const [openPrevPhoto, setOpenPrevPhoto] = useState(false);
  const [selectedValuePrevPhoto, setSelectedValuePrevPhoto] = useState("");

  const handleClickOpenPrevPhoto = (value) => {
    setOpenPrevPhoto(true);
    setSelectedValuePrevPhoto(value);
  };

  const handleClosePrevPhoto = () => {
    setOpenPrevPhoto(false);
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <form onSubmit={submitPortada}>
              <TextField
                margin="normal"
                required
                type="text"
                fullWidth
                id="titulo"
                label="Titulo"
                name="titulo"
                value={""}
                autoFocus
                {...titulo}
              />
              {!loading && (
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
                  {nombrePortada}
                  <br />
                  <div>
                    <Box id="prueba" justifyContent="center" marginTop="15px">
                      <div className={classes.toprightA}>
                        <DeleteForeverOutlinedIcon
                          style={{ color: "deeppink" }}
                          fontSize="large"
                          onClick={onDeleteFilePortada}
                        ></DeleteForeverOutlinedIcon>
                      </div>
                      <img height="150" src={urlPortada} alt="imagenPortada" />
                    </Box>
                  </div>
                </>
              )}
              <TextField
                margin="normal"
                required
                type="text"
                fullWidth
                id="subtitulo"
                label="Subtitulo"
                name="subtitulo"
                {...subtitulo}
              />
              <br /> <br />
              <div className={classes.root}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.backButton}
                >
                  Back
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  {activeStep === steps.length - 1 ? "Confirmar" : "Siguiente"}
                </Button>
              </div>
            </form>
          </>
        );
      case 1:
        return (
          <>
            <form onSubmit={submitImagenes}>
              {msgError && <div className={classes.msgError}>{msgError}</div>}
              {!loading && (
                <Box justifyContent="center" marginTop="15px">
                  <label htmlFor="contained-button-files">
                    <input
                      style={{ display: "none" }}
                      accept="image/*"
                      multiple
                      type="file"
                      id="contained-button-files"
                      onChange={onSelectFilesAlbum}
                    ></input>
                    <Fab component="span">
                      <AddPhotoAlternateIcon />
                    </Fab>
                  </label>
                </Box>
              )}
              {loading && (
                <div className={classes.spinner}>
                  <CircularProgress />
                </div>
              )}
              {rows && (
                <TableContainer>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>nombre</TableCell>
                        <TableCell align="right">accion</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow key={row.accion}>
                          <TableCell
                            className={classes.pointer}
                            component="th"
                            scope="row"
                            onClick={() => {
                              handleClickOpenPrevPhoto(row.accion);
                            }}
                          >
                            {row.nombre}
                          </TableCell>
                          <TableCell align="right">
                            {loadingTable && (
                              <div className={classes.spinner}>
                                <CircularProgress />
                              </div>
                            )}
                            {!loadingTable && (
                              <DeleteForeverOutlinedIcon
                                style={{ color: "deeppink" }}
                                fontSize="large"
                                onClick={() => onDeleteFile(row.accion)}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <br /> <br />
              <div className={classes.root}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.backButton}
                >
                  Back
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  {activeStep === steps.length - 1 ? "Confirmar" : "Siguiente"}
                </Button>
              </div>
            </form>
          </>
        );
      case 2:
        return (
          <>
            <form autoComplete="off" onSubmit={confirmar}>
              {msgError && <div className={classes.msgError}>{msgError}</div>}
              <TextareaAutosize
                required
                aria-label="minimum height"
                rowsMin={6}
                placeholder="Contenido*"
                className={classes.textArea}
                {...contenido}
              />
              <br /> <br />
              <TextField
                margin="normal"
                required
                type="text"
                fullWidth
                id="autor"
                label="pie de album (ej: autor)"
                name="autor"
                {...autor}
              />
              <br /> <br />
              <br /> <br />
              <div className={classes.root}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.backButton}
                >
                  Back
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  {activeStep === steps.length - 1 ? "Confirmar" : "Siguiente"}
                </Button>
              </div>
            </form>
          </>
        );
      default:
        return "Unknown stepIndex";
    }
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
          title="ELIMINAR ALBUM"
          open={confirmOpen}
          setOpen={setConfirmOpen}
          onConfirm={confirmDelete}
          state={"delete"}
        >
          ¿delete album?
        </ConfirmDialog>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {openPrevPhoto && (
          <div id="myModal" className={classes.modal}>
            <div
              className={classes.closeModalPreview}
              onClick={() => {
                handleClosePrevPhoto();
              }}
            >
              <IconButton
                aria-label="close"
                size="medium"
                className={classes.closeModalPreview}
              >
                <CloseIcon fontSize="medium" />
              </IconButton>
            </div>

            <div className={classes.modalContent}>
              <img width={"50%"} src={selectedValuePrevPhoto} />
            </div>
          </div>
        )}

        <DialogTitle className={classes.header} id="form-dialog-title">
          Edit Album
        </DialogTitle>

        <div className={classes.root}>
          <Stepper
            className={classes.stepper}
            activeStep={activeStep}
            alternativeLabel
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        <DialogActions>
          {!loadingStep && (
            <div className={classes.root}>
              {activeStep === steps.length ? (
                <>
                  <Typography className={classes.instructions}>
                    {okMessage && (
                      <div className={classes.okMsg}>{okMessage}</div>
                    )}
                    {errorMsg && (
                      <div className={classes.msgError}>{errorMsg}</div>
                    )}
                  </Typography>
                  <Button onClick={cerrar}>confirm</Button>
                </>
              ) : (
                <div>
                  <Typography className={classes.instructions}>
                    {getStepContent(activeStep)}
                  </Typography>
                </div>
              )}
            </div>
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
