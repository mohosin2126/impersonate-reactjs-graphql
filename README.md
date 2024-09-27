## This project provides user impersonation and logout management functionality using React, Apollo Client, and GraphQL. It enables admins to impersonate other users, manage the session, and log out or revert back to the original user.

# Features
 - User Impersonation: Allows admins to impersonate users (e.g., publishers) and temporarily switch to their session.
 - Session Management: Manages user session tokens, storing both the original and impersonated user tokens in cookies.
 - Logout Handling: Supports normal logout flow and reversion to the original user after impersonation.
 - Role-Based Redirection: Redirects users based on their roles after impersonation or logout.


# Table of Contents

 - Technologies Used
 - GraphQL Mutation
 - Custom Hook
 - Components
 - PublisherAll
 - UserNav


# How It Works

 - Running the Project
 - Technologies Used
 - React: Component rendering and state management using useContext.
 - Apollo Client: Manages GraphQL mutations and queries.
 - GraphQL: Defines and executes the impersonate mutation.
 - Cookies: Handles token storage for user sessions.
 - React Router: Redirects users based on their roles.
 - GraphQL Mutation

## The following GraphQL mutation allows admins to impersonate users and retrieve a new token and user data.

```js

mutation AuthImpersonate($id: ID!) {
impersonate(id: $id) {
token
user {
id
first_name
last_name
email
role {
slug
}
}
}
}

```

## Parameters: Takes a user ID ($id) as input.
 - Returns: A new token and user details for the impersonated session.
 - Custom Hook: useImpersonate

## The useImpersonate hook manages impersonation logic by calling the AUTH_IMPERSONATE mutation. It also stores the impersonated user in the component's state.

```js

import { useMutation } from "@apollo/client";
import { AUTH_IMPERSONATE } from "@/graphql/auth";

export default function useImpersonate(impersonateId) {
const [impersonate, { loading, error }] = useMutation(AUTH_IMPERSONATE);
const [impersonatedUser, setImpersonatedUser] = useState(null);

    const impersonateUser = async (id) => {
        try {
            const response = await impersonate({ variables: { id } });
            setImpersonatedUser(response.data.impersonate);
            return response.data.impersonate;
        } catch (err) {
            console.error("Impersonation error:", err);
        }
    };

    useEffect(() => {
        if (impersonateId) impersonateUser(impersonateId);
    }, [impersonateId]);

    return { impersonatedUser, loading, error };
}

```

## Functionality: Runs the impersonation mutation and sets the impersonated user in the state.
 - Input: impersonateId, the ID of the user to impersonate.
 - Output: The impersonated user and token.
 - Components 
 

# PublisherAll Component
This component provides a user interface for admins to impersonate publishers by calling the useImpersonate hook.

```js

import useImpersonate from "@/hooks/use-impersonate";

export default function PublisherAll() {
const [impersonateId, setImpersonateId] = useState();
const { impersonatedUser, loading, error } = useImpersonate(impersonateId);
const navigate = useNavigate();
const { setUser } = useContext(UserContext);

    const impersonateHandle = (id) => {
        setImpersonateId(id);
    };

    useEffect(() => {
        if (impersonatedUser?.token) {
            Cookies.set("authToken", impersonatedUser.token);
            setUser(impersonatedUser.user);
            navigate("/publisher");
        }
    }, [impersonatedUser, setUser, navigate]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">...</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => impersonateHandle(user.id)}>
                    Login as
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

```

## Functionality: Allows the admin to impersonate a user.
 - Impersonation Flow: The impersonateHandle function sets the impersonateId which triggers the impersonation hook.



# UserNav Component
This component handles the logout flow and manages the session, including restoring the original user after impersonation.

```js 
import { useContext } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function UserNav() {
const { user, setUser } = useContext(UserContext);
const navigate = useNavigate();

    const handleLogout = () => {
        const impersonateToken = Cookies.get("impersonateToken");
        const impersonatedUser = Cookies.get("impersonateUser");

        if (impersonateToken && impersonatedUser) {
            Cookies.set("authToken", impersonateToken);
            Cookies.remove("impersonateToken");
            setUser(JSON.parse(impersonatedUser));
            navigate("/admin");
        } else {
            Cookies.remove("authToken");
            Cookies.remove("user");
            setUser(null);
            navigate("/auth/login");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost'>...</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


```

## Functionality: Handles the user logout and impersonation session restoration.
 - Logout Flow: If impersonation is active, it restores the original session; otherwise, it logs the user out.
 - How It Works

# Admin Impersonation:

The admin selects a user to impersonate.
The app sends a GraphQL mutation (AUTH_IMPERSONATE) to get the impersonated user's token and details.
The original session's token is saved in cookies (impersonateToken), and the impersonated session token is stored in authToken.
The app updates the session state and navigates to the impersonated user's dashboard.


# Session Restoration:
When the user logs out, the app checks for an active impersonation session.
If impersonation is active, it restores the original admin session using impersonateToken.
If no impersonation is active, the user is logged out normally.
