import {
    createContext,
    useState,
    useEffect
} from "react";


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        () => sessionStorage.getItem("token")
    );

    const [student, setStudent] = useState(null);

    const [loading, setLoading] = useState(true);


    // Fetch authenticated user's profile
    useEffect(() => {

        const fetchProfile = async () => {

            if (!token) {

                setStudent(null);

                setLoading(false);

                return;

            }

            try {

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/auth/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message || "Authentication failed"
                    );

                }

                setStudent(data.student);

            } catch (error) {

                console.error("Authentication Error:", error);

                sessionStorage.removeItem("token");

                setToken(null);

                setStudent(null);

            } finally {

                setLoading(false);

            }

        };

        fetchProfile();

    }, [token]);


    // Login function
    const login = async (email, password) => {

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Login failed"
            );

        }

        // Save authentication token
        sessionStorage.setItem("token", data.token);

        setToken(data.token);

        // Save authenticated user information
        setStudent(data.student);

        return data;

    };


    // Logout function
    const logout = () => {

        sessionStorage.removeItem("token");

        setToken(null);

        setStudent(null);

    };


    return (

        <AuthContext.Provider
            value={{
                token,
                student,
                role: student?.role,
                loading,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};
