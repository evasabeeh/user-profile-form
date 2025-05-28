import { useState, useEffect } from 'react';
import axios from 'axios';

const Step1 = ({ formData, handleChange, next }) => {
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState('');
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (formData.profilePhoto) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(formData.profilePhoto);
        } else {
            setPreview(null);
        }
    }, [formData.profilePhoto]);

    const checkUsername = async () => {
        const username = formData.username;
        if (username.length >= 4 && username.length <= 20 && !/\s/.test(username)) {
            try {
                const res = await axios.get(`/api/user/check-username?username=${username}`);
                
                setUsernameAvailable(res.data.available);
                if (!res.data.available) {
                    setErrors(prev => ({ ...prev, username: 'Username is taken' }));
                } else {
                    setErrors(prev => {
                        const { username, ...rest } = prev;
                        return rest;
                    });
                }
            } catch {
                setUsernameAvailable(null);
                setErrors(prev => ({ ...prev, username: 'Error checking username availability' }));
            }
        } else {
            setUsernameAvailable(null);
            setErrors(prev => ({ ...prev, username: 'Username must be 4-20 characters and no spaces' }));
        }
    };

    const validatePassword = (pwd) => {
        const strong = pwd.length >= 8 && /[!@#$%^&*]/.test(pwd) && /[0-9]/.test(pwd);
        setPasswordStrength(strong ? 'Strong' : 'Weak');

        if (pwd && !strong) {
            setErrors(prev => ({ ...prev, password: 'Password must be 8+ chars, include 1 special char and 1 number' }));
        } else {
            setErrors(prev => {
                const { password, ...rest } = prev;
                return rest;
            });
        }
    };

    const validateBeforeNext = () => {
        let valid = true;
        let newErrors = {};

        // Profile photo
        if (!formData.profilePhoto) {
            newErrors.profilePhoto = "Profile photo is required";
            valid = false;
        } else {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(formData.profilePhoto.type)) {
                newErrors.profilePhoto = "Profile photo must be JPG or PNG";
                valid = false;
            }
        }

        // Username
        if (!formData.username || formData.username.length < 4 || formData.username.length > 20 || /\s/.test(formData.username)) {
            newErrors.username = "Username must be 4-20 characters with no spaces";
            valid = false;
        } else if (usernameAvailable === false) {
            newErrors.username = "Username is taken";
            valid = false;
        }

        // New password
        if (formData.password) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = "Current password is required to change password";
                valid = false;
            }

            const strongPwd = formData.password.length >= 8 && /[!@#$%^&*]/.test(formData.password) && /[0-9]/.test(formData.password);
            if (!strongPwd) {
                newErrors.password = "New password must be 8+ chars, include 1 special char and 1 number";
                valid = false;
            }
        }

        setErrors(newErrors);
        return valid;
    };

    const handleNextClick = () => {
        if (validateBeforeNext()) {
            next();
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto rounded shadow">
            <h2 className="text-2xl font-semibold mb-10">Step 1: Personal Info</h2>
           
            <div className="mb-4">
                <label className="block mb-2">Profile Photo <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-20 w-20 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                        />
                    ) : (
                        <div className="h-20 w-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                            No image
                        </div>
                    )}
                    <input
                        type="file"
                        name="profilePhoto"
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={handleChange}
                        className="text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#646cff] file:text-white hover:file:bg-[#4a54cc] transition"
                    />
                </div>
                {errors.profilePhoto && <p className="text-red-600 text-sm mt-1">{errors.profilePhoto}</p>}
            </div>

            <label className="block mb-2">Username</label>
            <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={checkUsername}
                className="w-full border px-3 py-2 rounded mb-1"
            />
            {(errors.username || usernameAvailable !== null) && (
                <p className={`text-sm mb-5 ${errors.username ? 'text-red-600' : usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {errors.username || (usernameAvailable ? 'Username available' : 'Username taken')}
                </p>
            )}

            <label className="block mb-2">Current Password</label>
            <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mb-5"
            />
            {errors.currentPassword && <p className="text-red-600 text-sm mb-2">{errors.currentPassword}</p>}

            <label className="block mb-2">New Password</label>
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => {
                    handleChange(e);
                    validatePassword(e.target.value);
                }}
                className="w-full border px-3 py-2 rounded"
            />
            <div className="text-sm text-gray-600 mb-1">
                Password Strength: 
                <span className={`text-sm mb-5 ${passwordStrength === 'Strong'
                    ? 'text-green-500'
                    : passwordStrength === 'Weak'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}>
                    {passwordStrength}
                </span>
            </div>
            
            {errors.password && <p className="text-red-600 text-sm mb-2">{errors.password}</p>}

            <div className="flex justify-end">
                <button
                    onClick={handleNextClick}
                    className="bg-[#646cff] text-white px-4 py-2 rounded hover:bg-[#4a54cc]"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Step1;
