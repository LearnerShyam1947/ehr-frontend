import MySwal from '../config/MySwal';

export const registerApplication     = async (data: any) => {

    try { 
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/user-application/apply`,
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

export const getApplications = async () => {

    const jwtToken = localStorage.getItem("accessToken");

    try { 
        
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/user-application`,
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

export const acceptApplication = async (id: number) => {

    const jwtToken = localStorage.getItem("accessToken");

    const result = await MySwal.fire({
        title: 'Are you sure?',
        text: 'You want to accept this application?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
    });

    // Only proceed if the user confirms the action
    if (result.isConfirmed) {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/user-application/accept/${id}`,
            {
                method: "GET",
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                })
            }
        );

        // Check if the response is successful and return it
        if (response.ok) {
            return await response.json();
        } else {
            return { statusCode: response.status, error: "Failed to accept application" };
        }
    }

    return null; // Return null if the action is not confirmed
}

export const rejectApplication = async (id: number) => {

    const jwtToken = localStorage.getItem("accessToken");

    const result = await MySwal.fire({
        title: 'Are you sure?',
        text: 'You want to reject this application?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
    });

    // Only proceed if the user confirms the action
    if (result.isConfirmed) {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/user-application/reject/${id}`,
            {
                method: "GET",
                headers: new Headers({
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${jwtToken}`
                })
            }
        );

        // Check if the response is successful and return it
        if (response.ok) {
            return await response.json();
        } else {
            return { statusCode: response.status, error: "Failed to reject application" };
        }
    }

    return null; // Return null if the action is not confirmed
};
