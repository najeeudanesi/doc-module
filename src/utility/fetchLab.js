/* eslint-disable */

import axios from "axios";
// import paths from "./endpoints";
// import Cookies from "universal-cookie";

// import { decodeToken, logout } from "../utility/auth";
console.log(sessionStorage.getItem("token"));

const getToken = () => {
  // console.log(localStorage.getItem("token"));
  // const t = decodeToken("t");
  // const token = t && t.t;
  const token = sessionStorage.getItem('token');

  // localStorage.getItem("token");
  return token;
};

const fetchBackend = async (
  endpoint,
  method,
  auth,
  body,
  pQuery,
  param,
  multipart
) => {
  const headers = {
    // "X-API-KEY": "fq05322d-429b-4f77-8a4p-a97ry62eb37k",
    // "X-API-KEY": process.env.VUE_APP_API_KEY,
    "content-type": "multipart/form-data",
    // "Content-Type":
    // "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Methods": "POST GET OPTIONS",
  };
  console.log(endpoint);
  console.log(body);
  const path =  endpoint;
  let url= `https://edogoverp.com/labapi/api${path}`;
  // let url = `https://api.rampng.com/api/${path}`;
  // let url = `https://api.educatial.com/public/api/${path}`;
  // let url = `https://tryba.io/api/v2/${path}`;
  //  `${process.env.TRYBA_API}/${path}`;
  // let url = `${process.env.TRYBA_API}${path}`;
  // let url = `https://api.greenzonetechnologies.com.ng/medicals/api${path}`;
// 
  if (param) {
    url += `/${param}`;
  }

  if (pQuery) {
    const paramsArray = Object.keys(pQuery).map(
      (key) =>
        pQuery[key] &&
        `${encodeURIComponent(key)}=${encodeURIComponent(pQuery[key])}`
    );

    url += `?${paramsArray.join("&")}`;
  }

  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  const options = {
    url,
    method,
    headers,
  };

  if (body) {
    options.data = body;
  }

  // console.log(options);
  return axios(options).then(
    (res) => res,
    async (err) => {
      if (err && err.response && err.response.status === 401) {
        // log the user out and return
        // console.log("UNAUTHORIZED REQUEST...");
        // await logout("/", true);
      }
      // console.log(err.response);
      return err.response;
    }
  );
};

/**
 *
 * @param {string} endpoint
 * @param {object} pQuery
 * @param {string} param
 * @param {boolean} auth
 */
export const get = ({ endpoint, pQuery, param = null, auth = true }) =>
  fetchBackend(endpoint, "GET", auth, null, pQuery, param);

/**
 *
 * @param {string} endpoint
 * @param {object} body
 * @param {boolean} auth
 * @param {boolean} multipart
 */
export const post = ({ endpoint, body, auth = true, multipart }) =>
  fetchBackend(endpoint, "POST", auth, body, null, null, multipart);

/**
 *
 * @param {string} endpoint
 * @param {object} body
 * @param {string} param
 * @param {string} pQuery
 * @param {boolean} auth
 * @param {boolean} multipart
 */

export const put = ({ endpoint, body, auth = true, multipart }) =>
  fetchBackend(endpoint, "PUT", auth, body, null, null, multipart);

/**
 *
 * @param {string} endpoint
 * @param {object} body
 * @param {string} param
 * @param {string} pQuery
 * @param {boolean} auth
 * @param {boolean} multipart
 */
export const patch = ({
  endpoint,
  body,
  param,
  pQuery,
  auth = true,
  multipart,
}) => fetchBackend(endpoint, "PATCH", auth, body, pQuery, param, multipart);

/**
 *
 * @param {string} endpoint
 * @param {object} body
 * @param {string} param
 * @param {string} pQuery
 * @param {boolean} auth
 * @param {boolean} multipart
 */
export const putPaginated = ({
  endpoint,
  body,
  param,
  pQuery,
  auth = true,
  multipart,
}) => fetchBackend(endpoint, "PATCH", auth, body, pQuery, param, multipart);

/**
 *
 * @param {string} endpoint
 * @param {string} param
 * @param {boolean} auth
 */
export const del = ({ endpoint, param, auth = true }) =>
  fetchBackend(endpoint, "DELETE", auth, null, null, param);
