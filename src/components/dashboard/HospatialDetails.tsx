import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Building2, Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import MySwal from '../../config/MySwal';
import * as hospitalService from "./../../services/HospitalService";
import { Hospital, HospitalSchema } from '../../types/Hospital';


const HospitalDetails = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);

    const [showForm, setShowForm] = useState(false);
    const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const initialValues = {
        name: editingHospital?.name || '',
        address: editingHospital?.address || '',
        city: editingHospital?.city || '',
        state: editingHospital?.state || '',
        zipCode: editingHospital?.zipCode || '',
        country: editingHospital?.country || '',
        phoneNumber: editingHospital?.phoneNumber || '',
        email: editingHospital?.email || '',
        website: editingHospital?.website || '',
        establishedYear: editingHospital?.establishedYear || new Date().getFullYear(),
        totalBeds: editingHospital?.totalBeds || 0,
        availableBeds: editingHospital?.availableBeds || 0,
        emergencyServices: editingHospital?.emergencyServices || false,
        ambulanceServices: editingHospital?.ambulanceServices || false,
        status: editingHospital?.status || 'ACTIVE',
    };

    const fetchAndSetHospitals = async () => {
        const resp = await hospitalService.getAllHospitals();
        setHospitals(resp);
    }

    useEffect(() => {
      fetchAndSetHospitals();
    }, [])

    const handleSubmit = async (values: any, { resetForm, setSubmitting }: any) => {
        console.log(values);
        
        try {
            if (editingHospital) {
                const resp = await hospitalService.updateHospital(editingHospital.id, values);
                
                if (!resp.error) {
                    setHospitals(
                        hospitals.map((h) =>
                            h.id === editingHospital.id
                                ? { ...values, id: editingHospital.id }
                                : h
                        )
                    );
                    MySwal.fire({
                        icon: 'success',
                        title: 'Updated!',
                        text: 'Hospital details updated successfully.',
                    });
                }
            } else {
                const resp = await hospitalService.createHospitals(values);

                if(!resp.error) {
                    const newHospital = {
                        ...values,
                        id: hospitals.length + 1,
                    };
                    setHospitals([...hospitals, newHospital]);
                    MySwal.fire({
                        icon: 'success',
                        title: 'Created!',
                        text: 'Hospital created successfully.',
                    });
                }
               
            }
            resetForm();
            setShowForm(false);
            setEditingHospital(null);
            setSubmitting(false);
        } catch (error) {
            console.error('Error saving hospital:', error);
            MySwal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save hospital details.',
            });
        }
    };

    const handleEdit = (hospital: Hospital) => {
        setEditingHospital(hospital);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        const result = await MySwal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this hospital?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            const resp = await hospitalService.deleteHospitals(id);
            if (!resp.error) {
                setHospitals(hospitals.filter((h) => h.id !== id));
                MySwal.fire('Deleted!', 'Hospital has been deleted.', 'success');
            }
            else {
                MySwal.fire('Deletion Failed!', resp.error, 'error');
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingHospital(null);
    };

    const filteredHospitals = hospitals.filter(
        (hospital) =>
            hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hospital.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastHospital = currentPage * itemsPerPage;
    const indexOfFirstHospital = indexOfLastHospital - itemsPerPage;
    const currentHospitals = filteredHospitals.slice(
        indexOfFirstHospital,
        indexOfLastHospital
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Hospital Details Management</h2>
                {!showForm && (
                    <button
                        onClick={() => {
                            setEditingHospital(null);
                            setShowForm(true);
                        }}
                        className="btn-primary inline-flex items-center"
                    >
                        <Plus className="mr-2" size={20} />
                        Add New Hospital
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-6">
                        {editingHospital ? 'Edit Hospital' : 'Add New Hospital'}
                    </h3>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={HospitalSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ errors, touched, isSubmitting }) => (
                            <Form>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Hospital Name *
                                        </label>
                                        <Field
                                            type="text"
                                            name="name"
                                            id="name"
                                            className={`input-field ${
                                                errors.name && touched.name
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            placeholder="Enter hospital name"
                                        />
                                        <ErrorMessage
                                            name="name"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Email *
                                        </label>
                                        <Field
                                            type="email"
                                            name="email"
                                            id="email"
                                            className={`input-field ${
                                                errors.email && touched.email
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            placeholder="hospital@example.com"
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phoneNumber"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Phone Number *
                                        </label>
                                        <Field
                                            type="tel"
                                            name="phoneNumber"
                                            id="phoneNumber"
                                            className={`input-field ${
                                                errors.phoneNumber && touched.phoneNumber
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            placeholder="1234567890"
                                        />
                                        <ErrorMessage
                                            name="phoneNumber"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="website"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Website
                                        </label>
                                        <Field
                                            type="url"
                                            name="website"
                                            id="website"
                                            className={`input-field ${
                                                errors.website && touched.website
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            placeholder="https://example.com"
                                        />
                                        <ErrorMessage
                                            name="website"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label
                                            htmlFor="address"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Address *
                                        </label>
                                        <Field
                                            type="text"
                                            name="address"
                                            id="address"
                                            className={`input-field ${
                                                errors.address && touched.address
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            placeholder="123 Main Street"
                                        />
                                        <ErrorMessage
                                            name="address"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="city"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            City *
                                        </label>
                                        <Field
                                            type="text"
                                            name="city"
                                            id="city"
                                            className={`input-field ${
                                                errors.city && touched.city
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            placeholder="City"
                                        />
                                        <ErrorMessage
                                            name="city"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="state"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            State *
                                        </label>
                                        <Field
                                            type="text"
                                            name="state"
                                            id="state"
                                            className={`input-field ${
                                                errors.state && touched.state
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            placeholder="State"
                                        />
                                        <ErrorMessage
                                            name="state"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="zipCode"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Zip Code *
                                        </label>
                                        <Field
                                            type="text"
                                            name="zipCode"
                                            id="zipCode"
                                            className={`input-field ${
                                                errors.zipCode && touched.zipCode
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            placeholder="12345"
                                        />
                                        <ErrorMessage
                                            name="zipCode"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="country"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Country *
                                        </label>
                                        <Field
                                            type="text"
                                            name="country"
                                            id="country"
                                            className={`input-field ${
                                                errors.country && touched.country
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            placeholder="Country"
                                        />
                                        <ErrorMessage
                                            name="country"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="establishedYear"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Established Year *
                                        </label>
                                        <Field
                                            type="number"
                                            name="establishedYear"
                                            id="establishedYear"
                                            className={`input-field ${
                                                errors.establishedYear && touched.establishedYear
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            placeholder="2000"
                                        />
                                        <ErrorMessage
                                            name="establishedYear"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="status"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Status *
                                        </label>
                                        <Field
                                            as="select"
                                            name="status"
                                            id="status"
                                            className="input-field"
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="INACTIVE">Inactive</option>
                                        </Field>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="totalBeds"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Total Beds *
                                        </label>
                                        <Field
                                            type="number"
                                            name="totalBeds"
                                            id="totalBeds"
                                            className={`input-field ${
                                                errors.totalBeds && touched.totalBeds
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            placeholder="100"
                                        />
                                        <ErrorMessage
                                            name="totalBeds"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="availableBeds"
                                            className="block text-gray-700 font-medium mb-2"
                                        >
                                            Available Beds *
                                        </label>
                                        <Field
                                            type="number"
                                            name="availableBeds"
                                            id="availableBeds"
                                            className={`input-field ${
                                                errors.availableBeds && touched.availableBeds
                                                    ? 'border-red-500'
                                                    : ''
                                            }`}
                                            placeholder="50"
                                        />
                                        <ErrorMessage
                                            name="availableBeds"
                                            component="div"
                                            className="text-red-500 mt-1 text-sm"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <Field
                                            type="checkbox"
                                            name="emergencyServices"
                                            id="emergencyServices"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label
                                            htmlFor="emergencyServices"
                                            className="ml-2 block text-gray-700 font-medium"
                                        >
                                            Emergency Services Available
                                        </label>
                                    </div>

                                    <div className="flex items-center">
                                        <Field
                                            type="checkbox"
                                            name="ambulanceServices"
                                            id="ambulanceServices"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label
                                            htmlFor="ambulanceServices"
                                            className="ml-2 block text-gray-700 font-medium"
                                        >
                                            Ambulance Services Available
                                        </label>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-primary"
                                    >
                                        {isSubmitting
                                            ? 'Saving...'
                                            : editingHospital
                                            ? 'Update Hospital'
                                            : 'Create Hospital'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="btn-outline"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 border-b">
                        <input
                            type="text"
                            placeholder="Search hospitals..."
                            className="input-field w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Beds
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentHospitals.map((hospital) => (
                                    <tr key={hospital.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Building2 className="h-5 w-5 text-blue-500 mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {hospital.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Est. {hospital.establishedYear}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{hospital.city}, {hospital.state}</div>
                                            <div>{hospital.country}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{hospital.phoneNumber}</div>
                                            <div>{hospital.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>Total: {hospital.totalBeds}</div>
                                            <div className="text-green-600">Available: {hospital.availableBeds}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    hospital.status === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {hospital.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEdit(hospital)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(hospital.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 flex items-center justify-between border-t">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">{indexOfFirstHospital + 1}</span> to{' '}
                            <span className="font-medium">
                                {Math.min(indexOfLastHospital, filteredHospitals.length)}
                            </span>{' '}
                            of <span className="font-medium">{filteredHospitals.length}</span> results
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="px-3 py-1 border rounded text-sm"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            {[...Array(Math.ceil(filteredHospitals.length / itemsPerPage)).keys()].map(
                                (page) => (
                                    <button
                                        key={page}
                                        className={`px-3 py-1 border rounded text-sm ${
                                            currentPage === page + 1 ? 'bg-blue-600 text-white' : ''
                                        }`}
                                        onClick={() => setCurrentPage(page + 1)}
                                    >
                                        {page + 1}
                                    </button>
                                )
                            )}
                            <button
                                className="px-3 py-1 border rounded text-sm"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={
                                    currentPage === Math.ceil(filteredHospitals.length / itemsPerPage)
                                }
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospitalDetails;
