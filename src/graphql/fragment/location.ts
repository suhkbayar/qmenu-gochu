import { gql } from '@apollo/client';

export const LOCATION_FIELDS = gql`
  fragment LocationFields on Location {
    type
    photo
    nameEn
    name
    lon
    lat
    keywords
    id
    floor
    description
    code
    address
  }
`;
