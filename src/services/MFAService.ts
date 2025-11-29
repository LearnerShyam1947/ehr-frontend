export const verifyMFA = async (mfaType: string|null, email: string, otp: string) => {

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/auth/mfa/verify`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ mfaType, email, otp })
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


export const registerMFA = async (mfaType: string, email: string) => {

    try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}api/v1/auth/mfa/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ mfaType, email })
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
