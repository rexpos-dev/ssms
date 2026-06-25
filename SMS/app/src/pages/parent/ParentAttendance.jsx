import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge } from '../../components/ui';
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export default function ParentAttendance() {
  const [currentMonth, setCurrentMonth] = useState('October 2023');

  const attendanceData = [
    { date: 'Oct 30', status: 'PRESENT', time: '07:52 AM', checkOut: '03:30 PM' },
    { date: 'Oct 20', status: 'PRESENT', time: '07:58 AM', checkOut: '03:30 PM' },
    { date: 'Oct 17', status: 'ABSENT', time: '—', checkOut: '—' },
    { date: 'Oct 16', status: 'PRESENT', time: '07:54 AM', checkOut: '03:30 PM' },
  ];

  const monthData = ['Oct 2', 'Oct 3', 'Oct 4', 'Oct 5', 'Oct 6', 'Oct 7', 'Oct 8', 'Oct 9', 'Oct 10', 'Oct 11'];
  const attendanceStatus = [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1];

  const conductRecords = [
    { date: 'Oct 08', type: '⭐ Excellent Behavior', description: 'Active participation and positive attitude', status: 'Oct 08' },
    { date: 'Oct 05', type: '📋 Community Service', description: 'Participated in school cleanup and recycling initiative event', status: 'Oct 05' },
    { date: 'Oct 01', type: '🔴 Late Arrival', description: 'Student arrived 10 minutes late to homeroom', status: 'Oct 01' },
  ];

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-primary">Attendance & Conduct</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Track student attendance and behavior records</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-label-md text-on-surface-variant uppercase mb-md">Academic Year Attendance</p>
              <p className="font-headline-lg text-headline-lg text-primary">98.2%</p>
              <p className="text-label-sm text-green-600 mt-sm flex items-center gap-xs">
                <TrendingUp size={14} /> +3.5% from last term
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-label-md text-on-surface-variant uppercase mb-md">Conduct Score</p>
              <div className="font-headline-lg text-primary mt-md">A+</div>
              <p className="text-label-sm text-on-surface-variant mt-sm">Exemplary Behavior</p>
            </div>
          </div>
        </Card>

        <Card className="bg-primary-fixed">
          <div>
            <p className="font-label-md text-on-surface-variant uppercase mb-md">Merit Points</p>
            <p className="font-headline-lg text-primary mt-md">42</p>
            <p className="text-label-sm text-on-surface-variant mt-sm">Earned this month</p>
          </div>
        </Card>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader title="October 2023" action={<span className="text-label-sm text-on-surface-variant">Oct 1 - 31</span>} />
        <CardContent>
          <div className="grid grid-cols-7 gap-sm">
            {monthData.map((day, idx) => (
              <div key={idx} className={`p-sm rounded-lg text-center text-label-sm font-label-md ${
                attendanceStatus[idx] === 1 ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'
              }`}>
                {idx + 2}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Conduct */}
      <Card>
        <CardHeader title="Recent Conduct" />
        <CardContent>
          <div className="space-y-md">
            {conductRecords.map((record, idx) => (
              <div key={idx} className="pb-md border-b border-surface-variant last:border-0 last:pb-0">
                <div className="flex items-start gap-md">
                  <span className="text-2xl">{record.type.split(' ')[0]}</span>
                  <div className="flex-1">
                    <p className="font-label-md text-on-surface">{record.type}</p>
                    <p className="text-label-sm text-on-surface-variant mt-xs">{record.description}</p>
                  </div>
                  <Badge variant="primary">{record.date}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader title="Attendance History - October" action={<button className="text-primary font-label-md">Export PDF</button>} />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-label-md">
              <thead>
                <tr className="border-b border-surface-variant">
                  <th className="text-left p-md text-on-surface font-label-md">DATE</th>
                  <th className="text-left p-md text-on-surface font-label-md">STATUS</th>
                  <th className="text-left p-md text-on-surface font-label-md">CHECK-IN TIME</th>
                  <th className="text-left p-md text-on-surface font-label-md">CHECK-OUT TIME</th>
                  <th className="text-left p-md text-on-surface font-label-md">NOTES/REMARKS</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, idx) => (
                  <tr key={idx} className="border-b border-surface-variant">
                    <td className="p-md text-on-surface">{record.date}</td>
                    <td className="p-md">
                      <Badge variant={record.status === 'PRESENT' ? 'success' : 'danger'}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="p-md text-on-surface">{record.time}</td>
                    <td className="p-md text-on-surface">{record.checkOut}</td>
                    <td className="p-md text-on-surface-variant">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-lg text-label-sm text-on-surface-variant">
            Showing 18 records for October
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
