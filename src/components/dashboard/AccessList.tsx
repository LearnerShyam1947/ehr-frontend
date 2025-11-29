import { Formik, Form, Field } from 'formik';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { User } from '../../types/User';
import { grantAccessBackend, fetchAccessList as getPatientAccessList, removeAccessBackend } from "../../services/PatientService";
import { useAuth } from '../../contexts/AuthContext';
import MySwal from '../../config/MySwal';

const AccessGrantSchema = Yup.object().shape({
    userIdToGrantAccess: Yup.number()
        .required('user id is required'),
    expiry: Yup.string()
        .oneOf(['1day', '1week', '1month', 'noexpire'], 'Invalid duration')
        .required('Please select how long the access should last'),
});


const AccessList: React.FC = () => {
    const [accessList, setAccessList] = useState<User[]>([]);
    const { user } = useAuth();
    console.log("current user", user?.id);
    
    const fetchAccessList = async () => {
        const list = await getPatientAccessList();
        console.log(list);

        setAccessList(list);
    };

    useEffect(() => {
        fetchAccessList();
    }, []);

    const convertToDate = (isoString: string) => {
        if (isoString) {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${day}|${month}|${year} ${hours}:${minutes}`;
        } else {
            return 'Not Assigned';
        }
    };

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: any) => {
        try {
            const response = await grantAccessBackend(user?.id?.toString() || '0', values.userIdToGrantAccess, values.expiry);
            console.log(response);
            if (response.error) {
                throw new Error(response.error); // TODO : more clear message
            }
            fetchAccessList();
            resetForm();
            setSubmitting(false);
        } catch (error) {
            console.error('Error granting access:', error);
        }
    };

    const handleRevokeAccess = async (userId: any) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await removeAccessBackend(userId);
                console.log(response);
                if (response.ok) {
                    MySwal.fire({
                        title: 'Success',
                        text: 'Access revoked successfully',
                        icon: 'success',
                    });
                    fetchAccessList();
                }
            }
        });
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Access Management</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Access Grant Form */}
                <div className="mb-8 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">Grant Access</h3>
                    <Formik
                        initialValues={{
                            userIdToGrantAccess: '',
                            expiry: '1day', // default value, you can choose
                        }}
                        validationSchema={AccessGrantSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form className="flex flex-col md:flex-row gap-4">
                                <div className="flex-grow">
                                    <Field
                                        name="userIdToGrantAccess"
                                        type="text"
                                        placeholder="Enter wallet address..."
                                        className={`input-field w-full ${errors.userIdToGrantAccess && touched.userIdToGrantAccess ? 'border-red-500' : ''
                                            }`}
                                    />
                                    {errors.userIdToGrantAccess && touched.userIdToGrantAccess && (
                                        <div className="text-red-500 text-sm mt-1">{errors.userIdToGrantAccess}</div>
                                    )}
                                </div>

                                <div className="flex-grow">
                                    <Field
                                        as="select"
                                        name="expiry"
                                        className={`input-field w-full ${errors.expiry && touched.expiry ? 'border-red-500' : ''
                                            }`}
                                    >
                                        <option value="1day">1 Day</option>
                                        <option value="1week">1 Week</option>
                                        <option value="1month">1 Month</option>
                                        <option value="noexpire">No Expire</option>
                                    </Field>
                                    {errors.expiry && touched.expiry && (
                                        <div className="text-red-500 text-sm mt-1">{errors.expiry}</div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary whitespace-nowrap"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Granting...' : 'Grant Access'}
                                </button>
                            </Form>
                        )}
                    </Formik>

                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="input-field w-64 mr-4"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Expire Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Specialization
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {accessList.map((user: User, index: number) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'DOCTOR' ? 'bg-blue-100 text-blue-800' :
                                                user.role === 'LAB_TECHNICIAN' ? 'bg-green-100 text-green-800' :
                                                    user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {convertToDate(user.expire)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.specialization || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onClick={() => handleRevokeAccess(user.id)} className="text-red-600 hover:text-red-900">Revoke Access</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 flex items-center justify-between border-t mt-4">
                    <div className="text-sm text-gray-500">
                        Showing all results
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessList;