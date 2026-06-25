import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from '../../components/ui';
import { Calendar, Users, Zap, BookOpen } from 'lucide-react';

export default function ParentSchoolLife() {
  const [campaigns] = useState([
    {
      title: 'Summer Internship Fair: Connecting Bridges Students With Industry Leaders',
      description: 'Join over 50 global companies on campus next Thursday to explore career paths and secure your future',
      image: '🏢',
      action: 'Read More'
    }
  ]);

  const [organizations] = useState([
    { name: 'Debate Club', icon: '🎤', tag: 'Debate', members: 'Member', meetTime: 'Meets Tue and Fri' },
    { name: 'Robotics Society', icon: '🤖', tag: 'Tech', members: 'Member', meetTime: 'Meet on the 1st and...' },
    { name: 'Drama Society', icon: '🎭', tag: 'Arts', members: 'Interested', meetTime: 'Meets monthly' },
    { name: 'Fine Arts Guild', icon: '🎨', tag: 'Arts', members: 'Interested', meetTime: 'Meets weekly' },
  ]);

  const [upcomingEvents] = useState([
    { date: 'Oct 27', title: 'Math Olympiad', time: '9:00 AM', location: 'Hall B' },
    { date: 'Oct 28', title: 'Science Fair', time: '1:00 PM', location: 'Sports Complex' },
    { date: 'Oct 29', title: 'Inter-House Football', time: '2:30 PM', location: 'Main Field' },
    { date: 'Oct 30', title: 'Guest Lecture: AI in Healthcare', time: '11:00 AM', location: 'Auditorium' },
  ]);

  const [achievements] = useState([
    { name: 'Elena Rodriguez', achievement: 'Elena won Honorable Mention in the Young Scientist Award 2024', image: '🏅' },
    { name: 'Marcus Chen', achievement: 'Mark published in International Design Journal for his award-winning design', image: '📰' },
    { name: 'Sarah Tildon', achievement: 'Sarah selected for the United Nations Youth Summit 2024', image: '🌍' },
  ]);

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-primary">School Life</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Stay updated with school activities and achievements</p>
      </div>

      {/* Featured Campaign */}
      {campaigns.map((campaign, idx) => (
        <Card key={idx} className="overflow-hidden">
          <CardContent>
            <div className="flex flex-col md:flex-row gap-lg items-start">
              <div className="text-6xl md:flex-shrink-0">{campaign.image}</div>
              <div className="flex-1">
                <h3 className="font-headline-md text-primary mb-sm">{campaign.title}</h3>
                <p className="text-body-md text-on-surface mb-lg">{campaign.description}</p>
                <Button>{campaign.action}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Student Organizations */}
      <Card>
        <CardHeader title="Student Organizations" action={<button className="text-primary font-label-md hover:underline">View All</button>} />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {organizations.map((org, idx) => (
              <div key={idx} className="border border-outline-variant rounded-lg p-lg">
                <div className="flex items-start justify-between mb-md">
                  <div>
                    <p className="text-2xl mb-sm">{org.icon}</p>
                    <h4 className="font-headline-sm text-primary">{org.name}</h4>
                    <Badge variant="primary" className="mt-sm">{org.tag}</Badge>
                  </div>
                </div>
                <p className="text-label-md text-on-surface-variant mb-sm">{org.members}</p>
                <p className="text-label-sm text-on-surface-variant mb-md">{org.meetTime}</p>
                <Button className="w-full" variant="secondary">Join Club</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader title="Upcoming Events" action={<span className="text-label-sm text-on-surface-variant">📅 Calendar</span>} />
        <CardContent>
          <div className="space-y-md">
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="flex items-start gap-md pb-md border-b border-surface-variant last:border-0 last:pb-0">
                <div className="flex-shrink-0">
                  <p className="font-label-md text-primary">{event.date}</p>
                </div>
                <div className="flex-1">
                  <p className="font-label-md text-on-surface">{event.title}</p>
                  <p className="text-label-sm text-on-surface-variant mt-xs">{event.time} • {event.location}</p>
                </div>
                <button className="text-primary font-label-md hover:underline">RSVP</button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campus News Feed */}
      <Card>
        <CardHeader title="Campus News Feed" />
        <CardContent>
          <div className="space-y-md">
            <div className="border-l-4 border-primary pl-md pb-md">
              <Badge variant="primary" className="mb-sm">SCHOLARSHIP</Badge>
              <p className="font-label-md text-on-surface">Scholarship Opportunities Announced for 2024-25 Term</p>
              <p className="text-label-sm text-on-surface-variant mt-xs">2 days ago • by Admin</p>
            </div>
            <div className="border-l-4 border-secondary pl-md pb-md">
              <Badge variant="secondary" className="mb-sm">ANNOUNCEMENT</Badge>
              <p className="font-label-md text-on-surface">New Staff Dining Hall Opens This Weekend</p>
              <p className="text-label-sm text-on-surface-variant mt-xs">Starting next Monday, the dining has been refurbished. We look forward to welcoming everyone</p>
            </div>
            <div className="border-l-4 border-tertiary pl-md">
              <Badge variant="tertiary" className="mb-sm">ANNOUNCEMENT</Badge>
              <p className="font-label-md text-on-surface">Cybersecurity: Use Top 10 Student Safety Tips</p>
              <p className="text-label-sm text-on-surface-variant mt-xs">Online safety is important through the school year. Find security updates through the...</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Achievements */}
      <Card>
        <CardHeader title="Student Achievements" />
        <CardContent>
          <div className="space-y-md">
            {achievements.map((achievement, idx) => (
              <div key={idx} className="flex items-start gap-md pb-md border-b border-surface-variant last:border-0 last:pb-0">
                <p className="text-3xl flex-shrink-0">{achievement.image}</p>
                <div>
                  <p className="font-label-md text-on-surface">{achievement.name}</p>
                  <p className="text-body-sm text-on-surface-variant mt-xs">{achievement.achievement}</p>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full mt-lg" variant="secondary">Start Discussion</Button>
        </CardContent>
      </Card>
    </div>
  );
}
