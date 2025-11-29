import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Layout from '../../components/Layout';
import MySwal from '../../config/MySwal';
import * as mfaService from "./../../services/MFAService";
import { useAuth } from '../../contexts/AuthContext';

const TwoFactorVerify = () => {
  const [method, setMethod] = useState<'AUTHENTICATOR_APP' | 'EMAIL'>('AUTHENTICATOR_APP');
  const [email, setEmail] = useState<string>('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  useEffect(() => {
    // Get method from location state if available
    const stateMethod = location.state?.method;
    const emailR = location.state?.email;
    console.log("requested email : " + emailR);
    
    if (stateMethod) {
      setMethod(stateMethod);
    }

    if (emailR) {
      setEmail(emailR);
    }

    // If email OTP, start countdown
    if (method === 'EMAIL') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [location.state, method]);

  const verificationSchema = Yup.object().shape({
    code: Yup.string()
      .matches(/^\d{6}$/, 'Code must be 6 digits')
      .required('Verification code is required'),
  });

  const handleVerification = async (values: any, actions: any) => {
    try {
      // TODO: Call API to verify the code and complete login
      console.log('Verifying code:', values.code);
      console.log('Method:', method);

      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000));
      const resp = await mfaService.verifyMFA(method, email, values.code);

      if(resp.message){
        localStorage.setItem("user", JSON.stringify(resp.user));
        localStorage.setItem("accessToken", resp.token);
        setUser(resp.user);

        MySwal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Login successful.',
        }).then(() => {
          navigate('/dashboard');
        });
      }
      else {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: resp.error,
        });
      }
      
      actions.setSubmitting(false);
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid verification code. Please try again.',
      });
      actions.setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    try {
      // TODO: Call API to resend OTP
      setCanResend(false);
      setCountdown(60);

      MySwal.fire({
        icon: 'success',
        title: 'Code Resent',
        text: 'A new verification code has been sent to your email.',
        timer: 2000,
      });

      // Restart countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to resend code. Please try again.',
      });
    }
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

              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                Two-Factor Authentication
              </h2>
              <p className="text-center text-gray-600 mb-8">
                {method === 'AUTHENTICATOR_APP'
                  ? 'Enter the 6-digit code from your authenticator app'
                  : 'Enter the code sent to your email address'}
              </p>

              <Formik
                initialValues={{ code: '' }}
                validationSchema={verificationSchema}
                onSubmit={handleVerification}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <div className="mb-6">
                      <label
                        htmlFor="code"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Verification Code
                      </label>
                      <Field
                        type="text"
                        name="code"
                        id="code"
                        maxLength={6}
                        className={`input-field text-center text-2xl tracking-widest ${
                          errors.code && touched.code ? 'border-red-500' : ''
                        }`}
                        placeholder="000000"
                        autoFocus
                      />
                      <ErrorMessage
                        name="code"
                        component="div"
                        className="text-red-500 mt-1 text-sm"
                      />
                    </div>

                    {method === 'EMAIL' && (
                      <div className="mb-6 text-center">
                        {canResend ? (
                          <button
                            type="button"
                            onClick={handleResendCode}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Resend Code
                          </button>
                        ) : (
                          <p className="text-sm text-gray-600">
                            Resend code in {countdown}s
                          </p>
                        )}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary mb-4"
                    >
                      {isSubmitting ? 'Verifying...' : 'Verify'}
                    </button>

                    <Link
                      to="/login"
                      className="flex items-center justify-center text-gray-600 hover:text-gray-800 text-sm"
                    >
                      <ArrowLeft size={16} className="mr-1" />
                      Back to Login
                    </Link>
                  </Form>
                )}
              </Formik>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  Having trouble?{' '}
                  <Link to="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                    Contact Support
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

export default TwoFactorVerify;
