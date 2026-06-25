import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from '../../components/ui';
import { Download, MessageSquare, FileText, AlertCircle, Calendar } from 'lucide-react';

export default function ParentDashboard() {
  const [announcements] = useState([
    { icon: '📚', title: 'Science Project: Solar System Model', desc: 'Due date next Thursday. Submit your project photos here and write the 500 word research summary for...' },
    { icon: '📝', title: 'Math Worksheet: Chapter 4 Exercises', desc: 'Questions 1-10 due by Friday. Remember to show all working steps for partial marks. Questions...' },
    { icon: '🔬', title: 'Lab Report: Acid-Base Titration', desc: 'Upcoming safety lab next week. Please make sure all students complete the safety...' },
    { icon: '📖', title: 'English Essay: Character Analysis', desc: 'Gallery focusing on the theme of the work. Please submit by the deadline indicated in your...' },
  ]);

  const [upcomingEvents] = useState([
    { date: 'Fri', time: 'May 10am', title: 'PTA Meeting', type: 'High', location: 'Main Auditorium' },
    { date: 'Wed', time: 'May 2pm', title: 'Math Olympiad', type: 'Info', location: 'Hall B' },
    { date: 'Sat', time: 'May 9am', title: 'School Day', type: 'Info', location: 'Sports Complex' },
  ]);

  const [semesterPerformance] = useState([
    { subject: 'Advanced Mathematics', teacher: 'Dr. Ania Thorne', grade: 'A-', attendance: '98%', status: 'Exceling' },
    { subject: 'Physics II', teacher: 'Prof. Elena Varela', grade: 'B+', attendance: '92%', status: 'Exceling' },
    { subject: 'English Literature', teacher: 'Ms. Sarah Jenkins', grade: 'A', attendance: '100%', status: 'Exceling' },
    { subject: 'History of Art', teacher: 'Mr. Julien Rose', grade: 'B-', attendance: '88%', status: 'Review' },
  ]);

  const studentInfo = {
    name: 'Elena Sterling',
    students: [
      { name: 'Marcus (Grade 11)', initial: 'M' },
      { name: 'Elena (Grade 7)', initial: 'E' },
    ]
  };

  return (
    <div className="space-y-xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-label-md text-on-surface-variant uppercase mb-sm">WELCOME BACK</p>
          <h1 className="font-headline-xl text-headline-xl text-primary">Academic Overview</h1>
        </div>
        <div className="flex gap-md">
          {studentInfo.students.map((student, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-headline-md mb-xs">
                {student.initial}
              </div>
              <p className="text-label-xs text-on-surface-variant">{student.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Overview Section */}
      <div className="grid grid-cols-12 gap-lg">
        {/* Left: KPI Cards and Sections */}
        <div className="col-span-12 lg:col-span-8 space-y-lg">
          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-lg">
            <Card>
              <CardContent>
                <div className="text-center">
                  <p className="font-label-sm text-on-surface-variant uppercase mb-md">GPA</p>
                  <p className="font-headline-lg text-primary mb-xs">3.85</p>
                  <p className="text-label-xs text-on-surface-variant">Last Semester</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-center">
                  <p className="font-label-sm text-on-surface-variant uppercase mb-md">Attendance</p>
                  <p className="font-headline-lg text-primary mb-xs">96%</p>
                  <p className="text-label-xs text-on-surface-variant">attendance</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="text-center">
                  <p className="font-label-sm text-on-surface-variant uppercase mb-md">Pending Tasks</p>
                  <p className="font-headline-lg text-primary mb-xs">04</p>
                  <p className="text-label-xs text-on-surface-variant">Hrs left</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* School Announcements */}
          <div>
            <h3 className="font-headline-sm text-primary mb-lg">School Announcements</h3>
            <div className="space-y-md">
              {announcements.map((ann, idx) => (
                <div key={idx} className="border-l-4 border-primary pl-md py-sm">
                  <div className="flex gap-md">
                    <span className="text-2xl flex-shrink-0">{ann.icon}</span>
                    <div className="flex-1">
                      <p className="font-label-md text-on-surface">{ann.title}</p>
                      <p className="text-label-xs text-on-surface-variant mt-xs line-clamp-2">{ann.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <h3 className="font-headline-sm text-primary mb-lg">Upcoming Events</h3>
            <div className="space-y-md">
              {upcomingEvents.map((event, idx) => (
                <div key={idx} className="flex items-start gap-md pb-md border-b border-surface-variant last:border-0">
                  <div className="flex-shrink-0">
                    <p className="font-label-md text-primary">{event.date}</p>
                    <p className="text-label-xs text-on-surface-variant">{event.time}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-label-md text-on-surface">{event.title}</p>
                    <p className="text-label-xs text-on-surface-variant mt-xs">{event.location}</p>
                  </div>
                  <Badge variant={event.type === 'High' ? 'warning' : 'primary'}>{event.type}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="bg-primary text-on-primary h-full">
            <CardContent>
              <h3 className="font-headline-sm mb-lg">Quick Actions</h3>
              <div className="space-y-md">
                <Button className="w-full bg-on-primary text-primary hover:opacity-90 justify-start">
                  💳 Pay Outstanding Fees
                </Button>
                <Button className="w-full bg-on-primary text-primary hover:opacity-90 justify-start">
                  ✉️ Message Teacher
                </Button>
                <Button className="w-full bg-on-primary text-primary hover:opacity-90 justify-start">
                  📋 View Project PLD
                </Button>
                <Button className="w-full bg-on-primary text-primary hover:opacity-90 justify-start">
                  📊 Absence Report
                </Button>
              </div>
              <div className="mt-lg pt-lg border-t border-on-primary/20">
                <p className="text-label-xs text-on-primary/80 mb-sm">General Outstanding Balance</p>
                <p className="font-headline-md">₱1,250.00</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Current Semester Performance */}
      <div>
        <div className="flex justify-between items-center mb-lg">
          <h3 className="font-headline-sm text-primary">Current Semester Performance</h3>
          <button className="text-primary font-label-md flex items-center gap-sm hover:underline">
            <Download size={16} /> Download Detailed PDF
          </button>
        </div>

        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-label-md">
                <thead>
                  <tr className="border-b border-surface-variant">
                    <th className="text-left p-md text-on-surface font-label-md">SUBJECT</th>
                    <th className="text-left p-md text-on-surface font-label-md">TEACHER</th>
                    <th className="text-left p-md text-on-surface font-label-md">MID-TERM GRADE</th>
                    <th className="text-left p-md text-on-surface font-label-md">ATTENDANCE</th>
                    <th className="text-left p-md text-on-surface font-label-md">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {semesterPerformance.map((item, idx) => (
                    <tr key={idx} className="border-b border-surface-variant hover:bg-surface-variant/50">
                      <td className="p-md text-on-surface font-label-md">{item.subject}</td>
                      <td className="p-md text-on-surface">{item.teacher}</td>
                      <td className="p-md">
                        <Badge variant="primary">{item.grade}</Badge>
                      </td>
                      <td className="p-md text-on-surface">{item.attendance}</td>
                      <td className="p-md">
                        <Badge variant={item.status === 'Exceling' ? 'success' : 'warning'}>
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
