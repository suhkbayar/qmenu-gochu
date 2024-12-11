import { gql } from '@apollo/client';
import { MENU_FIELDS } from './menu';
import { SECTION_FIELDS } from './section';

export const CHANNEL_TABLE_FIELDS = gql`
  fragment ChannelTableFields on ChannelTable {
    id
    code
    name
    active
  }
`;

export const CHANNEL_FIELDS = gql`
  fragment ChannelFields on Channel {
    id
    name
    type
    menuId
    services
    createdAt
    updatedAt
    orderable
    waiter
    vatable
    showActiveProducts
    deliveryRangeSize
    deliveryRangeState
    clientSecret
    clientId
    payments {
      id
      name
    }
    advancePayment
    active
    option {
      limit
      hasPenalty
      penaltyType
      penaltyAmount
      penaltyToken
      penaltyBarcode
      penaltyName
      orderKeeping
    }
    cycle {
      races
      orderClosing
      orderPreparation
      deliveryPreparation
      deliveryDuration
      deliveryDistribution
      deliveryReturn
      startAt
    }
    limits {
      id
      name
    }
  }
`;

export const CHANNEL_SECTION_FIELDS = gql`
  fragment ChannelSectionFields on ChannelSection {
    id
    # active
    name
    menu {
      ...MenuFields
    }
    section {
      ...SectionFields
    }
    tables {
      ...ChannelTableFields
    }
  }
  ${MENU_FIELDS}
  ${SECTION_FIELDS}
  ${CHANNEL_TABLE_FIELDS}
`;
