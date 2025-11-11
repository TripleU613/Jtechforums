import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const googleProvider = new GoogleAuthProvider();

export default function SignIn() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/apps';

  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, redirectTo, navigate]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setSubmitting(true);

    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, form.email, form.password);
      } else {
        const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        await sendEmailVerification(credential.user);
        setMessage('Account created. Check your email for a verification link.');
      }
      setForm({ email: '', password: '' });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setMessage('');
    setSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!form.email) {
      setMessage('Enter your email to receive a reset link.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, form.email);
      setMessage('Password reset email sent.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col gap-6 px-6 py-16">
      <div>
        <p className="section-label text-xs uppercase text-sky-200">Account</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">{mode === 'signin' ? 'Sign in' : 'Create an account'}</h1>
        <p className="mt-2 text-base text-slate-300">
          Use email/password or Google to manage app submissions. Verified email is required before uploading APKs.
        </p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-900/40">
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-white">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleInput}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-semibold text-white">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={handleInput}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-70"
        >
          {mode === 'signin' ? 'Sign in with email' : 'Create account'}
        </button>

        <button
          type="button"
          onClick={() => setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))}
          className="w-full text-center text-sm font-semibold text-sky-200 underline"
        >
          {mode === 'signin' ? 'Need an account?' : 'Have an account? Sign in'}
        </button>

        <button type="button" className="text-xs text-slate-200 underline" onClick={handlePasswordReset}>
          Forgot password?
        </button>
      </form>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-lg shadow-slate-900/40">
        <p className="text-sm text-slate-200">Prefer using Google?</p>
        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-sky-300 disabled:opacity-70"
        >
          <i className="fa-brands fa-google text-base text-sky-300" />
          Continue with Google
        </button>
      </div>

      {message && <p className="text-sm text-white">{message}</p>}

      <p className="text-xs text-slate-400">
        Problems signing in? Contact{' '}
        <a href="mailto:support@jtechforums.org" className="underline">
          support@jtechforums.org
        </a>{' '}
        and mention your JTech username.
      </p>

      <Link to="/apps" className="text-sm text-sky-300 underline">
        Back to apps
      </Link>
    </div>
  );
}
