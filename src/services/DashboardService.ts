export const adminDetails = async () => {
    try {
        const jwtToken = localStorage.getItem("accessToken");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/dashboard/admin`,
            {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }
            }
        );
        
        const result =await response.json();
        console.log("adminDetails", result);
        
        return  result;

    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const labDetails = async () => {
    try {
        const jwtToken = localStorage.getItem("accessToken");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/dashboard/lab`,
            {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }
            }
        );
        
        const result =await response.json();
        console.log("labDetails", result);
        
        return  result;

    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const doctorDetails = async () => {
    try {
        const jwtToken = localStorage.getItem("accessToken");
        const currentUser = JSON.parse(`${localStorage.getItem("user")}`);

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/dashboard/doctor/${currentUser.id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }
            }
        );
        
        const result =await response.json();
        console.log("doctorDetails", result);
        
        return  result;

    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const patientDetails = async () => {
    try {
        const jwtToken = localStorage.getItem("accessToken");
        const currentUser = JSON.parse(`${localStorage.getItem("user")}`);

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/dashboard/patient/${currentUser.id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }
            }
        );
        
        const result =await response.json();
        console.log("patientDetails", result);
        
        return  result;

    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const dashboardDetails = async () => {
    const currentUser = JSON.parse(`${localStorage.getItem("user")}`);

    if (currentUser.role === "ADMIN") {
        return await adminDetails();
    }
    if (currentUser.role === "DOCTOR") {
        return await doctorDetails();
    }
    if (currentUser.role === "PATIENT") {
        return await patientDetails();
    }
    if (currentUser.role === "LAB_TECHNICIAN") {
        return await labDetails();
    }

    return null;
}

