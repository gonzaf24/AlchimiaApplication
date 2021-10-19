import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import CircularProgress from "@material-ui/core/CircularProgress";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import RowingIcon from "@material-ui/icons/Rowing";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { ListOfAlbums } from "../../components/ListOfAlbums";
import { ListOfPodcasts } from "../../components/ListOfPodcasts";
import { ListOfActividades } from "../../components/ListOfActividades";
import { Context } from "../../Context";
import { EditarUsuario } from "../../components/Modales/Usuario/EditarUsuario";
import { useMutation } from "@apollo/react-hooks";
import {
  GET_USER_BY_ID,
  VER_PERFILES,
  FOLLOW,
} from "../../container/UsuarioMutation";
import { DialogPerfiles } from "../../components/DialogPerfiles/index";
import Button from "@material-ui/core/Button";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Dialog from "@material-ui/core/Dialog";
import ShareIcon from "@material-ui/icons/Share";
import DialogContent from "@material-ui/core/DialogContent";
import CommentIcon from "@material-ui/icons/Comment";
import InsertLinkIcon from "@material-ui/icons/InsertLink";
import { ChatDirect } from "../Modales/Chat/ChatDirect";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "lightgray",
    flexGrow: 1,
    paddingBottom: "200px",
    borderRadius: 0,
  },
  large: {
    marginTop: "-70px",
    width: theme.spacing(12),
    height: theme.spacing(12),
    boxShadow: "0px 0px 20px 20px rgba(255, 253, 255, 0.14)",
  },
  seguidoresSeguidos: {
    marginTop: "-100px",
  },
  paper1: {
    color: "#1d20afb0",
    padding: theme.spacing(0),
    textAlign: "left",
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  paper: {
    padding: theme.spacing(0),
    textAlign: "left",
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  cardFondoAvatar: {
    borderTopLeftRadius: "0px",
    borderTopRightRadius: "0px",
  },
  center: {
    textAlign: "center",
  },
  bottom: {
    paddingBottom: "20px",
  },
  grid: {
    width: "200px",
    position: "absolute",
    marginLeft: "120px",
    textAlign: "center",
    marginTop: "35px",
  },
  backgroundTable: {
    background: "transparent",
    boxShadow: "none !important",
    color: "white",
    cursor: "pointer",
  },
  follow: {
    width: "100px",
    position: "absolute",
    marginTop: "75px",
    marginLeft: "140px",
  },
  spinner: {
    position: "absolute",
    marginTop: "75px",
    marginLeft: "180px",
  },
  color: {
    color: "#e91e63",
  },
  copy: {
    cursor: "pointer",
    position: "absolute",
    color: " white !important",
    top: 85,
    right: "10%",
    zIndex: "2",
  },
  mensaje: {
    cursor: "pointer",
    position: "absolute",
    color: "#d89090",
    right: "20%",
    zIndex: "2",
    top: "5px !important",
  },
}));

export const Usuario = ({ userId, usr }) => {
  const classes = useStyles();
  var editar = false;
  const {
    user,
    userAuth,
    actualizoUsuario,
    setActualizoUsuario,
    actualizoAlbum,
    setActualizoAlbum,
    actualizoActividad,
    setActualizoActividad,
    actualizoPodcast,
    setActualizoPodcast,
  } = useContext(Context);
  var [follow, setFollow] = useState(false);
  var [perfiles, setPerfiles] = useState();
  const [usuario, setUsuario] = useState(usr);
  const [loadingPerfil, setLoadingPerfiles] = useState(true);
  const [actualizoUser, setActualizoUser] = useState();
  const [openVerSeguidores, setOpenVerSeguidores] = useState(false);
  const [openVerSeguidos, setOpenVerSeguidos] = useState(false);
  const [getUsuarioMutation, {}] = useMutation(GET_USER_BY_ID);
  const [followMutation, {}] = useMutation(FOLLOW);
  const [verPerfiles, {}] = useMutation(VER_PERFILES);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [open, setOpen] = useState(false);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const urlCopy = window.location.href;

  const handleClickOpenVerSeguidoresSeguidos = async (type) => {
    setLoadingPerfiles(true);
    if (type === "seguidores") {
      setOpenVerSeguidores(true);
      if (usuario.seguidores) {
        const input = { ids: usuario.seguidores };
        var result = await verPerfiles({
          variables: { input },
        });
        if (result.data.perfiles) {
          setPerfiles(result.data.perfiles);
          setLoadingPerfiles(false);
        }
      } else {
        setLoadingPerfiles(false);
      }
    } else if (type === "seguidos") {
      setOpenVerSeguidos(true);
      if (usuario.seguidos) {
        const input = { ids: usuario.seguidos };
        var result = await verPerfiles({
          variables: { input },
        });
        if (result.data.perfiles) {
          setPerfiles(result.data.perfiles);
          setLoadingPerfiles(false);
        }
      } else {
        setLoadingPerfiles(false);
      }
    }
  };

  if (user && user.uid === userId) {
    if (usuario && usuario.uid != userId) {
      setUsuario(user);
      if (actualizoAlbum == true) {
        setActualizoAlbum(false);
      } else {
        setActualizoAlbum(true);
      }
      if (actualizoActividad == true) {
        setActualizoActividad(false);
      } else {
        setActualizoActividad(true);
      }
      if (actualizoPodcast == true) {
        setActualizoPodcast(false);
      } else {
        setActualizoPodcast(true);
      }
    }
    editar = true;
  } else {
    if (usuario && usuario.seguidores && user && user.uid) {
      follow = usuario.seguidores.includes(user.uid);
    }
  }

  const toFollow = async () => {
    if (user && user.uid != usuario.uid) {
      setLoadingFollow(true);
      const input = { userIdSeguidor: user.uid, userIdSeguido: usuario.uid };
      const result = await followMutation({
        variables: { input },
      });
      if (result) {
        setUsuario(result.data.follow.seguido);
        userAuth(result.data.follow.seguidor);
        if (actualizoUsuario == true) {
          setActualizoUsuario(false);
        } else {
          setActualizoUsuario(true);
        }
        setLoadingFollow(false);
      } else {
        setLoadingFollow(false);
      }
    }
  };

  const handleClosePerfiles = (value) => {
    setOpenVerSeguidores(false);
    setOpenVerSeguidos(false);
  };

  const handleClickOpenCopy = () => {
    setLoadingCopy(true);
    setOpen(true);
    setTimeout(function () {
      setOpen(false);
      setLoadingCopy(false);
    }, 500);
  };

  return (
    <>
      {usuario && (
        <>
          <Card className={classes.root}>
            <CardActionArea className={classes.bottom}>
              <Grid className={classes.grid} container spacing={0}>
                <Grid item xs={6}>
                  <Paper
                    className={classes.backgroundTable}
                    onClick={() => {
                      handleClickOpenVerSeguidoresSeguidos("seguidores");
                    }}
                  >
                    {usuario.seguidores ? usuario.seguidores.length : "0"}
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    className={classes.backgroundTable}
                    onClick={() => {
                      handleClickOpenVerSeguidoresSeguidos("seguidos");
                    }}
                  >
                    {usuario.seguidos ? usuario.seguidos.length : "0"}
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    className={classes.backgroundTable}
                    onClick={() => {
                      handleClickOpenVerSeguidoresSeguidos("seguidores");
                    }}
                  >
                    Followers
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper
                    className={classes.backgroundTable}
                    onClick={() => {
                      handleClickOpenVerSeguidoresSeguidos("seguidos");
                    }}
                  >
                    Followed
                  </Paper>
                </Grid>
              </Grid>

              {!editar && user && (
                <Typography className={classes.mensaje}>
                  <ChatDirect
                    uidSender={user.uid}
                    uidReceiver={usuario.uid}
                    emailSender={user.email}
                    emailReceiver={usuario.email}
                    avatar={usuario.avatar}
                    nombre={usuario.nombre + " " + usuario.apellido}
                  />
                </Typography>
              )}

              <div className={classes.copy}>
                {!loadingCopy ? (
                  <CopyToClipboard text={urlCopy}>
                    <ShareIcon
                      onClick={() => {
                        handleClickOpenCopy();
                      }}
                    />
                  </CopyToClipboard>
                ) : (
                  <CopyToClipboard text={urlCopy}>
                    <ShareIcon
                      className={classes.color}
                      fontSize="small"
                      onClick={() => {
                        handleClickOpenCopy();
                      }}
                    />
                  </CopyToClipboard>
                )}
              </div>

              {user && !editar && follow && (
                <>
                  {!loadingFollow ? (
                    <Button
                      className={classes.follow}
                      color="primary"
                      onClick={() => {
                        toFollow();
                      }}
                    >
                      following
                    </Button>
                  ) : (
                    <div className={classes.spinner}>
                      <CircularProgress size={20} />
                    </div>
                  )}
                </>
              )}
              {user && !editar && !follow && (
                <>
                  {!loadingFollow ? (
                    <Button
                      className={classes.follow}
                      color="primary"
                      onClick={() => {
                        toFollow();
                      }}
                    >
                      follow
                    </Button>
                  ) : (
                    <div className={classes.spinner}>
                      <CircularProgress size={20} />
                    </div>
                  )}
                </>
              )}
              <CardMedia
                className={classes.cardFondoAvatar}
                component="img"
                alt="imagen fondo"
                height="120"
                image="https://alchimia.s3.us-east-2.amazonaws.com/utils/fondo_negro.jpeg"
                title="profile background"
              />
              {editar && <EditarUsuario usuario={usuario} />}
              <CardContent>
                <Avatar
                  className={classes.large}
                  alt={usuario.nombre}
                  src={usuario.avatar}
                />
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  className={classes.center}
                >
                  {usuario.nombre} {usuario.apellido}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="div"
                >
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Paper className={classes.paper}>
                        <LocationOnIcon /> {usuario.pais} -{" "}
                        {usuario.estadoCiudad}
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper className={classes.paper}>
                        {usuario.profesiones && <RowingIcon />}
                        {usuario.profesiones &&
                          " Profession: " +
                            usuario.profesiones
                              .toString()
                              .split(",")
                              .join("\n" + "-" + "\n")}
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper className={classes.paper}>
                        {usuario.intereses && <EmojiPeopleIcon />}
                        {usuario.intereses &&
                          " Interest: " +
                            usuario.intereses
                              .toString()
                              .split(",")
                              .join("\n" + "-" + "\n")}
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper
                        className={classes.paper1}
                        onClick={() => {
                          window.open(usuario.linkRef1);
                        }}
                      >
                        {usuario.nomRef1 && <InsertLinkIcon />}
                        {usuario.nomRef1 && "  " + usuario.nomRef1}
                      </Paper>
                    </Grid>
                  </Grid>
                </Typography>
              </CardContent>
            </CardActionArea>

            <ListOfAlbums userId={usuario.uid} type={"public"} />
            <ListOfPodcasts userId={usuario.uid} type={"public"} />
            <ListOfActividades userId={usuario.uid} type={"public"} />
          </Card>
          <DialogPerfiles
            openDialog={openVerSeguidores}
            onCloseDialog={handleClosePerfiles}
            perfiles={perfiles}
            titulo={"Seguidores"}
            loading={loadingPerfil}
          />
          <DialogPerfiles
            openDialog={openVerSeguidos}
            onCloseDialog={handleClosePerfiles}
            perfiles={perfiles}
            titulo={"Seguidos"}
            loading={loadingPerfil}
          />
          <Dialog open={open}>
            <DialogContent>copied</DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};
