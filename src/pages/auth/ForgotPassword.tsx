import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import MySwal from '../../config/MySwal';
import * as Yup from 'yup';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const ForgotPassword = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const navigate = useNavigate();

  const initialValues = {
    email: '',
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // TODO: Connect to your forgot password API endpoint
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}api/v1/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: values.email }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setEmailSent(true);
        setSentEmail(values.email);
        MySwal.fire({
          icon: 'success',
          title: 'Email Sent!',
          text: 'Check your email for password reset instructions.',
        });
      } else {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: result.error || 'Failed to send reset email. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleResendEmail = () => {
    setEmailSent(false);
  };

  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-8">
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-2">
                  <Activity size={32} className="text-blue-600" />
                  <span className="text-2xl font-bold text-gray-800">SecureEHR</span>
                </div>
              </div>

              {!emailSent ? (
                <>
                  <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Forgot Your Password?
                  </h2>
                  <p className="text-center text-gray-600 mb-8">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>

                  <Formik
                    initialValues={initialValues}
                    validationSchema={ForgotPasswordSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting, errors, touched }) => (
                      <Form>
                        <div className="mb-6">
                          <label
                            htmlFor="email"
                            className="block text-gray-700 font-medium mb-2"
                          >
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                            <Field
                              type="email"
                              name="email"
                              id="email"
                              className={`input-field pl-10 ${
                                errors.email && touched.email ? 'border-red-500' : ''
                              }`}
                              placeholder="your@email.com"
                            />
                          </div>
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 mt-1 text-sm"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full btn-primary flex justify-center items-center"
                        >
                          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                        </button>
                      </Form>
                    )}
                  </Formik>

                  <div className="mt-6">
                    <button
                      onClick={handleBackToLogin}
                      className="w-full flex items-center justify-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <ArrowLeft size={18} className="mr-2" />
                      Back to Login
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                      <Mail size={32} className="text-green-600" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Check Your Email
                  </h2>
                  <p className="text-center text-gray-600 mb-6">
                    We've sent a password reset link to <span className="font-semibold">{sentEmail}</span>
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      The reset link will expire in 1 hour. If you don't see the email, check your spam folder.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleBackToLogin}
                      className="w-full btn-primary"
                    >
                      Back to Login
                    </button>
                    <button
                      onClick={handleResendEmail}
                      className="w-full btn-outline"
                    >
                      Didn't receive the email?
                    </button>
                  </div>
                </>
              )}

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>
                  Remember your password?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
