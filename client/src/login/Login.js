import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';
import ColorTable from '../components/ColorSelect';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const [color, setColor] = useState('');

    const from = location.state?.from?.pathname || "/";

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const username = formData.get("username");
        const color = formData.get("color");

        await auth.signin({ username, color });
        navigate(from, { replace: true });
    }

    return (
        <div className='block'>
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label>
                        Username: <input name="username" type="text" />
                    </label>{" "}
                </div>
                <div className="form-field">
                    <label>
                        Color:
                        <span><ColorTable selected={color} onSelect={(color) => setColor(color)} /></span>
                        <input type="hidden" name="color" value={color} />
                    </label>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;