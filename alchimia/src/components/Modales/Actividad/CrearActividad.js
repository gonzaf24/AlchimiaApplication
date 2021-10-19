import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useInputValue } from "../../../hooks/useInputValue";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
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
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { es } from "date-fns/locale";
import countriesList from "../../../assets/countries/countries.json";
import profesionesList from "../../../assets/countries/profesiones.json";
import { minutosListA } from "../../../assets/countries/minutos";
import { horaListA } from "../../../assets/countries/horas";
import { CONFIG_ACTIVIDAD } from "../../../config";

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
  alignRow: {
    display: "flex",
    paddingTop: "10px",
  },
  parrafo: {
    transform: "translate(0, 24px) scale(1)",
    paddingRight: "10px",
  },
}));

function getSteps() {
  return ["Cover", "Information", "Info/Tags"];
}
var ciudadesList = [];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const CrearActividad = ({
  submitActividad,
  okMessage,
  errorMsg,
  loadingStep,
  uid,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [urlPortada, setUrlPortada] = useState("");
  const [nombrePortada, setNombrePortada] = useState("");
  const [msgError, setMsgError] = useState("");

  const [tags, setTags] = useState([]);
  const [apuntados, setApuntados] = useState([]);
  const [likes, setLikes] = useState([]);
  const [pais, setPais] = useState("");
  const [estadoCiudad, setEstadoCiudad] = useState("");
  const [inputValuePais, setInputValuePais] = useState("");
  const [inputValueEstadoCiudad, setInputValueEstadoCiudad] = useState("");

  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const [horaInicio, setHoraInicio] = useState("");
  const [inputValueHoraInicio, setInputValueHoraInicio] = useState("");

  const [minutosInicio, setMinutosInicio] = useState("");
  const [inputValueMinutosInicio, setInputValueMinutosInicio] = useState("");

  const [horaFin, setHoraFin] = useState("");
  const [inputValueHoraFin, setInputValueHoraFin] = useState("");

  const [minutosFin, setMinutosFin] = useState("");
  const [inputValueMinutosFin, setInputValueMinutosFin] = useState("");

  const handleChangePais = (e) => {
    setPais(e.CountryName);
    ciudadesList = e.States;
  };

  const handleDateInicioChange = (date) => {
    setFechaInicio(date);
  };

  const handleDateFinChange = (date) => {
    setFechaFin(date);
  };

  const steps = getSteps();

  var titulo = useInputValue("");
  var direccion = useInputValue("");
  var contenido = useInputValue("");

  const handleClickOpen = () => {
    setOpen(true);
    setActiveStep(0);
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
      }, 2000);
    } else {
      resetFormOnClose();
      setOpen(false);
      setActiveStep(0);
    }
  };

  const resetFormularioOnSubmit = () => {
    try {
      titulo.reset();
      direccion.reset();
      contenido.reset();
      setFechaInicio(null);
      setFechaFin(null);
      setHoraInicio("");
      setMinutosInicio("");
      setHoraFin("");
      setMinutosFin("");
      setPais("");
      setEstadoCiudad("");
      setInputValuePais("");
      setInputValueEstadoCiudad("");
      setUrlPortada("");
      setTags([]);
    } catch (error) {
      console.log(error);
    }
  };

  const resetFormOnClose = async () => {
    urlPortada && (await deleteFileFormA(urlPortada));
    resetFormularioOnSubmit();
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const submitPortada = (event) => {
    event.preventDefault();
    handleNext();
  };

  const submitFechaHora = (event) => {
    event.preventDefault();
    setMsgError("");
    handleNext();
  };

  const confirmar = async (event) => {
    setMsgError("");
    event.preventDefault();

    await apuntados.push(uid);
    await likes.push(uid);

    var tagsList = await tags.map(function (prof) {
      return prof.id;
    });

    try {
      await submitActividad({
        titulo: titulo.value,
        direccion: direccion.value,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        fotoPortada: urlPortada,
        horaInicio: inputValueHoraInicio + inputValueMinutosInicio,
        horaFin: inputValueHoraFin + inputValueMinutosFin,
        pais: inputValuePais,
        estadoCiudad: inputValueEstadoCiudad,
        tags: tagsList,
        contenido: contenido.value,
        apuntados: apuntados,
        likes: likes,
      });
      resetFormularioOnSubmit();
      handleNext();
      handleClose("delay");
    } catch {
      return setMsgError("hubo error al crear el Actividad, intente mas tarde");
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
      await uploadFile(data.get("file"), CONFIG_ACTIVIDAD)
        .then((result) => {
          setLoading(false);
          const url = result.location;
          setUrlPortada(url);
        })
        .catch((error) => {
          setLoading(false);
          console.log("Error : " + error);
        });
    }
  };

  const onDeleteFilePortada = async () => {
    setLoading(true);
    const filename = urlPortada.substring(urlPortada.lastIndexOf("/") + 1);
    await deleteFile(filename, CONFIG_ACTIVIDAD)
      .then((response) => {
        setLoading(false);
        setUrlPortada(null);
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error : " + error);
      });
  };

  const deleteFileFormA = async (src) => {
    const filename = src.substring(src.lastIndexOf("/") + 1);
    await deleteFile(filename, CONFIG_ACTIVIDAD)
      .then((response) => {})
      .catch((error) => {
        console.log("Error : " + error);
      });
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
                label="Title"
                name="titulo"
                autoFocus
                {...titulo}
              />
              {!loading && (
                <Box justifyContent="center" marginTop="15px">
                  <div>cover photo activity</div>
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
            <form onSubmit={submitFechaHora}>
              {msgError && <div className={classes.msgError}>{msgError}</div>}
              {!loading && (
                <>
                  <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      className={classes.table}
                      required
                      autoFocus
                      margin="normal"
                      id="date-picker-dialog-required"
                      label="Fecha Inicio"
                      format="dd/MM/yyyy"
                      value={fechaInicio}
                      onChange={handleDateInicioChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  <Box className={classes.alignRow}>
                    <p className={classes.parrafo}>Start Time</p>
                    <Autocomplete
                      id="horaInicioID"
                      value={horaInicio}
                      inputValue={inputValueHoraInicio}
                      options={horaListA}
                      getOptionLabel={(option) => (option.id ? option.id : "")}
                      renderOption={(option) => (
                        <React.Fragment>{option.id}</React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          required
                          {...params}
                          label="hr. inicio"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password",
                          }}
                        />
                      )}
                      onInputChange={(event, newInputValue) => {
                        setInputValueHoraInicio(newInputValue);
                      }}
                      onChange={(_, selectedOptions) => {
                        setHoraInicio(selectedOptions);
                      }}
                    />
                    <p className={classes.parrafo}>:</p>
                    <Autocomplete
                      id="minutosInicioID"
                      value={minutosInicio}
                      inputValue={inputValueMinutosInicio}
                      options={minutosListA}
                      getOptionLabel={(option) => (option.id ? option.id : "")}
                      renderOption={(option) => (
                        <React.Fragment>{option.id}</React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          required
                          {...params}
                          label="mins inicio"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password",
                          }}
                        />
                      )}
                      onInputChange={(event, newInputValue) => {
                        setInputValueMinutosInicio(newInputValue);
                      }}
                      onChange={(_, selectedOptions) =>
                        setMinutosInicio(selectedOptions)
                      }
                    />
                  </Box>

                  <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      className={classes.table}
                      required
                      margin="normal"
                      id="date-picker-dialog-required"
                      label="Fecha Fin"
                      format="dd/MM/yyyy"
                      value={fechaFin}
                      onChange={handleDateFinChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  <Box className={classes.alignRow}>
                    <p className={classes.parrafo}>End Time</p>
                    <Autocomplete
                      id="horaFinID"
                      value={horaFin}
                      inputValue={inputValueHoraFin}
                      options={horaListA}
                      getOptionLabel={(option) => (option.id ? option.id : "")}
                      renderOption={(option) => (
                        <React.Fragment>{option.id}</React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          required
                          inputProps={{
                            style: { fontSize: 5 },
                          }}
                          {...params}
                          label="hr. fin"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password",
                          }}
                        />
                      )}
                      onInputChange={(event, newInputValue) => {
                        setInputValueHoraFin(newInputValue);
                      }}
                      onChange={(_, selectedOptions) =>
                        setHoraFin(selectedOptions)
                      }
                    />
                    <p className={classes.parrafo}>:</p>
                    <Autocomplete
                      id="minutosFinID"
                      value={minutosFin}
                      inputValue={inputValueMinutosFin}
                      options={minutosListA}
                      getOptionLabel={(option) => (option.id ? option.id : "")}
                      renderOption={(option) => (
                        <React.Fragment>{option.id}</React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          required
                          {...params}
                          label="mins fin"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password",
                          }}
                        />
                      )}
                      onInputChange={(event, newInputValue) => {
                        setInputValueMinutosFin(newInputValue);
                      }}
                      onChange={(_, selectedOptions) =>
                        setMinutosFin(selectedOptions)
                      }
                    />
                  </Box>
                  <Autocomplete
                    className={classes.topPaddin10}
                    id="paisID"
                    inputValue={inputValuePais}
                    options={countriesList.Countries}
                    autoHighlight
                    getOptionLabel={(option) => option.CountryName}
                    renderOption={(option) => (
                      <React.Fragment>{option.CountryName}</React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Pais"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password",
                        }}
                      />
                    )}
                    onInputChange={(event, newInputValue) => {
                      setInputValuePais(newInputValue);
                    }}
                    onChange={(event, value) => handleChangePais(value)}
                  />

                  <Autocomplete
                    className={classes.topPaddin10}
                    id="ciudadID"
                    options={ciudadesList}
                    autoHighlight
                    inputValue={inputValueEstadoCiudad}
                    getOptionLabel={(option) => option.StateName}
                    renderOption={(option) => (
                      <React.Fragment>{option.StateName}</React.Fragment>
                    )}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Ciudad"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password",
                        }}
                      />
                    )}
                    onInputChange={(event, newInputValue) => {
                      setInputValueEstadoCiudad(newInputValue);
                    }}
                    onChange={(event, value) =>
                      setEstadoCiudad(value.StateName)
                    }
                  />

                  <TextField
                    className={classes.topPaddin10}
                    margin="normal"
                    required
                    type="text"
                    fullWidth
                    id="direccion"
                    label="Direccion"
                    name="direccion"
                    {...direccion}
                  />
                </>
              )}
              {loading && (
                <div className={classes.spinner}>
                  <CircularProgress />
                </div>
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
              <Autocomplete
                id="profesionesID"
                multiple
                disableCloseOnSelect
                value={tags}
                options={profesionesList}
                getOptionLabel={(option) => (option.id ? option.id : "")}
                renderInput={(params) => (
                  <TextField {...params} label="Profesiones" />
                )}
                renderOption={(option, { selected }) => (
                  <React.Fragment>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.id}
                  </React.Fragment>
                )}
                onChange={(_, selectedOptions) => setTags(selectedOptions)}
              />
              <br /> <br />
              <TextareaAutosize
                required
                aria-label="minimum height"
                rowsMin={6}
                placeholder="Informacion de la actividad*"
                className={classes.textArea}
                {...contenido}
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
          New Activities
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
