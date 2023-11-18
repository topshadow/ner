'use client'
import type {
  RbacUser,
  WmsProduct,
  WmsStock,
  WmsStockDetail,
} from "@prisma/client";

export enum StockTypes {
  //  原始重量
  OriginWeight = "OriginWeight",
  // 去车重
  OutCarWeight = "OutCarWeight",
  // 去盆重
  OutContainerWeight = "OutContainerWeight",
  // 去小果重
  OutFixedWeight = "OutFixedWeight",
  // 净重
  LastWeight = "LastWeight",
}

export function StockTypesToLabel(type: StockTypes) {
  switch (type) {
    case StockTypes.OriginWeight:
      return "原始重量";
    case StockTypes.OutCarWeight:
      return "去车重";
    case StockTypes.OutContainerWeight:
      return "去盆重";
    case StockTypes.OutFixedWeight:
      return "去小果重量";
    case StockTypes.LastWeight:
      return "净重";
  }
}
/** 获取token */
export function getToken() {
  return localStorage.getItem("token") || "";
}
/**是否登录 */
export function checkLogin(){
 return  !!getToken();
}

export type WmsStockUser = WmsStock & {
  ownerUser: RbacUser;
  createUser: RbacUser;
  product: WmsProduct;
  details: WmsStockDetail[];
};
