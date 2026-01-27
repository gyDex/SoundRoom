import { gql } from "graphql-request";

export const ENABLE_2FA = gql`
  mutation EnableTwoFactor {
    enableTwoFactor {
      qrCode
      secret
    }
  }
`;


export const DISABLE_2FA = gql`
  mutation DisableTwoFactor($code: String!) {
    disableTwoFactor(code: $code)
  }
`;