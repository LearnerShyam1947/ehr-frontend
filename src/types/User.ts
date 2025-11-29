export interface User {
  id: number;
  name: string;
  email: string;
  expire: string;
  message: string;
  address: string;
  username: string;
  resumeUrl: string;
  profileUrl: string;
  experience: string;
  mfaEnabled: boolean;
  phoneNumber: string;
  walletAddress: string;
  specialization: string;
  mfaType: 'AUTHENTICATOR_APP' | 'EMAIL' | null;
  role: "PATIENT" | "DOCTOR" | "ADMIN" | "LAB_TECHNICIAN";
}
