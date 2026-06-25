import { useState } from 'react';
import { Card, CardHeader, CardContent, Badge, Button } from '../../components/ui';
import { Download, AlertCircle, CreditCard } from 'lucide-react';

export default function ParentFinance() {
  const [payments] = useState([
    { date: 'Sep 24, 2021', description: 'Term 2 Tuition Fee', amount: '₱85,000.00', status: 'Pending', reference: 'INV-2021-0034' },
    { date: 'Aug 12, 2023', description: 'Annual Science-related Subscription', amount: '₱7,000.00', status: 'Paid', reference: 'INV-2023-0087' },
    { date: 'Aug 01, 2023', description: 'School Bus Transport - Quarter 1', amount: '₱7,500.00', status: 'Paid', reference: 'INV-2023-0042' },
  ]);

  const [paymentMethods] = useState([
    { type: 'Visa Ending in 4242', status: 'Default Method', lastUsed: 'Sep 26, 2024' },
  ]);

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-primary">Fees & Finance</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Manage tuition fees and payment records</p>
      </div>

      {/* Current Outstanding Balance */}
      <Card className="bg-primary">
        <CardContent>
          <div className="text-on-primary">
            <p className="font-label-md text-on-primary uppercase mb-md opacity-90">Current Outstanding Balance</p>
            <p className="font-headline-lg text-on-primary mb-lg">₱42,500.00</p>
            <p className="text-label-sm text-on-primary opacity-80 mb-lg">Due by October 15, 2023</p>
            <Button className="bg-on-primary text-primary hover:opacity-90">Pay Now</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Breakdown */}
      <Card>
        <CardHeader title="Bill Breakdown" action={<span className="text-label-sm text-on-surface-variant">Monthly</span>} />
        <CardContent>
          <div className="space-y-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-label-md text-on-surface">Tuition Fee</p>
                <p className="text-label-sm text-on-surface-variant mt-xs">₱25,000 / ₱31,000 paid</p>
              </div>
              <p className="font-headline-sm text-primary">₱25,000.00</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-label-md text-on-surface">Lab Fees</p>
              </div>
              <p className="font-headline-sm text-primary">₱4,500.00</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-label-md text-on-surface">School Bus Transport</p>
              </div>
              <p className="font-headline-sm text-primary">₱9,000.00</p>
            </div>
            <div className="border-t border-surface-variant pt-md flex justify-between items-center">
              <p className="font-label-md text-on-surface">Total Due</p>
              <p className="font-headline-md text-primary">₱42,500.00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert */}
      <Card className="border-l-4 border-warning bg-warning/5">
        <div className="flex gap-md">
          <AlertCircle size={20} className="text-warning flex-shrink-0 mt-1" />
          <div>
            <p className="font-label-md text-on-surface">Payment Reminder</p>
            <p className="text-label-sm text-on-surface-variant mt-xs">The balance is 6 days overdue from the previous term. Early full payment is much appreciated.</p>
          </div>
        </div>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader title="Transaction History" action={<button className="text-primary font-label-md flex items-center gap-sm">
          <Download size={16} /> Export CSV
        </button>} />
        <CardContent>
          <div className="space-y-md">
            {payments.map((payment, idx) => (
              <div key={idx} className="pb-md border-b border-surface-variant last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-label-md text-on-surface">{payment.description}</p>
                    <p className="text-label-sm text-on-surface-variant mt-xs">{payment.date} • {payment.reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-label-md text-on-surface">{payment.amount}</p>
                    <Badge variant={payment.status === 'Paid' ? 'success' : 'warning'}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-lg text-label-sm text-on-surface-variant flex justify-between items-center">
            <span>Showing 3 of 10 records</span>
            <button className="text-primary hover:underline">View All</button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader title="Payment Methods" />
        <CardContent>
          <div className="space-y-md">
            {paymentMethods.map((method, idx) => (
              <div key={idx} className="border border-outline-variant rounded-lg p-lg">
                <div className="flex items-start justify-between mb-md">
                  <div className="flex items-center gap-md">
                    <CreditCard size={32} className="text-primary" />
                    <div>
                      <p className="font-label-md text-on-surface">{method.type}</p>
                      <p className="text-label-sm text-on-surface-variant mt-xs">{method.status}</p>
                    </div>
                  </div>
                </div>
                <p className="text-label-sm text-on-surface-variant">Last used {method.lastUsed}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader title="Quick Actions" />
        <CardContent>
          <div className="space-y-sm">
            <button className="w-full bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:opacity-90 transition-colors text-left">
              📋 Statement of Account
            </button>
            <button className="w-full bg-secondary text-on-secondary px-lg py-sm rounded-lg font-label-md hover:opacity-90 transition-colors text-left">
              📅 Payment Schedule
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
