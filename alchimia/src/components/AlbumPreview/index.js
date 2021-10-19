import { Image } from "./styles";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import { reverseString, shortName, DEFAULT_IMAGE } from "../Utils/utils";
import { EditarAlbum } from "../Modales/Album/EditarAlbum";
import { VER_PERFILES } from "../../container/UsuarioMutation";
import { useMutation } from "@apollo/react-hooks";
import { navigate } from "@reach/router";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import CardContent from "@material-ui/core/CardContent";
import { DialogPerfiles } from "../../components/DialogPerfiles/index";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Dialog from "@material-ui/core/Dialog";
import ShareIcon from "@material-ui/icons/Share";
import DialogContent from "@material-ui/core/DialogContent";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    backgroundColor: "#000000d6",
    borderRadius: 0,
    color: "white",
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
  root20: {
    height: "20px",
  },
  carousel: {
    fontSize: "x-small",
    color: "#e91e63",
    fontWeight: "bold",
    textAlign: "center",
  },
  media: {
    height: 250,
    opacity: 0.5,
    background: "rgba(black, 0.5)",
  },
  fecha: {
    cursor: "pointer",
    position: "absolute",
    bottom: 270,
    left: "5%",
    color: " white !important",
    zIndex: "2",
    fontSize: "1em",
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
  imagen: {
    width: 500,
    height: 250,
    display: "block",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  imagenDialog: {
    borderRadius: "50%",
    height: "25px",
    width: "25px",
  },
  likesInfo: {
    display: "inline-table",
    fontFamily: "Roboto, Arial, sans-serif, sans-serif !important",
  },
  spinner: {
    justifyContent: "center",
    textAlign: "center",
    marginBottom: "20px",
  },
  copy: {
    cursor: "pointer",
    position: "absolute",
    color: " white !important",
    bottom: 10,
    right: "7%",
    zIndex: "2",
    animation: "pulse 5s infinite",
  },
  color: {
    color: "#e91e63",
  },
}));

export const AlbumPreview = ({
  fotoPortada = DEFAULT_IMAGE,
  path = "#",
  titulo = "...",
  fechaCreacion = "",
}) => {
  const classes = useStyles();
  if (!fotoPortada || fotoPortada === "") {
    fotoPortada = DEFAULT_IMAGE;
  }
  return (
    <div>
      <div className={classes.carousel}>{shortName(titulo)}</div>
      <Image src={fotoPortada} />
    </div>
  );
};

const options = ["Ver", "Editar", "Eliminar"];

const ITEM_HEIGHT = 40;

export const AlbumPortada = ({
  titulo = "",
  subtitulo = "",
  fotoPortada = "",
  contenido = "",
  autor = "",
  fotos = "",
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
  const [albumLikes, setAlbumLikes] = useState(likes);
  const [perfiles, setPerfiles] = useState();
  const [verPerfiles, {}] = useMutation(VER_PERFILES);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openVerLikes, setOpenVerLikes] = useState(false);
  const [loadingPerfiles, setLoadingPerfiles] = useState(false);

  const [open, setOpen] = useState(false);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const url = window.location.host;
  var urlCopy = url + "/album/" + uid;

  const handleClickOpenVerLikes = async () => {
    setLoadingPerfiles(true);
    setOpenVerLikes(true);
    const input = { ids: albumLikes };
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
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={fotoPortadaCard}
            title={titulo}
          />

          {type === "private" && (
            <EditarAlbum
              tituloA={titulo}
              subtituloA={subtitulo}
              fotoPortadaA={fotoPortada}
              contenidoA={contenido}
              autorA={autor}
              fotosA={fotos}
              uid={uid}
              fechaCreacion={fechaCreacion}
              likes={likes}
            />
          )}

          <div
            className={classes.titulo}
            onClick={() => {
              navigate(`/album/${uid}`);
            }}
          >
            <h3> {titulo}</h3>
          </div>

          <div className={classes.fecha}>
            {reverseString(fechaCreacion.substring(0, 10))}
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
        <DialogContent>copiado</DialogContent>
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
