import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge } from '../../components/ui';
import { Download, TrendingUp, Award, MessageCircle } from 'lucide-react';

export default function ParentGrades() {
  const [selectedTerm, setSelectedTerm] = useState('Fall 2023');

  const [subjects] = useState([
    {
      name: 'Mathematics (Calculus)',
      icon: '📐',
      classAvg: '82%',
      assessment: 94,
      finalGrade: 'A',
      status: 'Distinction',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      name: 'Physics (Advanced)',
      icon: '🔬',
      classAvg: '78%',
      assessment: 88,
      finalGrade: 'A-',
      status: 'Honors',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      name: 'English Literature',
      icon: '📚',
      classAvg: '85%',
      assessment: 92,
      finalGrade: 'A',
      status: 'Distinction',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      name: 'Modern World History',
      icon: '🏛️',
      classAvg: '75%',
      assessment: 82,
      finalGrade: 'B+',
      status: 'Consistent',
      statusColor: 'bg-blue-100 text-blue-800'
    }
  ]);

  const [feedback] = useState([
    {
      subject: 'Mathematics (Calculus)',
      teacher: 'Dr. Aris Thorne',
      comment: '"Marcus shows great aptitude for derivative analysis. His homework consistency is commendable."',
      avatar: '👨‍🏫'
    },
    {
      subject: 'English Literature',
      teacher: 'Mrs. Elena Vance',
      comment: '"Excellent essay on \'The Great Gatsby\'. Depth of analysis has significantly improved this term."',
      avatar: '👩‍🏫'
    }
  ]);

  const gpaData = [
    { grade: 'Grade 8', percentage: 60 },
    { grade: 'Grade 9', percentage: 75 },
    { grade: 'Grade 10', percentage: 82 },
    { grade: 'Grade 11', percentage: 92 }
  ];

  return (
    <div className="space-y-gutter">
      {/* Page Header with Student Info */}
      <div className="flex items-center justify-between mb-xl">
        <div className="flex items-center gap-md">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-xl">
            👤
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary">Marcus Chen</h2>
            <p className="font-label-sm text-label-sm text-secondary">Grade 11 • Section B</p>
          </div>
        </div>
        <div className="flex items-center gap-lg">
          <button className="flex items-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all">
            <Download size={18} /> Download Report
          </button>
          <div className="flex items-center gap-md text-secondary">
            <button className="hover:bg-surface-container-low p-xs rounded-full transition-colors">🔔</button>
            <button className="hover:bg-surface-container-low p-xs rounded-full transition-colors">⚙️</button>
            <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed text-xs font-bold">
              PC
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Overall GPA Card */}
        <Card className="col-span-3 h-40 flex flex-col justify-between">
          <CardContent className="flex justify-between items-start flex-grow flex-col">
            <div className="flex justify-between w-full">
              <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">Overall GPA</span>
              <TrendingUp size={20} className="text-primary" />
            </div>
            <div className="mt-auto">
              <div className="font-headline-lg text-headline-lg text-primary">3.88</div>
              <p className="text-label-sm text-on-secondary-container">+0.12 from last term</p>
            </div>
          </CardContent>
        </Card>

        {/* Rank Card */}
        <Card className="col-span-3 h-40 flex flex-col justify-between">
          <CardContent className="flex justify-between items-start flex-grow flex-col">
            <div className="flex justify-between w-full">
              <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">Rank</span>
              <Award size={20} className="text-primary" />
            </div>
            <div className="mt-auto">
              <div className="font-headline-lg text-headline-lg text-primary">12 / 180</div>
              <p className="text-label-sm text-secondary">Top 7% of Class</p>
            </div>
          </CardContent>
        </Card>

        {/* Next Exam Card */}
        <Card className="col-span-6 h-40 bg-primary-container text-on-primary flex flex-col justify-between relative overflow-hidden">
          <CardContent className="relative z-10">
            <h3 className="font-headline-sm text-headline-sm text-on-primary-container mb-xs">Next Major Exam</h3>
            <p className="font-body-lg text-body-lg text-white font-bold">Advanced Physics Lab</p>
            <p className="font-label-md text-label-md opacity-80 mt-sm">Tuesday, Oct 24 • 09:00 AM</p>
          </CardContent>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-9xl">🔬</div>
        </Card>

        {/* GPA Trend Chart */}
        <Card className="col-span-8">
          <CardHeader
            title="GPA Trend Over Time"
            action={
              <div className="flex gap-sm">
                <button className="px-md py-xs bg-surface-container-high rounded-full font-label-sm text-label-sm text-secondary hover:bg-surface-container transition-colors">
                  Quarterly
                </button>
                <button className="px-md py-xs bg-primary text-on-primary rounded-full font-label-sm text-label-sm hover:opacity-90 transition-colors">
                  Yearly
                </button>
              </div>
            }
          />
          <CardContent>
            <div className="h-60 w-full flex items-end gap-lg px-md relative">
              {/* Grid Lines */}
              <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between opacity-10 pointer-events-none">
                <div className="border-t border-on-surface"></div>
                <div className="border-t border-on-surface"></div>
                <div className="border-t border-on-surface"></div>
                <div className="border-t border-on-surface"></div>
              </div>

              {/* Bars */}
              {gpaData.map((item, idx) => (
                <div key={idx} className="flex-grow flex flex-col items-center gap-sm">
                  <div className="w-full relative group cursor-pointer">
                    <div
                      className={`rounded-t-lg transition-all ${
                        idx === gpaData.length - 1 ? 'bg-primary' : 'bg-primary-fixed-dim'
                      } group-hover:brightness-110`}
                      style={{ height: `${(item.percentage / 100) * 200}px` }}
                      title={`${item.grade}: ${item.percentage}%`}
                    />
                  </div>
                  <span className={`text-label-sm ${idx === gpaData.length - 1 ? 'text-primary font-bold' : 'text-secondary'}`}>
                    {item.grade}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Teacher Feedback */}
        <Card className="col-span-4">
          <CardHeader title="Recent Feedback" action={<a className="text-primary text-label-sm font-bold hover:underline cursor-pointer">View All</a>} />
          <CardContent className="space-y-lg">
            {feedback.map((item, idx) => (
              <div key={idx} className={`pb-lg ${idx < feedback.length - 1 ? 'border-b border-surface-container-high' : ''}`}>
                <div className="flex gap-md">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center flex-shrink-0 text-lg">
                    {item.avatar}
                  </div>
                  <div className="flex-grow">
                    <p className="font-label-md text-label-md text-primary">{item.subject}</p>
                    <p className="font-body-sm text-body-sm text-secondary mt-xs italic">{item.comment}</p>
                    <p className="text-xs uppercase tracking-tighter text-outline mt-sm font-bold">— {item.teacher}</p>
                  </div>
                  <button className="text-primary hover:bg-surface-container-high p-xs rounded-full transition-colors flex-shrink-0">
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Current Term Grades Table */}
        <Card className="col-span-12">
          <CardHeader
            title="Current Term Grades"
            action={
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="bg-surface border border-outline rounded-lg text-label-md px-md py-xs focus:ring-1 focus:ring-primary outline-none"
              >
                <option>Fall 2023</option>
                <option>Spring 2023</option>
                <option>Summer 2023</option>
              </select>
            }
          />
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-xl py-md font-label-sm text-label-sm uppercase tracking-widest text-secondary">Subject</th>
                    <th className="px-xl py-md font-label-sm text-label-sm uppercase tracking-widest text-secondary">Class Avg</th>
                    <th className="px-xl py-md font-label-sm text-label-sm uppercase tracking-widest text-secondary">Assessment</th>
                    <th className="px-xl py-md font-label-sm text-label-sm uppercase tracking-widest text-secondary">Final Grade</th>
                    <th className="px-xl py-md font-label-sm text-label-sm uppercase tracking-widest text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high">
                  {subjects.map((subject, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-tertiary-fixed hover:bg-opacity-10 transition-colors ${idx % 2 === 1 ? 'bg-tertiary/5' : ''}`}
                    >
                      <td className="px-xl py-lg">
                        <div className="flex items-center gap-md">
                          <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-lg">
                            {subject.icon}
                          </div>
                          <span className="font-body-md text-body-md text-primary font-semibold">{subject.name}</span>
                        </div>
                      </td>
                      <td className="px-xl py-lg text-secondary">{subject.classAvg}</td>
                      <td className="px-xl py-lg">
                        <div className="w-32 h-2 bg-surface-container rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all" style={{ width: `${subject.assessment}%` }} />
                        </div>
                      </td>
                      <td className="px-xl py-lg font-headline-sm text-headline-sm text-primary">{subject.finalGrade}</td>
                      <td className="px-xl py-lg">
                        <Badge className={subject.statusColor}>{subject.status}</Badge>
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
