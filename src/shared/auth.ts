/** 获取token */
export function getToken() {
    return localStorage.getItem("token") || "";
  }
  /**是否登录 */
  export function checkLogin(){
   return  !!getToken();
  }