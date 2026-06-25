import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Button, Input } from '../../components/ui';
import { Send, MessageSquare, Phone, Mail } from 'lucide-react';

export default function TeacherCommunication() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'Sarah Wilson', type: 'Student', date: '2026-06-24', subject: 'Question about Assignment', unread: true },
    { id: 2, from: 'James Liu', type: 'Student', date: '2026-06-24', subject: 'Grade inquiry', unread: true },
    { id: 3, from: 'Maria Santos', type: 'Parent', date: '2026-06-23', subject: 'Student performance update', unread: false },
  ]);

  const [replyMessage, setReplyMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const contacts = [
    { id: 1, name: 'Grade 10 Mathematics Class', type: 'Class', email: 'grade10math@bridges.edu', count: 28 },
    { id: 2, name: 'Grade 11 Mathematics Class', type: 'Class', email: 'grade11math@bridges.edu', count: 26 },
    { id: 3, name: 'Grade 12 Calculus Class', type: 'Class', email: 'calculus@bridges.edu', count: 24 },
    { id: 4, name: 'Dr. John Smith', type: 'Faculty', email: 'jsmith@bridges.edu', phone: '(555) 123-4001' },
  ];

  const handleReply = () => {
    if (replyMessage.trim()) {
      alert(`Message sent to ${selectedMessage.from}`);
      setReplyMessage('');
      setSelectedMessage(null);
    }
  };

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-primary">Communication</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Messages from students and parents</p>
      </div>

      {/* Messages */}
      <Card>
        <CardHeader title="Messages" action={<span className="text-label-sm text-on-surface-variant">{messages.filter(m => m.unread).length} unread</span>} />
        <CardContent>
          <div className="space-y-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`p-md border-l-4 rounded-lg cursor-pointer hover:bg-surface-container transition-colors ${
                  msg.unread ? 'bg-primary-fixed border-primary' : 'border-outline-variant'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`font-label-md text-on-surface ${msg.unread ? 'font-bold' : ''}`}>{msg.from}</p>
                    <p className="text-label-sm text-on-surface-variant">{msg.type}</p>
                  </div>
                  <p className="text-label-sm text-on-surface-variant">{msg.date}</p>
                </div>
                <p className="text-body-md text-on-surface mt-sm">{msg.subject}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {selectedMessage && (
        <Card className="border-l-4 border-primary">
          <CardHeader
            title={`Reply to ${selectedMessage.from}`}
            action={<button onClick={() => setSelectedMessage(null)} className="text-primary font-label-md">Close</button>}
          />
          <CardContent>
            <div className="space-y-lg">
              <div>
                <label className="font-label-md text-on-surface-variant uppercase mb-sm block">Message</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="input-field w-full h-32 resize-none"
                  placeholder="Type your message..."
                />
              </div>
              <div className="flex gap-sm">
                <Button onClick={handleReply} className="flex items-center gap-sm">
                  <Send size={16} /> Send Message
                </Button>
                <button onClick={() => setSelectedMessage(null)} className="px-lg py-sm rounded-lg border border-outline-variant text-on-surface font-label-md hover:bg-surface-container">
                  Cancel
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contacts Directory */}
      <Card>
        <CardHeader title="Contacts Directory" />
        <CardContent>
          <div className="space-y-md">
            {contacts.map((contact) => (
              <div key={contact.id} className="border border-outline-variant rounded-lg p-lg hover:shadow-md transition-shadow">
                <h3 className="font-headline-sm text-primary">{contact.name}</h3>
                <p className="text-label-md text-on-surface-variant mt-xs">{contact.type}</p>
                <div className="space-y-sm mt-md text-body-sm text-on-surface-variant">
                  {contact.email && (
                    <div className="flex items-center gap-md">
                      <Mail size={16} />
                      <span>{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-md">
                      <Phone size={16} />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.count && (
                    <p className="text-label-sm">{contact.count} members</p>
                  )}
                </div>
                <div className="flex gap-sm mt-lg">
                  <button className="flex-1 bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:opacity-90 transition-colors flex items-center justify-center gap-sm">
                    <MessageSquare size={14} /> Message
                  </button>
                  <button className="flex-1 border border-outline-variant text-on-surface px-md py-sm rounded-lg font-label-md hover:bg-surface-container transition-colors">
                    Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
