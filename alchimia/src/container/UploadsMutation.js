import React from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";

const SIMPLE_UPLOAD = gql`
  mutation uploadImage($input: FileUpload!) {
    uploadImage(input: $input)
  }
`;

export const UploadsMutation = ({ children }) => {
  return <Mutation mutation={SIMPLE_UPLOAD}>{children}</Mutation>;
};
