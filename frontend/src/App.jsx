import React, { useState } from 'react';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Summary from './components/Summary';

const App = () => {
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
    profilePhoto: null,
    profession: '',
    companyName: '',
    address: '',
    country: '',
    state: '',
    city: '',
    subscriptionPlan: 'Basic',
    newsletter: true
  });


  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const next = () => setStep(prev => prev + 1);
  const prev = () => setStep(prev => prev - 1);

  return (
    <div className="min-h-screen py-8">
      {step === 1 && <Step1 formData={formData} handleChange={handleChange} next={next} />}
      {step === 2 && <Step2 formData={formData} handleChange={handleChange} next={next} prev={prev} />}
      {step === 3 && <Step3 formData={formData} handleChange={handleChange} next={next} prev={prev} />}
      {step === 4 && <Summary formData={formData} prev={prev} />}
    </div>
  );
};

export default App;
