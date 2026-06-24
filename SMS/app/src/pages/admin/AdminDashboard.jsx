import { Card, CardHeader, CardContent, Table, TableHead, TableBody, TableRow, TableHeader, TableCell, Badge } from '../../components/ui';

const KPICard = ({ icon, title, value, change, positive }) => {
  return (
    <Card>
      <div className="flex justify-between items-start mb-md">
        <div className="p-sm bg-secondary-container rounded-lg text-lg">
          {icon}
        </div>
        <span className={`text-label-md text-[12px] px-sm py-1 rounded ${positive ? 'bg-green-100 text-green-800' : 'bg-error/10 text-error'}`}>
          {positive ? '↑' : '↓'} {change}
        </span>
      </div>
      <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{title}</p>
      <p className="font-headline-lg text-headline-lg text-primary mt-xs">{value}</p>
    </Card>
  );
};

export const AdminDashboard = () => {
  const students = [
    { id: 1, name: 'Elena Sterling', grade: '10-A', gpa: '3.98', status: 'Distinction' },
    { id: 2, name: 'Marcus Chen', grade: '11-B', gpa: '3.92', status: 'Distinction' },
    { id: 3, name: 'Aria Thorne', grade: '9-C', gpa: '3.88', status: 'Honors' },
    { id: 4, name: 'Julian Ross', grade: '12-A', gpa: '3.85', status: 'Honors' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-end mb-xl">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-primary">Academic Overview</h2>
          <p className="font-body-lg text-body-lg text-secondary">A snapshot of Bridges Academy performance and vital metrics.</p>
        </div>
        <button className="bg-primary text-on-primary px-lg py-sm rounded-lg flex items-center gap-sm font-label-md hover:bg-primary-container transition-colors">
          ➕ Register New Student
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        <KPICard icon="👥" title="Total Students" value="42,850" change="4.2%" positive={true} />
        <KPICard icon="🏫" title="Faculty Count" value="52" change="Stable" positive={true} />
        <KPICard icon="💰" title="Monthly Revenue" value="₱42,850" change="12.5%" positive={true} />
        <KPICard icon="📊" title="Avg. Attendance" value="52,450" change="0.8%" positive={false} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-lg">
        {/* Left Column - Tables */}
        <div className="col-span-12 lg:col-span-8 space-y-lg">
          {/* Top Performing Students */}
          <Card>
            <CardHeader title="Top Performing Students" action={<button className="text-primary font-label-md hover:underline">View All</button>} />
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Student Name</TableHeader>
                    <TableHeader>Grade/Section</TableHeader>
                    <TableHeader>GPA</TableHeader>
                    <TableHeader align="right">Status</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>{student.gpa}</TableCell>
                      <TableCell align="right">
                        <Badge>{student.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader title="Recent Activity" />
            <CardContent>
              <div className="space-y-lg">
                <div className="flex gap-lg">
                  <div className="w-10 h-10 bg-surface rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
                    👤
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-body-md"><strong>New Student Registered</strong>: Elias Thorne has joined Physics.</p>
                      <span className="text-on-surface-variant text-label-sm">2h ago</span>
                    </div>
                    <p className="text-label-sm text-secondary mt-xs">Action by: Administrator J. Doe</p>
                  </div>
                </div>

                <div className="flex gap-lg">
                  <div className="w-10 h-10 bg-surface rounded-full border-2 border-secondary flex items-center justify-center flex-shrink-0">
                    💳
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-body-md"><strong>Payroll Processed</strong>: Faculty salaries disbursed.</p>
                      <span className="text-on-surface-variant text-label-sm">5h ago</span>
                    </div>
                    <p className="text-label-sm text-secondary mt-xs">Automatic system task successful.</p>
                  </div>
                </div>

                <div className="flex gap-lg">
                  <div className="w-10 h-10 bg-surface rounded-full border-2 border-error flex items-center justify-center flex-shrink-0">
                    ⚠️
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-body-md"><strong>Alert</strong>: Low attendance reported for Grade 10-B.</p>
                      <span className="text-on-surface-variant text-label-sm">8h ago</span>
                    </div>
                    <p className="text-label-sm text-secondary mt-xs">Immediate review recommended.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-lg">
          {/* System Health */}
          <div className="bg-primary text-on-primary rounded-xl p-xl">
            <div className="flex justify-between items-center mb-xl">
              <h3 className="font-headline-sm">System Health</h3>
              <span className="flex items-center gap-xs px-sm py-1 bg-green-500/20 text-green-300 rounded-full text-[10px] font-bold">
                ● Live
              </span>
            </div>
            <div className="space-y-lg">
              <div>
                <div className="flex justify-between mb-xs">
                  <span className="text-primary-fixed-dim">Network Uptime</span>
                  <span>99.98%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div className="w-[99.98%] h-full bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-xs">
                  <span className="text-primary-fixed-dim">Database Latency</span>
                  <span>24ms</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div className="w-[20%] h-full bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Trends */}
          <Card>
            <CardHeader title="Enrollment Trends" />
            <CardContent>
              <div className="h-40 flex items-end gap-sm py-md">
                {[40, 65, 50, 85, 95, 20].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-surface-container-highest rounded-t hover:bg-primary transition-colors cursor-pointer"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-on-surface-variant font-bold mt-sm">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
              <p className="mt-lg font-body-sm text-secondary">Enrollments are up 14% from last year.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
