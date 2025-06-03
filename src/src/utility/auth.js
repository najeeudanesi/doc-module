

export const logout = async () => {
  const link = localStorage.getItem('homeLink')
  sessionStorage.removeItem('token');
  localStorage.removeItem('USER_INFO');
  
  
  // window.location.assign(link || 'https://emr.heartlandcardiovascular.com.ng/home');
  window.location.assign(link || `/`);
  
  // window.location.assign(link || 'https://emr-test.greenzonetechnologies.com.ng/home');
  // window.location.assign(link || 'https://emr-test.greenzonetechnologies.com.ng/home');
  localStorage.removeItem('homeLink');

};
