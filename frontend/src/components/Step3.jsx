import { useState, useEffect } from 'react';
import axios from 'axios';

const Step3 = ({ formData, handleChange, next, prev }) => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // Fetch countries
    useEffect(() => {
        axios.get('/api/user/countries')
            .then(res => {
                const result = res.data;
                if (Array.isArray(result)) {
                    setCountries(result);
                } else if (Array.isArray(result.countries)) {
                    setCountries(result.countries);
                } else {
                    setCountries([]);
                    console.warn("Unexpected API format for countries:", result);
                }
            })
            .catch(err => {
                console.error("Error fetching countries:", err);
                setCountries([]);
            });
    }, []);

    // Fetch states
    useEffect(() => {
        if (formData.country) {
            axios.get(`/api/user/states/${formData.country}`)
                .then(res => setStates(res.data))
                .catch(() => setStates([]));
        } else {
            setStates([]);
        }

        handleChange({ target: { name: 'state', value: '' } });
        handleChange({ target: { name: 'city', value: '' } });
        setCities([]);
    }, [formData.country]);

    // Fetch cities
    useEffect(() => {
        if (formData.state && formData.country) {
            axios.get(`/api/user/cities/${formData.state}`, {
                params: { country: formData.country }
            })
                .then(res => setCities(res.data))
                .catch(() => setCities([]));
        } else {
            setCities([]);
        }

        handleChange({ target: { name: 'city', value: '' } });
    }, [formData.state, formData.country]);

    const dropdownStyle = { backgroundColor: '#242424' };

    return (
        <div className="p-6 max-w-xl mx-auto rounded shadow">
            <h2 className="text-2xl font-semibold mb-10">Step 3: Preferences</h2>

            <label className="block mb-2">Country</label>
            <select name="country" value={formData.country} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-5" style={dropdownStyle}>
                <option value="">--Select--</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="block mb-2">State</label>
            <select name="state" value={formData.state} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-5" style={dropdownStyle}>
                <option value="">--Select--</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <label className="block mb-2">City</label>
            <select name="city" value={formData.city} onChange={handleChange} className="w-full border px-3 py-2 rounded mb-5" style={dropdownStyle}>
                <option value="">--Select--</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="block mb-2">Subscription Plan</label>
            <div className="flex gap-6 mb-5">
                {['Basic', 'Pro', 'Enterprise'].map(plan => (
                    <label key={plan} className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="subscriptionPlan"
                            value={plan}
                            checked={formData.subscriptionPlan === plan}
                            onChange={handleChange}
                        /> {plan}
                    </label>
                ))}
            </div>

            <label className="block mb-5">
                <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="mr-2"
                /> Subscribe to Newsletter
            </label>

            <div className="mt-5 flex justify-between">
                <button onClick={prev}>Back</button>
                <button onClick={next}>Next</button>
            </div>
        </div>
    );
};

export default Step3;