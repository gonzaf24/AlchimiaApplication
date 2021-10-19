import React, { Fragment, useState, useCallback } from "react";
import { Error, Form, Div, Img, Input, ReactCrop1, P } from "./styles";
import { Helmet } from "react-helmet";
import Container from "@material-ui/core/Container";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import Fab from "@material-ui/core/Fab";
import { SubmitButton } from "../../SubmitButton";
import Box from "@material-ui/core/Box";
import AvatarImg from "../../../assets/avatar.png";
import css from "../../../styles/reactCropp.css";
import Spinner from "react-spinner-material";

var uniqid = require("uniqid");

export const PhotoComponent = ({ error, loading, onSubmit }) => {
  const [upImg, setUpImg] = useState();
  const [imgRef, setImgRef] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", width: 60, aspect: 9 / 9 });
  const [previewUrl, setPreviewUrl] = useState();
  const [file, setFile] = useState();
  const [fileNameUpload, setFileNameUpload] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      file: file,
    });
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);

      const name = e.target.files[0].name;
      const lastDot = name.lastIndexOf(".");
      const ext = name.substring(lastDot + 1);
      const fileName = uniqid() + "." + ext;
      setFileNameUpload(fileName);
    }
  };

  const onLoad = useCallback((img) => {
    setImgRef(img);
  }, []);

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

  return (
    <Fragment>
      <Helmet>
        <title>Profile photo | Alchimia </title>
        <meta name="description" content={"imagen de perfil"} />
      </Helmet>
      <Container>
        <Div>
          <Form disabled={loading} onSubmit={handleSubmit}>
            <h2>Profile photo</h2>

            {loading && <Spinner size={220} color={"#c2185b"} visible={true} />}

            {error && (
              <Error>
                <br />
                {error}
                <br />
              </Error>
            )}

            <Box justifyContent="center" marginTop="15px">
              <label htmlFor="contained-button-file">
                <Fab component="span">
                  <AddPhotoAlternateIcon />
                </Fab>
              </label>
              <Input
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={onSelectFile}
              />
            </Box>

            {upImg && <P>move the frame to adjust your photo</P>}
            <ReactCrop1
              src={upImg}
              onImageLoaded={onLoad}
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={makeClientCrop}
            />
            <h4>will look like :</h4>
            <Box display="flex" justifyContent="center" marginBottom="20px">
              {previewUrl ? (
                <Img alt="vista imagen cortada" src={previewUrl} />
              ) : (
                <Img alt="vista imagen cortada" src={AvatarImg} />
              )}
            </Box>
            <SubmitButton disabled={!previewUrl}>confirm</SubmitButton>
          </Form>
        </Div>
      </Container>
    </Fragment>
  );
};
