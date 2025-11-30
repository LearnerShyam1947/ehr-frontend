export const getAllHospitals = async () => {
    try {
        const jwtToken = localStorage.getItem("accessToken");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/hospitals`,
            {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }
            }
        );
        
        const result =await response.json();
        console.log("getAllHospitals", result);
        
        return  result;

    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const createHospitals = async (data: any) => {
    try {
        const jwtToken = localStorage.getItem("accessToken");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/hospitals`,
            {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                },
                body: JSON.stringify(data)
            }
        );
        
        const result = await response.json();
        return  result;

    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const updateHospital = async (id:any, data: any) => {
    try {
        const jwtToken = localStorage.getItem("accessToken");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/hospitals/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                },
                body: JSON.stringify(data)
            }
        );
        
        const result = await response.json();
        console.log("updateHospital ", result);
        
        return  result;

    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const deleteHospitals = async (id:any) => {
    try {
        const jwtToken = localStorage.getItem("accessToken");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/hospitals/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }
            }
        );
        
        const result =await response.json();
        console.log("deleteHospitals", result);
        
        return  result;

    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

