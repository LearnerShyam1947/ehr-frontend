import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import MySwal from '../../config/MySwal';
import { changePasswordSchema, initialValues } from '../../schema/ChangePasswordSchema';
import { changePassword } from "./../../services/AuthService";
import { useAuth } from '../../contexts/AuthContext';
import TwoFactorSettings from './TwoFactorSettings';

const Settings = () => {
    const { user } = useAuth();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleChangePassword = async (values: any, { resetForm, setSubmitting }: any) => {
        try {
            setIsChangingPassword(true);

            await changePassword(values);

            resetForm();
            
        } catch (error) {
            console.error('Error changing password:', error);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred. Please try again later.',
            });
        } finally {
            setSubmitting(false);
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                value={user?.username}
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="input-field"
                                value={user?.email}
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                className="input-field"
                                value={user?.phoneNumber}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Role
                            </label>
                            <input
                                type="text"
                                className="input-field"
                                value={user?.role}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button className="btn-primary">Save Changes</button>
                    </div>
                </div>

                <div className="p-6 border-b">
                    <div className="flex items-center mb-6">
                        <Lock className="text-red-600 mr-2" size={24} />
                        <h3 className="text-lg font-semibold">Change Password</h3>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm">
                        Update your password to keep your account secure.
                    </p>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={changePasswordSchema}
                        onSubmit={handleChangePassword}
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                <div className="grid grid-cols-1 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password *
                                        </label>
                                        <div className="relative">
                                            <Field
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                name="currentPassword"
                                                className={`input-field pr-10 ${
                                                    errors.currentPassword && touched.currentPassword
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                            >
                                                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        <ErrorMessage
                                            name="currentPassword"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password *
                                        </label>
                                        <div className="relative">
                                            <Field
                                                type={showNewPassword ? 'text' : 'password'}
                                                name="newPassword"
                                                className={`input-field pr-10 ${
                                                    errors.newPassword && touched.newPassword
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                            >
                                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        <ErrorMessage
                                            name="newPassword"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Password must contain uppercase, lowercase, and number
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password *
                                        </label>
                                        <div className="relative">
                                            <Field
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                className={`input-field pr-10 ${
                                                    errors.confirmPassword && touched.confirmPassword
                                                        ? 'border-red-500'
                                                        : ''
                                                }`}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                            >
                                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        <ErrorMessage
                                            name="confirmPassword"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || isChangingPassword}
                                    className="btn-primary"
                                >
                                    {isSubmitting ? 'Updating Password...' : 'Update Password'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>

                <div className="p-6 border-b">
                    <TwoFactorSettings />
                </div>

            </div>
        </div>
    )
};

export default Settings;