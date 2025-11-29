import MySwal from "../config/MySwal";

export const fetchAccessList = async () => {

    const jwtToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/patient/access-list`,
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

export const grantAccessBackend = async (userId: string, userIdToGrant: string, expire: string) => {

    const jwtToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/patient/access-list/${userId}/add`,
            {
                method: 'POST',
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }),
                body: JSON.stringify({
                    expire: expire,
                    userId: userIdToGrant
                })
            }
        ); 
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        MySwal.fire({
            title:"Success!",
            text: userData.message,
            icon:"success"
        })
        return userData;
    } catch (err:any) {
        return { error: err.message };
    }
}

export const removeAccessBackend = async (userId: string) => {
    try {

        const jwtToken = localStorage.getItem("accessToken");
        const currentUser = JSON.parse(`${localStorage.getItem("user")}`)

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/patient/access-list/${currentUser.id}/remove`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${jwtToken}`
                },
                body: JSON.stringify({ userId })
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
}
