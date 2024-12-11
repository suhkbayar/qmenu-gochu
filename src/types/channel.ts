import { IBranch } from './branch';
import { BaseEntity } from './base';
import { IChannelSection } from './channel.section';
import { ChannelType } from '../constants/constant';

export interface IChannel extends BaseEntity {
  type: ChannelType;
  services: string[];
  branch: IBranch;
  active: boolean;
  sections: IChannelSection[];
  orderable: boolean;

  deliveryRangeState: boolean;
  deliveryRangeSize: number;
  maxOrderPerDelivery: number;
  review: boolean;
  reviewPush: boolean;
  reviewPushTime: number;
  reviewPushMessage: String;
  option: IChannelOption;
  cycle: IChannelCycle;
  menuId: string;
  // payments: string;
  // orderable: string;
  // waiter: string;
  // advancePayment: string;
  // table: string;
  // deliveryRangeState: string;
  // deliveryRangeSize: string;
  // deliveryCycleDuration: string;
  // orderConfirmation: string;
  // orderPreparation: string;
  // orderKeepingTime: string;
  // maxOrderPerDelivery: string;
  // penaltyAmount: string;
  // reviewPush: string;
  // deliveryTimetable: string;
  // takeawayTimetable: string;
}

export interface IChannelOption {
  limit: number;
  hasPenalty: boolean;
  penaltyType: string;
  penaltyAmount: number;
  penaltyToken: string;
  penaltyBarcode: string;
  penaltyName: string;
  orderKeeping: number;
}

export interface IChannelCycle {
  startAt: string;
  races: number;
  orderClosing: number;
  orderPreparation: number;
  deliveryPreparation: number;
  deliveryDuration: number;
  deliveryDistribution: number;
  deliveryReturn: number;
}
