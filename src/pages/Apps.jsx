import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { sendEmailVerification, signOut } from 'firebase/auth';
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
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth, firestore, storage } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import PageLoader from '../components/PageLoader';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const MAX_FORM_LIMITS = {
  name: 72,
  username: 32,
  header: 160,
  description: 1200,
};

const initialForm = {
  name: '',
  username: '',
  header: '',
  description: '',
  forumUrl: '',
};

export default function Apps() {
  const { user, loading, profile } = useAuth();
  const [approvedApps, setApprovedApps] = useState([]);
  const [pendingApps, setPendingApps] = useState([]);
  const [formValues, setFormValues] = useState(initialForm);
  const [files, setFiles] = useState({ icon: null, apk: null });
  const [submissionStatus, setSubmissionStatus] = useState({ state: 'idle', message: '' });
  const [uploadProgress, setUploadProgress] = useState({ icon: 0, apk: 0 });
  const [moderationMessage, setModerationMessage] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [catalogReady, setCatalogReady] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [supportsTouch, setSupportsTouch] = useState(false);

  const isAdmin = Boolean(profile?.isAdmin || user?.email === ADMIN_EMAIL);

  useEffect(() => {
    setCatalogReady(false);
    setCatalogLoading(true);
    const appsRef = collection(firestore, 'apps');
    const approvedQuery = query(appsRef, where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
    const unsubApproved = onSnapshot(approvedQuery, (snapshot) => {
      setApprovedApps(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
      setCatalogLoading(false);
    });

    let unsubPending = () => {};
    if (isAdmin) {
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
  }, [user?.email, isAdmin]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const detectTouch = () => {
      const coarse = window.matchMedia?.('(pointer: coarse)')?.matches;
      setSupportsTouch(Boolean(coarse || 'ontouchstart' in window));
    };

    detectTouch();
    window.addEventListener('resize', detectTouch);
    return () => window.removeEventListener('resize', detectTouch);
  }, []);

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

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    const limit = MAX_FORM_LIMITS[name];
    const nextValue = typeof limit === 'number' ? value.slice(0, limit) : value;
    setFormValues((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleFileChange = (event) => {
    const { name, files: list } = event.target;
    setFiles((prev) => ({ ...prev, [name]: list?.[0] || null }));
  };

  const handleFileDrop = (name, file) => {
    if (!file) return;
    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  const uploadFile = (path, file, key) =>
    new Promise((resolve, reject) => {
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file);
      task.on(
        'state_changed',
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress((prev) => ({ ...prev, [key]: percent }));
        },
        reject,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        }
      );
    });

  const handleAppSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setSubmissionStatus({ state: 'error', message: 'Sign in before submitting.' });
      return;
    }
    if (!user.emailVerified) {
      setSubmissionStatus({ state: 'error', message: 'Verify your email first.' });
      return;
    }
    if (!files.icon || !files.apk) {
      setSubmissionStatus({ state: 'error', message: 'Upload both an icon and APK.' });
      return;
    }

    setSubmissionStatus({ state: 'loading', message: 'Uploading files...' });
    setUploadProgress({ icon: 0, apk: 0 });
    try {
      const safe = (value) => value.trim();
      const normalizedUsername = safe(formValues.username).startsWith('@')
        ? safe(formValues.username)
        : `@${safe(formValues.username)}`;
      const normalizedLink = formValues.forumUrl?.startsWith('http')
        ? formValues.forumUrl.trim()
        : `https://${formValues.forumUrl.trim()}`;

      const timestamp = Date.now();
      const iconPath = `app-icons/${user.uid}/${timestamp}-${files.icon.name.replace(/\s+/g, '-')}`;
      const apkPath = `app-apks/${user.uid}/${timestamp}-${files.apk.name.replace(/\s+/g, '-')}`;

      const [iconUrl, apkUrl] = await Promise.all([
        uploadFile(iconPath, files.icon, 'icon'),
        uploadFile(apkPath, files.apk, 'apk'),
      ]);

      await addDoc(collection(firestore, 'apps'), {
        name: safe(formValues.name),
        username: normalizedUsername,
        header: safe(formValues.header),
        description: safe(formValues.description),
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
      setSubmissionStatus({ state: 'success', message: 'Submitted for review. Thanks!' });
      setUploadProgress({ icon: 0, apk: 0 });
    } catch (error) {
      console.error(error);
      setSubmissionStatus({ state: 'error', message: error.message || 'Unable to submit app.' });
    }
  };

  const handleModeration = async (appId, status) => {
    try {
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

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleResendVerification = async () => {
    if (!user) return;
    try {
      await sendEmailVerification(user);
      setVerificationMessage('Verification email sent. Check your inbox.');
    } catch (error) {
      setVerificationMessage(error.message);
    }
  };

  const renderSubmissionSection = () => {
    if (loading) {
      return <p className="text-sm text-slate-300">Checking your account...</p>;
    }
    if (!user) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Sign in to contribute</h2>
          <p className="text-sm text-slate-200">
            You need a verified account before uploading APKs.{' '}
            <Link to="/signin" className="text-sky-300 underline">
              Go to sign in
            </Link>
            .
          </p>
        </div>
      );
    }
    if (!user.emailVerified) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Verify your email</h2>
          <p className="text-sm text-slate-200">
            We sent a link to <span className="font-semibold">{user.email}</span>. Once verified, revisit this page to unlock uploads.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white"
              onClick={handleResendVerification}
            >
              Resend verification email
            </button>
            <button
              type="button"
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
          {verificationMessage && <p className="text-sm text-white">{verificationMessage}</p>}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-white">Submit an app</h2>
            <p className="text-sm text-slate-300">Signed in as {user.email}</p>
          </div>
          <button
            type="button"
            className="w-full rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white sm:w-auto"
            onClick={() => setShowSubmissionForm((prev) => !prev)}
          >
            {showSubmissionForm ? 'Hide form' : 'Open submission'}
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Need to upload an APK?</p>
              <p className="text-xs text-slate-400">
                Keep icons ≤2MB, link your forum post, and wait for the admin review queue to approve.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowSubmissionForm((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white"
            >
              <span>{showSubmissionForm ? 'Collapse' : 'Expand form'}</span>
              <i className={`fa-solid ${showSubmissionForm ? 'fa-chevron-up' : 'fa-chevron-down'} text-xs`} />
            </button>
          </div>
          <AnimatePresence initial={false}>
            {showSubmissionForm && (
              <motion.form
                className="mt-6 space-y-4"
                onSubmit={handleAppSubmit}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="App name"
                  name="name"
                  value={formValues.name}
                  onChange={handleFormChange}
                  required
                  autoComplete="off"
                  autoCapitalize="words"
                  enterKeyHint="next"
                maxLength={MAX_FORM_LIMITS.header}
                />
                <InputField
                  label="JTech username"
                  name="username"
                  value={formValues.username}
                  onChange={handleFormChange}
                  placeholder="@you"
                  required
                  autoComplete="username"
                  enterKeyHint="next"
                />
              </div>
              <InputField
                label="Header info"
                name="header"
                value={formValues.header}
                onChange={handleFormChange}
                required
                autoComplete="off"
                enterKeyHint="next"
              />
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
                <p className="mt-1 text-xs text-slate-400">
                  {formValues.description.length}/{MAX_FORM_LIMITS.description} characters
                </p>
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
                <FileField
                  label="App icon"
                  name="icon"
                  accept="image/png,image/jpeg,image/webp"
                  file={files.icon}
                  onChange={handleFileChange}
                  onDropFile={handleFileDrop}
                  helper="PNG/JPG/WebP • 1024×1024 preferred • < 2 MB"
                  progress={uploadProgress.icon}
                />
                <FileField
                  label="APK file"
                  name="apk"
                  accept=".apk"
                  file={files.apk}
                  onChange={handleFileChange}
                  onDropFile={handleFileDrop}
                  helper="Signed release build • max 200 MB"
                  progress={uploadProgress.apk}
                />
              </div>
              <button
                type="submit"
                disabled={submissionStatus.state === 'loading'}
                className="w-full rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-70"
              >
                {submissionStatus.state === 'loading' ? 'Submitting…' : 'Submit for review'}
              </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        {submissionStatus.message && (
          <p className={`text-sm ${submissionStatus.state === 'error' ? 'text-rose-200' : 'text-emerald-300'}`}>
            {submissionStatus.message}
          </p>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (catalogLoading) {
      setCatalogReady(false);
      return undefined;
    }
    const timeout = setTimeout(() => setCatalogReady(true), 600);
    return () => clearTimeout(timeout);
  }, [catalogLoading]);

  return (
    <>
      <PageLoader show={!catalogReady} label="Loading catalog" />
      <div
        className={`mx-auto max-w-5xl space-y-12 px-6 py-16 transition-opacity duration-500 ${catalogReady ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
      <section className="text-center">
        <p className="section-label text-xs uppercase text-sky-200">Apps</p>
        <h1 className="mt-4 text-5xl font-semibold text-white">Community App Catalog</h1>
        <p className="mt-3 text-base text-slate-300">
          Browse vetted APKs submitted by verified community members. Upload your own builds, icons, and forum links so the admin team can
          review them before they land here.
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
                    <img
                      src={app.iconUrl}
                      alt={`${app.name} icon`}
                      className="h-14 w-14 rounded-2xl object-cover"
                      referrerPolicy="no-referrer"
                    />
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
        {renderSubmissionSection()}
      </section>

      {user?.email === ADMIN_EMAIL && (
        <section className="rounded-3xl border border-amber-300/30 bg-amber-300/5 p-6 shadow-lg shadow-amber-900/20">
          <h2 className="text-2xl font-semibold text-white">Admin review queue</h2>
          <p className="mt-2 text-sm text-amber-100">Only admins can see this section.</p>
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
    </>
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

function FileField({ label, name, accept, onChange, onDropFile, file, helper, progress }) {
  const [dragging, setDragging] = useState(false);

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragging(true);
    } else if (event.type === 'dragleave') {
      setDragging(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    const droppedFile = event.dataTransfer?.files?.[0];
    if (droppedFile) {
      onDropFile(name, droppedFile);
    }
  };

  return (
    <div>
      <label className="text-sm font-semibold text-white">{label}</label>
      <label
        htmlFor={name}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-4 py-8 text-center text-sm text-white transition ${
          dragging ? 'border-sky-400 bg-slate-900/70' : 'border-white/20 bg-slate-900/30 hover:border-sky-400 hover:bg-slate-900/60'
        }`}
      >
        <i className="fa-solid fa-cloud-arrow-up text-2xl text-sky-300" />
        <span className="mt-2 font-semibold">{file ? 'Replace file' : 'Click or drag to upload'}</span>
        {file && <span className="mt-1 text-xs text-slate-300">{file.name}</span>}
        {helper && <span className="mt-1 text-xs text-slate-400">{helper}</span>}
        {progress > 0 && progress < 100 && (
          <div className="mt-4 h-2 w-full rounded-full bg-white/10">
            <div className="h-full rounded-full bg-sky-400" style={{ width: `${progress}%` }} />
          </div>
        )}
      </label>
      <input id={name} name={name} type="file" accept={accept} onChange={onChange} className="hidden" />
    </div>
  );
}
