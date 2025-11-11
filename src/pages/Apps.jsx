import { useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, firestore, storage } from '../lib/firebase';

const ADMIN_EMAIL = 'tripleuworld@gmail.com';
const initialForm = {
  name: '',
  username: '',
  header: '',
  description: '',
  forumUrl: '',
};

export default function Apps() {
  const [user, setUser] = useState(null);
  const [approvedApps, setApprovedApps] = useState([]);
  const [pendingApps, setPendingApps] = useState([]);
  const [authMode, setAuthMode] = useState('signin');
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authMessage, setAuthMessage] = useState('');
  const [formValues, setFormValues] = useState(initialForm);
  const [files, setFiles] = useState({ icon: null, apk: null });
  const [submissionStatus, setSubmissionStatus] = useState({ state: 'idle', message: '' });
  const [moderationMessage, setModerationMessage] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const appsRef = collection(firestore, 'apps');
    const approvedQuery = query(appsRef, where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
    const unsubApproved = onSnapshot(approvedQuery, (snapshot) => {
      setApprovedApps(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
    });

    let unsubPending = () => {};
    if (user?.email === ADMIN_EMAIL) {
      const pendingQuery = query(appsRef, where('status', '==', 'pending'), orderBy('createdAt', 'asc'));
      unsubPending = onSnapshot(pendingQuery, (snapshot) => {
        setPendingApps(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
      });
    } else {
      setPendingApps([]);
    }

    return () => {
      unsubApproved();
      unsubPending();
    };
  }, [user?.email]);

  const approvedAppCards = useMemo(
    () =>
      approvedApps.map((app) => ({
        ...app,
        createdLabel: app.createdAt?.toDate
          ? new Intl.DateTimeFormat(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(app.createdAt.toDate())
          : '',
      })),
    [approvedApps]
  );

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthMessage('');
    try {
      if (authMode === 'signin') {
        await signInWithEmailAndPassword(auth, authForm.email, authForm.password);
        setAuthMessage('Signed in successfully.');
      } else {
        const credential = await createUserWithEmailAndPassword(auth, authForm.email, authForm.password);
        await sendEmailVerification(credential.user);
        setAuthMessage('Account created. Check your inbox for a verification link.');
      }
      setAuthForm({ email: '', password: '' });
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!authForm.email) {
      setAuthMessage('Enter your email to receive a reset link.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, authForm.email);
      setAuthMessage('Password reset email sent.');
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;
    try {
      await sendEmailVerification(user);
      setAuthMessage('Verification email sent.');
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setAuthMessage('');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const { name, files: selected } = event.target;
    setFiles((prev) => ({ ...prev, [name]: selected?.[0] || null }));
  };

  const uploadFile = async (path, file) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };

  const handleAppSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setSubmissionStatus({ state: 'error', message: 'You must be signed in to submit an app.' });
      return;
    }
    if (!user.emailVerified) {
      setSubmissionStatus({ state: 'error', message: 'Verify your email before submitting.' });
      return;
    }

    if (!files.icon || !files.apk) {
      setSubmissionStatus({ state: 'error', message: 'Upload both an icon and APK.' });
      return;
    }

    setSubmissionStatus({ state: 'loading', message: 'Uploading files...' });

    try {
      const safeName = (value) => value.trim();
      const normalizedUsername = safeName(formValues.username).startsWith('@')
        ? safeName(formValues.username)
        : `@${safeName(formValues.username)}`;
      const normalizedLink = formValues.forumUrl?.startsWith('http')
        ? formValues.forumUrl.trim()
        : `https://${formValues.forumUrl.trim()}`;

      const timestamp = Date.now();
      const iconPath = `app-icons/${user.uid}/${timestamp}-${files.icon.name.replace(/\s+/g, '-')}`;
      const apkPath = `app-apks/${user.uid}/${timestamp}-${files.apk.name.replace(/\s+/g, '-')}`;

      const [iconUrl, apkUrl] = await Promise.all([
        uploadFile(iconPath, files.icon),
        uploadFile(apkPath, files.apk),
      ]);

      await addDoc(collection(firestore, 'apps'), {
        name: safeName(formValues.name),
        username: normalizedUsername,
        header: safeName(formValues.header),
        description: safeName(formValues.description),
        forumUrl: normalizedLink,
        iconUrl,
        iconPath,
        apkUrl,
        apkPath,
        uploaderUid: user.uid,
        uploaderEmail: user.email,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setFormValues(initialForm);
      setFiles({ icon: null, apk: null });
      setSubmissionStatus({ state: 'success', message: 'Submitted for review. Thanks for contributing!' });
    } catch (error) {
      console.error(error);
      setSubmissionStatus({ state: 'error', message: error.message || 'Unable to submit app.' });
    }
  };

  const handleModeration = async (appId, status) => {
    try {
      setModerationMessage('');
      await updateDoc(doc(firestore, 'apps', appId), {
        status,
        reviewerEmail: user.email,
        reviewedAt: serverTimestamp(),
      });
      setModerationMessage(`App ${status}.`);
    } catch (error) {
      setModerationMessage(error.message || 'Unable to update submission.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 py-16">
      <section className="text-center">
        <p className="section-label text-xs uppercase text-sky-200">Apps</p>
        <h1 className="mt-4 text-5xl font-semibold text-white">Community App Catalog</h1>
        <p className="mt-3 text-base text-slate-300">
          Browse vetted APKs submitted by verified community members. Upload your own builds, icons, and forum links so the
          admin team can review them before they land here.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-white">Approved uploads</h2>
        {approvedAppCards.length === 0 ? (
          <p className="text-slate-400">No apps have been approved yet. Check back soon!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {approvedAppCards.map((app) => (
              <article
                key={app.id}
                className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-sky-900/20"
              >
                <div className="flex items-center gap-4">
                  {app.iconUrl ? (
                    <img src={app.iconUrl} alt={`${app.name} icon`} className="h-14 w-14 rounded-2xl object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-xl text-white">
                      {app.name?.[0] ?? '?'}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-white">{app.name}</h3>
                    <p className="text-sm text-slate-300">{app.header}</p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm text-slate-200">{app.description}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                  <span>{app.username}</span>
                  <span>{app.createdLabel}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {app.forumUrl && (
                    <a
                      href={app.forumUrl}
                      target="_blank"
                      rel="noopener"
                      className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-sky-400"
                    >
                      Forum guide
                    </a>
                  )}
                  {app.apkUrl && (
                    <a
                      href={app.apkUrl}
                      target="_blank"
                      rel="noopener"
                      className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                    >
                      Download APK
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-900/30">
        {!user ? (
          <AuthCard
            authMode={authMode}
            setAuthMode={setAuthMode}
            authForm={authForm}
            setAuthForm={setAuthForm}
            onSubmit={handleAuthSubmit}
            onPasswordReset={handlePasswordReset}
            authMessage={authMessage}
          />
        ) : (
          <VerifiedSubmissionSection
            user={user}
            onSignOut={handleSignOut}
            onResendVerification={handleResendVerification}
            formValues={formValues}
            setFormValues={setFormValues}
            files={files}
            handleFileChange={handleFileChange}
            handleFormChange={handleFormChange}
            handleAppSubmit={handleAppSubmit}
            submissionStatus={submissionStatus}
          />
        )}
      </section>

      {user?.email === ADMIN_EMAIL && (
        <section className="rounded-3xl border border-amber-300/30 bg-amber-300/5 p-6 shadow-lg shadow-amber-900/20">
          <h2 className="text-2xl font-semibold text-white">Admin review queue</h2>
          <p className="mt-2 text-sm text-amber-100">Only you can see this section.</p>
          {moderationMessage && <p className="mt-3 text-sm text-white">{moderationMessage}</p>}
          {pendingApps.length === 0 ? (
            <p className="mt-4 text-sm text-white/80">No pending submissions.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {pendingApps.map((app) => (
                <article key={app.id} className="rounded-2xl border border-white/20 bg-black/30 p-4">
                  <div className="flex flex-col gap-2 text-sm text-white">
                    <p className="text-lg font-semibold">{app.name}</p>
                    <p>{app.header}</p>
                    <p className="text-xs text-white/70">Submitted by {app.username} ({app.uploaderEmail})</p>
                    {app.forumUrl && (
                      <a href={app.forumUrl} target="_blank" rel="noopener" className="text-sky-300 underline">
                        Forum / guide link
                      </a>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                      onClick={() => handleModeration(app.id, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
                      onClick={() => handleModeration(app.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function AuthCard({ authMode, setAuthMode, authForm, setAuthForm, onSubmit, onPasswordReset, authMessage }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">{authMode === 'signin' ? 'Sign in' : 'Sign up'}</h2>
        <button
          type="button"
          className="text-sm font-semibold text-sky-300 underline"
          onClick={() => setAuthMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))}
        >
          {authMode === 'signin' ? 'Need an account?' : 'Have an account?'}
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="auth-email" className="text-sm font-semibold text-white">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            name="email"
            required
            value={authForm.email}
            onChange={(event) => setAuthForm((prev) => ({ ...prev, email: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="auth-password" className="text-sm font-semibold text-white">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            name="password"
            required
            minLength={8}
            value={authForm.password}
            onChange={(event) => setAuthForm((prev) => ({ ...prev, password: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
        >
          {authMode === 'signin' ? 'Sign in' : 'Sign up'}
        </button>
      </form>
      <button type="button" className="text-xs text-sky-200 underline" onClick={onPasswordReset}>
        Forgot password?
      </button>
      {authMessage && <p className="text-sm text-white">{authMessage}</p>}
    </div>
  );
}

function VerifiedSubmissionSection({
  user,
  onSignOut,
  onResendVerification,
  formValues,
  setFormValues,
  files,
  handleFileChange,
  handleFormChange,
  handleAppSubmit,
  submissionStatus,
}) {
  if (!user.emailVerified) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Verify your email</h2>
        <p className="text-sm text-slate-200">
          We sent a verification link to <span className="font-semibold">{user.email}</span>. Once you verify, refresh this page and
          the submission form will unlock.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white"
            onClick={onResendVerification}
          >
            Resend verification email
          </button>
          <button
            type="button"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white"
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Submit an app</h2>
          <p className="text-sm text-slate-200">Signed in as {user.email}</p>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white"
          onClick={onSignOut}
        >
          Sign out
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleAppSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="App name" name="name" value={formValues.name} onChange={handleFormChange} required />
          <InputField
            label="JTech username"
            name="username"
            value={formValues.username}
            onChange={handleFormChange}
            required
            placeholder="@you"
          />
        </div>
        <InputField label="Header info" name="header" value={formValues.header} onChange={handleFormChange} required />
        <div>
          <label className="text-sm font-semibold text-white" htmlFor="description">
            More info
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            required
            value={formValues.description}
            onChange={handleFormChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
          />
        </div>
        <InputField
          label="Guide or forum link"
          name="forumUrl"
          value={formValues.forumUrl}
          onChange={handleFormChange}
          placeholder="https://forums.jtechforums.org/..."
          required
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FileField label="App icon" name="icon" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} file={files.icon} />
          <FileField label="APK file" name="apk" accept=".apk" onChange={handleFileChange} file={files.apk} />
        </div>

        <button
          type="submit"
          disabled={submissionStatus.state === 'loading'}
          className="w-full rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-wait disabled:opacity-70"
        >
          {submissionStatus.state === 'loading' ? 'Submitting...' : 'Submit for review'}
        </button>
      </form>

      {submissionStatus.message && (
        <p
          className={`text-sm ${
            submissionStatus.state === 'error' ? 'text-rose-200' : 'text-emerald-300'
          }`}
        >
          {submissionStatus.message}
        </p>
      )}
    </div>
  );
}

function InputField({ label, name, value, onChange, required, placeholder }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-white">
        {label}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-sky-400 focus:outline-none"
      />
    </div>
  );
}

function FileField({ label, name, accept, onChange, file }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-white">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        accept={accept}
        onChange={onChange}
        className="mt-2 w-full rounded-2xl border border-dashed border-white/20 bg-black/10 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
      />
      {file && <p className="mt-1 text-xs text-slate-300">{file.name}</p>}
    </div>
  );
}
