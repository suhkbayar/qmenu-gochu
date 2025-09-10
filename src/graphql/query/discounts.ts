import { gql } from '@apollo/client';

export const GET_DISCOUNTS = gql`
  query GetDiscounts($input: EsQueryInput!) {
    getEsDiscounts(input: $input) {
      discounts {
        id
        name
        image
        value
        type
        startAt
        endAt
        startDate
        endDate
        channel {
          id
          name
          type
        }
        branch {
          id
          name
          logo
          latitude
          longitude
        }
        distance
        buyProduct {
          id
          name
          image
          variants {
            id
            name
            price
          }
        }
        getProduct {
          id
          name
          image
          variants {
            id
            name
            price
          }
        }
      }
      discountTotal
      afterKey
    }
  }
`;
