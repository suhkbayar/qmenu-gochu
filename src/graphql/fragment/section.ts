import { gql } from '@apollo/client';

export const SECTION_FIELDS = gql`
  fragment SectionFields on Section {
    id
    name
    createdAt
    updatedAt
  }
`;
