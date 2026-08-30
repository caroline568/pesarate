import { useRef, useState } from "react";
import { Camera, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import PageHeader from "../components/PageHeader";
import { Card, CardEyebrow } from "../components/Card";

const MAX_DIMENSION = 256; // resized square, keeps the upload well under the backend's size cap

function resizeImageToDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Couldn't read that file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That doesn't look like a valid image"));
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = MAX_DIMENSION;
        canvas.height = MAX_DIMENSION;
        const ctx = canvas.getContext("2d");
        // Center-crop to a square, then downscale — keeps the avatar small
        // and consistent regardless of the source photo's aspect ratio.
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, MAX_DIMENSION, MAX_DIMENSION);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const fileInputRef = useRef(null);
  const [name, setName] = useState(user?.name || "");
  const [uploading, setUploading] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const dataUri = await resizeImageToDataUri(file);
      await updateProfile({ avatar: dataUri });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const saveName = async (e) => {
    e.preventDefault();
    setSavingName(true);
    setError("");
    try {
      await updateProfile({ name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingName(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Account" title="Profile" description="Your PesaRate identity — visible only to you." />

      <Card className="p-6 sm:p-7">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-2 border-lime/40 bg-paper/10">
              {user?.avatar ? (
                <img src={user.avatar} alt="Your avatar" className="h-full w-full object-cover" />
              ) : (
                <UserIcon size={32} className="text-paper/40" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 grid h-9 w-9 place-items-center rounded-full bg-lime text-ink shadow-lg disabled:opacity-60"
              aria-label="Change profile photo"
            >
              <Camera size={15} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <CardEyebrow>Signed in as</CardEyebrow>
            <p className="mt-1 font-medium">{user?.email}</p>
            <p className="mt-1 text-xs text-paper/45 capitalize">{user?.auth_provider} account</p>
            {uploading && <p className="mt-2 text-xs text-lime">Uploading photo…</p>}
          </div>
        </div>

        <form onSubmit={saveName} className="mt-7 border-t border-line pt-6">
          <label className="block text-xs text-paper/50">Display name</label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Add a name"
              className="w-full rounded-xl border border-paper/10 bg-ink/40 p-3 outline-none focus:border-lime/50"
            />
            <button
              type="submit"
              disabled={savingName}
              className="rounded-xl bg-lime px-5 py-3 text-sm font-semibold text-ink disabled:opacity-60"
            >
              {savingName ? "Saving…" : saved ? "Saved ✓" : "Save"}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-4 rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral" role="alert">
            {error}
          </p>
        )}

        <button
          onClick={logout}
          className="mt-7 inline-flex items-center gap-2 text-sm text-paper/50 hover:text-coral"
        >
          <LogOut size={15} /> Sign out
        </button>
      </Card>
    </div>
  );
}
