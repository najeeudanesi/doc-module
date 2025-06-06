
const paths = {
  login: 'login-path'
};


async function fetchBackend(endpoint, method, auth, body, params) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
  const fetchObject = { method, headers };
  const path = paths[endpoint] || endpoint;
  let url = `${process.env.REACT_APP_BACKEND_URL}${path}`;
  // let url = `https://api.greenzonetechnologies.com.ng/medicals/api${path}`;
  
 


  if (body) {
    fetchObject.body = JSON.stringify(body);
  }

  if (params) {
    const paramsArray = Object.keys(params).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);

    url += `?${paramsArray.join('&')}`;
  }

  if (auth) {
    const token = sessionStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }



  return fetch(url, fetchObject)
    .then(checkHttpStatus)
    .then(parseJSON);
}

export const get = (endpoint, params, auth = true) => fetchBackend(endpoint, 'GET', auth, null, params);

export const post = (endpoint, body, auth = true) => fetchBackend(endpoint, 'POST', auth, body);

export const put = (endpoint, body, auth = true) => fetchBackend(endpoint, 'PUT', auth, body);

export const del = (endpoint, body, auth = true) => fetchBackend(endpoint, 'DELETE', auth, body);

function checkHttpStatus(response) {
  if (response && response.ok) {
    return response;
  }

  const errorText = response && response.statusText ? response.statusText : 'Unknown Error';
  const error = new Error(errorText);
  error.response = response;
  // toast.error(errorText)
  // throw error;

}

function parseJSON(response) {
  return response.json();
}
