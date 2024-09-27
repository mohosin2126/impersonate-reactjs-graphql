import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useImpersonate from "@//hooks/use-impersonate/index.jsx";
import Cookies from "js-cookie";
import { UserContext } from "@//context-api/index.jsx";

export default function PublisherAll() {
    const [impersonateId, setImpersonateId] = useState();
    const { impersonatedUser = null, loading = false, error = null } = useImpersonate(impersonateId);
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const userRole = impersonatedUser?.user?.role?.slug;

    const impersonateHandle = (id) => {
        console.log(user);
        setImpersonateId(id);
    };

    useEffect(() => {
        if (impersonatedUser && impersonatedUser.token) {
            const adminToken = Cookies.get("authToken");
            Cookies.set("impersonateToken", adminToken);
            Cookies.set("impersonateUser", JSON.stringify(user));
            Cookies.set("authToken", impersonatedUser.token);
            setUser(impersonatedUser?.user);

            if (userRole === "publisher") {
                navigate("/publisher");
            }
        }
    }, [impersonatedUser, userRole, navigate, setUser]);

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => impersonateHandle(user.id)}>
                        Login as
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
