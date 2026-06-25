import { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, Input, Button } from '../../components/ui';
import { useNavigate } from 'react-router-dom';

export const RegistrationStep2 = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState({
    birthCertificate: null,
    transcripts: null,
    medicalRecords: null,
    idProof: null,
  });

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList.length > 0) {
      setFiles(prev => ({ ...prev, [name]: fileList[0] }));
    }
  };

  const handleNext = () => {
    sessionStorage.setItem('registrationStep2', JSON.stringify({
      files: Object.keys(files).reduce((acc, key) => {
        acc[key] = files[key] ? files[key].name : null;
        return acc;
      }, {})
    }));
    navigate('/registration/step3');
  };

  const FileUploadField = ({ label, name, description }) => (
    <div className="mb-lg">
      <label className="font-label-md text-label-md text-on-surface mb-sm block">{label}</label>
      <p className="text-body-sm text-on-surface-variant mb-md">{description}</p>
      <label className="border-2 border-dashed border-outline-variant rounded-lg p-lg cursor-pointer hover:bg-surface-container transition-colors block text-center">
        <input
          type="file"
          name={name}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-4xl mb-sm">📄</div>
        <p className="font-body-md text-primary">{files[name] ? files[name].name : 'Click to upload'}</p>
        <p className="text-body-sm text-on-surface-variant">or drag and drop</p>
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-margin-desktop flex items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardHeader title="Student Registration" subtitle="Step 2 of 3: Document Upload" />
        <CardContent>
          <FileUploadField
            label="Birth Certificate / ID Proof"
            name="birthCertificate"
            description="Upload a clear copy of your birth certificate or government-issued ID"
          />
          <FileUploadField
            label="Previous School Transcripts"
            name="transcripts"
            description="Upload transcripts or grades from your previous school"
          />
          <FileUploadField
            label="Medical Records / Vaccination Proof"
            name="medicalRecords"
            description="Upload vaccination records and medical documentation"
          />
          <FileUploadField
            label="Photo Identification"
            name="idProof"
            description="Upload a recent passport-sized photograph"
          />
        </CardContent>
        <CardFooter>
          <Button variant="secondary" onClick={() => navigate('/registration/step1')}>Back</Button>
          <Button onClick={handleNext}>Continue to Step 3</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationStep2;
