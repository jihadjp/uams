import { useState, useEffect } from 'react';
import { Calendar, Save, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { getCalendarBySemester, saveCalendar } from '../../api/academicCalendarApi';
import toast from 'react-hot-toast';

const AcademicCalendarManager = ({ semester, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    academicYear: new Date().getFullYear(),
    duration: '',
    events: []
  });

  useEffect(() => {
    const fetchCalendar = async () => {
      setLoading(true);
      try {
        const res = await getCalendarBySemester(semester.id);
        if (res.data) {
          setData({
            academicYear: res.data.academicYear || new Date().getFullYear(),
            duration: res.data.duration || '',
            events: res.data.events || []
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, [semester.id]);

  const handleEventChange = (index, field, value) => {
    const newEvents = [...data.events];
    newEvents[index][field] = value;
    setData({ ...data, events: newEvents });
  };

  const addEvent = () => {
    setData({
      ...data,
      events: [...data.events, { title: '', dateValue: '' }]
    });
  };

  const removeEvent = (index) => {
    const newEvents = data.events.filter((_, i) => i !== index);
    setData({ ...data, events: newEvents });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveCalendar(semester.id, data);
      toast.success('Calendar saved successfully');
      onBack();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to save calendar';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 flex justify-center"><Loader /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Calendar: {semester.name}</h2>
          <p className="text-sm text-gray-500">Set event dates and visibility for this semester.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card title="General Information" icon={Calendar}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Academic Year"
              type="number"
              value={data.academicYear}
              onChange={(e) => setData({ ...data, academicYear: e.target.value })}
              required
            />
            <Input
              label="Duration"
              placeholder="e.g., January - June"
              value={data.duration}
              onChange={(e) => setData({ ...data, duration: e.target.value })}
              required
            />
          </div>
        </Card>

        <Card title="Events" icon={Plus}>
          <div className="space-y-4">
            <p className="text-xs text-amber-600 font-medium mb-4 italic">
              Note: Events with empty date values will be hidden from students.
            </p>

            {data.events.map((event, index) => (
              <div key={index} className="flex items-end space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 group">
                <div className="flex-1">
                  <Input
                    label="Event Title"
                    value={event.title}
                    onChange={(e) => handleEventChange(index, 'title', e.target.value)}
                    required
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Date Value"
                    placeholder="e.g., 10 Jan 2026"
                    value={event.dateValue || ''}
                    onChange={(e) => handleEventChange(index, 'dateValue', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeEvent(index)}
                  className="p-3 text-gray-400 hover:text-red-500 transition-colors mb-0.5"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              onClick={addEvent}
              className="w-full py-4 border-dashed border-2 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <Plus size={18} className="mr-2" /> Add Custom Event
            </Button>
          </div>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="secondary" onClick={onBack}>Cancel</Button>
          <Button type="submit" isLoading={saving}>
            <Save size={18} className="mr-2" /> Save Academic Calendar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AcademicCalendarManager;
