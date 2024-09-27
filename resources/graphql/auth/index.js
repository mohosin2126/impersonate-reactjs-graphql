import { gql } from '@apollo/client';

export const AUTH_IMPERSONATE = gql`
    mutation AuthImpersonate($id: ID!) {
        impersonate(id: $id) {
            token
            user {
                id
                first_name
                last_name
                email
                street_address
                city
                state
                country
                zip
                phone
                role {
                    slug
                }
            }
        }
    }
`;
