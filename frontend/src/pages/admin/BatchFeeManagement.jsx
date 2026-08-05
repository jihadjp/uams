import { useState, useEffect } from 'react';
import { CreditCard, Save, Layers, Calendar, ChevronDown, AlertCircle } from 'lucide-react';
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
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
        {/* Top Action Bar */}
        <div className="flex justify-end items-center">
          <Button onClick={handleSaveAll} isLoading={saving === 'all'} className="bg-[#2D2A4F] hover:bg-[#1E1C38] text-white flex items-center gap-2 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-2.5 px-4 border-none">
            <Save size={16} />
            <span>Save All Changes</span>
          </Button>
        </div>

        {/* Semester Selection Card */}
        <Card className="bg-[#0B1225] text-white !p-5 sm:!p-6 border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl">
          <div className="max-w-md">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 ml-1">Configure for Semester</label>
            <div className="relative mt-2">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300 pointer-events-none" size={16} />
              <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full pl-10 pr-9 py-3 bg-white/10 border border-white/15 rounded-xl sm:rounded-2xl outline-none text-xs sm:text-sm font-bold appearance-none cursor-pointer text-white"
              >
                {semesters.map(s => (
                    <option key={s.id} value={s.id} className="text-gray-900">{s.name} ({s.status})</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
            </div>
          </div>
        </Card>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {batches.map((batch, idx) => (
                <motion.div
                    key={batch.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                >
                  <Card className="border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-colors group overflow-hidden !p-5">
                    <div className="flex items-center gap-3.5 mb-5">
                      <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-900/30 rounded-xl sm:rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                        <Layers size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-black text-[#2D2A4F] dark:text-white truncate">Batch {batch.batchNumber}</h3>
                        <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{batch.programName}</p>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 dark:text-white/40 tracking-widest ml-1">Registration Fee (BDT)</label>
                        <div className="relative mt-1">
                          <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                          <input
                              type="number"
                              value={fees[batch.id] || ''}
                              onChange={(e) => handleFeeChange(batch.id, e.target.value)}
                              placeholder="e.g. 15000"
                              className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50/70 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/60 rounded-xl text-xs sm:text-sm font-bold outline-none dark:text-white transition-all"
                          />
                        </div>
                      </div>

                      <Button
                          variant="secondary"
                          onClick={() => handleSave(batch.id)}
                          isLoading={saving === batch.id}
                          className="w-full py-2.5 text-xs font-black rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10"
                      >
                        Update Batch Fee
                      </Button>
                    </div>
                  </Card>
                </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pricing Logic Info Banner */}
        <div className="bg-amber-50/70 dark:bg-amber-500/10 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-amber-200 dark:border-amber-500/20 flex items-start gap-3 sm:gap-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
            <AlertCircle size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-300 uppercase tracking-widest">Pricing Logic</h4>
            <p className="text-xs font-medium text-amber-800/80 dark:text-amber-300/70 mt-1 leading-relaxed">
              The values set above are <strong className="font-black text-amber-900 dark:text-amber-200">Fixed Registration Fees</strong>. Students must pay this amount to unlock course registration for the selected semester.
              Additionally, a variable fee of <strong className="font-black text-amber-900 dark:text-amber-200">6,500 BDT per credit</strong> will be added automatically as they enroll in courses.
            </p>
          </div>
        </div>
      </div>
  );
};

export default BatchFeeManagement;