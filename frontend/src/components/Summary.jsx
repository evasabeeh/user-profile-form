import axios from 'axios';

const Summary = ({ formData, prev }) => {
    const handleSubmit = async () => {
        try {
            await axios.post('https://user-profile-form.onrender.com/api/user/submit', formData);
            alert('Submitted Successfully!');
        } catch (error) {
            alert('Submission failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto rounded shadow">
            <h2 className="text-2xl font-semibold mb-7">Summary</h2>
            <pre className="p-4 rounded text-sm overflow-auto max-h-80">{JSON.stringify(formData, null, 2)}</pre>
            <div className="flex justify-between mt-5">
                <button onClick={prev}>Back</button>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default Summary;
