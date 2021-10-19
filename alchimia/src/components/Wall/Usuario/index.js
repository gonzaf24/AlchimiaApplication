import React, { useContext, useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import RowingIcon from "@material-ui/icons/Rowing";
import { ChatDirect } from "../../Modales/Chat/ChatDirect";
import { Context } from "../../../Context";
import { navigate } from "@reach/router";
import CommentIcon from "@material-ui/icons/Comment";
import { aboutTime } from "../../Utils/utils";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Dialog from "@material-ui/core/Dialog";
import ShareIcon from "@material-ui/icons/Share";
import DialogContent from "@material-ui/core/DialogContent";
import { useNearScreen } from "../../../hooks/useNearScreen";
var uniqid = require("uniqid");

const useStyles = makeStyles((theme) => ({
  rootPrincipal: {
    width: "100%",
    backgroundColor: "#1c1c1c",
    minHeight: 120,
    padding: "0px !important",
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
  root: {
    padding: "0px !important",
  },
  root20: {
    height: "20px",
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
  owner: {
    cursor: "pointer",
    position: "absolute",
    color: " white !important",
    top: "45px",
    left: "0%",
    zIndex: "2",
    color: "#e91e63",
  },
  like: {
    cursor: "pointer",
    position: "absolute",
    color: " white !important",
    top: "55px",
    right: "5%",
    zIndex: "2",
  },
  titulo: {
    width: "100%",
    textAlign: "center",
    cursor: "pointer",
    position: "absolute",
    color: " white !important",
    zIndex: "2",
    top: "50%",
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
  likesInfo: {
    display: "inline-table",
    fontFamily: "Roboto, Arial, sans-serif, sans-serif !important",
  },
  imagen: {
    width: 500,
    height: 250,
    display: "block",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  black: {
    color: "#000000",
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
  large: {
    left: 5,
    top: "20px",
    position: "absolute",
    width: theme.spacing(10),
    height: theme.spacing(10),
    boxShadow: "0px 0px 30px 10px rgba(255, 253, 255, 0.14)",
  },
  seguidoresSeguidos: {
    marginTop: "-100px",
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
    paddingBottom: "0px !important",
    height: 110,
  },
  nombre: {
    color: "#e91e63",
    top: "30px",
    left: "130px",
    position: "absolute",
  },
  location: {
    backgroundColor: "#1c1c1c",
    color: "#e91e63",
    top: "50px",
    left: "130px",
    marginLeft: 5,
    fontSize: ".8rem",
  },
  profe: {
    backgroundColor: "#1c1c1c",
    color: "#e91e63",
    top: "70px",
    left: "130px",
    marginLeft: 5,
    fontSize: ".8rem",
  },
  inter: {
    backgroundColor: "#1c1c1c",
    color: "#e91e63",
    top: "90px",
    left: "130px",
    marginLeft: 5,
    fontSize: ".8rem",
    marginBottom: 5,
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
  copy: {
    top: "80px",
    right: "15%",
    position: "absolute",
    cursor: "pointer",
    color: " white !important",
    zIndex: "2",
  },
  color: {
    color: "#e91e63",
  },
  min: {
    minHeight: 120,
  },
}));

export const Usuario = ({
  uid,
  fechaCreacion,
  nombre,
  apellido,
  avatar,
  pais,
  estadoCiudad,
  type,
  email,
  profesiones,
  intereses,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const [about, setAbout] = useState("");
  const url = window.location.href;
  var urlCopy = url.substring(0, url.lastIndexOf("home/")) + "user/" + uid;
  const [show, element] = useNearScreen();
  const handleListItemClick = async (value) => {
    navigate(`/user/${value}`);
  };
  const [uniqueKey, setUniqueKey] = useState(uniqid());
  useEffect(() => {
    async function fetchData() {
      var prue = await aboutTime(fechaCreacion);
      setAbout(prue);
    }
    fetchData();
  }, [fechaCreacion]);

  const { user } = useContext(Context);

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
          <Card className={classes.rootPrincipal}>
            <CardActionArea>
              <CardMedia
                className={classes.cardFondoAvatar}
                component="img"
                alt="imagen fondo"
                image="https://alchimia.s3.us-east-2.amazonaws.com/utils/fondo_negro.jpeg"
                title="profile background"
              />
              <CardContent className={classes.root}>
                <Avatar
                  className={classes.large}
                  alt={nombre}
                  src={avatar}
                  onClick={() => handleListItemClick(uid)}
                />
                <Typography
                  gutterBottom
                  variant="h5"
                  className={classes.nombre}
                  onClick={() => handleListItemClick(uid)}
                >
                  {nombre} {apellido}
                </Typography>

                <Typography
                  className={classes.location}
                  onClick={() => handleListItemClick(uid)}
                >
                  <LocationOnIcon className={classes.sizeIcon} /> {pais} -{" "}
                  {estadoCiudad}
                </Typography>

                <Typography className={classes.profe}>
                  {profesiones && <RowingIcon className={classes.sizeIcon} />}
                  {profesiones &&
                    " Profession: " +
                      profesiones
                        .toString()
                        .split(",")
                        .join("\n" + "-" + "\n")}
                </Typography>

                <Typography className={classes.inter}>
                  {intereses && (
                    <EmojiPeopleIcon className={classes.sizeIcon} />
                  )}
                  {intereses &&
                    " Interest: " +
                      intereses
                        .toString()
                        .split(",")
                        .join("\n" + "-" + "\n")}
                </Typography>

                <ChatDirect
                  uidSender={user.uid}
                  uidReceiver={uid}
                  emailSender={user.email}
                  emailReceiver={email}
                  avatar={avatar}
                  nombre={nombre + " " + apellido}
                />

                {/*  <Typography className={classes.mensaje}>
                  <CommentIcon fontSize="small" />
                </Typography> */}

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

                <Typography className={classes.aboutTime}>{about}</Typography>
              </CardContent>
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
