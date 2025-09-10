import { gql } from '@apollo/client';

export const GET_LOYALTIES = gql`
  query GetLoyalties {
    getLoyalties {
      id
      name
      description
      type
      status
      configs {
        id
        name
        value
        type
      }
    }
  }
`;

export const GET_LOYALTY_RECORDS = gql`
  query GetLoyaltyRecords {
    getLoyaltyRecords {
      id
      loyalty {
        id
        name
        description
        type
      }
      amount
      progress
      state
      createdAt
    }
  }
`;
