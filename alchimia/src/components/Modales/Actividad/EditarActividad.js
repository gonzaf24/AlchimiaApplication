import React, { useState, useContext } from "react";
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

import { profesionesList } from "../../../assets/countries/profesiones.js";

import { minutosList } from "../../../assets/countries/minutos";
import { horaList } from "../../../assets/countries/horas";
import { useMutation } from "@apollo/react-hooks";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Context } from "../../../Context";
import ConfirmDialog from "../../ConfirmDialog/index";
import {
  EDIT_ACTIVIDAD,
  DELETE_ACTIVIDAD,
} from "../../../container/ActividadMutation";
import { CONFIG_ACTIVIDAD } from "../../../config";
import { Paises } from "../../../assets/countries/paises";
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
  return ["Portada", "Información", "Info/Tags"];
}
var ciudadesList = [];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const options = ["Ver", "Editar", "Eliminar"];

const ITEM_HEIGHT = 40;

export const EditarActividad = ({
  submitEditarActividad,
  okMessage,
  errorMsg,
  loadingStep,
  tituloA,
  fechaInicioA,
  fechaFinA,
  fotoPortadaA,
  horaInicioA,
  horaFinA,
  paisA,
  direccionA,
  estadoCiudadA,
  tagsA,
  contenidoA,
  uid,
  fechaCreacionA,
  apuntadosA,
  likesA,
}) => {
  //console.log("APUNTADOSSSSSSS222222 editar : " + JSON.stringify(apuntadosA));
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [urlPortada, setUrlPortada] = useState(fotoPortadaA);
  const [nombrePortada, setNombrePortada] = useState("");
  const [msgError, setMsgError] = useState("");

  const [tags, setTags] = useState(() => {
    return tagsA ? tagsA : [];
  });

  var [pais, setPais] = useState(paisA);
  const [estadoCiudad, setEstadoCiudad] = useState(estadoCiudadA);

  //const [pais, setPais] = useState();
  const [inputValuePais, setInputValuePais] = useState(paisA);

  //const [estadoCiudad, setEstadoCiudad] = useState("");
  const [inputValueEstadoCiudad, setInputValueEstadoCiudad] = useState(
    estadoCiudadA
  );

  const [fechaInicio, setFechaInicio] = useState(fechaInicioA);
  const [fechaFin, setFechaFin] = useState(fechaFinA);

  const [horaInicio, setHoraInicio] = useState();
  const [inputValueHoraInicio, setInputValueHoraInicio] = useState(
    horaInicioA.substring(0, 2)
  );

  const [minutosInicio, setMinutosInicio] = useState();
  const [inputValueMinutosInicio, setInputValueMinutosInicio] = useState(
    horaInicioA.substring(2, 5)
  );

  const [horaFin, setHoraFin] = useState();
  const [inputValueHoraFin, setInputValueHoraFin] = useState(
    horaFinA.substring(0, 2)
  );

  const [minutosFin, setMinutosFin] = useState();
  const [inputValueMinutosFin, setInputValueMinutosFin] = useState(
    horaFinA.substring(2, 5)
  );

  const { actualizoActividad, setActualizoActividad } = useContext(Context);

  const [editarActividad, { data, loadingA, error }] = useMutation(
    EDIT_ACTIVIDAD
  );

  const [eliminarActividad, { dataB, loadingB, errorB }] = useMutation(
    DELETE_ACTIVIDAD
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
    await eliminarActividad({
      variables: { actividadId: uid },
    });
    if (actualizoActividad == true) {
      setActualizoActividad(false);
    } else {
      setActualizoActividad(true);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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

  var titulo = useInputValue(tituloA);
  var direccion = useInputValue(direccionA);
  var contenido = useInputValue(contenidoA);

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

    if (actualizoActividad == true) {
      setActualizoActividad(false);
    } else {
      setActualizoActividad(true);
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
    //urlPortada && (await deleteFileFormA(urlPortada));
    resetFormularioOnSubmit();
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

  const submitFechaHora = (event) => {
    event.preventDefault();
    setMsgError("");
    handleNext();
  };

  const confirmar = async (event) => {
    setMsgError("");
    event.preventDefault();
    try {
      const input = {
        titulo: titulo.value,
        direccion: direccion.value,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        fotoPortada: urlPortada,
        horaInicio: inputValueHoraInicio + inputValueMinutosInicio,
        horaFin: inputValueHoraFin + inputValueMinutosFin,
        pais: pais,
        estadoCiudad: estadoCiudad,
        tags: tags,
        contenido: contenido.value,
        uid: uid,
        fechaCreacion: fechaCreacionA,
        apuntados: apuntadosA,
        likes: likesA,
      };
      const dataA = await editarActividad({
        variables: { input },
      });
      if (actualizoActividad == true) {
        setActualizoActividad(false);
      } else {
        setActualizoActividad(true);
      }
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
          console.log("ERROR : " + error);
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
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const deleteFileFormA = async (src) => {
    const filename = src.substring(src.lastIndexOf("/") + 1);
    await deleteFile(filename, CONFIG_ACTIVIDAD)
      .then((response) => {})
      .catch((err) => {
        console.log("ERRRRRRORRRR : " + err);
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
                label="Titulo"
                name="titulo"
                value={""}
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
                      autoSelect={true}
                      selectOnFocus={true}
                      id="horaInicioID"
                      value={horaInicio}
                      inputValue={inputValueHoraInicio}
                      options={horaList}
                      defaultValue={horaInicioA.substring(0, 2)}
                      getOptionLabel={(option) => option}
                      renderOption={(option) => (
                        <React.Fragment>{option}</React.Fragment>
                      )}
                      getOptionSelected={(option, value) => {
                        if (option === value) {
                          setHoraInicio(value);
                          setInputValueHoraInicio(value);
                        }
                      }}
                      renderInput={(params) => {
                        return (
                          <TextField
                            required
                            {...params}
                            label="hr. inicio"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "off",
                            }}
                          />
                        );
                      }}
                    />
                    <p className={classes.parrafo}>:</p>

                    <Autocomplete
                      autoSelect={true}
                      selectOnFocus={true}
                      id="minutosInicioID"
                      value={minutosInicio}
                      inputValue={inputValueMinutosInicio}
                      options={minutosList}
                      defaultValue={horaInicioA.substring(2, 5)}
                      getOptionLabel={(option) => {
                        return option;
                      }}
                      renderOption={(option) => (
                        <React.Fragment>{option}</React.Fragment>
                      )}
                      getOptionSelected={(option, value) => {
                        if (option === value) {
                          setMinutosInicio(value);
                          setInputValueMinutosInicio(value);
                        }
                      }}
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
                      autoSelect={true}
                      selectOnFocus={true}
                      id="horaFinID"
                      value={horaFin}
                      inputValue={inputValueHoraFin}
                      options={horaList}
                      defaultValue={horaFinA.substring(0, 2)}
                      getOptionLabel={(option) => {
                        return option;
                      }}
                      renderOption={(option) => (
                        <React.Fragment>{option}</React.Fragment>
                      )}
                      getOptionSelected={(option, value) => {
                        if (option === value) {
                          setHoraFin(value);
                          setInputValueHoraFin(value);
                        }
                      }}
                      renderInput={(params) => {
                        return (
                          <TextField
                            required
                            {...params}
                            label="hr. fin"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "off",
                            }}
                          />
                        );
                      }}
                    />

                    <p className={classes.parrafo}>:</p>

                    <Autocomplete
                      autoSelect={true}
                      selectOnFocus={true}
                      id="minutosFinID"
                      value={minutosFin}
                      inputValue={inputValueMinutosFin}
                      options={minutosList}
                      defaultValue={horaFinA.substring(2, 5)}
                      getOptionLabel={(option) => option}
                      renderOption={(option) => (
                        <React.Fragment>{option}</React.Fragment>
                      )}
                      getOptionSelected={(option, value) => {
                        if (option === value) {
                          setMinutosFin(value);
                          setInputValueMinutosFin(value);
                        }
                      }}
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
                    />
                  </Box>

                  <Autocomplete
                    id="paisIDD"
                    options={Paises}
                    defaultValue={pais}
                    getOptionLabel={(option) => option}
                    getOptionSelected={(option, value) => {
                      if (option === value) {
                        setPais(value);
                        Object.keys(countriesList.Countries).forEach(function (
                          value
                        ) {
                          var value = countriesList.Countries[value];
                          if (value.CountryName === option) {
                            ciudadesList = [];
                            Object.keys(value.States).forEach(function (
                              valueA
                            ) {
                              var valueB = value.States[valueA];
                              ciudadesList.push(valueB.StateName);
                              setEstadoCiudad(ciudadesList[1]);
                            });
                          }
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Pais"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "off",
                        }}
                      />
                    )}
                  />
                  <Autocomplete
                    id="ciudadID"
                    options={ciudadesList}
                    defaultValue={estadoCiudad}
                    getOptionLabel={(option) => option}
                    getOptionSelected={(option, value) => {
                      if (option === value) {
                        setEstadoCiudad(option);
                        return option;
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Ciudad"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "off",
                        }}
                      />
                    )}
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
                    value={""}
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
                value={tags}
                disableCloseOnSelect
                options={profesionesList}
                getOptionLabel={(option) => option}
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
                    {option}
                  </React.Fragment>
                )}
                onChange={(_, selectedOptions) => {
                  setTags(selectedOptions);
                }}
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
          title="DELETE ACTIVITY"
          open={confirmOpen}
          setOpen={setConfirmOpen}
          onConfirm={confirmDelete}
          state={"delete"}
        >
          ¿delete activity?
        </ConfirmDialog>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle className={classes.header} id="form-dialog-title">
          Edit Activitiy
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
