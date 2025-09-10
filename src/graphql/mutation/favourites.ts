import { gql } from '@apollo/client';

export const EDIT_FAVOURITE = gql`
  mutation EditFavourite($id: String!, $type: String) {
    editFavourite(id: $id, type: $type)
  }
`;
