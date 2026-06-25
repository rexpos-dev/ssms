import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Button } from '../../components/ui';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';

export default function ParentGrades() {
  const [subjects] = useState([
    { name: 'Advanced Mathematics', teacher: 'Dr. Elena Rodriguez', current: 'A', percentage: 92, previous: 'A', trend: 'up' },
    { name: 'English Literature', teacher: 'Ms. Sarah Jenkins', current: 'A', percentage: 90, previous: 'A', trend: 'stable' },
    { name: 'Physics', teacher: 'Prof. James Chen', current: 'B+', percentage: 87, previous: 'B', trend: 'up' },
    { name: 'Chemistry', teacher: 'Dr. Michael Torres', current: 'A-', percentage: 88, previous: 'B+', trend: 'up' },
    { name: 'History', teacher: 'Mr. William Foster', current: 'A', percentage: 91, previous: 'A', trend: 'stable' },
    { name: 'Physical Education', teacher: 'Coach Maria Santos', current: 'A', percentage: 95, previous: 'A', trend: 'up' },
  ]);

  const getGradeColor = (grade) => {
    if (grade.includes('A')) return 'success';
    if (grade.includes('B')) return 'warning';
    return 'secondary';
  };

  return (
    <div className="space-y-lg">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary">Academic Performance</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Elena Sterling's grades and academic progress</p>
        </div>
        <Button className="flex items-center gap-sm">
          <Download size={18} /> Download Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <Card>
          <p className="font-label-md text-on-surface-variant uppercase mb-md">Current GPA</p>
          <p className="font-headline-lg text-headline-lg text-primary">3.92</p>
          <p className="text-label-sm text-green-600 mt-sm flex items-center gap-xs">
            <TrendingUp size={14} /> +0.15 from last semester
          </p>
        </Card>
        <Card>
          <p className="font-label-md text-on-surface-variant uppercase mb-md">Class Performance</p>
          <p className="font-headline-lg text-headline-lg text-primary">A- Average</p>
          <p className="text-label-sm text-on-surface-variant mt-sm">Top 5% of class</p>
        </Card>
        <Card>
          <p className="font-label-md text-on-surface-variant uppercase mb-md">Attendance</p>
          <p className="font-headline-lg text-headline-lg text-primary">98.5%</p>
          <p className="text-label-sm text-green-600 mt-sm">Excellent attendance</p>
        </Card>
      </div>

      {/* Detailed Grades Table */}
      <Card>
        <CardHeader title="Subject Grades" />
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Subject</TableHeader>
                  <TableHeader>Teacher</TableHeader>
                  <TableHeader>Current Grade</TableHeader>
                  <TableHeader>Percentage</TableHeader>
                  <TableHeader align="right">Change</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <p className="font-label-md text-on-surface">{subject.name}</p>
                    </TableCell>
                    <TableCell className="text-label-md">{subject.teacher}</TableCell>
                    <TableCell>
                      <Badge variant={getGradeColor(subject.current)}>{subject.current}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-sm">
                        <div className="w-20">
                          <div className="h-2 rounded-full bg-surface-variant overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${subject.percentage}%` }} />
                          </div>
                        </div>
                        <span className="font-label-md text-on-surface min-w-[40px]">{subject.percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center gap-sm justify-end">
                        {subject.trend === 'up' && <TrendingUp size={16} className="text-green-600" />}
                        {subject.trend === 'down' && <TrendingDown size={16} className="text-error" />}
                        <span className="text-label-sm text-on-surface-variant">
                          {subject.previous} → {subject.current}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Section */}
      <Card>
        <CardHeader title="Performance Analysis" />
        <CardContent>
          <div className="space-y-md">
            <div>
              <p className="font-label-md text-on-surface-variant uppercase mb-sm">Strengths</p>
              <p className="text-body-md text-on-surface">Elena excels in Mathematics (92%) and Physics (87%) with consistent improvement. Excellent attendance and participation in all classes.</p>
            </div>
            <div className="border-t border-surface-variant pt-md">
              <p className="font-label-md text-on-surface-variant uppercase mb-sm">Areas for Focus</p>
              <p className="text-body-md text-on-surface">Chemistry shows slight difficulty (88%). Recommend additional practice problems and tutoring sessions if needed.</p>
            </div>
            <div className="border-t border-surface-variant pt-md">
              <p className="font-label-md text-on-surface-variant uppercase mb-sm">Recommendations</p>
              <ul className="list-disc list-inside space-y-sm text-body-md text-on-surface">
                <li>Continue current study routine - it's working well!</li>
                <li>Consider Chemistry tutoring for additional support</li>
                <li>Prepare early for upcoming mid-term exams</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
