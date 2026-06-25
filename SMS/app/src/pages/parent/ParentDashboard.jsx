import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from '../../components/ui';
import { Download, TrendingUp, AlertCircle, Calendar } from 'lucide-react';

export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState('marcus');

  const [announcements] = useState([
    {
      icon: '🔬',
      category: 'Science & Tech',
      dueDate: 'Due Tomorrow, 11:59 PM',
      title: 'Science Project: Solar System Model',
      desc: 'Complete the 3D model and submit the 500-word research summary via the student portal.'
    },
    {
      icon: '📐',
      category: 'Advanced Mathematics',
      dueDate: 'Due Oct 26, 2023',
      title: 'Math Workbook: Chapter 4 Exercises',
      desc: 'Solve problems 1-25 on pages 112-115. Show all working steps for partial credit.'
    },
    {
      icon: '📋',
      category: 'School Event',
      dueDate: 'Due Oct 27, 2023',
      title: 'Field Trip Consent Form: National Museum',
      desc: 'Digital signature required for the upcoming history department field trip scheduled for next Friday.'
    },
    {
      icon: '📚',
      category: 'English Literature',
      dueDate: 'Due Oct 30, 2023',
      title: 'English Essay: Character Analysis',
      desc: 'Draft a character analysis of Jay Gatsby focusing on the theme of the American Dream.'
    }
  ]);

  const [upcomingEvents] = useState([
    {
      date: 'Tomorrow',
      time: '18:00',
      title: 'PTA Meeting',
      location: 'Main Auditorium',
      badge: 'High'
    },
    {
      date: 'Oct 30',
      time: '09:00',
      title: 'Math Olympiad',
      location: 'Regional Level',
      badge: 'Event'
    },
    {
      date: 'Nov 02',
      time: 'All Day',
      title: 'School Photo Day',
      location: 'Full Uniform Required',
      badge: 'Info'
    }
  ]);

  const [performance] = useState([
    { subject: 'Advanced Mathematics', teacher: 'Dr. Aris Thorne', grade: 'A-', attendance: '98%', status: 'Exceling', statusColor: 'bg-green-100 text-green-800' },
    { subject: 'Physics II', teacher: 'Prof. Elena Vance', grade: 'B+', attendance: '92%', status: 'Steady', statusColor: 'bg-blue-100 text-blue-800' },
    { subject: 'English Literature', teacher: 'Ms. Sarah Jenkins', grade: 'A', attendance: '100%', status: 'Exceling', statusColor: 'bg-green-100 text-green-800' },
    { subject: 'History of Art', teacher: 'Mr. Julian Ross', grade: 'B-', attendance: '85%', status: 'Needs Review', statusColor: 'bg-orange-100 text-orange-800' }
  ]);

  return (
    <div className="space-y-xl">
      {/* Welcome Header with Child Switcher */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-lg">
        <div className="flex flex-col gap-xs">
          <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">Welcome Back</span>
          <h3 className="font-headline-lg text-headline-lg text-primary">Academic Overview</h3>
        </div>
        <div className="bg-surface-container p-xs rounded-xl flex gap-xs">
          <button
            onClick={() => setSelectedChild('marcus')}
            className={`px-lg py-sm font-label-md rounded-lg flex items-center gap-sm transition-all ${
              selectedChild === 'marcus'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-secondary hover:bg-surface-container-high'
            }`}
          >
            👤 Marcus (Grade 10)
          </button>
          <button
            onClick={() => setSelectedChild('elena')}
            className={`px-lg py-sm font-label-md rounded-lg flex items-center gap-sm transition-all ${
              selectedChild === 'elena'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-secondary hover:bg-surface-container-high'
            }`}
          >
            👤 Elena (Grade 7)
          </button>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Stats Cards */}
        <div className="col-span-12 md:col-span-8 grid grid-cols-3 gap-gutter">
          {/* GPA Card */}
          <Card className="hover:shadow-md hover:translate-y-[-2px]">
            <CardContent className="flex flex-col gap-md">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-secondary uppercase">Current GPA</p>
                <h4 className="font-headline-xl text-headline-xl text-primary">3.85</h4>
              </div>
              <div className="flex items-center gap-xs text-green-600">
                <TrendingUp size={16} />
                <span className="font-label-sm">+0.2 from last term</span>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Card */}
          <Card className="hover:shadow-md hover:translate-y-[-2px]">
            <CardContent className="flex flex-col gap-md">
              <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center">
                <span className="text-xl">📅</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-secondary uppercase">Attendance</p>
                <h4 className="font-headline-xl text-headline-xl text-primary">96%</h4>
              </div>
              <div className="flex items-center gap-xs text-secondary">
                <span className="font-label-sm">2 excused absences</span>
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks Card */}
          <Card className="hover:shadow-md hover:translate-y-[-2px]">
            <CardContent className="flex flex-col gap-md">
              <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <p className="font-label-sm text-label-sm text-secondary uppercase">Pending Tasks</p>
                <h4 className="font-headline-xl text-headline-xl text-primary">04</h4>
              </div>
              <div className="flex items-center gap-xs text-error">
                <AlertCircle size={16} />
                <span className="font-label-sm">Due in 48 hours</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="col-span-12 md:col-span-4 row-span-2">
          <Card className="bg-primary text-on-primary h-full flex flex-col">
            <CardContent className="flex flex-col gap-md h-full">
              <h4 className="font-headline-sm text-headline-sm">Quick Actions</h4>
              <div className="flex flex-col gap-md flex-grow">
                <button className="w-full bg-white text-primary font-label-md py-md rounded px-lg flex items-center justify-between hover:opacity-90 transition-all active:scale-95">
                  Pay Outstanding Fees
                  <span>💳</span>
                </button>
                <button className="w-full border border-white border-opacity-30 text-white font-label-md py-md rounded px-lg flex items-center justify-between hover:bg-white hover:bg-opacity-10 transition-all active:scale-95">
                  Message Teacher
                  <span>✉️</span>
                </button>
                <button className="w-full border border-white border-opacity-30 text-white font-label-md py-md rounded px-lg flex items-center justify-between hover:bg-white hover:bg-opacity-10 transition-all active:scale-95">
                  View Project PRD
                  <span>📋</span>
                </button>
                <button className="w-full border border-white border-opacity-30 text-white font-label-md py-md rounded px-lg flex items-center justify-between hover:bg-white hover:bg-opacity-10 transition-all active:scale-95">
                  Absence Report
                  <span>📊</span>
                </button>
              </div>
              <div className="mt-lg p-md bg-white bg-opacity-10 rounded-lg">
                <p className="font-label-sm text-label-sm opacity-80 mb-sm">Overall Outstanding Balance</p>
                <p className="font-headline-md text-headline-md">₱1,250.00</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* School Announcements */}
        <div className="col-span-12 md:col-span-5">
          <Card className="h-full flex flex-col">
            <CardHeader
              title="School Announcements"
              action={
                <div className="flex gap-md">
                  <div className="flex bg-surface-container p-xs rounded-lg gap-xs">
                    <button className="px-sm py-1 text-secondary hover:bg-surface-container-high font-label-sm rounded transition-colors">
                      General
                    </button>
                    <button className="px-sm py-1 bg-surface-container-lowest text-primary font-label-sm rounded shadow-sm">
                      Homework
                    </button>
                  </div>
                  <a className="text-primary font-label-sm hover:underline">View All</a>
                </div>
              }
            />
            <CardContent className="flex flex-col gap-lg flex-grow">
              {announcements.map((ann, idx) => (
                <div key={idx} className="flex gap-md">
                  <div className="shrink-0 w-12 h-12 rounded bg-tertiary-fixed flex items-center justify-center text-2xl">
                    {ann.icon}
                  </div>
                  <div className="flex flex-col gap-xs flex-grow">
                    <span className="font-label-sm text-label-sm text-secondary">{ann.dueDate} • {ann.category}</span>
                    <h5 className="font-label-md text-label-md text-on-surface font-bold">{ann.title}</h5>
                    <p className="font-body-sm text-body-sm text-secondary line-clamp-2">{ann.desc}</p>
                  </div>
                  {idx < announcements.length - 1 && <div className="w-full h-px bg-surface-container" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="col-span-12 md:col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader title="Upcoming" />
            <CardContent className="flex flex-col divide-y divide-surface-container">
              {upcomingEvents.map((event, idx) => (
                <div key={idx} className="py-lg hover:bg-tertiary-fixed hover:bg-opacity-10 px-0 -mx-lg px-lg transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm text-secondary">{event.date} • {event.time}</span>
                      <p className="font-label-md text-label-md font-bold text-on-surface">{event.title}</p>
                      <p className="font-body-sm text-body-sm text-secondary">{event.location}</p>
                    </div>
                    <Badge variant={event.badge === 'High' ? 'warning' : 'primary'} size="sm">
                      {event.badge}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Table */}
      <Card>
        <CardHeader
          title="Current Semester Performance"
          action={
            <button className="text-secondary font-label-md flex items-center gap-sm px-md py-sm hover:bg-surface-container rounded-lg transition-colors">
              Download Detailed PDF
              <Download size={20} />
            </button>
          }
        />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-tertiary-fixed bg-opacity-50 border-b border-surface-container">
                  <th className="px-xl py-md font-label-sm text-label-sm text-on-tertiary-fixed-variant uppercase tracking-widest">
                    Subject
                  </th>
                  <th className="px-xl py-md font-label-sm text-label-sm text-on-tertiary-fixed-variant uppercase tracking-widest">
                    Teacher
                  </th>
                  <th className="px-xl py-md font-label-sm text-label-sm text-on-tertiary-fixed-variant uppercase tracking-widest">
                    Mid-Term Grade
                  </th>
                  <th className="px-xl py-md font-label-sm text-label-sm text-on-tertiary-fixed-variant uppercase tracking-widest">
                    Attendance
                  </th>
                  <th className="px-xl py-md font-label-sm text-label-sm text-on-tertiary-fixed-variant uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {performance.map((item, idx) => (
                  <tr key={idx} className="hover:bg-tertiary-fixed hover:bg-opacity-20 transition-all">
                    <td className="px-xl py-lg font-label-md text-label-md text-on-surface">{item.subject}</td>
                    <td className="px-xl py-lg font-body-sm text-body-sm text-secondary">{item.teacher}</td>
                    <td className="px-xl py-lg font-headline-sm text-headline-sm text-primary">{item.grade}</td>
                    <td className="px-xl py-lg font-body-sm text-body-sm text-secondary">{item.attendance}</td>
                    <td className="px-xl py-lg">
                      <Badge className={item.statusColor}>{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
