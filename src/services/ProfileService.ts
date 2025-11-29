import { getPatientReports } from "./../services/PatientReportService";

export const getDetailsWithAccess = async (userId: any) => {
    try {
        const currentUser = JSON.parse(`${localStorage.getItem("user")}`);
        if(currentUser.id == userId) {
            const reports = await getPatientReports();
            return {
                user: currentUser,
                access: true,
                records: reports
            }
        }

        const user = await getUserDetails(userId);

        if(user.role != "PATIENT") {
            return {
                user,
                access: true,
                records: []
            }
        }
    
        const hasAccessResp = await hasAccess(userId);
        const access = hasAccessResp.accessStatus;
        const records = hasAccessResp.records;
    
        return {
            user,
            access,
            records
        }

    } catch (error: any) {
        return { error: error.message };
    }
}

export const getUserDetails = async (userId: any) => {

    const jwtToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/user/${userId}`,
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
        console.log("getUserDetails", resp);
        
        return resp;
    } catch (err:any) {
        return { error: err.message };
    }
}

export const hasAccess = async (userId: any) => {

    const jwtToken = localStorage.getItem("accessToken");
    const user = JSON.parse(`${localStorage.getItem("user")}`);

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/patient/access-list/${userId}/has-access`,
            {
                method: 'POST',
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                }),
                body: JSON.stringify({
                    userId: user.id
                })
            }
        ); 
        const resp = await response.json();
        if (!response.ok) {
            throw new Error(resp.error);
        }
        console.log("hasAccess", resp);
        
        return resp;
    } catch (err:any) {
        return { error: err.message };
    }
}