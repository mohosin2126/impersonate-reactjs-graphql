import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/custom/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useContext } from "react";
import { UserContext } from "@//context-api/index.jsx";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/IMG_4317.jpg";

export default function UserNav() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        const impersonateToken = Cookies.get("impersonateToken");
        const impersonatedUser = Cookies.get("impersonateUser");

        if (impersonateToken && impersonatedUser) {
            const newUser = JSON.parse(impersonatedUser); // Deserialize the impersonated user

            // Restore original token and user
            Cookies.set("authToken", impersonateToken);
            Cookies.remove("impersonateToken");

            // Set user to impersonated one
            setUser(newUser);

            // Handle redirection based on user role
            if (newUser.role.slug === "admin") {
                setUser(newUser);
                navigate("/admin");
            }
        } else {
            // Normal logout flow
            Cookies.remove("authToken");
            Cookies.remove("user");

            setUser(null); // Clear user state
            navigate("/auth/login"); // Redirect to login page
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                    <Avatar className='h-8 w-8'>
                        <AvatarImage src={logo} alt='@shadcn' />
                        <AvatarFallback>SN</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
