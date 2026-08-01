import { useState, useEffect } from 'react';
import { DollarSign, Plus, Trash2, Calendar, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { getMyFees } from '../../api/feeApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatDate';

const FeeManagementModal = ({ isOpen, onClose, student }) => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recordingPayment, setRecordingPayment] = useState(null); // Fee ID being paid
    const [payAmount, setPayAmount] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchFees = async () => {
        if (!student?.id) return;
        setLoading(true);
        try {
            const res = await getMyFees(student.id);
            setFees(res.data || []);
        } catch (err) {
            toast.error('Failed to load fee records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchFees();
    }, [isOpen, student?.id]);

    const handleRecordPayment = async (feeId) => {
        if (!payAmount || parseFloat(payAmount) <= 0) return toast.error('Enter valid amount');

        setActionLoading(true);
        try {
            await client.post(`/fees/${feeId}/pay?amount=${payAmount}`);
            toast.success('Payment recorded successfully');
            setRecordingPayment(null);
            setPayAmount('');
            fetchFees();
        } catch (err) {
            toast.error('Failed to record payment');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Financial Ledger - ${student?.name}`}
            size="lg"
        >
            <div className="space-y-6 py-2">
                <div className="bg-primary-50 dark:bg-primary-900/10 p-4 rounded-2xl flex items-center justify-between border border-primary-100 dark:border-primary-900/20">
                    <div className="flex items-center space-x-3 text-primary-700 dark:text-primary-300 font-bold">
                        <Info size={18} />
                        <span className="text-sm">Registrar Override: Record manual payments from bank/office receipts.</span>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center"><Loader /></div>
                ) : fees.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th className="px-4 py-3">Semester</th>
                                    <th className="px-4 py-3 text-right">Payable</th>
                                    <th className="px-4 py-3 text-right">Paid</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {fees.map(f => (
                                    <tr key={f.id} className="text-sm">
                                        <td className="px-4 py-4 font-bold text-gray-800 dark:text-gray-200 uppercase">{f.semesterName}</td>
                                        <td className="px-4 py-4 text-right font-mono">{f.amountDue?.toLocaleString()}</td>
                                        <td className="px-4 py-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">{f.amountPaid?.toLocaleString()}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-black ${f.status === 'PAID' ? 'bg-green-100 text-green-700' : f.status === 'PARTIAL' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {f.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            {recordingPayment === f.id ? (
                                                <div className="flex items-center justify-end space-x-2">
                                                    <input
                                                        autoFocus
                                                        type="number"
                                                        placeholder="Amt"
                                                        value={payAmount}
                                                        onChange={(e) => setPayAmount(e.target.value)}
                                                        className="w-20 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 rounded text-xs outline-none"
                                                    />
                                                    <button onClick={() => handleRecordPayment(f.id)} disabled={actionLoading} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                                        <Plus size={14} />
                                                    </button>
                                                    <button onClick={() => { setRecordingPayment(null); setPayAmount(''); }} className="p-1.5 text-gray-400 hover:text-rose-500">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                f.status !== 'PAID' && (
                                                    <button
                                                        onClick={() => setRecordingPayment(f.id)}
                                                        className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100 dark:border-indigo-900/30"
                                                    >
                                                        Add Payment
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-3 opacity-40">
                        <AlertCircle size={48} className="mx-auto" />
                        <p className="text-sm font-black uppercase tracking-widest italic">No fee records generated for this student</p>
                    </div>
                )}

                <div className="pt-6 flex justify-end">
                    <Button variant="secondary" onClick={onClose} className="px-10">Done</Button>
                </div>
            </div>
        </Modal>
    );
};

export default FeeManagementModal;
