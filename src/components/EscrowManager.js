// components/EscrowManager.jsx
import { useEffect, useState } from 'react';
import axios from '../utils/axios';

const EscrowManager = ({ project, userRole }) => {
    const [escrowStatus, setEscrowStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEscrowStatus();
    }, [project.id]);

    const fetchEscrowStatus = async () => {
        try {
            const response = await axios.get(`escrow/project/${project.id}/status`);
            if (response.data.success) {
                setEscrowStatus(response.data.data);
            }
        } catch (err) {
            // No escrow exists yet
            setEscrowStatus(null);
        }
    };

    const createEscrow = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post('escrow/create', {
                project_id: project.id,
                amount: project.budget
            });

            if (response.data.success) {
                // Redirect to payment if payment URL is provided
                if (response.data.data.payment_url) {
                    window.open(response.data.data.payment_url, '_blank');
                }
                await fetchEscrowStatus();
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create escrow');
        } finally {
            setLoading(false);
        }
    };

    const releaseFunds = async () => {
        if (!window.confirm('Are you sure you want to release the funds? This cannot be undone.')) {
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post(`escrow/${escrowStatus.id}/release`);
            
            if (response.data.success) {
                await fetchEscrowStatus();
                alert('Funds released successfully!');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to release funds');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-yellow-600';
            case 'funded': return 'text-green-600';
            case 'released': return 'text-blue-600';
            case 'cancelled': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Waiting for Payment';
            case 'funded': return 'Funds Secured';
            case 'released': return 'Payment Released';
            case 'cancelled': return 'Transaction Cancelled';
            default: return 'Unknown Status';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Escrow Protection
            </h3>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {!escrowStatus ? (
                // No escrow created yet
                <div>
                    <p className="text-gray-600 mb-4">
                        Secure this project with escrow protection. Funds will be held safely until work is completed.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                        <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Client deposits ${project.budget} into secure escrow</li>
                            <li>• Freelancer begins work knowing payment is guaranteed</li>
                            <li>• Funds are released when work is approved</li>
                            <li>• Dispute resolution available if needed</li>
                        </ul>
                    </div>
                    
                    {userRole === 'client' && (
                        <button
                            onClick={createEscrow}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : `Secure ${project.budget} with Escrow`}
                        </button>
                    )}
                    
                    {userRole === 'freelancer' && (
                        <div className="text-gray-600">
                            Waiting for client to set up escrow protection...
                        </div>
                    )}
                </div>
            ) : (
                // Escrow exists
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-600">Amount Secured</p>
                            <p className="text-2xl font-bold text-green-600">${escrowStatus.amount}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Status</p>
                            <p className={`font-medium ${getStatusColor(escrowStatus.status)}`}>
                                {getStatusText(escrowStatus.status)}
                            </p>
                        </div>
                    </div>

                    {/* Status-specific messages and actions */}
                    {escrowStatus.status === 'pending' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
                            <p className="text-yellow-800">
                                <strong>Action Required:</strong> Please complete the payment to secure the funds.
                            </p>
                        </div>
                    )}

                    {escrowStatus.status === 'funded' && (
                        <div>
                            <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
                                <p className="text-green-800">
                                    <strong>Great!</strong> Funds are secured. Work can now begin safely.
                                </p>
                            </div>
                            
                            {userRole === 'client' && (
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600">
                                        Release payment when you're satisfied with the completed work.
                                    </p>
                                    <button
                                        onClick={releaseFunds}
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : 'Release Payment'}
                                    </button>
                                </div>
                            )}
                            
                            {userRole === 'freelancer' && (
                                <div className="text-gray-600">
                                    Payment is secured! You can start working with confidence.
                                </div>
                            )}
                        </div>
                    )}

                    {escrowStatus.status === 'released' && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-4">
                            <p className="text-blue-800">
                                <strong>Payment Released!</strong> The funds have been transferred to the freelancer.
                            </p>
                        </div>
                    )}

                    {escrowStatus.status === 'cancelled' && (
                        <div className="bg-red-50 border border-red-200 rounded p-4">
                            <p className="text-red-800">
                                <strong>Transaction Cancelled.</strong> Funds have been refunded to the client.
                            </p>
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                            Escrow ID: {escrowStatus.id} • Created: {new Date(escrowStatus.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EscrowManager;

// Usage example in your project page:
// <EscrowManager 
//     project={project} 
//     userRole={currentUser.id === project.client_id ? 'client' : 'freelancer'} 
// />