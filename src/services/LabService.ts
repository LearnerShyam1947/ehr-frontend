import MySwal from "../config/MySwal";

export const getAllReports = async () => {

    const jwtToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/lab-technician/reports`,
            {
                method: 'GET',
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                })
            }
        ); 
        const resp = await response.json();
        if (!response.ok) {
            throw new Error(resp.error);
        }
        console.log("getAllReports", resp);
        
        return resp;
    } catch (err:any) {
        return { error: err.message };
    }
}

export const acceptReport = async (reportId: number) => {
    const jwtToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/lab-technician/reports/${reportId}/accept`,
            {
                method: 'POST',
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                })
            }
        ); 
        const resp = await response.json();
        if (!response.ok) {
            throw new Error(resp.error);
        }
        console.log("acceptReport", resp);

        MySwal.fire({
            title:"Success!",
            text: resp.message,
            icon: "success"
        });
        
        return resp;
    } catch (err:any) {
        MySwal.fire({
            title:"Error!",
            text: err.message,
            icon: "error"
        });
        return { error: err.message };
    }
}

export const uploadReport = async (reportId: number, reportUrl: string) => {
    const jwtToken = localStorage.getItem("accessToken");
    console.log("upload report url ", reportUrl);
    
    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/lab-technician/reports/${reportId}/upload`,
            {
                method: 'POST',
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }),
                body: JSON.stringify({
                    reportUrl
                })
            }
        ); 
        const resp = await response.json();
        if (!response.ok) {
            throw new Error(resp.error);
        }
        console.log("uploadReport", resp);
        MySwal.fire({
            title:"Success!",
            text: resp.message,
            icon: "success"
        });
        return resp;
    } catch (err:any) {
        MySwal.fire({
            title:"Error!",
            text: err.message,
            icon: "error"
        });
        return { error: err.message };
    }
}

