import React, { useState, useContext, Fragment } from "react";
import { Context } from "../Context";
import { SEARCH_WALL } from "../container/WallMutation";
import { Wall as Muro } from "../components/Wall/index";

import { Layout } from "../components/Layout";
import { useMutation } from "@apollo/react-hooks";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import Autocomplete from "@material-ui/lab/Autocomplete";

import countriesList from "../assets/countries/countries.json";
import IconButton from "@material-ui/core/IconButton";
import { profesionesList } from "../assets/countries/profesiones.js";
import Collapse from "@material-ui/core/Collapse";

import Button from "@material-ui/core/Button";

import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import clsx from "clsx";

import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: "10px",
  },
  spinner: {
    justifyContent: "center",
    textAlign: "center",
    paddingTop: "40px",
    display: "grid",
  },
  collapser: {
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "#E91E63",
  },
  btnSearch: {
    float: "right",
    marginRight: "15px",
    backgroundColor: "white",
    marginTop: "5px",
    "&:hover": {
      color: "white",
      borderColor: "white",
    },
  },
  atocomplete: {
    width: "100%",
  },
  formControl1: {
    marginLeft: "15px",
    width: "30%",
    marginBottom: "10px",
  },
  formControl2: {
    marginLeft: "15px",
    height: "96px",
    marginTop: "10px",
    width: "30%",
    fontSize: "0.8rem !important",
  },
  formControl3: {
    height: "96px",
    marginTop: "10px",
    width: "30%",
    fontSize: "0.8rem !important",
  },
  fontSize: {
    fontSize: "5px",
    marginLeft: 0,
  },
  prue: {
    justifyContent: "center",
    textAlign: "center",
    marginBottom: "20px",
  },
  expand: {
    textAlign: "center",
    transform: "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: "22%",
  },
  expandOpen: {
    transform: "rotate(0deg)",
  },
  empty: {
    justifyContent: "center",
    textAlign: "center",
    width: "100%",
  },
  tete: {
    backgroundColor: "#0000001a",
    padding: 0,
  },
}));

var ciudadesList = [];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const Search = ({ id }) => {
  const classes = useStyles();
  const { user } = useContext(Context);

  const [pais, setPais] = useState("");
  const [estadoCiudad, setEstadoCiudad] = useState("");
  const [inputValuePais, setInputValuePais] = useState("");
  const [inputValueEstadoCiudad, setInputValueEstadoCiudad] = useState("");

  const [searchWallMutation, {}] = useMutation(SEARCH_WALL);
  const [loading, setLoading] = useState(false);
  const [wall, setWall] = useState();
  const [profesiones, setProfesiones] = useState("");

  const [checkPerfiles, setCheckPerfiles] = useState(true);
  const [checkArtAlbums, setCheckArtAlbums] = useState(true);
  const [checkPodcasts, setCheckPodcasts] = useState(true);
  const [checkActividades, setCheckActividades] = useState(true);
  const [album, setAlbum] = useState(true);
  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleChangePais = (e) => {
    setPais(e && e.CountryName ? e.CountryName : "");
    ciudadesList = e.States;
  };

  const handleClickCheckPerfil = (event) => {
    if (checkPerfiles) {
      setCheckPerfiles(false);
    } else {
      setCheckPerfiles(true);
    }
  };
  const handleClickCheckArtAlbums = (event) => {
    if (checkArtAlbums) {
      setCheckArtAlbums(false);
    } else {
      setCheckArtAlbums(true);
    }
  };
  const handleClickCheckPodcasts = (event) => {
    if (checkPodcasts) {
      setCheckPodcasts(false);
    } else {
      setCheckPodcasts(true);
    }
  };
  const handleClickCheckActividades = (event) => {
    if (checkActividades) {
      setCheckActividades(false);
    } else {
      setCheckActividades(true);
    }
  };

  const onClickSearch = async () => {
    setLoading(true);
    const input = {
      checkPerfiles,
      checkArtAlbums,
      checkPodcasts,
      checkActividades,
      pais,
      estadoCiudad,
      profesiones,
    };
    const result = await searchWallMutation({
      variables: { input },
    });
    if (result) {
      const { searchWall } = result.data;
      setWall(searchWall);
      setLoading(false);
    }
  };

  return (
    <>
      <Layout id={id}>
        <Fragment>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <FormControl component="fieldset" className={classes.formControl1}>
              <FormGroup>
                <Autocomplete
                  className={classes.atocomplete}
                  id="paisID"
                  inputValue={inputValuePais}
                  options={countriesList.Countries}
                  autoHighlight
                  getOptionLabel={(option) => option.CountryName}
                  renderOption={(option) => (
                    <Fragment>{option.CountryName}</Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
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
                  className={classes.atocomplete}
                  id="ciudadID"
                  options={ciudadesList}
                  autoHighlight
                  inputValue={inputValueEstadoCiudad}
                  getOptionLabel={(option) => option.StateName}
                  renderOption={(option) => (
                    <Fragment>{option.StateName}</Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password",
                      }}
                    />
                  )}
                  onInputChange={(event, newInputValue) => {
                    setInputValueEstadoCiudad(newInputValue);
                  }}
                  onChange={(event, value) => {
                    setEstadoCiudad(value ? value.StateName : "");
                  }}
                />

                <Autocomplete
                  id="profesionesID"
                  disableCloseOnSelect
                  value={profesiones}
                  options={profesionesList}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField {...params} label="Profession" />
                  )}
                  renderOption={(option, { selected }) => (
                    <Fragment>{option}</Fragment>
                  )}
                  onChange={(_, selectedOptions) =>
                    setProfesiones(selectedOptions)
                  }
                />
              </FormGroup>
            </FormControl>

            <FormControl component="fieldset" className={classes.formControl2}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkPerfiles}
                      onChange={handleClickCheckPerfil}
                      name="Profiles"
                    />
                  }
                  label="Profiles"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkArtAlbums}
                      onChange={handleClickCheckArtAlbums}
                      name="Art+ / Albums"
                    />
                  }
                  label="Art+ / Albums"
                />
              </FormGroup>
            </FormControl>
            <FormControl component="fieldset" className={classes.formControl3}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkPodcasts}
                      onChange={handleClickCheckPodcasts}
                      name="Podcasts"
                    />
                  }
                  label="Podcasts"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkActividades}
                      onChange={handleClickCheckActividades}
                      name="Activities"
                    />
                  }
                  label="Activities"
                />
              </FormGroup>
            </FormControl>
          </Collapse>

          {album && (
            <div className={classes.collapser}>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandLessIcon />
              </IconButton>
              <Button
                variant="outlined"
                color="primary"
                className={classes.btnSearch}
                onClick={onClickSearch}
                disabled={loading}
              >
                search
              </Button>
            </div>
          )}
        </Fragment>

        {loading ? (
          <div className={classes.spinner}>
            <CircularProgress size={150} />
          </div>
        ) : (
          <Muro wall={wall} />
        )}
      </Layout>
      ;
    </>
  );
  return "";
};
