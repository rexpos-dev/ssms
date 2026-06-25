import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Input, Button } from '../../components/ui';
import { Search, Download, Filter, Save, Check } from 'lucide-react';

export default function TeacherGrading() {
  const [selectedClass, setSelectedClass] = useState(1);
  const [searchStudent, setSearchStudent] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const classes = [
    { id: 1, name: 'Grade 10 Mathematics', pending: 15 },
    { id: 2, name: 'Grade 11 Mathematics', pending: 12 },
    { id: 3, name: 'Grade 12 Calculus', pending: 8 },
  ];

  const [grades, setGrades] = useState([
    { id: 1, name: 'Elena Sterling', assignment: 'Quiz 1', submittedDate: '2026-06-24', score: 92, feedback: 'Excellent work!' },
    { id: 2, name: 'Marcus Chen', assignment: 'Quiz 1', submittedDate: '2026-06-24', score: 88, feedback: 'Good effort' },
    { id: 3, name: 'Aria Thorne', assignment: 'Quiz 1', submittedDate: '2026-06-23', score: null, feedback: '' },
    { id: 4, name: 'Julian Ross', assignment: 'Quiz 1', submittedDate: '2026-06-22', score: 95, feedback: 'Outstanding!' },
  ]);

  const updateGrade = (id, field, value) => {
    setGrades(grades.map(g => g.id === id ? { ...g, [field]: field === 'score' ? Number(value) : value } : g));
  };

  const handleSave = () => {
    alert('Grades saved successfully!');
  };

  const currentClass = classes.find(c => c.id === selectedClass);
  const filtered = grades.filter(g => g.name.toLowerCase().includes(searchStudent.toLowerCase()));

  return (
    <div className="space-y-lg">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary">Grade Assignments</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Review and submit grades for your students</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-sm">
          <Save size={18} /> Save All Grades
        </Button>
      </div>

      {/* Class Selector */}
      <Card>
        <CardContent>
          <p className="font-label-md text-on-surface-variant uppercase mb-md">Select Class</p>
          <div className="flex flex-wrap gap-sm">
            {classes.map(cls => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={`px-lg py-sm rounded-lg font-label-md transition-colors ${
                  selectedClass === cls.id
                    ? 'bg-primary text-on-primary'
                    : 'border border-outline-variant text-on-surface hover:bg-surface-container'
                }`}
              >
                {cls.name} <span className="ml-sm bg-white/20 px-sm py-xs rounded text-xs">{cls.pending}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grading Table */}
      <Card>
        <CardHeader
          title={`${currentClass?.name} - Grading`}
          action={
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-sm px-md py-sm rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container transition-colors"
            >
              <Filter size={16} /> Filters
            </button>
          }
        />
        <CardContent>
          {showFilters && (
            <div className="mb-lg pb-lg border-b border-surface-variant">
              <div className="relative">
                <Search size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="text"
                  placeholder="Search student name..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="input-field w-full pl-xl"
                />
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Student Name</TableHeader>
                  <TableHeader>Assignment</TableHeader>
                  <TableHeader>Submitted</TableHeader>
                  <TableHeader>Score</TableHeader>
                  <TableHeader>Feedback</TableHeader>
                  <TableHeader align="right">Status</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map(student => (
                  <TableRow key={student.id}>
                    <TableCell className="font-label-md text-on-surface">{student.name}</TableCell>
                    <TableCell>{student.assignment}</TableCell>
                    <TableCell>{student.submittedDate}</TableCell>
                    <TableCell>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={student.score || ''}
                        onChange={(e) => updateGrade(student.id, 'score', e.target.value)}
                        className="input-field w-20 text-center"
                        placeholder="—"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        value={student.feedback}
                        onChange={(e) => updateGrade(student.id, 'feedback', e.target.value)}
                        className="input-field w-full"
                        placeholder="Add feedback..."
                      />
                    </TableCell>
                    <TableCell align="right">
                      {student.score !== null && <Badge variant="success"><Check size={14} /> Graded</Badge>}
                      {student.score === null && <Badge variant="warning">Pending</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-lg text-on-surface-variant">
              <p>No students match your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
