import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import Avatar from "@material-ui/core/Avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DateRangeIcon from "@material-ui/icons/DateRange";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LabelIcon from "@material-ui/icons/Label";
import Button from "@material-ui/core/Button";
import { Context } from "../../Context";
import { navigate } from "@reach/router";
import ConfirmDialog from "../ConfirmDialog/index";
import { useMutation } from "@apollo/react-hooks";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ShareIcon from "@material-ui/icons/Share";
import {
  LIKE_ACTIVIDAD,
  APUNTARSE_ACTIVIDAD,
} from "../../container/ActividadMutation";
import { VER_PERFILES } from "../../container/UsuarioMutation";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { DEFAULT_IMAGE } from "../Utils/utils";
import { DialogPerfiles } from "../../components/DialogPerfiles/index";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
  },
  root5: {
    height: "5px",
  },
  root10: {
    height: "10px",
  },
  root20: {
    height: "20px",
  },
  root40: {
    height: "40px",
  },
  root140: {
    height: "140px",
  },
  "@keyframes myEffect": {
    "0%": {
      filter: "blur(5px)",
      opacity: 0,
    },
    "100%": {
      filter: "blur(0)",
      opacity: 1,
    },
  },
  avatar: {
    cursor: "pointer",
    marginTop: "-40px",
    marginLeft: "15px",
    width: theme.spacing(4),
    height: theme.spacing(4),
    boxShadow: "0px 0px 20px 20px rgba(255, 253, 255, 0.14)",
  },
  nameUser: {
    cursor: "pointer",
    marginTop: "-26px",
    marginLeft: "65px",
    width: "100%",
    height: theme.spacing(4),
    boxShadow: "0px 0px 20px 20px rgba(255, 253, 255, 0.14)",
    color: "#fff7f791",
  },
  cardFondoAvatar: {
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
  },
  contenido: {
    paddingBottom: "180px",
  },
  autor: {
    paddingBottom: "180px",
    textAlign: "right",
    marginRight: "30px",
  },
  media: {
    height: 250,
    opacity: 0.5,
    background: "rgba(black, 0.5)",
  },
  fecha: {
    cursor: "pointer",
    position: "absolute",
    bottom: 220,
    left: "5%",
    color: " white !important",
    zIndex: "2",
    fontSize: "1em",
  },
  fechaActividad: {
    width: 100,
    height: 20,
    textAlign: "center",
    backgroundColor: "yellowgreen",
    cursor: "pointer",
    position: "absolute",
    bottom: 230,
    left: "5%",
    color: " white !important",
    zIndex: "2",
    fontSize: "1.2em",
    fontWeight: "bold",
  },
  fechaActividad1: {
    width: 100,
    height: 20,
    textAlign: "center",
    backgroundColor: "yellowgreen",
    cursor: "pointer",
    position: "absolute",
    bottom: 210,
    left: "5%",
    color: " white !important",
    zIndex: "2",
    fontSize: "1.2em",
    fontWeight: "bold",
  },
  fechaActividad2: {
    width: 100,
    height: 20,
    textAlign: "center",
    backgroundColor: "yellowgreen",
    cursor: "pointer",
    position: "absolute",
    bottom: 190,
    left: "5%",
    color: " white !important",
    zIndex: "2",
    fontSize: "1.2em",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  fechaActividad3: {
    width: 100,
    height: 20,
    textAlign: "center",
    backgroundColor: "#37cd32",
    cursor: "pointer",
    position: "absolute",
    bottom: 167,
    left: "5%",
    color: " white !important",
    zIndex: "2",
    fontSize: "1.3em",
    borderBottomRightRadius: "5px",
    borderBottomLeftRadius: "5px",
    fontWeight: "bold",
  },
  titulo: {
    width: "100%",
    textAlign: "center",
    cursor: "pointer",
    position: "absolute",
    color: " white !important",
    zIndex: "2",
    top: "80%",
    left: "50%",
    width: "80%",
    fontSize: "1.8em",
    transform: "translate(-50%, -50%)",
    textShadow: "0 3px 0 rgba(0,0,0,0.6)!important",
    fontFamily: "sans-serif, Roboto, Arial, sans-serif !important",
    fontWeight: "900 !important",
    fontStyle: "normal !important",
    letterSpacing: "0.2em !important",
    textTransform: "uppercase !important",
    letterSpacing: "4px",
    "&:hover": {
      fontSize: "2.2em",
      textShadow: "0 3px 0 rgba(252, 185, 0, 0.6)!important",
    },
  },
  paper: {
    padding: theme.spacing(0),
    textAlign: "left",
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  margin: {
    margin: "10px",
    paddingBottom: "200px",
  },
  textRight: {
    cursor: "pointer",
    textAlign: "right",
    marginRight: "15px",
  },
  textCenter: {
    width: "100%",
    textAlign: "center",
  },
  prue: {
    color: "#e91f62",
    fontWeight: "bold",
    width: "fit-content",
    float: "right",
    display: "inline-flex",
  },
  imagen: {
    borderRadius: "50%",
    height: "25px",
    width: "25px",
  },
  spinner: {
    justifyContent: "center",
    textAlign: "center",
    marginBottom: "20px",
  },
  color: {
    color: "#e91e63",
  },
  spinnerSize: {
    width: "20px !important",
    height: "20px !important",
    marginBottom: 7,
    marginRight: 10,
  },
  copy: {
    marginLeft: "15px",
    marginBottom: "-10px",
  },
}));

export const Actividad = ({ loading, actividad }) => {
  const { user, actualizoActividad, setActualizoActividad } = useContext(
    Context
  );
  const [actividadApuntados, setActividadApuntados] = useState(
    actividad.apuntados
  );
  const [actividadLikes, setActividadLikes] = useState(actividad.likes);
  const [perfiles, setPerfiles] = useState();
  const [selectedValue, setSelectedValue] = useState([]);
  const [openVerApuntados, setOpenVerApuntados] = useState(false);
  const [apuntado, setApuntado] = useState(() => {
    if (actividadApuntados && user && user.uid) {
      return actividadApuntados.includes(user.uid);
    } else {
      return false;
    }
  });
  const [like, setLike] = useState(() => {
    if (actividadLikes && user && user.uid) {
      return actividadLikes.includes(user.uid);
    } else {
      return false;
    }
  });
  const [loadingApuntar, setLoadingApuntar] = useState(false);
  const [loadingPerfiles, setLoadingPerfiles] = useState(false);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const handleCloseVerApuntados = (value) => {
    setOpenVerApuntados(false);
    setSelectedValue(value);
  };
  const uidUserActividad = actividad.uid.substring(
    0,
    actividad.uid.lastIndexOf("|")
  );
  const classes = useStyles();
  const url = window.location.href;
  const [openCopy, setOpenCopy] = useState(false);
  var uid = actividad.uid.substring(0, actividad.uid.lastIndexOf("|"));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openDesapuntar, setOpenDesapuntar] = useState(false);
  var date = new Date(actividad.fechaInicio);
  var fechaInicioAct = format(date, "dd/MM/yyyy", { locale: es });
  var formatted_DIA_NOMBRE = format(date, "EEEE", { locale: es });
  var formatted_DIA_NUMBER = format(date, "dd", { locale: es });
  var formatted_MES_NOMBRE = format(date, "MMM", { locale: es });
  var formatted_HORA =
    actividad.horaInicio.substr(0, 2) +
    ":" +
    actividad.horaInicio.substr(2, 5) +
    ".hrs";
  var dateFin = new Date(actividad.fechaFin);
  var fechaFinAct = format(dateFin, "dd/MM/yyyy", { locale: es });
  var formatted_HORA_FIN =
    actividad.horaFin.substr(0, 2) +
    ":" +
    actividad.horaFin.substr(2, 5) +
    ".hrs";
  const [apuntarseActividad, {}] = useMutation(APUNTARSE_ACTIVIDAD);
  const [likeActividad, {}] = useMutation(LIKE_ACTIVIDAD);
  const [verPerfiles, {}] = useMutation(VER_PERFILES);

  var fotoPortadaCard = "";
  if (!actividad.fotoPortada || actividad.fotoPortada === "") {
    fotoPortadaCard = DEFAULT_IMAGE;
  } else {
    fotoPortadaCard = actividad.fotoPortada;
  }

  const handleClickOpenCopy = () => {
    setLoadingCopy(true);
    setOpenCopy(true);
    setTimeout(function () {
      setOpenCopy(false);
      setLoadingCopy(false);
    }, 500);
  };

  const confirmLike = async () => {
    if (user.uid != uidUserActividad) {
      setLoadingLike(true);
      const input = { actividadID: actividad.uid, userId: user.uid };
      const result = await likeActividad({
        variables: { input },
      });
      if (result) {
        setActividadLikes(result.data.likeActividad.likes);
        setLike(result.data.likeActividad.likes.includes(user.uid));
        setLoadingLike(false);
      } else {
        setLoadingLike(false);
      }
    }
  };

  const confirmApuntar = async () => {
    if (user.uid != uidUserActividad) {
      setLoadingApuntar(true);
      const input = { actividadID: actividad.uid, userId: user.uid };
      const result = await apuntarseActividad({
        variables: { input },
      });
      if (result) {
        setActividadApuntados(result.data.apuntarseActividad.apuntados);
        setApuntado(
          result.data.apuntarseActividad.apuntados.includes(user.uid)
        );
        setOpenDesapuntar(false);
        setConfirmOpen(false);
        setLoadingApuntar(false);
      }
    } else {
      setOpenDesapuntar(false);
      setConfirmOpen(false);
    }
  };

  const handleClickOpenVerApuntados = async () => {
    setLoadingPerfiles(true);
    setOpenVerApuntados(true);
    const input = { ids: actividadApuntados };
    const result = await verPerfiles({
      variables: { input },
    });
    if (result) {
      setPerfiles(result.data.perfiles);
      setLoadingPerfiles(false);
    } else {
      setLoadingPerfiles(false);
    }
  };

  return (
    <>
      {actividad && (
        <>
          <CardMedia
            className={classes.cardFondoAvatar}
            component="img"
            alt="imagen fondo"
            height="50"
            image="https://alchimia.s3.us-east-2.amazonaws.com/utils/fondo_negro.jpeg"
            title="profile background"
          />

          <Avatar
            className={classes.avatar}
            alt={actividad.nombre}
            src={actividad.avatar}
            onClick={() => {
              navigate(`/user/${uid}`);
            }}
          />
          <div
            className={classes.nameUser}
            onClick={() => {
              navigate(`/user/${uid}`);
            }}
          >
            {actividad.nombre} {actividad.apellido}
          </div>

          <div className={classes.root5}></div>
          <CardMedia
            component="img"
            alt="imagen fondo"
            height="3"
            image="https://alchimia.s3.us-east-2.amazonaws.com/utils/fondo_negro.jpeg"
            title="profile background"
          />
          <div className={classes.root}>
            <h2>ACTIVIDAD</h2>
          </div>
          <CardMedia
            component="img"
            alt="imagen fondo"
            height="3"
            image="https://alchimia.s3.us-east-2.amazonaws.com/utils/fondo_negro.jpeg"
            title="profile background"
          />
          <div className={classes.root5}></div>

          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={fotoPortadaCard}
              title={actividad.titulo}
            />

            <div className={classes.fechaActividad}>{formatted_DIA_NOMBRE}</div>
            <div className={classes.fechaActividad1}>
              {formatted_DIA_NUMBER}
            </div>
            <div className={classes.fechaActividad2}>
              {formatted_MES_NOMBRE}.
            </div>
            <div className={classes.fechaActividad3}>{formatted_HORA}</div>
          </CardActionArea>

          <CardMedia
            component="img"
            alt="imagen fondo"
            height="3"
            image="https://alchimia.s3.us-east-2.amazonaws.com/utils/fondo_negro.jpeg"
            title="profile background"
          />

          <div className={classes.root10}></div>

          <div className={classes.margin}>
            <Typography variant="body2" color="textSecondary" component="div">
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <DateRangeIcon color="primary" /> {fechaInicioAct} -{" "}
                    {formatted_HORA}{" "}
                    {fechaInicioAct != fechaFinAct ? " --- " + fechaFinAct : ""}{" "}
                    - {formatted_HORA_FIN}
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <LocationOnIcon color="primary" /> {actividad.pais} -{" "}
                    {actividad.estadoCiudad}
                  </Paper>
                </Grid>
                {actividad.tags && (
                  <>
                    {" "}
                    <Grid item xs={12}>
                      <Paper className={classes.paper}>
                        {actividad.tags && <LabelIcon color="primary" />}
                        {actividad.tags &&
                          " Tags: " +
                            actividad.tags
                              .toString()
                              .split(",")
                              .join("\n" + "-" + "\n")}
                      </Paper>
                    </Grid>
                  </>
                )}
              </Grid>
            </Typography>
            <div className={classes.root20}></div>
            <div>
              <h3> {actividad.titulo}</h3>
            </div>
            <div className={classes.root20} />
            {actividad.contenido}
            <div className={classes.root20} />

            {user && user.uid && (
              <>
                <div className={classes.textRight}>
                  {!loadingLike ? (
                    <>
                      {like && (
                        <>
                          <Badge
                            color="primary"
                            badgeContent={actividadLikes.length}
                          >
                            <ThumbUpAltIcon
                              className={classes.color}
                              fontSize="large"
                              onClick={() => {
                                confirmLike();
                              }}
                            />
                          </Badge>
                        </>
                      )}
                      {!like && (
                        <>
                          <Badge
                            color="primary"
                            badgeContent={actividadLikes.length}
                          >
                            <ThumbUpAltIcon
                              fontSize="large"
                              onClick={() => {
                                confirmLike();
                              }}
                            />
                          </Badge>
                        </>
                      )}
                    </>
                  ) : (
                    <CircularProgress className={classes.spinnerSize} />
                  )}
                  {!loadingCopy ? (
                    <CopyToClipboard text={url} className={classes.copy}>
                      <ShareIcon
                        fontSize="large"
                        onClick={() => {
                          handleClickOpenCopy();
                        }}
                      />
                    </CopyToClipboard>
                  ) : (
                    <CopyToClipboard text={url} className={classes.copy}>
                      <ShareIcon
                        className={classes.color}
                        fontSize="large"
                        onClick={() => {
                          handleClickOpenCopy();
                        }}
                      />
                    </CopyToClipboard>
                  )}
                </div>
                <div className={classes.root10} />
                {apuntado && (
                  <>
                    {!loadingApuntar ? (
                      <Button
                        variant="contained"
                        className={classes.textCenter}
                        color="primary"
                        onClick={() => {
                          if (user.uid != uidUserActividad) {
                            setOpenDesapuntar(true);
                          }
                        }}
                      >
                        apuntado
                      </Button>
                    ) : (
                      <div className={classes.spinner}>
                        <CircularProgress />
                      </div>
                    )}

                    <div className={classes.root20} />
                    <div>
                      <LocationOnIcon color="primary" />
                      Dirección: {actividad.direccion}
                    </div>
                    <div
                      className={classes.textRight}
                      onClick={() => {
                        handleClickOpenVerApuntados(true);
                      }}
                    >
                      apuntados:
                      <div className={classes.prue}>
                        {actividadApuntados.length}
                      </div>
                    </div>
                    <div className={classes.root140} />
                  </>
                )}
                {!apuntado && (
                  <>
                    {!loadingApuntar ? (
                      <Button
                        className={classes.textCenter}
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          if (user.uid != uidUserActividad) {
                            setConfirmOpen(true);
                          }
                        }}
                      >
                        apuntarme
                      </Button>
                    ) : (
                      <div className={classes.spinner}>
                        <CircularProgress />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {!user && (
              <Button
                className={classes.textCenter}
                variant="outlined"
                color="primary"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Debes estar logueado para apuntarte!
              </Button>
            )}

            {actividad.autor && (
              <>
                <div className={classes.root20} />
                <div className={classes.autor}>{actividad.autor}</div>
              </>
            )}

            <div>
              <ConfirmDialog
                key="A4"
                title="¡ Apuntarme a la Actividad !"
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={() => {
                  confirmApuntar();
                }}
                state={"confirm"}
              >
                ¿{user && user.nombre + " " + user.apellido}, confirmas que te
                apuntas a esta actividad ?
              </ConfirmDialog>
            </div>
            <div>
              <ConfirmDialog
                key="A3"
                title="¡ Desapuntarme a la Actividad !"
                open={openDesapuntar}
                setOpen={setOpenDesapuntar}
                onConfirm={() => {
                  confirmApuntar();
                }}
                state={"delete"}
              >
                ¿{user && user.nombre + " " + user.apellido}, confirmas que te
                desapuntas de esta actividad ?
              </ConfirmDialog>
            </div>
            <Dialog key="A1" open={openCopy}>
              <DialogContent>copiado</DialogContent>
            </Dialog>

            <DialogPerfiles
              openDialog={openVerApuntados}
              onCloseDialog={handleCloseVerApuntados}
              perfiles={perfiles}
              titulo={"Apuntados"}
              loading={loadingPerfiles}
            />
          </div>
        </>
      )}
    </>
  );
};
