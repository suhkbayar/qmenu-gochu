import { gql } from '@apollo/client';

export const PAYMENT_FIELDS = gql`
  fragment PaymentFields on Payment {
    id
    name
    type
    fee
    merchantCode
    invoiceCode
    account
    active
    owner
    bank
  }
`;
