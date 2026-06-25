import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from '../../components/ui';
import { Send, MessageSquare, Phone, Mail } from 'lucide-react';

export default function ParentCommunication() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'Dr. Elena Rodriguez', role: 'Mathematics Teacher', date: '2026-06-24', message: 'Elena did excellent on the recent quiz! Great work.', unread: true },
    { id: 2, from: 'Ms. Sarah Jenkins', role: 'English Teacher', date: '2026-06-23', message: 'Please encourage Elena to participate more in class discussions.', unread: false },
    { id: 3, from: 'Prof. James Chen', role: 'Physics Teacher', date: '2026-06-22', message: 'Your daughter shows great potential in physics. Recommend considering advanced courses next year.', unread: false },
  ]);

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  const [teachers] = useState([
    { id: 1, name: 'Dr. Elena Rodriguez', subject: 'Mathematics', email: 'elena.r@bridges.edu', phone: '(555) 123-4001' },
    { id: 2, name: 'Ms. Sarah Jenkins', subject: 'English', email: 'sarah.j@bridges.edu', phone: '(555) 123-4002' },
    { id: 3, name: 'Prof. James Chen', subject: 'Physics', email: 'james.c@bridges.edu', phone: '(555) 123-4003' },
    { id: 4, name: 'Dr. Michael Torres', subject: 'Chemistry', email: 'michael.t@bridges.edu', phone: '(555) 123-4004' },
  ]);

  const handleReply = (teacher) => {
    setSelectedTeacher(teacher);
  };

  const sendMessage = () => {
    if (replyMessage.trim()) {
      alert(`Message sent to ${selectedTeacher.name}`);
      setReplyMessage('');
      setSelectedTeacher(null);
    }
  };

  return (
    <div className="space-y-lg">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-primary">Communication</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Messages from teachers and school staff</p>
        </div>
      </div>

      {/* Messages Inbox */}
      <Card>
        <CardHeader title="Messages" action={<span className="text-label-sm text-on-surface-variant">{messages.filter(m => m.unread).length} unread</span>} />
        <CardContent>
          <div className="space-y-md">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-md border-l-4 rounded-lg cursor-pointer hover:bg-surface-container transition-colors ${
                  msg.unread ? 'bg-primary-fixed border-primary' : 'border-outline-variant'
                }`}
              >
                <div className="flex justify-between items-start mb-sm">
                  <div>
                    <p className={`font-label-md text-on-surface ${msg.unread ? 'font-bold' : ''}`}>{msg.from}</p>
                    <p className="text-label-sm text-on-surface-variant">{msg.role}</p>
                  </div>
                  <p className="text-label-sm text-on-surface-variant">{msg.date}</p>
                </div>
                <p className="text-body-md text-on-surface mb-md">{msg.message}</p>
                <button
                  onClick={() => handleReply(teachers.find(t => t.name === msg.from))}
                  className="text-primary font-label-md hover:underline flex items-center gap-xs"
                >
                  <Send size={14} /> Reply
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Teacher Directory */}
      <Card>
        <CardHeader title="Teacher Directory" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="border border-outline-variant rounded-lg p-lg hover:shadow-md transition-shadow">
                <h3 className="font-headline-sm text-primary mb-xs">{teacher.name}</h3>
                <p className="text-label-md text-on-surface-variant mb-lg">{teacher.subject}</p>
                <div className="space-y-sm mb-lg text-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-md">
                    <Mail size={16} />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-md">
                    <Phone size={16} />
                    <span>{teacher.phone}</span>
                  </div>
                </div>
                <div className="flex gap-sm">
                  <button
                    onClick={() => handleReply(teacher)}
                    className="flex-1 bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:opacity-90 transition-colors text-sm flex items-center justify-center gap-sm"
                  >
                    <MessageSquare size={14} /> Message
                  </button>
                  <a href={`mailto:${teacher.email}`} className="flex-1 border border-outline-variant text-on-surface px-md py-sm rounded-lg font-label-md hover:bg-surface-container transition-colors text-sm text-center">
                    Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reply Modal */}
      {selectedTeacher && (
        <Card className="border-l-4 border-primary">
          <CardHeader
            title={`Message to ${selectedTeacher.name}`}
            action={<button onClick={() => setSelectedTeacher(null)} className="text-primary font-label-md">Close</button>}
          />
          <CardContent>
            <div className="space-y-lg">
              <div>
                <p className="font-label-md text-on-surface-variant uppercase mb-sm">To</p>
                <p className="font-body-md text-on-surface">{selectedTeacher.name}</p>
              </div>
              <div>
                <label className="font-label-md text-on-surface-variant uppercase mb-sm block">Message</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="input-field w-full h-32 resize-none"
                  placeholder="Type your message here..."
                />
              </div>
              <div className="flex gap-sm">
                <Button onClick={sendMessage}>Send Message</Button>
                <button onClick={() => setSelectedTeacher(null)} className="px-lg py-sm rounded-lg border border-outline-variant text-on-surface font-label-md hover:bg-surface-container">
                  Cancel
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
