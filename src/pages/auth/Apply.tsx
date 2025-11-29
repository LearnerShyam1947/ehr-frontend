import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import { CheckCircle, Send } from 'lucide-react';
import { useEffect } from 'react';
import Layout from '../../components/Layout';
import MySwal from '../../config/MySwal';
import { applicationSchema, initialValues } from '../../schema/ApplicationSchema';
import { registerApplication } from '../../services/ApplicationService';
import { uploadToCloud } from '../../services/Web3UploadService';

const Apply = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const specializations = [
    "Neurology",
    "Orthopedics",
    "Oncology",
    "Pediatrics",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Pulmonology",
    "Nephrology",
    "Rheumatology"
  ];

  const applicationTypes = [
    "DOCTOR",
    "LAB_TECHNICIAN"
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleSubmit = async (values: any, actions: any) => {
    console.log(values);
    const response = await registerApplication(values);
    console.log(response);

    if (response.statusCode >= 400) {
      MySwal.fire({
        icon: 'error',
        title: 'Application submitted failed!',
        text: response.error,
      });
    } else {
      MySwal.fire({
        icon: 'success',
        title: 'Application submitted successfully!',
        text: 'Our team will contact you soon.',
      });

      actions.resetForm();
    }
  };

  async function handleFileUpload(event: any, setFieldValue: any) {
    const url = await uploadToCloud(event.target.files[0]);
    // const url = `https://${import.meta.env.VITE_GATEWAY}/ipfs/${ipfsHash}`;
    await setFieldValue("resumeUrl", url);
  }

  return (
    <Layout>
      <div className="pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Join SecureEHR Network</h2>
              <p className="text-center text-gray-600 mb-8">
                Complete the form below to apply and join our network of healthcare providers using cloud technology.
              </p>

              <Formik
                initialValues={initialValues}
                validationSchema={applicationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched, setFieldValue }) => (
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Type */}
                      <div>
                        <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
                          Application Type <span className="text-red-500">*</span>
                        </label>
                        <Field
                          as="select"
                          name="type"
                          id="type"
                          className={`input-field ${errors.type && touched.type ? 'border-red-500' : ''}`}
                        >
                          <option value="">Select Type</option>
                          {applicationTypes.map((appType) => (
                            <option key={appType} value={appType}>
                              {appType.replace('_', ' ')}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="type" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>

                      {/* Specialization */}
                      <div>
                        <label htmlFor="specialization" className="block text-gray-700 font-medium mb-2">
                          Specialization <span className="text-red-500">*</span>
                        </label>
                        <Field
                          as="select"
                          name="specialization"
                          id="specialization"
                          className={`input-field ${errors.specialization && touched.specialization ? 'border-red-500' : ''}`}
                        >
                          <option value="">Select Specialization</option>
                          {specializations.map((spec) => (
                            <option key={spec} value={spec}>
                              {spec}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="specialization" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Username */}
                      <div>
                        <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                          Username <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="text"
                          name="username"
                          id="username"
                          className={`input-field ${errors.username && touched.username ? 'border-red-500' : ''}`}
                          placeholder="Enter your username"
                        />
                        <ErrorMessage name="username" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className={`input-field ${errors.email && touched.email ? 'border-red-500' : ''}`}
                          placeholder="your.email@example.com"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Phone Number */}
                      <div>
                        <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="tel"
                          name="phoneNumber"
                          id="phoneNumber"
                          className={`input-field ${errors.phoneNumber && touched.phoneNumber ? 'border-red-500' : ''}`}
                          placeholder="(123) 456-7890"
                        />
                        <ErrorMessage name="phoneNumber" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>

                      {/* Experience */}
                      <div>
                        <label htmlFor="experience" className="block text-gray-700 font-medium mb-2">
                          Experience (Years) <span className="text-red-500">*</span>
                        </label>
                        <Field
                          type="number"
                          name="experience"
                          id="experience"
                          className={`input-field ${errors.experience && touched.experience ? 'border-red-500' : ''}`}
                          placeholder="0"
                          min="0"
                        />
                        <ErrorMessage name="experience" component="div" className="text-red-500 mt-1 text-sm" />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mb-6">
                      <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="textarea"
                        name="address"
                        id="address"
                        className={`input-field ${errors.address && touched.address ? 'border-red-500' : ''}`}
                        placeholder="123 Healthcare Street, City, State, ZIP"
                        rows={3}
                      />
                      <ErrorMessage name="address" component="div" className="text-red-500 mt-1 text-sm" />
                    </div>

                    {/* Resume Upload */}
                    <div className="mb-6">
                      <label htmlFor="resume" className="block text-gray-700 font-medium mb-2">
                        Upload Resume <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="file"
                        name="resume"
                        id="resume"
                        className={`input-field ${errors.resumeUrl && touched.resumeUrl ? 'border-red-500' : ''}`}
                        onChange={(event: any) => handleFileUpload(event, setFieldValue)}
                      />
                      <ErrorMessage name="resumeUrl" component="div" className="text-red-500 mt-1 text-sm" />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary inline-flex items-center justify-center"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      <Send className="ml-2" size={20} />
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </motion.div>

          {/* Benefits Section */}
          <section className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <motion.h3
                className="text-2xl font-bold text-center text-gray-800 mb-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                Benefits of Joining the SecureEHR Network
              </motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="flex items-start"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Enhanced Data Security</h4>
                    <p className="text-gray-600">Protect patient data with cloud's immutable and encrypted record-keeping.</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Streamlined Operations</h4>
                    <p className="text-gray-600">Reduce administrative overhead and improve efficiency with automated processes.</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Interoperability</h4>
                    <p className="text-gray-600">Seamlessly share data with other healthcare providers in the network.</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Reduced Costs</h4>
                    <p className="text-gray-600">Lower operational costs through improved efficiency and reduced intermediaries.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Apply;
