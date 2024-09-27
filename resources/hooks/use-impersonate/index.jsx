import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { AUTH_IMPERSONATE } from "@//graphql/auth/index.js";

export default function useImpersonate(impersonateId) {
    const [impersonate, { loading, error }] = useMutation(AUTH_IMPERSONATE);
    const [impersonatedUser, setImpersonatedUser] = useState(null);

    const impersonateUser = async (id) => {
        if (!id) return;
        try {
            const response = await impersonate({ variables: { id } });
            const userData = response?.data?.impersonate;
            setImpersonatedUser(userData);
            return userData;
        } catch (err) {
            console.error("Impersonation error:", err);
            throw err;
        }
    };

    useEffect(() => {
        if (impersonateId) {
            impersonateUser(impersonateId);
        }
    }, [impersonateId]);

    return { impersonatedUser, loading, error };
}
