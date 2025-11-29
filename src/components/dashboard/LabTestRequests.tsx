import { useEffect, useState } from 'react';
import MySwal from '../../config/MySwal';
import { uploadToCloud } from '../../services/Web3UploadService';
import * as labService from "./../../services/LabService";
import { useAuth } from '../../contexts/AuthContext';

const LabTestRequests = () => {
    const [reports, setReports] = useState([]);
    const { user } = useAuth();

    const fetchReports = async () => {
        const reports = await labService.getAllReports();
        setReports(reports);
    };

    useEffect(() => {
        fetchReports();
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
            return 'NA';    
        }
    };

    function handleAcceptReportRequest(id: any): void {
        MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await labService.acceptReport(id);
            }
        })
    }

    function handleUploadTestReport(id: any): void {
        MySwal.fire({
            title: 'Upload Test Report',
            html: `
                <input type="file" 
                       id="reportFile" 
                       accept=".pdf,.jpg,.jpeg,.png"
                       class="swal2-file">
            `,
            showCancelButton: true,
            confirmButtonText: 'Upload',
            confirmButtonColor: "#3085d6",
            preConfirm: async () => {
                const fileInput = document.getElementById('reportFile') as HTMLInputElement;
                const file = fileInput?.files?.[0];
                console.log("file : ", file);
                
                if (!file) {
                    MySwal.showValidationMessage('Please select a file');
                    return false;
                }

                const reportUrl = await uploadToCloud(file);

                return reportUrl;
            }
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                // Call the smart contract function with the file URL
                console.log(result.value);
                
                await labService.uploadReport(id, result.value);
                
                MySwal.fire(
                    'Uploaded!',
                    'The test report has been uploaded successfully.',
                    'success'
                );
            }
        });
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Lab Test Requests</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search requests..."
                            className="input-field w-64 mr-4"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Test Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Completed At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Lab Technician
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reports.map((report: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {report.reportName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {convertToDate(report.requestAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {convertToDate(report.completedAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.reportStatus === 'STARTED' ? 'bg-yellow-100 text-yellow-800' :
                                            report.reportStatus === 'REQUESTED' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {report.reportStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {report.doctorId == "0" ? 'Not Assigned' : report.labDetails.name}
                                        {
                                            user?.id == report.labDetails.id 
                                                ? <span> (you)</span>
                                                : <></>
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {
                                        report.reportStatus === 'REQUESTED' ? <button onClick={() => handleAcceptReportRequest(report.id)} className="text-blue-600 hover:text-blue-900 mr-3">Accept</button>
                                        : report.reportStatus === 'STARTED' ? <button onClick={() => handleUploadTestReport(report.id)} className="text-green-600 hover:text-green-900 mr-3">Upload</button>
                                        : <span>No pending actions</span>
                                    }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 flex items-center justify-between border-t mt-4">
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                        <span className="font-medium">42</span> results
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 border rounded text-sm">Previous</button>
                        <button className="px-3 py-1 border rounded bg-blue-600 text-white text-sm">1</button>
                        <button className="px-3 py-1 border rounded text-sm">2</button>
                        <button className="px-3 py-1 border rounded text-sm">3</button>
                        <button className="px-3 py-1 border rounded text-sm">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LabTestRequests;