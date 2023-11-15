import jwt from "jsonwebtoken";
export type JwtTokenObject = {
  username: string;
  tenant_id: any;
  role_id: any;
  user_id: any;
  forAuth: {
    create_user_id: any;
    tenant_id: any;
  };
};

export function encodeJwt(tokenObject: JwtTokenObject) {
  return jwt.sign(tokenObject, "postgres");
}

export function decodeJwt(token: string) {
  let data = jwt.decode(token) as JwtTokenObject;
  data.forAuth = { create_user_id: data.user_id, tenant_id: data.tenant_id };
  return data;
}

export function decodeJwtFromRequest(req: Request) {
  let token = req.headers.get("authorization");
  if (token) {
    return decodeJwt(token);
  } else {
    new Error("用户尚未登录");
  }
}
