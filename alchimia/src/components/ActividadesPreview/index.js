import { Image } from "./styles";
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { reverseString, shortName, DEFAULT_IMAGE } from "../Utils/utils";
import { EditarActividad } from "../Modales/Actividad/EditarActividad";
import CardContent from "@material-ui/core/CardContent";
import PostAddIcon from "@material-ui/icons/PostAdd";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { VER_PERFILES } from "../../container/UsuarioMutation";
import { useMutation } from "@apollo/react-hooks";
import { navigate } from "@reach/router";
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
  root20: {
    height: "24px",
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
  carousel: {
    fontSize: "x-small",
    color: "#e91e63",
    fontWeight: "bold",
    textAlign: "center",
  },
  spinner: {
    justifyContent: "center",
    textAlign: "center",
    marginBottom: "20px",
  },
  botonSetting: {
    cursor: "pointer",
    position: "absolute",
    bottom: 190,
    left: "85%",
    zIndex: "2",
    fontSize: 30,
    color: "#E91E63 !important",
    backgroundColor: "#191415c2 !important",
    borderRadius: "100%",
    padding: "10px",
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
    height: 26,
    textAlign: "center",
    backgroundColor: "yellowgreen",
    cursor: "pointer",
    position: "absolute",
    bottom: 280,
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
    bottom: 260,
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
    bottom: 241,
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
    bottom: 217,
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
    top: "60%",
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
    borderRadius: "50%",
    height: "25px",
    width: "25px",
  },
  apuntadosInfo: {
    display: "inline-table",
    fontFamily: "Roboto, Arial, sans-serif, sans-serif !important",
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

export const ActividadesPreview = ({
  fotoPortada = DEFAULT_IMAGE,
  fechaInicio = "",
}) => {
  const classes = useStyles();
  if (!fotoPortada || fotoPortada === "") {
    fotoPortada = DEFAULT_IMAGE;
  }
  return (
    <div>
      <Image src={fotoPortada} />
      <div className={classes.carousel}>
        {reverseString(fechaInicio.substring(0, 10))}{" "}
      </div>
    </div>
  );
};

export const ActividadPortada = ({
  titulo = "",
  fechaInicio = "",
  fechaFin = "",
  fotoPortada = "",
  fechaCreacion = "",
  horaInicio = "",
  horaFin = "",
  pais = "",
  direccion = "",
  estadoCiudad = "",
  tags = "",
  contenido = "",
  uid = "",
  type = "",
  apuntados = "",
  likes = "",
}) => {
  var fotoPortadaCard = "";
  if (!fotoPortada || fotoPortada === "") {
    fotoPortadaCard = DEFAULT_IMAGE;
  } else {
    fotoPortadaCard = fotoPortada;
  }
  const [actividadApuntados, setActividadApuntados] = useState(apuntados);
  const [actividadLikes, setActividadLikes] = useState(likes);
  const classes = useStyles();
  const [perfiles, setPerfiles] = useState();
  const [loadingPerfiles, setLoadingPerfiles] = useState(false);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [verPerfiles, {}] = useMutation(VER_PERFILES);
  const [openVerApuntados, setOpenVerApuntados] = useState(false);
  const [openVerLikes, setOpenVerLikes] = useState(false);
  var date = new Date(fechaInicio);
  var formatted_DIA_NOMBRE = format(date, "EEEE", { locale: es });
  var formatted_DIA_NUMBER = format(date, "dd", { locale: es });
  var formatted_MES_NOMBRE = format(date, "MMM", { locale: es });
  var formatted_HORA =
    horaInicio.substr(0, 2) + ":" + horaInicio.substr(2, 5) + ".hrs";

  const [open, setOpen] = useState(false);
  const [loadingCopy, setLoadingCopy] = useState(false);
  const url = window.location.host;
  var urlCopy = url + "/actividad/" + uid;

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

  const handleClickOpenVerLikes = async () => {
    setLoadingPerfiles(true);
    setOpenVerLikes(true);
    const input = { ids: actividadLikes };
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

  const handleCloseVerApuntados = (value) => {
    setOpenVerApuntados(false);
    setOpenVerLikes(false);
  };

  const handleListItemClick = (value) => {
    navigate(`/user/${value}`);
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
            <EditarActividad
              tituloA={titulo}
              fechaInicioA={fechaInicio}
              fechaFinA={fechaFin}
              fotoPortadaA={fotoPortada}
              horaInicioA={horaInicio}
              horaFinA={horaFin}
              paisA={pais}
              direccionA={direccion}
              estadoCiudadA={estadoCiudad}
              tagsA={tags}
              contenidoA={contenido}
              uid={uid}
              fechaCreacionA={fechaCreacion}
              apuntadosA={apuntados}
              likesA={likes}
            />
          )}
          <div className={classes.fechaActividad}>{formatted_DIA_NOMBRE}</div>
          <div className={classes.fechaActividad1}>{formatted_DIA_NUMBER}</div>
          <div className={classes.fechaActividad2}>{formatted_MES_NOMBRE}.</div>
          <div className={classes.fechaActividad3}>{formatted_HORA}</div>

          <div
            className={classes.titulo}
            onClick={() => {
              navigate(`/actividad/${uid}`);
            }}
          >
            <h3> {titulo}</h3>
          </div>

          {type === "private" ? (
            <>
              <CardContent
                className={classes.apuntadosInfo}
                onClick={() => {
                  handleClickOpenVerApuntados(true);
                }}
              >
                <PostAddIcon color="primary" fontSize="small" />
                Apuntados : {apuntados.length}
              </CardContent>
              <CardContent
                className={classes.apuntadosInfo}
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
              <CardContent className={classes.apuntadosInfo}>
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
        openDialog={openVerApuntados}
        onCloseDialog={handleCloseVerApuntados}
        perfiles={perfiles}
        titulo={"Apuntados"}
        loading={loadingPerfiles}
      />

      <DialogPerfiles
        openDialog={openVerLikes}
        onCloseDialog={handleCloseVerApuntados}
        perfiles={perfiles}
        titulo={"Likes"}
        loading={loadingPerfiles}
      />
    </>
  );
};
