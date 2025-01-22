import { Link } from "react-router-dom"
import axios from "axios";
import { useState } from "react";

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const registerUser = async e => {
        e.preventDefault();
        try {
            await axios.post('/register', { name, email, password })
            alert('Registration successful')
        } catch (error) {
            alert('Registration failed')
        }
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                    <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="submit" className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member?{" "}
                        <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Register