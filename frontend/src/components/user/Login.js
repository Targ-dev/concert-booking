import React, { useState } from 'react';
import Userheader from '../partials/userHeader';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/AuthSlice';

const styles = {
  body: {
    background: 'linear-gradient(to right, #e2e2e2,rgb(211, 221, 253))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: '100vh',
    fontFamily: "'Montserrat', sans-serif",
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: '30px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.35)',
    position: 'relative',
    overflow: 'hidden',
    width: '768px',
    maxWidth: '100%',
    minHeight: '480px',
  },
  formContainer: {
    position: 'absolute',
    top: 0,
    height: '100%',
    transition: 'all 0.6s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '0 40px',
    width: '50%',
  },
  input: {
    backgroundColor: '#eee',
    border: 'none',
    margin: '8px 0',
    padding: '10px 15px',
    fontSize: '13px',
    borderRadius: '8px',
    width: '100%',
    outline: 'none',
  },
  button: {
    backgroundColor: 'rgb(205, 26, 16)',
    color: '#fff',
    fontSize: '12px',
    padding: '10px 45px',
    border: '1px solid transparent',
    borderRadius: '8px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginTop: '10px',
    cursor: 'pointer',
  },
  hiddenButton: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
  },

  toggleContainer: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: '50%',
    height: '100%',
    overflow: 'hidden',
    transition: 'all 0.6s ease-in-out',
    borderRadius: '150px 0 0 100px',
    zIndex: 1000,
  },
  toggle: {
    background: 'linear-gradient(to right,rgb(201, 24, 14),rgb(165, 20, 13))',
    color: '#fff',
    height: '100%',
    width: '200%',
    position: 'relative',
    left: '-100%',
    transform: 'translateX(0)',
    transition: 'all 0.6s ease-in-out',
    display: 'flex',
  },
  togglePanel: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '0 30px',
    textAlign: 'center',
    top: 0,
    transition: 'all 0.6s ease-in-out',
  },
  alink: {
    textDecoration: 'none',
    color: 'rgb(41, 40, 40)',
    fontSize: '13px',
  },
};

export default function AuthForm() {
  const [isActive, setIsActive] = useState(false);
  let [name, setName] = useState('')
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [confirmPassword, setConfirmPassword] = useState('');
  let [role, setRole] = useState('user');
  let [signupErrorMessage, setSignupErrorMessage] = useState('');
  let [signinErrorMessage, setSigninErrorMessage] = useState('');
  const [showSigninPassword, setShowSigninPassword] = useState(false);
  let navigate = useNavigate()
  const dispatch = useDispatch()

  function Signup() {
    const user = {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      role: role
    }
    axios.post('http://localhost:5000/api/signup-api', user).then(response => {
      setSignupErrorMessage('')
      window.location.reload()
    }).catch(error => {
      if (error.response && error.response.data && error.response.data.error) {
        setSignupErrorMessage(error.response.data.error);
      } else {
        setSignupErrorMessage('Failed to connect to API');
      }
    })
  }

  const Signin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login-api', {
        email: email,
        password: password
      })
      const { token } = response.data

      dispatch(loginSuccess({ token }));

      const role = jwtDecode(token).role;
      localStorage.setItem('userRole', role)
      
      window.location.href = role === 'admin' ? '/dashboard' : '/'

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setSigninErrorMessage(error.response.data.message);
      } else {
        setSigninErrorMessage('Login failed. Try again later.');
      }
    }
  }

  return (
    <>
      <Userheader />
      <div style={styles.body}>
        <div style={{ ...styles.container, ...(isActive ? { transform: 'translateX(0)' } : {}) }}>
          <div
            style={{
              ...styles.formContainer,
              left: 0,
              transform: 'translateX(100%)',
              zIndex: isActive ? 2 : 1,
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? 'auto' : 'none'
            }}
          >
            <form>
              <h1>Create Account</h1>
              {signupErrorMessage ? <div className="alert alert-danger">{signupErrorMessage}</div> : ''}
              <input type="text" placeholder="Name" style={styles.input} value={name} onChange={(event) => setName(event.target.value)} required />
              <input type="email" placeholder="Email" style={styles.input} value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete='new-password'/>
              <input type="password" placeholder="Password" style={styles.input} value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete='new-password'/>
              <input type="password" placeholder="Confirm Password" style={styles.input} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
              <div className="mb-3">
                <select name="role" id="role" className="form-control d-none" value={role} onChange={(event) => setRole(event.target.value)}>
                  <option value="" disabled>Select your role</option>
                  <option name="admin" value="admin">Admin</option>
                  <option name="user" value="user">User</option>
                </select>
              </div>
              <button type="button" style={styles.button} onClick={Signup}>Sign Up</button>
            </form>
          </div>

          <div
            style={{
              ...styles.formContainer,
              left: 0,
              zIndex: isActive ? 1 : 2,
              opacity: isActive ? 0 : 1,
              pointerEvents: isActive ? 'none' : 'auto'
            }}
          >
            <form autoComplete='off'>
              <h1>Sign In</h1>
              {signinErrorMessage ? <div className="alert alert-danger">{signinErrorMessage}</div> : ''}
              <input type="email" placeholder="Email" style={styles.input} value={email} onChange={(event) => setEmail(event.target.value)} autocomplete='new-password'/>
              <div style={{ position: 'relative' }}>
                <input
                  type={showSigninPassword ? "text" : "password"}
                  placeholder="Password"
                  style={styles.input}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autocomplete='new-password'
                />
                <span
                  onClick={() => setShowSigninPassword(!showSigninPassword)}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#555',
                  }}
                >
                  {showSigninPassword ? <i class="bi bi-eye-slash" style={{ color: 'black' }}/> : <i class="bi bi-eye" style={{ color: 'black' }}/>}
                </span>
              </div>

              <a href="#" style={styles.alink}>Forget Your Password?</a><br />
              <button type="button" style={styles.button} onClick={Signin}>Sign In</button>
            </form>
          </div>

          <div
            style={{
              ...styles.toggleContainer,
              transform: isActive ? 'translateX(-100%)' : '',
              borderRadius: isActive ? '0 150px 100px 0' : '150px 0 0 100px',
            }}
          >
            <div
              style={{
                ...styles.toggle,
                transform: isActive ? 'translateX(50%)' : 'translateX(0)',
              }}
            >
              <div
                style={{
                  ...styles.togglePanel,
                  left: 0,
                  transform: isActive ? 'translateX(0)' : 'translateX(-200%)',
                }}
              >
                <h1>Welcome Back!</h1>
                <p>Enter your personal details to use all of site features</p>
                <button
                  type="button"
                  onClick={() => setIsActive(false)}
                  style={{ ...styles.button, ...styles.hiddenButton }}
                >
                  Sign In
                </button>
              </div>
              <div
                style={{
                  ...styles.togglePanel,
                  right: 0,
                  transform: isActive ? 'translateX(200%)' : 'translateX(0)',
                }}
              >
                <h1>Hello, Friend!</h1>
                <p>Register with your personal details to use all of site features</p>
                <button
                  type="button"
                  onClick={() => setIsActive(true)}
                  style={{ ...styles.button, ...styles.hiddenButton }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
