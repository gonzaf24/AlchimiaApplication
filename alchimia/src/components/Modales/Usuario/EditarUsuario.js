import React, { useState, useContext, Fragment, useCallback } from "react";
import ReactCrop from "react-image-crop";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useInputValue } from "../../../hooks/useInputValue";
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
import Autocomplete from "@material-ui/lab/Autocomplete";
import DateFnsUtils from "@date-io/date-fns";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import { useMutation } from "@apollo/react-hooks";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Context } from "../../../Context";
import CloseIcon from "@material-ui/icons/Close";
import { EDIT_USER } from "../../../container/UsuarioMutation";
import { CONFIG_AVATAR } from "../../../config";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { es } from "date-fns/locale";
import { sexoList } from "../../../assets/countries/sexo";
import { Paises } from "../../../assets/countries/paises";
import countriesList from "../../../assets/countries/countries.json";
import { profesionesList } from "../../../assets/countries/profesiones.js";
import FormControl from "@material-ui/core/FormControl";
import AvatarImg from "../../../assets/avatar.png";
import Spinner from "react-spinner-material";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

var uniqid = require("uniqid");

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: "100%",
  },
  rootRefPerDisplay: {
    display: "block",
    marginTop: "40px",
  },
  rootRefPer: {
    fontFamily: "Roboto, Helvetica, Arial, sansSerif",
    width: "100%",
    textAlign: "center",
    marginBottom: "30px",
  },
  root: {
    fontFamily: "Roboto, Helvetica, Arial, sansSerif",
    width: "100%",
    textAlign: "center",
    marginBottom: "30px",
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
    left: "85%",
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
  imagen: {
    borderRadius: "50%",
    height: "100px",
    width: "100px",
  },
  crop: {
    display: "flex",
    flexDirection: "column",
    alignItem: "center",
    textAlign: "center",
    borderRadius: "4px",
  },
  editButton: {
    whiteSpace: "break-spaces",
  },
}));

function getSteps() {
  return ["Personal Data", "Profile photo"];
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

var ciudadesList = [];
const ITEM_HEIGHT = 40;

const options = ["Edit", "Ref. Personal", "Sign out"];

export const EditarUsuario = ({
  okMessage,
  errorMsg,
  loadingStep,
  usuario,
}) => {
  loadingStep = true;
  var loadingStepRefPer = true;
  const nombre = useInputValue(usuario.nombre);
  const apellido = useInputValue(usuario.apellido);
  const nomRef1 = useInputValue(usuario.nomRef1);
  const linkRef1 = useInputValue(usuario.linkRef1);
  const telefono = useInputValue(usuario.telefono);
  const [sexo, setSexo] = useState(usuario.sexo);
  const [avatar, setAvatar] = useState(usuario.avatar);
  const [fechaNacimiento, setFechaNacimiento] = useState(
    usuario.fechaNacimiento
  );
  const [upImg, setUpImg] = useState();
  const [loading, setLoading] = useState(false);
  var [pais, setPais] = useState(usuario.pais);
  const [estadoCiudad, setEstadoCiudad] = useState(usuario.estadoCiudad);
  const [profesiones, setProfesiones] = useState(() => {
    return usuario.profesiones ? usuario.profesiones : [];
  });
  const [intereses, setIntereses] = useState(() => {
    return usuario.intereses ? usuario.intereses : [];
  });
  const [msgError, setMsgError] = useState("");
  const [open, setOpen] = useState(false);
  const [openRefPer, setOpenRefPer] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElRefPer, setAnchorElRefPer] = useState(null);
  const openMenu = Boolean(anchorEl);
  const classes = useStyles();
  const [imgRef, setImgRef] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", width: 60, aspect: 9 / 9 });
  const [previewUrl, setPreviewUrl] = useState();
  const [file, setFile] = useState();
  const [fileNameUpload, setFileNameUpload] = useState();
  const {
    actualizoUsuario,
    setActualizoUsuario,
    userAuth,
    removeAuth,
  } = useContext(Context);
  const [editUserMutation, { loadingA, errorA }] = useMutation(EDIT_USER);

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
    if (event === "Edit") {
      setOpen(true);
      setActiveStep(0);
      setAnchorEl(null);
    }
    if (event === "Ref. Personal") {
      setOpenRefPer(true);
      setAnchorElRefPer(null);
    }

    if (event === "Sign out") {
      removeAuth();
    }
  };

  const onLoad = useCallback((img) => {
    setImgRef(img);
  }, []);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const cerrar = () => {
    setOpen(false);
    setActiveStep(0);
  };

  const makeClientCrop = async (crop) => {
    if (imgRef && crop.width && crop.height) {
      createCropPreview(imgRef, crop, fileNameUpload);
    }
  };

  const createCropPreview = async (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx1 = canvas.getContext("2d");

    ctx1.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(previewUrl);
        setPreviewUrl(window.URL.createObjectURL(blob));
        setFile(blob);
      }, "image/jpeg");
    });
  };

  const resetFormularioOnSubmit = () => {
    try {
      nombre.reset();
      apellido.reset();
      nomRef1.reset();
      linkRef1.reset();
      telefono.reset();
      setSexo("");
      setAvatar("");
      setFechaNacimiento("");
      setUpImg("");
      setEstadoCiudad("");
      setProfesiones([]);
      setIntereses([]);
      setImgRef("");
      setPreviewUrl("");
      setFile("");
      setFileNameUpload("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    setPreviewUrl(null);
    setUpImg(null);
  };

  const handleCloseOnConfirm = () => {
    setOpen(false);
    setActiveStep(0);
    setPreviewUrl(null);
    setUpImg(null);
    resetFormularioOnSubmit();

    if (actualizoUsuario == true) {
      setActualizoUsuario(false);
    } else {
      setActualizoUsuario(true);
    }
  };

  const handleCloseRefPer = () => {
    setOpenRefPer(false);
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

  const confirmarReferencia = async () => {
    try {
      const input = {
        uid: usuario.uid,
        email: usuario.email,
        nomRef1: nomRef1.value,
        linkRef1: linkRef1.value,
      };
      const result = await editUserMutation({
        variables: { input },
      });
      if (result) {
        const { editarUsuario } = result.data;
        userAuth(editarUsuario);
        if (actualizoUsuario == true) {
          setActualizoUsuario(false);
        } else {
          setActualizoUsuario(true);
        }
      }
    } catch {
      return setMsgError(
        "hubo error al editar referencia personal, intente mas tarde"
      );
    }
  };

  const confirmar = async (event) => {
    setMsgError("");
    event.preventDefault();
    var url = null;
    if (file) {
      await onDeleteFilePortada();
      var data = new FormData();
      data.append("file", file, fileNameUpload);
      await uploadFile(data.get("file"), CONFIG_AVATAR)
        .then((result) => {
          setLoading(false);
          url = result.location;
        })
        .catch((error) => {
          setLoading(false);
          console.log("Error : " + error);
        });
    }

    try {
      const input = {
        nombre: nombre.value,
        apellido: apellido.value,
        telefono: telefono.value,
        avatar: url ? url : usuario.avatar,
        email: usuario.email,
        estadoCiudad: estadoCiudad,
        fechaCreacion: usuario.fechaCreacion,
        notificar: false,
        pais: pais,
        sexo: sexo,
        status: "online",
        fechaNacimiento: fechaNacimiento,
        intereses: intereses,
        profesiones: profesiones,
        uid: usuario.uid,
        seguidores: usuario.seguidores,
        seguidos: usuario.seguidos,
        nomRef1: nomRef1.value,
        linkRef1: linkRef1.value,
      };

      const dataA = await editUserMutation({
        variables: { input },
      });

      if (dataA) {
        const { editarUsuario } = dataA.data;
        userAuth(editarUsuario);
        if (actualizoUsuario == true) {
          setActualizoUsuario(false);
        } else {
          setActualizoUsuario(true);
        }
      }

      handleNext();
      handleCloseOnConfirm();
    } catch {
      return setMsgError("hubo error al editar perfil, intente mas tarde");
    }
  };

  const onSelectFilePortada = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoading(true);
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      var file = e.target.files[0];
      var nameFilePortadaShow = e.target.files[0].name;
      const name = e.target.files[0].name;
      const lastDot = name.lastIndexOf(".");
      const ext = name.substring(lastDot + 1);
      const fileName = uniqid() + "-" + usuario.uid + "." + ext;
      if (nameFilePortadaShow.length > 10) {
        nameFilePortadaShow = nameFilePortadaShow
          .substring(0, 8)
          .concat(" ... " + ext);
      }
      setFileNameUpload(fileName);
      setLoading(false);
    }
  };

  const onDeleteFilePortada = async () => {
    setLoading(true);
    if (avatar) {
      const filename = avatar.substring(avatar.lastIndexOf("/") + 1);
      await deleteFile(filename, CONFIG_AVATAR)
        .then((response) => {
          setLoading(false);
          setAvatar(null);
        })
        .catch((err) => {
          setLoading(false);
          console.log("ERRRRRRORRRR : " + err);
          console.error(err);
        });
    }
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

  const handleDateChange = (date) => {
    setFechaNacimiento(date);
  };

  const handleChangePais = (e) => {
    setPais(e.CountryName);
    ciudadesList = e.States;
  };
  loadingStep = false;
  loadingStepRefPer = false;
  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <form onSubmit={submitPortada}>
              <FormControl>
                <Autocomplete
                  id="sexoID"
                  options={sexoList}
                  defaultValue={sexo}
                  getOptionLabel={(option) => option}
                  getOptionSelected={(option, value) => {
                    if (option === value) {
                      setSexo(value);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      required
                      {...params}
                      label="Sex"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password",
                      }}
                    />
                  )}
                />
                <TextField
                  required
                  id="standard-required"
                  label="Name"
                  placeholder="name"
                  {...nombre}
                />
                <TextField
                  required
                  id="standard-required"
                  label="Surname"
                  placeholder="surname"
                  {...apellido}
                />
                <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    required
                    margin="normal"
                    id="date-picker-dialog-required"
                    label="Brith date"
                    format="dd/MM/yyyy"
                    value={fechaNacimiento}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </MuiPickersUtilsProvider>
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
                        alert("value selected :" + value);
                        alert("option selected :" + option);
                        if (value.CountryName === option) {
                          ciudadesList = [];
                          Object.keys(value.States).forEach(function (valueA) {
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
                      label="Country (where you live)"
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
                      label="City (where you live)"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "off",
                      }}
                    />
                  )}
                />
                <TextField
                  required
                  id="standard-required"
                  label="Telefono"
                  placeholder="Ej: +34653058319"
                  {...telefono}
                />

                <Autocomplete
                  id="profesionesID"
                  multiple
                  disableCloseOnSelect
                  value={profesiones}
                  options={profesionesList}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField {...params} label="Professions" />
                  )}
                  renderOption={(option, { selected }) => (
                    <Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </Fragment>
                  )}
                  onChange={(_, selectedOptions) =>
                    setProfesiones(selectedOptions)
                  }
                />
                <Autocomplete
                  id="interesesID"
                  multiple
                  disableCloseOnSelect
                  value={intereses}
                  options={profesionesList}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField {...params} label="Interests" />
                  )}
                  renderOption={(option, { selected }) => (
                    <Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option}
                    </Fragment>
                  )}
                  onChange={(_, selectedOptions) =>
                    setIntereses(selectedOptions)
                  }
                />
                <br />
              </FormControl>
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
                  {activeStep === steps.length - 1 ? "Confirm" : "Next"}
                </Button>
              </div>
            </form>
          </>
        );
      case 1:
        return (
          <>
            <form onSubmit={confirmar}>
              {msgError && <div className={classes.msgError}>{msgError}</div>}
              {loading && (
                <Spinner size={220} color={"#c2185b"} visible={true} />
              )}
              <Box justifyContent="center" marginTop="15px">
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
              {upImg && <p>mueve el recuadro para ajustar tu foto</p>}
              <ReactCrop
                className={classes.crop}
                src={upImg}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={makeClientCrop}
              />
              <h4>will look like :</h4>
              <Box display="flex" justifyContent="center" marginBottom="20px">
                {previewUrl ? (
                  <img
                    className={classes.imagen}
                    alt="vista imagen cortada"
                    src={previewUrl}
                  />
                ) : (
                  <img
                    className={classes.imagen}
                    alt="vista imagen cortada"
                    src={usuario.avatar ? usuario.avatar : AvatarImg}
                  />
                )}
              </Box>
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
                  {activeStep === steps.length - 1 ? "Confirm" : "Next"}
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
              className={classes.editButton}
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
          Edit Profile Data
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
                  <Button onClick={cerrar}>aceptar</Button>
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

      <Dialog
        open={openRefPer}
        onClose={handleCloseRefPer}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle className={classes.header} id="form-dialog-title">
          Add Personal Reference
        </DialogTitle>

        <DialogActions className={classes.rootRefPerDisplay}>
          {!loadingStepRefPer && (
            <>
              <div className={classes.rootRefPer}>
                <TextField
                  className={classes.rootRefPer}
                  required
                  id="standard-required"
                  label="Name Reference"
                  placeholder="name de reference : Ej:  Linkedin"
                  {...nomRef1}
                />
                <TextField
                  className={classes.rootRefPer}
                  required
                  id="standard-required"
                  label="Link Reference"
                  placeholder="link reference : Ej:  https://www.linkedin.com/in/xxxxx-xxxxx-12345678/"
                  {...linkRef1}
                />
              </div>
              <div className={classes.rootRefPer}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={() => {
                    confirmarReferencia();
                  }}
                >
                  Confirm
                </Button>
              </div>
            </>
          )}
          {loadingStepRefPer && (
            <div className={classes.rootRefPer}>
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
