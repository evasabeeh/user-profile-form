import { useState } from 'react';

const Step2 = ({ formData, handleChange, next, prev }) => {
    const [error, setError] = useState('');

    const dropdownStyle = { backgroundColor: '#242424' };

    const handleNext = () => {
        if (!formData.address.trim()) {
            setError('Address is required');
            return;
        }
        setError('');
        next();
    };

    return (
        <div className="p-6 max-w-xl mx-auto rounded shadow">
            <h2 className="text-2xl font-semibold mb-10">Step 2: Professional Details</h2>

            <label className="block mb-1">Profession</label>
            <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mb-5"
                style={dropdownStyle}
            >
                <option value="">--Select--</option>
                <option value="Student">Student</option>
                <option value="Developer">Developer</option>
                <option value="Entrepreneur">Entrepreneur</option>
            </select>

            {formData.profession === 'Entrepreneur' && (
                <>
                    <label className="block mb-1">Company Name</label>
                    <input
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded mb-5"
                    />
                </>
            )}

            <label className="block mb-1">Address <span className="text-red-500">*</span></label>
            <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mb-1"
            />
            {error && <p className="text-red-600 text-sm mb-5">{error}</p>}

            <div className="flex justify-between mt-5">
                <button onClick={prev} className="">Back</button>
                <button onClick={handleNext} className="">Next</button>
            </div>
        </div>
    );
};

export default Step2;
