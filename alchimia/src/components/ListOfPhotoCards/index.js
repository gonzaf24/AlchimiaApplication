import React from "react";
import { PhotoCard } from "../PhotoCard";

export const ListOfPhotoCardsComponent = ({ data: { photos = [] } } = {}) => {
  photos = [
    {
      id: "1",
      liked: true,
      likes: 22,
      src: "",
    },
  ];

  return (
    <ul>
      {photos.map((photo) => (
        <PhotoCard key={photo.id} {...photo} />
      ))}
    </ul>
  );
};
