// impersonate
const [impersonateId, setImpersonateId] = useState();
const {impersonatedUser = null, loading = false, error = null} = useImpersonate(impersonateId);
const navigate = useNavigate();
const {user, setUser} = useContext(UserContext);
const userRole = impersonatedUser?.user?.role?.slug;

const impersonateHandle = (id) => {
    console.log(user)
    // Cookies.set("impersonateUser", user)
    setImpersonateId(id);
};

useEffect(() => {

    if (impersonatedUser && impersonatedUser.token) {
        const adminToken = Cookies.get("authToken");
        Cookies.set("impersonateToken", adminToken);
        Cookies.set("impersonateUser", JSON.stringify(user))
        Cookies.set("authToken", impersonatedUser.token);
        setUser(impersonatedUser?.user);
        if (userRole === "publisher") {
            navigate("/publisher");
        }

    }
}, [impersonatedUser, userRole, navigate, setUser]);
