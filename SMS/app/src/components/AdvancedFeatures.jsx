import { Badge, Button, Card, CardContent, CardHeader, IconButton } from './ui';
import {
  Bell,
  Mail,
  Settings,
  Download,
  Share2,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Users,
  Award,
  Star,
  Heart,
  MessageSquare,
  Phone,
} from 'lucide-react';

/**
 * Advanced Features Showcase Component
 * Demonstrates professional CSS features and icon implementations
 * Can be used as reference for UI patterns throughout the application
 */
export const AdvancedFeatures = () => {
  return (
    <div className="space-y-2xl p-xl">
      {/* Section 1: Advanced Buttons with Icons */}
      <section className="space-y-lg">
        <h2 className="font-headline-lg text-primary">Advanced Button Components</h2>

        <Card variant="gradient">
          <CardHeader title="Button Variants with Icons" subtitle="All button types with icon support" />
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
              <Button variant="primary" size="md">
                <Bell size={18} /> Notifications
              </Button>
              <Button variant="secondary" size="md">
                <Mail size={18} /> Messages
              </Button>
              <Button variant="success" size="md">
                <Check size={18} /> Approve
              </Button>
              <Button variant="warning" size="md">
                <AlertCircle size={18} /> Warning
              </Button>
              <Button variant="danger" size="md">
                <Heart size={18} /> Delete
              </Button>
              <Button variant="outline" size="md">
                <Download size={18} /> Export
              </Button>
              <Button variant="ghost" size="md">
                <Share2 size={18} /> Share
              </Button>
              <Button variant="text" size="md">
                More options →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader title="Button Sizes" subtitle="Different button sizes for different contexts" />
          <CardContent>
            <div className="flex flex-wrap gap-lg items-center">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
              <Button variant="primary" size="xl">
                Extra Large
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: Advanced Icon Buttons */}
      <section className="space-y-lg">
        <h2 className="font-headline-lg text-primary">Icon Button System</h2>

        <Card variant="elevated">
          <CardHeader title="Icon Button Variants" subtitle="Compact icon-only buttons with multiple styles" />
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-md">
              <div className="flex flex-col items-center gap-sm">
                <IconButton icon={<Bell size={20} />} variant="primary" size="md" />
                <span className="text-label-xs text-on-surface-variant">Primary</span>
              </div>
              <div className="flex flex-col items-center gap-sm">
                <IconButton icon={<Settings size={20} />} variant="secondary" size="md" />
                <span className="text-label-xs text-on-surface-variant">Secondary</span>
              </div>
              <div className="flex flex-col items-center gap-sm">
                <IconButton icon={<Heart size={20} />} variant="danger" size="md" />
                <span className="text-label-xs text-on-surface-variant">Danger</span>
              </div>
              <div className="flex flex-col items-center gap-sm">
                <IconButton icon={<Check size={20} />} variant="success" size="md" />
                <span className="text-label-xs text-on-surface-variant">Success</span>
              </div>
              <div className="flex flex-col items-center gap-sm">
                <IconButton icon={<AlertCircle size={20} />} variant="warning" size="md" />
                <span className="text-label-xs text-on-surface-variant">Warning</span>
              </div>
              <div className="flex flex-col items-center gap-sm">
                <IconButton icon={<Eye size={20} />} variant="outline" size="md" />
                <span className="text-label-xs text-on-surface-variant">Outline</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Icon Button Sizes" subtitle="Responsive icon button sizes" />
          <CardContent>
            <div className="flex gap-md items-center">
              <IconButton icon={<Bell size={16} />} variant="primary" size="sm" />
              <IconButton icon={<Bell size={18} />} variant="primary" size="md" />
              <IconButton icon={<Bell size={22} />} variant="primary" size="lg" />
              <IconButton icon={<Bell size={26} />} variant="primary" size="xl" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 3: Advanced Badge System */}
      <section className="space-y-lg">
        <h2 className="font-headline-lg text-primary">Advanced Badge Variants</h2>

        <Card variant="elevated">
          <CardHeader title="Badge Styles" subtitle="Multiple badge styles for different contexts" />
          <CardContent>
            <div className="flex flex-wrap gap-md">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="ghost">Ghost</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Badge with Icons & Dots" subtitle="Enhanced badges with visual indicators" />
          <CardContent>
            <div className="flex flex-wrap gap-md">
              <Badge variant="primary" icon={<Star size={14} />}>
                Featured
              </Badge>
              <Badge variant="success" dot>
                Active
              </Badge>
              <Badge variant="warning" icon={<AlertCircle size={14} />}>
                Pending
              </Badge>
              <Badge variant="danger" icon={<Heart size={14} />}>
                Urgent
              </Badge>
              <Badge variant="info" animated>
                Loading
              </Badge>
              <Badge variant="success" size="lg">
                Large Badge
              </Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 4: Card Variants with Icons */}
      <section className="space-y-lg">
        <h2 className="font-headline-lg text-primary">Advanced Card System</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <Card variant="default" interactive onClick={() => alert('Card clicked!')}>
            <CardHeader
              title="Clickable Card"
              icon={<BarChart3 size={24} className="text-primary" />}
              badge="New"
            />
            <CardContent>
              <p className="text-body-sm text-on-surface">
                Cards can be interactive with click handlers. This one has a custom icon and badge.
              </p>
            </CardContent>
          </Card>

          <Card variant="success">
            <CardHeader
              title="Success Card"
              icon={<Check size={24} className="text-green-600" />}
              subtitle="Everything is working"
            />
            <CardContent>
              <p className="text-body-sm text-on-surface">
                Use colored card variants for status indicators and contextual information.
              </p>
            </CardContent>
          </Card>

          <Card variant="danger">
            <CardHeader
              title="Error Card"
              icon={<AlertCircle size={24} className="text-error" />}
              badge="Alert"
            />
            <CardContent>
              <p className="text-body-sm text-on-surface">
                Display errors and alerts with the danger variant for immediate attention.
              </p>
            </CardContent>
          </Card>

          <Card variant="info">
            <CardHeader
              title="Info Card"
              icon={<Mail size={24} className="text-blue-600" />}
              subtitle="New message"
            />
            <CardContent>
              <p className="text-body-sm text-on-surface">
                Use info cards to highlight important information and notifications.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 5: Icon Grid Patterns */}
      <section className="space-y-lg">
        <h2 className="font-headline-lg text-primary">Icon Patterns & Combinations</h2>

        <Card variant="elevated">
          <CardHeader title="Common Icon Patterns" />
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
              {/* Pattern 1 */}
              <div className="flex flex-col items-center gap-md p-md bg-primary/5 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users size={24} className="text-primary" />
                </div>
                <span className="text-label-sm text-on-surface font-medium">Users</span>
              </div>

              {/* Pattern 2 */}
              <div className="flex flex-col items-center gap-md p-md bg-secondary/5 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Award size={24} className="text-secondary" />
                </div>
                <span className="text-label-sm text-on-surface font-medium">Achievements</span>
              </div>

              {/* Pattern 3 */}
              <div className="flex flex-col items-center gap-md p-md bg-green-500/5 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
                <span className="text-label-sm text-on-surface font-medium">Growth</span>
              </div>

              {/* Pattern 4 */}
              <div className="flex flex-col items-center gap-md p-md bg-yellow-500/5 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Clock size={24} className="text-yellow-600" />
                </div>
                <span className="text-label-sm text-on-surface font-medium">Time</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="ghost">
          <CardHeader title="Icon Action Groups" />
          <CardContent>
            <div className="space-y-md">
              {/* Group 1 */}
              <div className="flex items-center justify-between p-md bg-surface-variant/30 rounded-lg">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <MessageSquare size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface">Message Teacher</p>
                    <p className="text-label-xs text-on-surface-variant">Quick communication</p>
                  </div>
                </div>
                <IconButton icon={<Phone size={18} />} variant="primary" size="sm" />
              </div>

              {/* Group 2 */}
              <div className="flex items-center justify-between p-md bg-surface-variant/30 rounded-lg">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Calendar size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface">Schedule Meeting</p>
                    <p className="text-label-xs text-on-surface-variant">Pick a time</p>
                  </div>
                </div>
                <IconButton icon={<Check size={18} />} variant="success" size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 6: Color & Theme Showcase */}
      <section className="space-y-lg">
        <h2 className="font-headline-lg text-primary">Color System & Theming</h2>

        <Card variant="elevated">
          <CardHeader title="Primary Color Palette" />
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-md">
              <div className="flex flex-col gap-sm">
                <div className="w-full h-12 rounded-lg bg-primary shadow-md" />
                <span className="text-label-xs text-on-surface-variant text-center">Primary</span>
              </div>
              <div className="flex flex-col gap-sm">
                <div className="w-full h-12 rounded-lg bg-secondary shadow-md" />
                <span className="text-label-xs text-on-surface-variant text-center">Secondary</span>
              </div>
              <div className="flex flex-col gap-sm">
                <div className="w-full h-12 rounded-lg bg-tertiary shadow-md" />
                <span className="text-label-xs text-on-surface-variant text-center">Tertiary</span>
              </div>
              <div className="flex flex-col gap-sm">
                <div className="w-full h-12 rounded-lg bg-green-500 shadow-md" />
                <span className="text-label-xs text-on-surface-variant text-center">Success</span>
              </div>
              <div className="flex flex-col gap-sm">
                <div className="w-full h-12 rounded-lg bg-error shadow-md" />
                <span className="text-label-xs text-on-surface-variant text-center">Error</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Copy Code Section */}
      <section className="space-y-lg">
        <h2 className="font-headline-lg text-primary">Copy & Use Components</h2>

        <Card variant="gradient">
          <CardHeader
            title="Ready to Copy"
            subtitle="All components are production-ready and can be copied directly"
          />
          <CardContent>
            <div className="space-y-md">
              <p className="text-body-sm text-on-surface">
                All components above are fully functional and production-ready. You can:
              </p>
              <ul className="space-y-sm text-body-sm text-on-surface list-disc list-inside">
                <li>Copy the component structure and styling directly</li>
                <li>Customize colors using Tailwind CSS variables</li>
                <li>Add your own icons from lucide-react</li>
                <li>Extend variants for different use cases</li>
                <li>Combine components for complex layouts</li>
              </ul>
              <div className="flex gap-md mt-lg">
                <Button variant="primary" size="md">
                  <Copy size={18} /> Copy Component Code
                </Button>
                <Button variant="secondary" size="md">
                  <Download size={18} /> Download Package
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default AdvancedFeatures;
