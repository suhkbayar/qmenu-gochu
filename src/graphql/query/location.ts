import { gql } from '@apollo/client';
import { LOCATION_FIELDS } from '../fragment';

export const GET_NEAREST_LOCATIONS = gql`
  query getNearestLocations($lat: Float!, $lon: Float) {
    getNearestLocations(lat: $lat, lon: $lon) {
      ...LocationFields
    }
  }
  ${LOCATION_FIELDS}
`;

export const SEARCH_LOCATIONS = gql`
  query searchLocations($keyword: String, $lat: Float, $lon: Float, $size: Int) {
    searchLocations(keyword: $keyword, lat: $lat, lon: $lon, size: $size) {
      ...LocationFields
    }
  }
  ${LOCATION_FIELDS}
`;
