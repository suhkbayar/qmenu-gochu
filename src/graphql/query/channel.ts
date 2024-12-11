import { gql } from '@apollo/client';
import {
  BRANCH_FIELDS,
  CHANNEL_CONFIG_FIELDS,
  CHANNEL_FIELDS,
  CHANNEL_SECTION_FIELDS,
  CHANNEL_TABLE_FIELDS,
  LOCATION_FIELDS,
  PAYMENT_FIELDS,
  TABLE_FIELDS,
} from '../fragment';

export const GET_COPARTNERS = gql`
  {
    getCoPartners {
      ...ChannelFields
      branch {
        ...BranchFields
      }
      table {
        ...TableFields
      }
      payments {
        ...PaymentFields
      }
      sections {
        ...ChannelSectionFields
        tables {
          ...ChannelTableFields
        }
      }
      locations {
        ...LocationFields
      }
      configs {
        ...ChannelConfigFields
      }
    }
  }
  ${CHANNEL_FIELDS}
  ${BRANCH_FIELDS}
  ${PAYMENT_FIELDS}
  ${TABLE_FIELDS}
  ${CHANNEL_SECTION_FIELDS}
  ${CHANNEL_TABLE_FIELDS}
  ${LOCATION_FIELDS}
  ${CHANNEL_CONFIG_FIELDS}
`;
