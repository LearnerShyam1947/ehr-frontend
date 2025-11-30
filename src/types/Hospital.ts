import * as Yup from 'yup';

export interface Hospital {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: string;
    email: string;
    website: string;
    establishedYear: number;
    totalBeds: number;
    availableBeds: number;
    emergencyServices: boolean;
    ambulanceServices: boolean;
    status: 'ACTIVE' | 'INACTIVE';
}

export const HospitalSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Name must be at least 3 characters')
        .required('Hospital name is required'),
    address: Yup.string()
        .required('Address is required'),
    city: Yup.string()
        .required('City is required'),
    state: Yup.string()
        .required('State is required'),
    zipCode: Yup.string()
        .required('Zip code is required'),
    country: Yup.string()
        .required('Country is required'),
    phoneNumber: Yup.string()
        .matches(/[0-9]{10}/, 'Please enter a valid phone number')
        .required('Phone number is required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    website: Yup.string()
        .url('Invalid URL'),
    establishedYear: Yup.number()
        .min(1800, 'Year must be after 1800')
        .max(new Date().getFullYear(), 'Year cannot be in the future')
        .required('Established year is required'),
    totalBeds: Yup.number()
        .min(1, 'Total beds must be at least 1')
        .required('Total beds is required'),
    availableBeds: Yup.number()
        .min(0, 'Available beds cannot be negative')
        .required('Available beds is required'),
});