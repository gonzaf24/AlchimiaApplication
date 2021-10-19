import styled from "styled-components";
import { TextField as textFieldRouter } from "@material-ui/core";
import { KeyboardDatePicker as dateRouter } from "@material-ui/pickers";

export const Form = styled.form`
  padding: 25px 15px 25px 15px;
`;

export const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-item: center;
  margin: 0px;
  text-align: center;
  background: #fefefe;
  padding: 0px;
  border-radius: 4px;
  margin-top: 6%;
  margin-bottom: 6%;
`;

export const DateF = styled(dateRouter)`
  width: 100%;
  text-align: left;
  &[disabled] {
    opacity: 0.3;
  }
`;

export const TextF = styled(textFieldRouter)`
  border: 1px solid #ccc;
  margin-bottom: 8px;
  padding: 8px 4px;
  display: block;
  width: 100%;
  &[disabled] {
    opacity: 0.3;
  }
`;

export const Error = styled.span`
  color: red;
  font-size: 14px;
`;
