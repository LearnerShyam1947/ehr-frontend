import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { Activity, Mail, Shield, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Layout from '../../components/Layout';
import * as mfaService from "./../../services/MFAService";
import MySwal from '../../config/MySwal';
import { useAuth } from '../../contexts/AuthContext';

const TwoFactorSetup = () => {
  const [selectedMethod, setSelectedMethod] = useState<'AUTHENTICATOR_APP' | 'EMAIL' | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const verificationSchema = Yup.object().shape({
    code: Yup.string()
      .matches(/^\d{6}$/, 'Code must be 6 digits')
      .required('Verification code is required'),
  });

  useEffect(() => {
    const emailR = location.state?.email;
    setEmail(emailR);
  }, [])

  const handleMethodSelect = async (method: 'AUTHENTICATOR_APP' | 'EMAIL') => {
    setSelectedMethod(method);

    const response = await mfaService.registerMFA(method, email);

    if (response.message) {

      if (response.mfaType === 'AUTHENTICATOR_APP') {

        setQrCode(response.qrCodeUrl);
        setSecret(response.secret);
      } else if (response.mfaType === 'EMAIL') {
        // TODO: Call API to send email OTP
        MySwal.fire({
          icon: 'info',
          title: 'OTP Sent',
          text: 'A verification code has been sent to your email address.',
        });
      }
    }

    else {
      MySwal.fire({
        icon: 'error',
        title: 'Error...! :{',
        text: response.error,
      });
    }

  };

  const handleVerification = async (values: any, actions: any) => {
    try {
      // TODO: Call API to verify the code and complete login
      console.log('Verifying code:', values.code);
      console.log('Method:', selectedMethod);

      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1000));
      const resp = await mfaService.verifyMFA(selectedMethod, email, values.code);

      if (resp.message) {
        localStorage.setItem("user", JSON.stringify(resp.user));
        localStorage.setItem("accessToken", resp.token);
        setUser(resp.user);

        MySwal.fire({
          icon: 'success',
          title: 'Success!',
          text: resp.message,
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

  return (
    <Layout>
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
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
                Setup Two-Factor Authentication
              </h2>
              <p className="text-center text-gray-600 mb-8">
                Add an extra layer of security to your account
              </p>

              {!selectedMethod ? (
                <div className="space-y-4">
                  <div
                    onClick={() => handleMethodSelect('AUTHENTICATOR_APP')}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Authenticator App
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Use an authenticator app like Google Authenticator or Authy to generate
                          verification codes.
                        </p>
                        <div className="mt-2">
                          <span className="inline-flex items-center text-sm text-blue-600 font-medium">
                            <Shield className="w-4 h-4 mr-1" />
                            Recommended
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleMethodSelect('EMAIL')}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Mail className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Email OTP</h3>
                        <p className="text-gray-600 text-sm">
                          Receive a one-time password via email whenever you sign in.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {selectedMethod === 'AUTHENTICATOR_APP' && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Scan QR Code
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex flex-col items-center">
                          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                          </div>
                          <p className="text-sm text-gray-600 text-center mb-2">
                            Scan this QR code with your authenticator app
                          </p>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Or enter this code manually:</p>
                            <code className="text-sm font-mono text-gray-800">{secret}</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'EMAIL' && (
                    <div className="mb-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex">
                          <Mail className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-blue-800 font-medium">
                              Verification code sent
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                              Please check your email for the 6-digit verification code.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
                            Enter Verification Code
                          </label>
                          <Field
                            type="text"
                            name="code"
                            id="code"
                            maxLength={6}
                            className={`input-field text-center text-2xl tracking-widest ${errors.code && touched.code ? 'border-red-500' : ''
                              }`}
                            placeholder="000000"
                          />
                          <ErrorMessage
                            name="code"
                            component="div"
                            className="text-red-500 mt-1 text-sm"
                          />
                        </div>

                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedMethod(null);
                              setQrCode('');
                              setSecret('');
                            }}
                            className="flex-1 btn-outline"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 btn-primary"
                          >
                            {isSubmitting ? 'Verifying...' : 'Verify & Enable'}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Skip for now
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default TwoFactorSetup;
