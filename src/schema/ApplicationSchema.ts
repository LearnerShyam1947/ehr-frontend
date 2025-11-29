import * as Yup from 'yup';

export const applicationSchema = Yup.object().shape({
    type: Yup.string()
        .required('Type is required'),

    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),

    address: Yup.string()
        .required('Address is required'),

    username: Yup.string()
        .required('Username is required'),

    resumeUrl: Yup.string()
        .required('Resume is required'),

    experience: Yup.number()
        .min(0, 'Experience must be greater than 0')
        .required('Experience is required'),

    phoneNumber: Yup.string()
        .required('Phone number is required'),

    specialization: Yup.string()
        .required('Specialization is required'),
});

export const initialValues = {
    type: '',
    email: '',
    address: '',
    username: '',
    resumeUrl: '',
    experience: 0,
    phoneNumber: '',
    specialization: '',
};
