import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, Button, Badge } from '../../components/ui';
import { useNavigate } from 'react-router-dom';

export const RegistrationStep3 = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const step1Data = JSON.parse(sessionStorage.getItem('registrationStep1') || '{}');
  const step2Data = JSON.parse(sessionStorage.getItem('registrationStep2') || '{}');

  const handleSubmit = () => {
    if (agreed) {
      setSubmitted(true);
      setTimeout(() => {
        sessionStorage.clear();
        navigate('/');
      }, 2000);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background p-margin-desktop flex items-center justify-center">
        <Card className="max-w-2xl w-full text-center">
          <div className="text-6xl mb-lg">✅</div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">Registration Submitted!</h2>
          <p className="font-body-md text-body-md text-secondary mb-lg">
            Your application has been submitted successfully. You will receive a confirmation email shortly.
          </p>
          <p className="font-body-sm text-on-surface-variant">Redirecting to home page...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-margin-desktop flex items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardHeader title="Student Registration" subtitle="Step 3 of 3: Review & Submit" />
        <CardContent>
          <div className="space-y-lg">
            {/* Personal Information */}
            <div className="border-b border-surface-variant pb-lg">
              <h3 className="font-headline-sm text-headline-sm text-primary mb-md">Personal Information</h3>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <p className="text-label-sm text-on-surface-variant">First Name</p>
                  <p className="font-body-md">{step1Data.firstName}</p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Last Name</p>
                  <p className="font-body-md">{step1Data.lastName}</p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Email</p>
                  <p className="font-body-md">{step1Data.email}</p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Phone</p>
                  <p className="font-body-md">{step1Data.phone}</p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Date of Birth</p>
                  <p className="font-body-md">{step1Data.dob}</p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Grade Level</p>
                  <p className="font-body-md">Grade {step1Data.grade}</p>
                </div>
              </div>
            </div>

            {/* Documents Checklist */}
            <div className="border-b border-surface-variant pb-lg">
              <h3 className="font-headline-sm text-headline-sm text-primary mb-md">Documents Uploaded</h3>
              <div className="space-y-sm">
                {Object.entries(step2Data.files || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-md">
                    <Badge variant={value ? 'success' : 'warning'}>
                      {value ? '✓' : '✗'}
                    </Badge>
                    <span className="font-body-md">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="flex items-start gap-md cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-sm"
                />
                <div>
                  <p className="font-body-md text-on-surface">
                    I agree to the <strong>Terms and Conditions</strong> and <strong>Privacy Policy</strong>
                  </p>
                  <p className="text-body-sm text-on-surface-variant mt-xs">
                    By checking this box, you confirm that all information provided is accurate and complete.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" onClick={() => navigate('/registration/step2')}>Back</Button>
          <Button onClick={handleSubmit} className={!agreed ? 'opacity-50 cursor-not-allowed' : ''} disabled={!agreed}>
            Submit Application
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationStep3;
