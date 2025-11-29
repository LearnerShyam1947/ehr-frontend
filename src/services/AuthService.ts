
export const login = async (data: any) => {

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();
        console.log(result);
        
        return result;
        
    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const register = async (data: any) => {
    data = {...data, username: `${data.firstName} ${data.lastName}`}
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();
        console.log(result);
        
        return result; 
        
    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const fetchDoctors = async () => {
    const jwtToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/doctor`,
            {
                method: "GET",
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                })
            }
        );

        return await response.json();
        
    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const setPassword = async (data: any) => {

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/auth/set-password`,
            {   
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        ); 

        return await response.json();
        
    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
    
}

