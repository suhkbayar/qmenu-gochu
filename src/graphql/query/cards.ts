import { gql } from '@apollo/client';

export const GET_CARD_ORDERS = gql`
  query GetCardOrders($number: String, $branch: String, $startDate: AWSDate!, $endDate: AWSDate!) {
    getCardOrders(number: $number, branch: $branch, startDate: $startDate, endDate: $endDate) {
      id
      state
      grandTotal
      createdAt
      items {
        id
        name
        quantity
        price
        total
      }
    }
  }
`;

export const CHECK_CARD = gql`
  query CheckCard($card: String!, $branch: String!) {
    checkCard(card: $card, branch: $branch) {
      id
      number
      owner {
        id
        customer {
          id
          firstName
          lastName
          phone
        }
      }
    }
  }
`;
