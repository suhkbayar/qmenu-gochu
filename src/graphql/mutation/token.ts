import { gql } from '@apollo/client';

export const CURRENT_TOKEN = gql`
  mutation getToken($code: String, $type: ChannelType!) {
    getToken(code: $code, type: $type) {
      token
      id
    }
  }
`;

export const GET_COPARTNER_TOKEN = gql`
  mutation getCoPartnerToken($id: ID!) {
    getCoPartnerToken(id: $id) {
      token
      id
    }
  }
`;
