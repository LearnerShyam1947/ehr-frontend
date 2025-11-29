
export const getPatientReports = async () => {

    const jwtToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/patient/reports`,
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
        console.log("getPatientReports", resp);
        
        return resp;
    } catch (err:any) {
        return { error: err.message };
    }
}

export const requestReport = async (testName: string) => {

    const jwtToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/patient/reports/request`,
            {
                method: 'POST',
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }),
                body: JSON.stringify({
                    reportName: testName
                })
            }
        ); 
        const resp = await response.json();
        if (!response.ok) {
            throw new Error(resp.error);
        }
        console.log("patientRequestReport" + resp);
        
        return resp;
    } catch (err:any) {
        return { error: err.message };
    }
}
