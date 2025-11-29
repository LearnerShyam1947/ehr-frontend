import { useState, useEffect } from 'react';
import { Mail, Smartphone, Shield, CheckCircle } from 'lucide-react';
import MySwal from '../../config/MySwal';
import { useAuth } from '../../contexts/AuthContext';

const TwoFactorSettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentMethod, setCurrentMethod] = useState<'AUTHENTICATOR_APP' | 'EMAIL' | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'AUTHENTICATOR_APP' | 'EMAIL' | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // TODO: Fetch user's 2FA status from API
    // Simulating API response
    const fetch2FAStatus = async () => {
      if(user?.mfaEnabled) {
        setCurrentMethod(user.mfaType)
      }
    };

    fetch2FAStatus();
  }, [user]);

  const handleEnable2FA = async (method: 'AUTHENTICATOR_APP' | 'EMAIL') => {
    setSelectedMethod(method);

    if (method === 'AUTHENTICATOR_APP') {
      // TODO: Call API to generate QR code and secret
      setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SecureEHR:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=SecureEHR');
      setSecret('JBSWY3DPEHPK3PXP');
    } else if (method === 'EMAIL') {
      // TODO: Call API to send email OTP
      MySwal.fire({
        icon: 'info',
        title: 'OTP Sent',
        text: 'A verification code has been sent to your email address.',
      });
    }

    setShowSetupModal(true);
  };

  const handleVerifyAndEnable = async () => {
    const { value: code } = await MySwal.fire({
      title: 'Enter Verification Code',
      input: 'text',
      inputLabel: 'Enter the 6-digit code',
      inputPlaceholder: '000000',
      inputAttributes: {
        maxlength: '6',
        autocomplete: 'off'
      },
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter a code!';
        }
        if (!/^\d{6}$/.test(value)) {
          return 'Code must be 6 digits!';
        }
      }
    });

    if (code) {
      try {
        // TODO: Call API to verify and enable 2FA
        console.log('Verifying code:', code);
        console.log('Method:', selectedMethod);

        setTwoFactorEnabled(true);
        setCurrentMethod(selectedMethod);
        setShowSetupModal(false);

        MySwal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Two-factor authentication has been enabled successfully.',
        });
      } catch (error) {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Invalid verification code. Please try again.',
        });
      }
    }
  };

  const handleDisable2FA = async () => {
    const result = await MySwal.fire({
      title: 'Disable Two-Factor Authentication?',
      text: 'This will make your account less secure. Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, disable it',
    });

    if (result.isConfirmed) {
      try {
        // TODO: Call API to disable 2FA
        setTwoFactorEnabled(false);
        setCurrentMethod(null);

        MySwal.fire({
          icon: 'success',
          title: 'Disabled',
          text: 'Two-factor authentication has been disabled.',
        });
      } catch (error) {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to disable 2FA. Please try again.',
        });
      }
    }
  };

  const handleChangeMethod = async (method: 'AUTHENTICATOR_APP' | 'EMAIL') => {
    const result = await MySwal.fire({
      title: 'Change Authentication Method?',
      text: `Switch to ${method === 'AUTHENTICATOR_APP' ? 'Authenticator App' : 'Email OTP'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it',
    });

    if (result.isConfirmed) {
      handleEnable2FA(method);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Enhanced Security</p>
            <p className="text-sm text-blue-700 mt-1">
              Two-factor authentication adds an extra layer of security to your account by requiring
              both your password and a verification code.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium text-gray-800">Status</p>
            <p className="text-sm text-gray-600">
              {twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
            </p>
          </div>
          <div>
            {twoFactorEnabled ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                Enabled
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Disabled
              </span>
            )}
          </div>
        </div>

        {currentMethod && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Current Method:</p>
            <p className="text-sm font-medium text-gray-800">
              {currentMethod === 'AUTHENTICATOR_APP' ? 'Authenticator App' : 'Email OTP'}
            </p>
          </div>
        )}
      </div>

      {!twoFactorEnabled ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Choose your preferred authentication method:</p>

          <div
            onClick={() => handleEnable2FA('AUTHENTICATOR_APP')}
            className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Authenticator App</h4>
                <p className="text-sm text-gray-600">
                  Use Google Authenticator or similar apps
                </p>
              </div>
              <span className="text-xs text-blue-600 font-medium">Recommended</span>
            </div>
          </div>

          <div
            onClick={() => handleEnable2FA('EMAIL')}
            className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">Email OTP</h4>
                <p className="text-sm text-gray-600">
                  Receive codes via email
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={() => handleChangeMethod(currentMethod === 'AUTHENTICATOR_APP' ? 'EMAIL' : 'AUTHENTICATOR_APP')}
            className="w-full btn-outline"
          >
            Change Authentication Method
          </button>
          <button
            onClick={handleDisable2FA}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300"
          >
            Disable Two-Factor Authentication
          </button>
        </div>
      )}

      {showSetupModal && selectedMethod === 'AUTHENTICATOR_APP' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Setup Authenticator App</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Scan this QR code with your authenticator app:
              </p>
              <div className="flex justify-center mb-3">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
              <div className="bg-gray-50 rounded p-3">
                <p className="text-xs text-gray-500 mb-1">Or enter this code manually:</p>
                <code className="text-sm font-mono text-gray-800">{secret}</code>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowSetupModal(false);
                  setSelectedMethod(null);
                }}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyAndEnable}
                className="flex-1 btn-primary"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSettings;
