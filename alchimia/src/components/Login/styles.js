import styled from "styled-components";
import { Link as linkRouter } from "@material-ui/core";

export const Image = styled.img`
  width: 70px;
  height: 70px;
  text-align: center;
`;

export const Form = styled.form`
  padding: 16px 0;
`;

export const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-item: center;
  margin: 5px;
  text-align: center;
  background: #fefefe;
  padding: 20px;
  border-radius: 20px;
  -moz-box-shadow: inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow: inset 0 0 10px #000000;
  margin-top: 24%;
  margin-bottom: 24%;
`;

export const Link = styled(linkRouter)`
  color: rgba(0, 0, 0, 0.65) !important;
  font-size: 11px;
`;
export const Link1 = styled(linkRouter)`
  color: green !important;
  font-size: 11px;
`;

export const Error = styled.span`
  color: red;
  font-size: 14px;
`;
