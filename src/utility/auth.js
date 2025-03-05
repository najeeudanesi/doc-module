

export const logout = async () => {
  const link = localStorage.getItem('homeLink')
  sessionStorage.removeItem('token');
  localStorage.removeItem('USER_INFO');
  localStorage.removeItem('homeLink');


  // window.location.assign(link || 'https://emr.heartlandcardiovascular.com.ng/home');
  // window.location.assign(link || 'https://emr.heartlandcardiovascular.com.ng/home');

  window.location.assign(link || 'hhttps://emr-test.greenzonetechnologies.com.ng/home');
  // window.location.assign(link || 'https://emr-test.greenzonetechnologies.com.ng/home');

};
