export function reverseString(str) {
  return str.split("-").reverse().join("-");
}

export function shortName(str) {
  if (str.length > 10) {
    return str.substring(0, 10) + "...";
  }
  return str;
}

export function shortNameCustom(number, str) {
  if (str.length > number) {
    return str.substring(0, number) + "...";
  }
  return str;
}

export const DEFAULT_IMAGE =
  "https://alchimia.s3.us-east-2.amazonaws.com/utils/default_background.png";

export function funcionDeFechas(date1, date2) {
  let dt1 = new Date(date1);
  let dt2 = new Date(date2);
  return Math.floor(
    (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
      Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
      (1000 * 60 * 60 * 24)
  );
}

export async function aboutTime(fecha) {
  let fechaHoy = new Date();
  let fechaParamFormato = new Date(fecha);
  let fechaParam = fechaParamFormato.toISOString().slice(0, 10);
  let fechaHoyFormato = fechaHoy.toISOString().slice(0, 10);
  let numeroDeDias = await funcionDeFechas(fechaParam, fechaHoyFormato);
  if (numeroDeDias === 0 || numeroDeDias < 0) {
    return "hoy ... ";
  } else if (numeroDeDias === 1) {
    return "hace 1 dia ... ";
  } else if (numeroDeDias === 2) {
    return "hace 2 dias ... ";
  } else if (numeroDeDias === 3) {
    return "hace 3 dias ... ";
  } else if (numeroDeDias === 4) {
    return "hace 4 dias ... ";
  } else if (numeroDeDias >= 5 && numeroDeDias <= 10) {
    return "+ de 5 dias ... ";
  } else if (numeroDeDias >= 11 && numeroDeDias <= 20) {
    return "+ de 10 dias ... ";
  } else if (numeroDeDias >= 30) {
    return "+ de 1 mes ... ";
  }
  return "";
}
