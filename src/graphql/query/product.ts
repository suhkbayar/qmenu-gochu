import { gql } from '@apollo/client';
import { MENU_OPTION_FIELDS, MENU_PRODUCT_FIELDS, MENU_VARIANT_FIELDS } from '../fragment';

export const GET_CROSS_SELLS = gql`
  query getCrossSells($menuId: ID!, $ids: [ID!]!) {
    getCrossSells(menuId: $menuId, ids: $ids) {
      ...MenuProductFields
      variants {
        ...MenuVariantFields
        options {
          ...MenuOptionFields
        }
      }
    }
  }
  ${MENU_OPTION_FIELDS}
  ${MENU_PRODUCT_FIELDS}
  ${MENU_VARIANT_FIELDS}
`; 