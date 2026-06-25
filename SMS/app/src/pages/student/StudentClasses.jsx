import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from '../../components/ui';
import { Users, Clock, MapPin, BookOpen } from 'lucide-react';

export default function StudentClasses() {
  const [selectedClass, setSelectedClass] = useState(null);

  const [classes] = useState([
    {
      id: 1,
      name: 'Advanced Mathematics',
      teacher: 'Dr. Elena Rodriguez',
      schedule: 'MWF 10:00 AM - 11:30 AM',
      room: '201',
      students: 28,
      credits: 3,
      description: 'Calculus and advanced algebraic functions',
      color: 'bg-blue-100',
    },
    {
      id: 2,
      name: 'English Literature',
      teacher: 'Ms. Sarah Jenkins',
      schedule: 'TTh 11:30 AM - 1:00 PM',
      room: '105',
      students: 25,
      credits: 3,
      description: 'Classic and contemporary literature analysis',
      color: 'bg-purple-100',
    },
    {
      id: 3,
      name: 'Physics Lab',
      teacher: 'Prof. James Chen',
      schedule: 'TTh 2:00 PM - 4:00 PM',
      room: 'Lab 3',
      students: 20,
      credits: 2,
      description: 'Experimental physics and lab techniques',
      color: 'bg-green-100',
    },
    {
      id: 4,
      name: 'Chemistry',
      teacher: 'Dr. Michael Torres',
      schedule: 'MWF 1:00 PM - 2:30 PM',
      room: '215',
      students: 30,
      credits: 3,
      description: 'Organic and inorganic chemistry principles',
      color: 'bg-orange-100',
    },
    {
      id: 5,
      name: 'World History',
      teacher: 'Mr. William Foster',
      schedule: 'TTh 9:00 AM - 10:30 AM',
      room: '110',
      students: 32,
      credits: 3,
      description: 'History from Renaissance to modern era',
      color: 'bg-red-100',
    },
    {
      id: 6,
      name: 'Physical Education',
      teacher: 'Coach Maria Santos',
      schedule: 'MWF 3:30 PM - 4:30 PM',
      room: 'Gymnasium',
      students: 35,
      credits: 1,
      description: 'Fitness, sports, and wellness activities',
      color: 'bg-yellow-100',
    },
  ]);

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-primary">Your Classes</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">6 courses enrolled for this semester</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {classes.map((cls) => (
          <Card key={cls.id} className={`cursor-pointer transition-all ${selectedClass?.id === cls.id ? 'ring-2 ring-primary' : ''}`}>
            <CardContent>
              <div className="flex justify-between items-start mb-md">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary">{cls.name}</h3>
                  <p className="text-label-md text-on-surface-variant mt-xs">{cls.teacher}</p>
                </div>
                <Badge variant="primary">{cls.credits} Credits</Badge>
              </div>

              <p className="text-body-sm text-on-surface mb-lg">{cls.description}</p>

              <div className="space-y-sm my-lg text-label-md text-on-surface-variant">
                <div className="flex items-center gap-md">
                  <Clock size={16} />
                  <span>{cls.schedule}</span>
                </div>
                <div className="flex items-center gap-md">
                  <MapPin size={16} />
                  <span>{cls.room}</span>
                </div>
                <div className="flex items-center gap-md">
                  <Users size={16} />
                  <span>{cls.students} students enrolled</span>
                </div>
              </div>

              <div className="flex gap-sm">
                <Button onClick={() => setSelectedClass(cls)} variant={selectedClass?.id === cls.id ? 'primary' : 'secondary'} className="flex-1">
                  View Details
                </Button>
                <button className="flex-1 px-lg py-sm rounded-lg border border-outline-variant text-on-surface font-label-md hover:bg-surface-container transition-colors">
                  📧 Message Teacher
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedClass && (
        <Card>
          <CardHeader
            title={selectedClass.name}
            action={<button onClick={() => setSelectedClass(null)} className="text-primary font-label-md hover:underline">Close</button>}
          />
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
              <div>
                <p className="font-label-md text-on-surface-variant uppercase mb-sm">Instructor</p>
                <p className="font-headline-sm text-primary">{selectedClass.teacher}</p>
              </div>
              <div>
                <p className="font-label-md text-on-surface-variant uppercase mb-sm">Schedule</p>
                <p className="font-headline-sm text-primary text-sm">{selectedClass.schedule}</p>
              </div>
              <div>
                <p className="font-label-md text-on-surface-variant uppercase mb-sm">Location</p>
                <p className="font-headline-sm text-primary">{selectedClass.room}</p>
              </div>
              <div>
                <p className="font-label-md text-on-surface-variant uppercase mb-sm">Enrollment</p>
                <p className="font-headline-sm text-primary">{selectedClass.students} Students</p>
              </div>
            </div>
            <p className="mt-lg text-body-md border-t border-surface-variant pt-lg">{selectedClass.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
