import { gql } from '@apollo/client';

export const GET_FAVOURITES = gql`
  query GetFavourites($input: EsQueryInput!) {
    getFavourites(input: $input) {
      channels {
        id
        name
        logo
        description
        address
        latitude
        longitude
        distance
        totalReviews
        star
      }
      products {
        id
        name
        description
        image
        price
        branch {
          id
          name
          logo
          address
          latitude
          longitude
          distance
          totalReviews
          star
        }
      }
      channelTotal
      productTotal
      afterKey
    }
  }
`;

export const GET_FAVOURITE_IDS = gql`
  query GetFavouriteIds($type: String!) {
    getFavouriteIds(type: $type)
  }
`;
