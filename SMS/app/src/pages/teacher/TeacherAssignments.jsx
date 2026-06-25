import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Button, Input } from '../../components/ui';
import { Plus, Edit2, Trash2, FileText, Calendar } from 'lucide-react';

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([
    { id: 1, title: 'Algebra Problem Set Chapter 5', class: 'Grade 10 Math', dueDate: '2026-06-28', submissions: 24, total: 28, status: 'Active' },
    { id: 2, title: 'Literature Essay - Book Review', class: 'Grade 11 Math', dueDate: '2026-06-30', submissions: 18, total: 26, status: 'Active' },
    { id: 3, title: 'Physics Lab Report', class: 'Grade 12 Calculus', dueDate: '2026-06-27', submissions: 22, total: 24, status: 'Active' },
    { id: 4, title: 'Quiz 1 - Derivatives', class: 'Grade 12 Calculus', dueDate: '2026-06-25', submissions: 23, total: 24, status: 'Closed' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', class: '', dueDate: '' });

  const handleCreateAssignment = () => {
    if (newAssignment.title && newAssignment.class && newAssignment.dueDate) {
      setAssignments([...assignments, {
        id: Math.max(...assignments.map(a => a.id)) + 1,
        ...newAssignment,
        submissions: 0,
        total: 28,
        status: 'Active'
      }]);
      setNewAssignment({ title: '', class: '', dueDate: '' });
      setShowForm(false);
    }
  };

  const handleDeleteAssignment = (id) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-lg">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary">Assignments</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Create and manage assignments</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-sm">
          <Plus size={18} /> Create Assignment
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="border-l-4 border-primary">
          <CardHeader title="Create New Assignment" />
          <CardContent>
            <div className="space-y-lg">
              <Input
                label="Assignment Title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                placeholder="e.g., Chapter 5 Problem Set"
              />
              <div className="grid grid-cols-2 gap-lg">
                <select
                  value={newAssignment.class}
                  onChange={(e) => setNewAssignment({ ...newAssignment, class: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select Class</option>
                  <option>Grade 10 Mathematics</option>
                  <option>Grade 11 Mathematics</option>
                  <option>Grade 12 Calculus</option>
                </select>
                <Input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                />
              </div>
              <div className="flex gap-sm">
                <Button onClick={handleCreateAssignment}>Create</Button>
                <button onClick={() => setShowForm(false)} className="px-lg py-sm rounded-lg border border-outline-variant text-on-surface font-label-md hover:bg-surface-container">
                  Cancel
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      <div className="space-y-md">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-md">
                    <FileText size={20} className="text-primary" />
                    <div>
                      <h3 className="font-headline-sm text-primary">{assignment.title}</h3>
                      <p className="text-label-md text-on-surface-variant mt-xs">{assignment.class}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-md mt-md text-label-md text-on-surface-variant">
                    <Calendar size={16} />
                    <span>Due: {assignment.dueDate}</span>
                    <span>•</span>
                    <span>{assignment.submissions}/{assignment.total} submissions</span>
                  </div>
                </div>
                <div className="flex items-center gap-sm ml-lg">
                  <Badge variant={assignment.status === 'Active' ? 'primary' : 'secondary'}>
                    {assignment.status}
                  </Badge>
                  <button className="p-sm text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDeleteAssignment(assignment.id)} className="p-sm text-on-surface-variant hover:text-error hover:bg-error/10 rounded transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-md">
                <div className="h-2 rounded-full bg-surface-variant overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}
                  />
                </div>
                <p className="text-label-sm text-on-surface-variant mt-xs">{Math.round((assignment.submissions / assignment.total) * 100)}% submissions</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
