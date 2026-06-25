import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from '../../components/ui';
import { Calendar, Check, X, Clock } from 'lucide-react';

export default function TeacherAttendance() {
  const [selectedClass, setSelectedClass] = useState(1);
  const [selectedDate, setSelectedDate] = useState('2026-06-25');

  const classes = [
    { id: 1, name: 'Grade 10 Mathematics - Section A', students: 28 },
    { id: 2, name: 'Grade 11 Mathematics - Section B', students: 26 },
    { id: 3, name: 'Grade 12 Calculus - Advanced', students: 24 },
  ];

  const [attendance, setAttendance] = useState([
    { id: 1, name: 'Elena Sterling', status: 'Present' },
    { id: 2, name: 'Marcus Chen', status: 'Present' },
    { id: 3, name: 'Aria Thorne', status: 'Absent' },
    { id: 4, name: 'Julian Ross', status: 'Late' },
    { id: 5, name: 'Sarah Wilson', status: 'Present' },
    { id: 6, name: 'James Liu', status: 'Present' },
  ]);

  const toggleAttendance = (id, newStatus) => {
    const statuses = ['Present', 'Late', 'Absent'];
    const currentIndex = statuses.indexOf(attendance.find(a => a.id === id).status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    setAttendance(attendance.map(a => a.id === id ? { ...a, status: nextStatus } : a));
  };

  const currentClass = classes.find(c => c.id === selectedClass);
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const lateCount = attendance.filter(a => a.status === 'Late').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-primary">Attendance Management</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Mark and track student attendance</p>
      </div>

      {/* Class and Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <Card>
          <p className="font-label-md text-on-surface-variant uppercase mb-md">Select Class</p>
          <select value={selectedClass} onChange={(e) => setSelectedClass(Number(e.target.value))} className="input-field w-full">
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </Card>
        <Card>
          <p className="font-label-md text-on-surface-variant uppercase mb-md">Select Date</p>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input-field w-full" />
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-lg">
        <Card>
          <div className="flex items-center gap-md">
            <Check size={24} className="text-green-600" />
            <div>
              <p className="font-label-md text-on-surface-variant">Present</p>
              <p className="font-headline-md text-primary">{presentCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-md">
            <Clock size={24} className="text-warning" />
            <div>
              <p className="font-label-md text-on-surface-variant">Late</p>
              <p className="font-headline-md text-primary">{lateCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-md">
            <X size={24} className="text-error" />
            <div>
              <p className="font-label-md text-on-surface-variant">Absent</p>
              <p className="font-headline-md text-primary">{absentCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance List */}
      <Card>
        <CardHeader title={`${currentClass?.name} - ${selectedDate}`} />
        <CardContent>
          <div className="space-y-sm">
            {attendance.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-md border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">
                <p className="font-label-md text-on-surface">{record.name}</p>
                <button
                  onClick={() => toggleAttendance(record.id, null)}
                  className={`px-md py-sm rounded-lg font-label-md transition-colors ${
                    record.status === 'Present'
                      ? 'bg-green-100 text-green-800'
                      : record.status === 'Late'
                      ? 'bg-warning/20 text-warning'
                      : 'bg-error/10 text-error'
                  }`}
                >
                  {record.status}
                </button>
              </div>
            ))}
          </div>
          <Button className="w-full mt-lg">Save Attendance</Button>
        </CardContent>
      </Card>
    </div>
  );
}
