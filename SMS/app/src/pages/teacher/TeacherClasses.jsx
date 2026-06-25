import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from '../../components/ui';
import { Users, Calendar, MapPin, BookOpen, Edit2, BarChart3 } from 'lucide-react';

export default function TeacherClasses() {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: 'Grade 10 Mathematics',
      section: 'A',
      time: 'MWF 9:00 - 10:30 AM',
      room: '201',
      students: 28,
      subject: 'Mathematics',
      credits: 3,
      description: 'Algebra, geometry, and basic trigonometry',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Grade 11 Mathematics',
      section: 'B',
      time: 'MWF 10:45 - 12:15 PM',
      room: '215',
      students: 26,
      subject: 'Mathematics',
      credits: 3,
      description: 'Advanced algebra and pre-calculus',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Grade 12 Calculus',
      section: 'Advanced',
      time: 'TTh 1:00 - 2:30 PM',
      room: '305',
      students: 24,
      subject: 'Mathematics',
      credits: 4,
      description: 'Differential and integral calculus',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Mathematics Tutoring',
      section: 'Optional',
      time: 'Wed 3:00 - 4:00 PM',
      room: '201',
      students: 12,
      subject: 'Mathematics',
      credits: 1,
      description: 'Additional support for struggling students',
      status: 'Active',
    },
  ]);

  const [selectedClass, setSelectedClass] = useState(null);

  return (
    <div className="space-y-lg">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary">My Classes</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">{classes.length} active classes this semester</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {classes.map((cls) => (
          <Card key={cls.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent>
              <div className="flex justify-between items-start mb-md">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary">{cls.name}</h3>
                  <p className="text-label-md text-on-surface-variant mt-xs">Section {cls.section}</p>
                </div>
                <Badge variant="success">{cls.credits} Credits</Badge>
              </div>

              <p className="text-body-md text-on-surface-variant mb-lg">{cls.description}</p>

              <div className="space-y-sm my-lg text-label-md text-on-surface-variant">
                <div className="flex items-center gap-md">
                  <Calendar size={16} />
                  <span>{cls.time}</span>
                </div>
                <div className="flex items-center gap-md">
                  <MapPin size={16} />
                  <span>Room {cls.room}</span>
                </div>
                <div className="flex items-center gap-md">
                  <Users size={16} />
                  <span>{cls.students} students enrolled</span>
                </div>
              </div>

              <div className="border-t border-surface-variant pt-lg mt-lg flex gap-sm">
                <Button
                  onClick={() => setSelectedClass(cls)}
                  variant="primary"
                  className="flex-1 flex items-center justify-center gap-sm"
                >
                  <BarChart3 size={16} /> View Performance
                </Button>
                <button className="flex-1 px-lg py-sm rounded-lg border border-outline-variant text-on-surface font-label-md hover:bg-surface-container transition-colors flex items-center justify-center gap-sm">
                  <Edit2 size={16} /> Manage
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedClass && (
        <Card className="border-l-4 border-primary">
          <CardHeader
            title={selectedClass.name}
            action={<button onClick={() => setSelectedClass(null)} className="text-primary font-label-md hover:underline">Close</button>}
          />
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
              <div>
                <p className="font-label-md text-on-surface-variant uppercase mb-sm">Section</p>
                <p className="font-headline-md text-primary">{selectedClass.section}</p>
              </div>
              <div>
                <p className="font-label-md text-on-surface-variant uppercase mb-sm">Students</p>
                <p className="font-headline-md text-primary">{selectedClass.students}</p>
              </div>
              <div>
                <p className="font-label-md text-on-surface-variant uppercase mb-sm">Credits</p>
                <p className="font-headline-md text-primary">{selectedClass.credits}</p>
              </div>
              <div>
                <p className="font-label-md text-on-surface-variant uppercase mb-sm">Status</p>
                <Badge variant="success">{selectedClass.status}</Badge>
              </div>
            </div>
            <p className="mt-lg text-body-md text-on-surface border-t border-surface-variant pt-lg">{selectedClass.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
