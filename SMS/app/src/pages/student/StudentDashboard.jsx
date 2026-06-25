import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge } from '../../components/ui';
import { BookOpen, FileText, TrendingUp, Clock, AlertCircle, Calendar } from 'lucide-react';

export default function StudentDashboard() {
  const [classes, setClasses] = useState([
    { id: 1, name: 'Advanced Mathematics', teacher: 'Dr. Elena Rodriguez', time: '10:00 AM', room: '201', upcoming: true },
    { id: 2, name: 'English Literature', teacher: 'Ms. Sarah Jenkins', time: '11:30 AM', room: '105', upcoming: true },
    { id: 3, name: 'Physics Lab', teacher: 'Prof. James Chen', time: '2:00 PM', room: 'Lab 3', upcoming: false },
  ]);

  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Algebra Problem Set', subject: 'Mathematics', dueDate: '2026-06-28', status: 'In Progress', progress: 65 },
    { id: 2, title: 'Literature Essay', subject: 'English', dueDate: '2026-06-30', status: 'Not Started', progress: 0 },
    { id: 3, title: 'Physics Lab Report', subject: 'Physics', dueDate: '2026-06-27', status: 'Submitted', progress: 100 },
  ]);

  const [events, setEvents] = useState([
    { id: 1, title: 'Mid-Term Exam', date: '2026-07-02', icon: '📝' },
    { id: 2, title: 'Project Submission', date: '2026-07-10', icon: '📋' },
    { id: 3, title: 'Class Field Trip', date: '2026-07-15', icon: '🚌' },
  ]);

  return (
    <div className="space-y-xl">
      {/* Header */}
      <section>
        <h1 className="font-headline-xl text-headline-xl text-primary">Welcome back, Elena Sterling!</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Grade 10-A | Your academic progress at a glance</p>
      </section>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant uppercase">Current GPA</p>
              <p className="font-headline-lg text-headline-lg text-primary mt-md">3.92</p>
              <p className="text-label-sm text-on-surface-variant mt-sm">Last updated today</p>
            </div>
            <BookOpen size={24} className="text-primary opacity-40" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant uppercase">Attendance</p>
              <p className="font-headline-lg text-headline-lg text-primary mt-md">98.5%</p>
              <p className="text-label-sm text-on-surface-variant mt-sm">Perfect for this term</p>
            </div>
            <TrendingUp size={24} className="text-primary opacity-40" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant uppercase">Assignments</p>
              <p className="font-headline-lg text-headline-lg text-primary mt-md">12/15</p>
              <p className="text-label-sm text-on-surface-variant mt-sm">3 pending submissions</p>
            </div>
            <FileText size={24} className="text-primary opacity-40" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant uppercase">Classes Enrolled</p>
              <p className="font-headline-lg text-headline-lg text-primary mt-md">6</p>
              <p className="text-label-sm text-on-surface-variant mt-sm">All courses active</p>
            </div>
            <Calendar size={24} className="text-primary opacity-40" />
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-lg">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-lg">
          {/* Today's Classes */}
          <Card>
            <CardHeader title="Today's Classes" />
            <CardContent>
              <div className="space-y-md">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-start justify-between pb-md border-b border-surface-variant last:border-0 last:pb-0">
                    <div>
                      <p className="font-label-md text-on-surface">{cls.name}</p>
                      <p className="text-label-sm text-on-surface-variant mt-xs">{cls.teacher}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-label-md text-primary">{cls.time}</p>
                      <p className="text-label-sm text-on-surface-variant">Room {cls.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card>
            <CardHeader title="Your Assignments" />
            <CardContent>
              <div className="space-y-md">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="pb-md border-b border-surface-variant last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-sm">
                      <div>
                        <p className="font-label-md text-on-surface">{assignment.title}</p>
                        <p className="text-label-sm text-on-surface-variant mt-xs">Due: {assignment.dueDate}</p>
                      </div>
                      <Badge variant={assignment.status === 'Submitted' ? 'success' : assignment.status === 'In Progress' ? 'primary' : 'secondary'}>
                        {assignment.status}
                      </Badge>
                    </div>
                    <div className="h-2 rounded-full bg-surface-variant overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${assignment.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-lg">
          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <div className="space-y-sm">
                <button className="w-full bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:opacity-90 transition-colors text-left">
                  📧 Message Teacher
                </button>
                <button className="w-full bg-secondary text-on-secondary px-lg py-sm rounded-lg font-label-md hover:opacity-90 transition-colors text-left">
                  📚 Library Resources
                </button>
                <button className="w-full bg-tertiary text-on-tertiary px-lg py-sm rounded-lg font-label-md hover:opacity-90 transition-colors text-left">
                  📋 View Report Card
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader title="Upcoming Events" />
            <CardContent>
              <div className="space-y-md">
                {events.map((event) => (
                  <div key={event.id} className="flex gap-md pb-md border-b border-surface-variant last:border-0 last:pb-0">
                    <span className="text-2xl flex-shrink-0">{event.icon}</span>
                    <div>
                      <p className="font-label-md text-on-surface">{event.title}</p>
                      <p className="text-label-sm text-on-surface-variant">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="border-l-4 border-warning bg-warning/5">
            <div className="flex gap-md">
              <AlertCircle size={20} className="text-warning flex-shrink-0 mt-xs" />
              <div>
                <p className="font-label-md text-on-surface">Important Notice</p>
                <p className="text-label-sm text-on-surface-variant mt-xs">School fees payment due by June 30, 2026</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
