import { useState } from 'react';
import { Card, CardHeader, CardContent, Button } from '../../components/ui';
import { BookOpen, Users, FileText, AlertCircle, Plus, MessageSquare, Calendar } from 'lucide-react';

export default function TeacherDashboard() {
  const [announcements, setAnnouncements] = useState([
    { id: 1, date: 'Today 10:30 AM', title: 'Class: Grade 10 Mathematics', students: 28 },
    { id: 2, date: 'Today 1:00 PM', title: 'Class: Grade 11 Mathematics', students: 26 },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Grade Mathematics Quiz - Grade 10', dueDate: 'Today', priority: 'High' },
    { id: 2, title: 'Prepare Lesson Plan - Calculus', dueDate: 'Tomorrow', priority: 'Medium' },
    { id: 3, title: 'Review Student Projects', dueDate: 'Tomorrow', priority: 'Medium' },
    { id: 4, title: 'Update Attendance Records', dueDate: 'Today', priority: 'High' },
  ]);

  const [classes, setClasses] = useState([
    { id: 1, name: 'Grade 10 Mathematics - Section A', time: 'MWF 9:00 - 10:30 AM', students: 28 },
    { id: 2, name: 'Grade 11 Mathematics - Section B', time: 'MWF 10:45 - 12:15 PM', students: 26 },
    { id: 3, name: 'Grade 12 Calculus - Advanced', time: 'TTh 1:00 - 2:30 PM', students: 24 },
    { id: 4, name: 'Mathematics Tutoring - Optional', time: 'Wed 3:00 - 4:00 PM', students: 12 },
  ]);

  return (
    <div className="space-y-xl">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary">Good Morning, Dr. Jenkins</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">You have {classes.length} classes and {tasks.length} pending tasks for today.</p>
        </div>
        <Button className="flex items-center gap-sm">
          <Plus size={20} /> New Announcement
        </Button>
      </section>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant uppercase">Active Classes</p>
              <p className="font-headline-lg text-headline-lg text-primary mt-md">{classes.length}</p>
              <p className="text-label-sm text-on-surface-variant mt-sm">All active today</p>
            </div>
            <BookOpen size={24} className="text-primary opacity-40" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant uppercase">Total Students</p>
              <p className="font-headline-lg text-headline-lg text-primary mt-md">90</p>
              <p className="text-label-sm text-on-surface-variant mt-sm">Across all classes</p>
            </div>
            <Users size={24} className="text-primary opacity-40" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant uppercase">Pending Tasks</p>
              <p className="font-headline-lg text-headline-lg text-primary mt-md">{tasks.length}</p>
              <p className="text-label-sm text-on-surface-variant mt-sm">Due soon</p>
            </div>
            <FileText size={24} className="text-primary opacity-40" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant uppercase">Avg Class Size</p>
              <p className="font-headline-lg text-headline-lg text-primary mt-md">26</p>
              <p className="text-label-sm text-on-surface-variant mt-sm">Students per class</p>
            </div>
            <Users size={24} className="text-primary opacity-40" />
          </div>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-lg">
        {/* Left Column - Classes & Tasks */}
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
                      <div className="flex items-center gap-sm mt-xs text-label-sm text-on-surface-variant">
                        <Calendar size={14} />
                        <span>{cls.time}</span>
                        <span>•</span>
                        <span>{cls.students} students</span>
                      </div>
                    </div>
                    <button className="px-md py-sm bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-all">
                      View Class
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader title="Pending Tasks" />
            <CardContent>
              <div className="space-y-md">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-start justify-between pb-md border-b border-surface-variant last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-label-md text-on-surface">{task.title}</p>
                      <p className="text-label-sm text-on-surface-variant mt-xs">Due: {task.dueDate}</p>
                    </div>
                    <span className={`px-sm py-1 rounded-lg text-label-sm font-bold whitespace-nowrap ml-md ${
                      task.priority === 'High'
                        ? 'bg-error/10 text-error'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Announcements */}
        <div className="col-span-12 lg:col-span-4 space-y-lg">
          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <div className="space-y-sm">
                <button className="w-full bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:opacity-90 transition-all flex items-center gap-sm">
                  <FileText size={18} /> Grade Assignment
                </button>
                <button className="w-full bg-secondary text-on-secondary px-lg py-sm rounded-lg font-label-md hover:opacity-90 transition-all flex items-center gap-sm">
                  <Calendar size={18} /> Mark Attendance
                </button>
                <button className="w-full bg-tertiary text-on-tertiary px-lg py-sm rounded-lg font-label-md hover:opacity-90 transition-all flex items-center gap-sm">
                  <MessageSquare size={18} /> Message Students
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader title="Recent Announcements" />
            <CardContent>
              <div className="space-y-md">
                {announcements.map((ann) => (
                  <div key={ann.id} className="pb-md border-b border-surface-variant last:border-0 last:pb-0">
                    <p className="font-label-md text-on-surface">{ann.title}</p>
                    <div className="flex items-center gap-sm mt-xs text-label-sm text-on-surface-variant">
                      <span>{ann.date}</span>
                      <span>•</span>
                      <span>{ann.students} notified</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Messages */}
          <Card className="border-l-4 border-warning bg-warning/5">
            <div className="flex gap-md">
              <AlertCircle size={20} className="text-warning flex-shrink-0 mt-xs" />
              <div>
                <p className="font-label-md text-on-surface">End of Term Approaching</p>
                <p className="text-label-sm text-on-surface-variant mt-xs">Final grades must be submitted by June 30, 2026</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
