import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Button } from '../../components/ui';
import { TrendingUp, Download } from 'lucide-react';

export default function StudentGrades() {
  const [subjects] = useState([
    { name: 'Advanced Mathematics', teacher: 'Dr. Elena Rodriguez', grade: 'A', percentage: 92, trend: 'up' },
    { name: 'English Literature', teacher: 'Ms. Sarah Jenkins', grade: 'A', percentage: 90, trend: 'stable' },
    { name: 'Physics', teacher: 'Prof. James Chen', grade: 'B+', percentage: 87, trend: 'up' },
    { name: 'Chemistry', teacher: 'Dr. Michael Torres', grade: 'A-', percentage: 88, trend: 'up' },
    { name: 'History', teacher: 'Mr. William Foster', grade: 'A', percentage: 91, trend: 'stable' },
    { name: 'Physical Education', teacher: 'Coach Maria Santos', grade: 'A', percentage: 95, trend: 'up' },
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
          <h1 className="font-headline-xl text-headline-xl text-primary">Your Grades</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Current semester performance overview</p>
        </div>
        <Button className="flex items-center gap-sm">
          <Download size={18} /> Download Report Card
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
          <p className="font-label-md text-on-surface-variant uppercase mb-md">Honor Roll Status</p>
          <p className="font-headline-lg text-headline-lg text-primary">Distinguished</p>
          <p className="text-label-sm text-on-surface-variant mt-sm">Top 5% of class</p>
        </Card>
        <Card>
          <p className="font-label-md text-on-surface-variant uppercase mb-md">Class Rank</p>
          <p className="font-headline-lg text-headline-lg text-primary">4th / 180</p>
          <p className="text-label-sm text-on-surface-variant mt-sm">Grade 10-A section</p>
        </Card>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader title="Subject Grades" />
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Subject</TableHeader>
                  <TableHeader>Teacher</TableHeader>
                  <TableHeader>Grade</TableHeader>
                  <TableHeader align="right">Percentage</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjects.map((subject, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <p className="font-label-md text-on-surface">{subject.name}</p>
                    </TableCell>
                    <TableCell>{subject.teacher}</TableCell>
                    <TableCell>
                      <Badge variant={getGradeColor(subject.grade)}>{subject.grade}</Badge>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-sm">
                        <div className="w-20">
                          <div className="h-2 rounded-full bg-surface-variant overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${subject.percentage}%` }} />
                          </div>
                        </div>
                        <span className="font-label-md text-on-surface min-w-[40px] text-right">{subject.percentage}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Analysis */}
      <Card>
        <CardHeader title="Performance Analysis" />
        <CardContent>
          <div className="space-y-md">
            <div>
              <p className="font-label-md text-on-surface-variant uppercase mb-sm">Strengths</p>
              <p className="text-body-md text-on-surface">You excel in Mathematics (92%) and Physics (87%) with consistent improvement. Excellent attendance and participation in all classes.</p>
            </div>
            <div className="border-t border-surface-variant pt-md">
              <p className="font-label-md text-on-surface-variant uppercase mb-sm">Areas for Focus</p>
              <p className="text-body-md text-on-surface">Chemistry shows slight difficulty (88%). Consider additional practice problems and tutoring sessions if needed.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
