import React, { useContext, useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Context } from "../../../Context";
import Avatar from "@material-ui/core/Avatar";
import AvatarImg from "../../../assets/avatar.png";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DEFAULT_IMAGE } from "../../Utils/utils";
import { LIKE_ACTIVIDAD } from "../../../container/ActividadMutation";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import { navigate } from "@reach/router";
import CircularProgress from "@material-ui/core/CircularProgress";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { useMutation } from "@apollo/react-hooks";
import { aboutTime } from "../../Utils/utils";
import Typography from "@material-ui/core/Typography";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Dialog from "@material-ui/core/Dialog";
import ShareIcon from "@material-ui/icons/Share";
import DialogContent from "@material-ui/core/DialogContent";
import { useNearScreen } from "../../../hooks/useNearScreen";
var uniqid = require("uniqid");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: 300,
    backgroundColor: "black",
    flexGrow: 1,
    borderRadius: "0px",
    animation: `$myEffect 1250ms ${theme.transitions.easing.easeInOut}`,
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
    paddingTop: 3,
    width: 100,
    height: 25,
    textAlign: "center",
    backgroundColor: "yellowgreen",
    cursor: "pointer",
    position: "absolute",
    bottom: 225,
    left: "5%",
    color: " white !important",
    zIndex: "2",
    fontSize: "1.2em",
    fontWeight: "bold",
  },
  fechaActividad1: {
    paddingTop: 1,
    width: 100,
    height: 21,
    textAlign: "center",
    backgroundColor: "yellowgreen",
    cursor: "pointer",
    position: "absolute",
    bottom: 205,
    left: "5%",
    color: " white !important",
    zIndex: "2",
    fontSize: "1.2em",
    fontWeight: "bold",
  },
  fechaActividad2: {
    width: 100,
    height: 21,
    textAlign: "center",
    backgroundColor: "yellowgreen",
    cursor: "pointer",
    position: "absolute",
    bottom: 185,
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
    bottom: 160,
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
    top: "65%",
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
  owner: {
    cursor: "pointer",
    position: "absolute",
    color: " white !important",
    bottom: -50,
    left: "0%",
    zIndex: "2",
    color: "#e91e63",
  },
  like: {
    cursor: "pointer",
    position: "absolute",
    color: " white !important",
    bottom: -40,
    right: "5%",
    zIndex: "2",
  },
  spinnerSize: {
    cursor: "pointer",
    position: "absolute",
    width: "20px !important",
    height: "20px !important",
    marginBottom: 7,
    marginRight: 10,
    bottom: -40,
    right: "5%",
    zIndex: "2",
  },
  aboutTime: {
    color: "white",
    backgroundColor: "#e6ad00b8",
    right: "0px",
    paddingLeft: "10px",
    position: "absolute",
    borderBottomLeftRadius: "3px",
    fontSize: "smaller",
    top: "0px",
  },
  sizeIcon: {
    color: "#e91e63",
    fontSize: ".8rem",
  },
  location: {
    color: "white",
    bottom: 10,
    right: "10px",
    position: "absolute",
    fontSize: ".8rem",
    cursor: "pointer",
  },
  color: {
    color: "#e91e63",
  },
  copy: {
    cursor: "pointer",
    position: "absolute",
    color: " white !important",
    bottom: -40,
    right: "15%",
    zIndex: "2",
    animation: "pulse 5s infinite",
  },
  min: {
    minHeight: 120,
  },
}));

export const Actividad = ({
  uid,
  fechaCreacion,
  contenido,
  titulo,
  fechaFin,
  fechaInicio,
  fotoPortada,
  horaFin,
  horaInicio,
  pais,
  estadoCiudad,
  tags,
  apuntados,
  likes,
  like,
  type,
  email,
  avatar,
  nombre,
  apellido,
}) => {
  var fotoPortadaCard = "";
  if (!fotoPortada || fotoPortada === "") {
    fotoPortadaCard = DEFAULT_IMAGE;
  } else {
    fotoPortadaCard = fotoPortada;
  }

  const classes = useStyles();
  const { user } = useContext(Context);
  var date = new Date(fechaInicio);
  var formatted_DIA_NOMBRE = format(date, "EEEE", { locale: es });
  var formatted_DIA_NUMBER = format(date, "dd", { locale: es });
  var formatted_MES_NOMBRE = format(date, "MMM", { locale: es });
  var formatted_HORA =
    horaInicio.substr(0, 2) + ":" + horaInicio.substr(2, 5) + ".hrs";
  const handleListItemClick = async (value) => {
    navigate(`/user/${value}`);
  };
  const uidUser = uid.substring(0, uid.lastIndexOf("|"));
  const labelId = `checkbox-list-label-${uid}`;
  const [meGusta, setMeGusta] = useState(like);
  const [loadingLike, setLoadingLike] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [likeActividad, {}] = useMutation(LIKE_ACTIVIDAD);
  const [open, setOpen] = useState(false);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const [about, setAbout] = useState("");
  const url = window.location.href;
  var urlCopy = url.substring(0, url.lastIndexOf("home/")) + "actividad/" + uid;
  const [show, element] = useNearScreen();
  const [uniqueKey, setUniqueKey] = useState(uniqid());
  const confirmLike = async () => {
    if (user.uid != uidUser) {
      setLoadingLike(true);
      const input = { actividadID: uid, userId: user.uid };
      const result = await likeActividad({
        variables: { input },
      });
      if (result) {
        setLikesCount(result.data.likeActividad.likes.length);
        setMeGusta(
          result.data.likeActividad.likes.includes(user.uid) ? "true" : "false"
        );
        setLoadingLike(false);
      } else {
        setLoadingLike(false);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      var prue = await aboutTime(fechaCreacion);
      setAbout(prue);
    }
    fetchData();
  }, [fechaCreacion]);

  const handleClickOpenCopy = () => {
    setLoadingCopy(true);
    setOpen(true);
    setTimeout(function () {
      setOpen(false);
      setLoadingCopy(false);
    }, 500);
  };

  return (
    <article className={classes.min} ref={element} key={uid}>
      {show && (
        <Fragment>
          <Card className={classes.root}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={fotoPortadaCard}
                title={titulo}
              />
              <div className={classes.fechaActividad}>
                {formatted_DIA_NOMBRE}
              </div>
              <div className={classes.fechaActividad1}>
                {formatted_DIA_NUMBER}
              </div>
              <div className={classes.fechaActividad2}>
                {formatted_MES_NOMBRE}.
              </div>
              <div className={classes.fechaActividad3}>{formatted_HORA}</div>
              <div
                className={classes.titulo}
                onClick={() => {
                  navigate(`/actividad/${uid}`);
                }}
              >
                <h3> {titulo}</h3>
              </div>

              {!loadingLike ? (
                <>
                  {meGusta === "true" ? (
                    <div className={classes.like}>
                      <ThumbUpAltIcon
                        color="primary"
                        fontSize="small"
                        onClick={() => {
                          confirmLike();
                        }}
                      />
                      {likesCount}
                    </div>
                  ) : (
                    <div className={classes.like}>
                      <ThumbUpAltIcon
                        fontSize="small"
                        onClick={() => {
                          confirmLike();
                        }}
                      />
                      {likesCount}
                    </div>
                  )}
                </>
              ) : (
                <CircularProgress className={classes.spinnerSize} />
              )}

              <Typography
                className={classes.location}
                onClick={() => handleListItemClick(uidUser)}
              >
                <LocationOnIcon className={classes.sizeIcon} /> {pais} -{" "}
                {estadoCiudad}
              </Typography>

              <div className={classes.copy}>
                {!loadingCopy ? (
                  <CopyToClipboard text={urlCopy}>
                    <ShareIcon
                      fontSize="small"
                      onClick={() => {
                        handleClickOpenCopy();
                      }}
                    />
                  </CopyToClipboard>
                ) : (
                  <CopyToClipboard text={urlCopy}>
                    <ShareIcon
                      className={classes.color}
                      onClick={() => {
                        handleClickOpenCopy();
                      }}
                    />
                  </CopyToClipboard>
                )}
              </div>

              <div className={classes.owner}>
                <ListItem key={uid} role={undefined} dense button>
                  <ListItemAvatar>
                    <Avatar
                      alt="Remy Sharp"
                      src={avatar ? avatar : AvatarImg}
                      onClick={() => handleListItemClick(uidUser)}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    id={labelId}
                    primary={nombre + " " + apellido}
                    onClick={() => handleListItemClick(uidUser)}
                  />
                </ListItem>
              </div>

              <Typography className={classes.aboutTime}>{about}</Typography>
            </CardActionArea>
          </Card>
          <Dialog open={open}>
            <DialogContent>copied</DialogContent>
          </Dialog>
        </Fragment>
      )}
    </article>
  );
};
