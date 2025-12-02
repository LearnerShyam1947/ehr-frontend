import * as Yup from 'yup';

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    )
    .required('New password is required')
    .notOneOf(
      [Yup.ref('currentPassword')],
      'New password must be different from current password'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const initialValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};
