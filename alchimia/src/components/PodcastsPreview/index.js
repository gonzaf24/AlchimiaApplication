import React, { useContext, useState } from "react";
import { ImageP } from "./styles";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import { Context } from "../../Context";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { EditarPodcast } from "../Modales/Podcast/EditarPodcast";
import CardActionArea from "@material-ui/core/CardActionArea";
import { DialogPerfiles } from "../../components/DialogPerfiles/index";
import { VER_PERFILES } from "../../container/UsuarioMutation";
import { useMutation } from "@apollo/react-hooks";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Dialog from "@material-ui/core/Dialog";
import ShareIcon from "@material-ui/icons/Share";
import DialogContent from "@material-ui/core/DialogContent";
import { navigate } from "@reach/router";

import {
  reverseString,
  shortName,
  shortNameCustom,
  DEFAULT_IMAGE,
} from "../Utils/utils";

const useStyles = makeStyles((theme) => ({
  carousel: {
    fontSize: "x-small",
    color: "#e91e63",
    fontWeight: "bold",
    textAlign: "center",
  },
  root: {
    backgroundColor: "#000000d6",
    animation: `$myEffect 1250ms ${theme.transitions.easing.easeInOut}`,
    borderRadius: 0,
    /* color: "white", */

    height: 250,
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
  root1: {
    float: "left",
    width: "50%",
    backgroundColor: "#bd741880",
    height: "200px",
    animation: `$myEffect 1250ms ${theme.transitions.easing.easeInOut}`,
  },
  root2: {
    float: "right",
    width: "50%",
    backgroundColor: "#bd741880",
    height: "200px",
    animation: `$myEffect 1250ms ${theme.transitions.easing.easeInOut}`,
  },

  details: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    /*  width: "70%", */
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: "100%",
    right: 0,
    float: "right",
    height: "200px",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 50,
    width: 50,
    borderRadius: "100% !important",
    backgroundColor: "#faebd766  !important",
    padding: "10px  !important",
  },

  size09: {
    fontSize: "0.9em",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 400,
    lineHeight: 1.3,
    letterSpacing: "0.00938em",
    textTransform: "uppercase",
  },
  size07: {
    fontSize: "0.7em",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: "0.00938em",
  },
  likesInfo: {
    color: "white",
    bottom: "-50px",
    position: "absolute",
    display: "inline-table",
    fontFamily: "Roboto, Arial, sans-serif, sans-serif !important",
  },
  root20: {
    height: "20px",
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
  color: {
    color: "#e91e63",
  },
}));

export const PodcastsPreview = ({
  fotoPortada = DEFAULT_IMAGE,
  path = "#",
  titulo = "...",
  fechaCreacion = "",
}) => {
  if (!fotoPortada || fotoPortada === "") {
    fotoPortada = DEFAULT_IMAGE;
  }
  const divStyle = {
    backgroundImage: `url(${fotoPortada})`,
    backgroundSize: "cover",
    objectFit: "cover",
    height: 75,
    width: 75,
    backgroundPosition: "center",
    opacity: 0.7,
    position: "relative",
    zIndex: 20,
  };
  const divStylePlay = {
    color: "#e91e63",
    width: "2em",
    height: "2em",
    marginTop: "15px",
    marginLeft: "15px",
    position: "absolute",
    zIndex: 40,
  };

  const prueba = {
    position: "relative",
  };
  const classes = useStyles();

  return (
    <>
      <div className={classes.carousel}>{shortName(titulo)}</div>
      <div style={prueba}>
        <PlayArrowIcon style={divStylePlay} />
        <ImageP style={divStyle} />
      </div>
      <div className={classes.carousel}>
        {reverseString(fechaCreacion.substring(0, 10))}{" "}
      </div>
    </>
  );
};

export const PodcastPortada = ({
  titulo = "",
  fotoPortada = "",
  contenido = "",
  autor = "",
  audio = "",
  uid = "",
  fechaCreacion = "",
  type = "",
  likes = "",
}) => {
  var fotoPortadaCard = "";
  if (!fotoPortada || fotoPortada === "") {
    fotoPortadaCard = DEFAULT_IMAGE;
  } else {
    fotoPortadaCard = fotoPortada;
  }

  const classes = useStyles();
  const [podcastLikes, setPodcastLikes] = useState(likes);
  const { setAbrirReproductor, setAudio } = useContext(Context);
  const [perfiles, setPerfiles] = useState();
  const [verPerfiles, {}] = useMutation(VER_PERFILES);
  const [loadingPerfiles, setLoadingPerfiles] = useState(false);
  const [openVerLikes, setOpenVerLikes] = useState(false);

  const [open, setOpen] = useState(false);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const url = window.location.host;
  var urlCopy = url + "/podcast/" + uid;

  const enviarAbrirAudio = (audioSource, titulo, autor) => {
    const audio = {
      audio: audioSource,
      titulo: titulo,
      autor: autor,
    };
    setAbrirReproductor(true);
    setAudio(audio);
  };

  const handleClickOpenVerLikes = async () => {
    setLoadingPerfiles(true);
    setOpenVerLikes(true);
    const input = { ids: podcastLikes };
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

  const handleCloseVerLikes = (value) => {
    setOpenVerLikes(false);
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
      <Card className={classes.root}>
        <CardActionArea className={classes.root1}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography
                className={classes.size09}
                onClick={() => {
                  navigate(`/podcast/${uid}`);
                }}
              >
                {shortNameCustom(40, titulo)}
              </Typography>
              <Typography
                className={classes.size07}
                color="textSecondary"
                onClick={() => {
                  navigate(`/podcast/${uid}`);
                }}
              >
                {shortNameCustom(140, contenido)}
              </Typography>
            </CardContent>
            <div className={classes.controls}>
              <IconButton aria-label="play/pause">
                <PlayArrowIcon
                  className={classes.playIcon}
                  onClick={() => {
                    enviarAbrirAudio(audio, titulo, autor);
                  }}
                />
              </IconButton>
            </div>
            <div className={classes.controls}>
              <Typography className={classes.size09}>
                {shortNameCustom(15, autor)}
              </Typography>
            </div>
          </div>

          {type === "private" ? (
            <>
              <CardContent
                className={classes.likesInfo}
                onClick={() => {
                  handleClickOpenVerLikes(true);
                }}
              >
                <ThumbUpAltIcon color="primary" fontSize="small" /> Likes :{" "}
                {likes.length}
              </CardContent>
            </>
          ) : (
            <>
              <CardContent className={classes.likesInfo}>
                <div className={classes.root20}></div>
              </CardContent>
            </>
          )}
        </CardActionArea>
        <CardActionArea className={classes.root2}>
          <CardMedia
            className={classes.cover}
            image={fotoPortada}
            /* onClick={() => {
              navigate(`/podcast/${uid}`);
            }} */
          >
            {type == "private" && (
              <EditarPodcast
                tituloA={titulo}
                fotoPortadaA={fotoPortada}
                contenidoA={contenido}
                autorA={autor}
                audioA={audio}
                uid={uid}
                fechaCreacion={fechaCreacion}
                likes={likes}
              />
            )}
          </CardMedia>

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
        </CardActionArea>
      </Card>

      <Dialog open={open}>
        <DialogContent>copied</DialogContent>
      </Dialog>

      <DialogPerfiles
        openDialog={openVerLikes}
        onCloseDialog={handleCloseVerLikes}
        perfiles={perfiles}
        titulo={"Likes"}
        loading={loadingPerfiles}
      />
    </>
  );
};
