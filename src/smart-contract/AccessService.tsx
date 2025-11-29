import { abi } from './Config';
import { ethers } from "ethers";
import { fetchAccessList, removeAccessBackend } from '../services/PatientService';
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export async function requestAccount() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        return address;

    } else {
        alert("Please install MetaMask!");
    }
}

export const removeAccessFromUser = async (userId: string, requestUserWalletAddress: string) => {
    const walletAddress = await requestAccount();

    const response = await removeAccessBackend(userId, requestUserWalletAddress);
    if (response.error) {
        return response;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        await contract.removeAccess(requestUserWalletAddress, walletAddress);

        return response;
    } catch (error) {
        console.error(error);
    }
};

