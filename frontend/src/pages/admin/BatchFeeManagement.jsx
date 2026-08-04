import { useState, useEffect } from 'react';
import { CreditCard, Save, RefreshCw, Layers, Calendar, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import client from '../../api/client';
import { getSemesters } from '../../api/semesterApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const BatchFeeManagement = () => {
  const [semesters, setSemesters] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [fees, setFees] = useState({}); // { batchId: amount }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [semRes, batchRes] = await Promise.all([
        getSemesters({ size: 100 }),
        client.get('/batches')
      ]);

      const allSems = semRes.data.content || semRes.data || [];
      setSemesters(allSems);
      setBatches(batchRes.data || []);

      const activeSem = allSems.find(s => s.status === 'REGISTRATION' || s.status === 'ONGOING') || allSems[0];
      if (activeSem) {
        setSelectedSemester(activeSem.id);
        await fetchFees(activeSem.id);
      }
    } catch (err) {
      toast.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async (semesterId) => {
    try {
      const res = await client.get(`/batch-semester-fees?semesterId=${semesterId}`);
      const feeMap = {};
      res.data.forEach(f => {
        feeMap[f.batchId] = f.registrationFee;
      });
      setFees(feeMap);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSemester) fetchFees(selectedSemester);
  }, [selectedSemester]);

  const handleFeeChange = (batchId, value) => {
    setFees(prev => ({ ...prev, [batchId]: value }));
  };

  const handleSave = async (batchId) => {
    setSaving(batchId);
    try {
      await client.post('/batch-semester-fees', {
        batchId,
        semesterId: selectedSemester,
        registrationFee: fees[batchId] || 0
      });
      toast.success('Fee updated successfully');
    } catch (err) {
      toast.error('Failed to update fee');
    } finally {
      setSaving(null);
    }
  };

  const handleSaveAll = async () => {
    setSaving('all');
    try {
      for (const batch of batches) {
        await client.post('/batch-semester-fees', {
          batchId: batch.id,
          semesterId: selectedSemester,
          registrationFee: fees[batch.id] || 0
        });
      }
      toast.success('All fees updated successfully');
    } catch (err) {
      toast.error('Failed to update some fees');
    } finally {
      setSaving(null);
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2D2A4F] dark:text-white tracking-tight">Batch Fee Configuration</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium">Set fixed registration fees per batch per semester.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSaveAll} isLoading={saving === 'all'} className="flex items-center gap-2">
            <Save size={18} />
            <span>Save All Changes</span>
          </Button>
        </div>
      </div>

      <Card className="bg-[#2D2A4F] text-white !p-6 border-none shadow-xl">
        <div className="max-w-md">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 ml-1">Configure for Semester</label>
          <div className="relative mt-2">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
            <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-white/10 border border-white/15 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400/60 text-sm font-bold appearance-none cursor-pointer text-white"
            >
              {semesters.map(s => (
                  <option key={s.id} value={s.id} className="text-gray-900">{s.name} ({s.status})</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {batches.map((batch, idx) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all group overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#2D2A4F] dark:text-white">Batch {batch.batchNumber}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{batch.programName}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Registration Fee (BDT)</label>
                    <div className="relative mt-1.5">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="number"
                        value={fees[batch.id] || ''}
                        onChange={(e) => handleFeeChange(batch.id, e.target.value)}
                        placeholder="e.g. 15000"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-sm dark:text-white"
                      />
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={() => handleSave(batch.id)}
                    isLoading={saving === batch.id}
                    className="w-full py-2.5 text-xs font-black"
                  >
                    Update Batch Fee
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-[2rem] border border-amber-100 dark:border-amber-900/20 flex items-start gap-4">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600">
          <AlertCircle size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black text-amber-900 dark:text-amber-400 uppercase tracking-widest">Pricing Logic</h4>
          <p className="text-xs font-medium text-amber-800/70 dark:text-amber-500/70 mt-1 leading-relaxed">
            The values set above are **Fixed Registration Fees**. Students must pay this amount to unlock course registration for the selected semester.
            Additionally, a variable fee of **6,500 BDT per credit** will be added automatically as they enroll in courses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BatchFeeManagement;
