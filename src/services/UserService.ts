export const fetchUserData = async (id: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/v1/user/${id}`); 
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        return userData;
    } catch (err:any) {
        return { error: err.message };
    }
};

export const fetchAllUsers = async () => {
    const jwtToken = localStorage.getItem("accessToken");

    if(!jwtToken) {
        return { error: "session expired" }
    }

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/user`,
            {
                method: "GET",
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                })
            }
        ); 
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        return userData;
    } catch (err:any) {
        return { error: err.message };
    }
};

