import MySwal from "../config/MySwal";

export const applyAppointment = async (data: any) => {

    try { 
        
        const jwtToken = localStorage.getItem("accessToken");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/appointment`,
            {
                method: "POST",
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }),
                body: JSON.stringify(data)
            }
        );

        const result =await response.json();

        if (result.statusCode >= 400) {
            MySwal.fire({
                icon: "error",
                title: "Error",
                text: result.error
            })
                
        }

        return  result;
        
    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const getPatientAppointments = async (id: number) => {
    try {

        const jwtToken = localStorage.getItem("accessToken");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/patient/appointment/${id}`,
            {
                method: "GET",
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                })
            }
        );

        const result =await response.json();

        if (result.statusCode >= 400) {
            MySwal.fire({
                icon: "error",
                title: "Error",
                text: result.error
            })
                
        }

        return  result;
    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const getDoctorAppointments = async (id: number) => {
    try {
        const jwtToken = localStorage.getItem("accessToken");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/doctor/appointment/${id}`,
            {
                method: 'GET',
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                })
            }
        );
        
        const result =await response.json();

        if (result.statusCode >= 400) {
            MySwal.fire({
                icon: "error",
                title: "Error",
                text: result.error
            })
                
        }

        return  result;

    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const cancelAppointment = async (id: number) => {

    const jwtToken = localStorage.getItem("accessToken");
    
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/patient/appointment/${id}/cancel`,
            {
                method: "GET",
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                })
            }
        );
        
        const result =await response.json();

        if (result.statusCode >= 400) {
            MySwal.fire({
                icon: "error",
                title: "Error",
                text: result.error
            })
                
        }

        return  result;

    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const acceptAppointment = async (id: number) => {
    try {
        const jwtToken = localStorage.getItem("accessToken");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/doctor/appointment/${id}/accept`,
            {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }
            }
        );
        
        const result =await response.json();

        if (result.statusCode >= 400) {
            MySwal.fire({
                icon: "error",
                title: "Error",
                text: result.error
            })   
        }

        else {
            MySwal.fire({
                icon: "success",
                title: "Success..!",
                text: result.message
            })
        }

        return  result;
    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}

export const rejectAppointment = async (id: number, reason: string) => {
    try {
        const jwtToken = localStorage.getItem("accessToken");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/doctor/appointment/${id}/reject?reason=${reason}`,
            {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }
            }
        );
        const result =await response.json();

        if (result.statusCode >= 400) {
            MySwal.fire({
                icon: "error",
                title: "Error",
                text: result.error
            })
                
        }

        return  result;
        
    } catch (error) {
        console.log(`error while make api call : ${error}`);
        return null;
    }
}



