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


export type WmsStockUser = WmsStock & {
  ownerUser: RbacUser;
  createUser: RbacUser;
  product: WmsProduct;
  details: WmsStockDetail[];
};

export const StockTypesOptions: { label: string, value: StockTypes }[] = [
  { label: StockTypesToLabel(StockTypes.OriginWeight), value: StockTypes.OriginWeight },
  { label: StockTypesToLabel(StockTypes.OutCarWeight), value: StockTypes.OutCarWeight },
  { label: StockTypesToLabel(StockTypes.OutContainerWeight), value: StockTypes.OutContainerWeight },
  { label: StockTypesToLabel(StockTypes.OutFixedWeight), value: StockTypes.OutFixedWeight },
  { label: StockTypesToLabel(StockTypes.LastWeight), value: StockTypes.LastWeight },
]