import styled from "styled-components";
import ReactCrop from "react-image-crop";
import { efectoSize } from "../../../styles/animations";

export const Form = styled.form`
  padding: 25px 15px 25px 15px;
`;

export const P = styled.p`
  color: #e91e63;
  font-size: 12px !important;
  margin-top: 10px;
  margin-bottom: 10px;
  ${efectoSize({ time: "3s" })};
`;

export const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-item: center;
  margin-top: 25px;
  text-align: center;
  background: #fefefe;
  border-radius: 4px;
`;

export const Div1 = styled.div`
  display: inline-grid;
`;

export const Error = styled.span`
  color: red;
  font-size: 14px;
`;

export const Img = styled.img`
  border-radius: 50%;
  height: 100px;
  width: 100px;
`;

export const Input = styled.input`
  border-radius: 50%;
  margin-top: 10px;
`;

export const ReactCrop1 = styled(ReactCrop)`
  display: flex;
  flex-direction: column;
  align-item: center;
  text-align: center;
  border-radius: 4px;
`;
