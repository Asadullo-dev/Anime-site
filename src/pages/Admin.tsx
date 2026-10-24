import React, { useState, useEffect } from "react";
import {
  db,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
} from "../firebase";
import { User, Anime, Episode } from "../types";
import {
  ShieldAlert,
  Plus,
  RefreshCw,
  Trash2,
  LayoutDashboard,
  Film,
  UploadCloud,
  X,
} from "lucide-react";
import {
  uploadVideo,
  deleteVideoFile,
  extractFilenameFromVideoUrl,
} from "../api";

interface AdminProps {
  user: User | null;
}

const DEMO_ANIME = [
  {
    title: "Shadow Blade Academy",
    description:
      "A young swordsman enrolls in a secret academy to master the dark arts and avenge his fallen clan.",
    category: "Action",
    rating: "4.8",
    releaseYear: "2024",
    language: "Sub",
    status: "Ongoing",
    tags: ["Swords", "School", "Dark Fantasy"],
    posterUrl:
      "https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?q=80&w=400&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?q=80&w=1200&fit=crop",
  },
  {
    title: "Cyber Ninja Reborn",
    description:
      "In a neon-drenched future Tokyo, a resurrected ninja battles mega-corporations using a mix of ancient techniques and cybernetic enhancements.",
    category: "Sci-Fi",
    rating: "4.9",
    releaseYear: "2023",
    language: "Dub",
    status: "Completed",
    tags: ["Cyberpunk", "Ninja", "Sci-Fi Action"],
    posterUrl:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=400&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&fit=crop",
  },
  {
    title: "Dragon Soul Quest",
    description:
      "An epic journey to find the scattered pieces of the Dragon Soul to prevent the revival of the ancient evil.",
    category: "Fantasy",
    rating: "4.6",
    releaseYear: "2024",
    language: "Sub",
    status: "Ongoing",
    tags: ["Magic", "Dragons", "Adventure"],
    posterUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&fit=crop",
  },
  {
    title: "Moonlight Samurai",
    description:
      "A wandering samurai protects the weak in a fictional historical era, guided only by the moonlight and his code of honor.",
    category: "Action",
    rating: "4.7",
    releaseYear: "2022",
    language: "Sub",
    status: "Completed",
    tags: ["Historical", "Samurai", "Drama"],
    posterUrl:
      "https://images.unsplash.com/photo-1554162035-77983c2763db?q=80&w=400&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1554162035-77983c2763db?q=80&w=1200&fit=crop",
  },
  {
    title: "Galaxy Titan Wars",
    description:
      "Humanity reaches the stars only to find them ruled by colossal titans. The ultimate mech war begins.",
    category: "Sci-Fi",
    rating: "4.5",
    releaseYear: "2023",
    language: "Dub",
    status: "Completed",
    tags: ["Mecha", "Space", "War"],
    posterUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&fit=crop",
  },
  {
    title: "Magic Hunter Zero",
    description:
      "In a world where magic is outlawed, a rebellious teen discovers she holds the key to the Zero Spell.",
    category: "Fantasy",
    rating: "4.8",
    releaseYear: "2024",
    language: "Sub",
    status: "Ongoing",
    tags: ["Magic", "Rebellion", "Action"],
    posterUrl:
      "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=400&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=1200&fit=crop",
  },
  {
    title: "Spirit Runner",
    description:
      "A young track star accidentally runs into the spirit realm and must participate in the ethereal games to win her way back.",
    category: "Adventure",
    rating: "4.4",
    releaseYear: "2024",
    language: "Sub",
    status: "Ongoing",
    tags: ["Sports", "Spirits", "Supernatural"],
    posterUrl:
      "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=400&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=1200&fit=crop",
  },
  {
    title: "Neon Tokyo Heroes",
    description:
      "A group of misfits gain extraordinary abilities from a mysterious energy source and form an unlikely superhero team.",
    category: "Action",
    rating: "4.7",
    releaseYear: "2023",
    language: "Dub",
    status: "Completed",
    tags: ["Superpower", "City", "Comedy"],
    posterUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=400&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&fit=crop",
  },
  {
    title: "Fire Fist Legends",
    description:
      "Underground martial arts tournaments where fighters can manipulate the elements. The search for the legendary Fire Fist begins.",
    category: "Action",
    rating: "4.9",
    releaseYear: "2024",
    language: "Sub",
    status: "Ongoing",
    tags: ["Martial Arts", "Tournament", "Superpower"],
    posterUrl:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=400&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=1200&fit=crop",
  },
  {
    title: "Ocean Guardian",
    description:
      "Protectors of the deep sea realms clash with surface dwellers in this visually stunning environmental fantasy.",
    category: "Fantasy",
    rating: "4.5",
    releaseYear: "2022",
    language: "Dub",
    status: "Completed",
    tags: ["Ocean", "Environment", "Magic"],
    posterUrl:
      "https://images.unsplash.com/photo-1498623116890-37e912163d5d?q=80&w=400&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1498623116890-37e912163d5d?q=80&w=1200&fit=crop",
  },
  {
    title: "Dark Crystal Saga",
    description:
      "An artifact of immense power shatters, sending fragments across the dimensions. A lone wanderer must collect them all.",
    category: "Adventure",
    rating: "4.6",
    releaseYear: "2023",
    language: "Sub",
    status: "Completed",
    tags: ["Isekai", "Magic", "Journey"],
    posterUrl:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=400&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&fit=crop",
  },
  {
    title: "Sky Warriors",
    description:
      "Aerial dogfights using vintage aircraft modified with futuristic tech in a world consisting entirely of floating islands.",
    category: "Sci-Fi",
    rating: "4.8",
    releaseYear: "2024",
    language: "Dub",
    status: "Ongoing",
    tags: ["Aviation", "Steampunk", "Action"],
    posterUrl:
      "https://images.unsplash.com/photo-1473220464526-9d2a233b2a26?q=80&w=400&fit=crop",
    bannerUrl:
      "https://images.unsplash.com/photo-1473220464526-9d2a233b2a26?q=80&w=1200&fit=crop",
  },
];

export default function Admin({ user }: AdminProps) {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [totalEpisodeCount, setTotalEpisodeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [newAnime, setNewAnime] = useState<Partial<Anime>>({
    title: "",
    description: "",
    category: "Action",
    rating: "",
    releaseYear: new Date().getFullYear().toString(),
    language: "Sub",
    status: "Ongoing",
    tags: [],
    posterUrl: "",
    bannerUrl: "",
  });

  // --- Epizod boshqaruvi ---
  const [managingAnime, setManagingAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [newEpisode, setNewEpisode] = useState<Partial<Episode>>({
    episodeNumber: 1,
    episodeTitle: "",
    thumbnailUrl: "",
    duration: "",
    language: "Sub",
  });

  useEffect(() => {
    fetchAnimes();
  }, []);

  async function openEpisodeManager(anime: Anime) {
    setManagingAnime(anime);
    setUploadError(null);
    setVideoFile(null);
    setNewEpisode({
      episodeNumber: 1,
      episodeTitle: "",
      thumbnailUrl: anime.posterUrl || "",
      duration: "",
      language: anime.language || "Sub",
    });
    await fetchEpisodes(anime.id!);
  }

  async function fetchEpisodes(animeId: string) {
    setEpisodesLoading(true);
    try {
      const q = query(
        collection(db, "episodes"),
        where("animeId", "==", animeId),
        orderBy("episodeNumber", "asc"),
      );
      const snap = await getDocs(q);
      const list: Episode[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Episode));
      setEpisodes(list);
      // Keyingi epizod raqamini avtomatik taklif qilish
      const nextNumber =
        list.length > 0 ? Math.max(...list.map((e) => e.episodeNumber)) + 1 : 1;
      setNewEpisode((prev) => ({ ...prev, episodeNumber: nextNumber }));
    } catch (err) {
      console.error(err);
    } finally {
      setEpisodesLoading(false);
    }
  }

  async function handleAddEpisode(e: React.FormEvent) {
    e.preventDefault();
    if (!managingAnime) return;
    setUploadError(null);

    if (!newEpisode.episodeTitle) {
      setUploadError("Epizod nomini kiriting.");
      return;
    }
    if (!videoFile) {
      setUploadError("Video faylni tanlang.");
      return;
    }

    try {
      setUploadProgress(0);
      const result = await uploadVideo(videoFile, (percent) =>
        setUploadProgress(percent),
      );

      await addDoc(collection(db, "episodes"), {
        animeId: managingAnime.id,
        episodeNumber: Number(newEpisode.episodeNumber) || 1,
        episodeTitle: newEpisode.episodeTitle,
        thumbnailUrl: newEpisode.thumbnailUrl || managingAnime.posterUrl || "",
        videoUrl: result.videoUrl,
        duration: newEpisode.duration || "",
        language: newEpisode.language || "Sub",
        createdAt: serverTimestamp(),
      });

      setVideoFile(null);
      setUploadProgress(null);
      setTotalEpisodeCount((prev) => prev + 1);
      await fetchEpisodes(managingAnime.id!);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Video yuklashda xatolik yuz berdi.");
      setUploadProgress(null);
    }
  }

  async function handleDeleteEpisode(ep: Episode) {
    if (!confirm(`"${ep.episodeTitle}" epizodini o'chirishni xohlaysizmi?`))
      return;
    try {
      // Agar video o'zimizning serverimizda saqlangan bo'lsa, diskdan ham o'chiramiz
      const filename = ep.videoUrl
        ? extractFilenameFromVideoUrl(ep.videoUrl)
        : null;
      if (filename) {
        await deleteVideoFile(filename).catch((err) =>
          console.warn("Video faylni o'chirishda ogohlantirish:", err.message),
        );
      }
      await deleteDoc(doc(db, "episodes", ep.id!));
      setEpisodes(episodes.filter((e) => e.id !== ep.id));
      setTotalEpisodeCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Epizodni o'chirishda xatolik.");
    }
  }

  async function fetchAnimes() {
    setLoading(true);
    try {
      const q = query(collection(db, "anime"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list: Anime[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Anime));
      setAnimes(list);

      // Barcha epizodlarning haqiqiy sonini olish (taxminiy hisob emas)
      const epSnap = await getDocs(collection(db, "episodes"));
      setTotalEpisodeCount(epSnap.size);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSeedData() {
    if (animes.length > 0) {
      if (
        !confirm(
          "Data already exists. Are you sure you want to add duplicate demo content?",
        )
      )
        return;
    }
    setSeeding(true);
    try {
      // Create Categories
      const categories = [
        "Action",
        "Fantasy",
        "Adventure",
        "Romance",
        "Sci-Fi",
        "Comedy",
      ];
      for (const cat of categories) {
        await addDoc(collection(db, "categories"), {
          name: cat,
          createdAt: serverTimestamp(),
        });
      }

      // Create Anime & Episodes
      for (const item of DEMO_ANIME) {
        const animeRef = await addDoc(collection(db, "anime"), {
          ...item,
          createdAt: serverTimestamp(),
        });

        // Add 3 fake episodes for each anime
        for (let i = 1; i <= 3; i++) {
          await addDoc(collection(db, "episodes"), {
            animeId: animeRef.id,
            episodeNumber: i,
            episodeTitle: `The Beginning - Part ${i}`,
            thumbnailUrl: item.posterUrl,
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // safe placeholder
            duration: "24:00",
            language: item.language,
            createdAt: serverTimestamp(),
          });
        }
      }
      alert("Demo data seeded successfully!");
      fetchAnimes();
    } catch (err) {
      console.error(err);
      alert("Failed to seed data.");
    } finally {
      setSeeding(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this anime?")) return;
    try {
      await deleteDoc(doc(db, "anime", id));
      setAnimes(animes.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    }
  }

  async function handleAddAnime(e: React.FormEvent) {
    e.preventDefault();
    if (!newAnime.title || !newAnime.description) {
      alert("Please fill at least title and description.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "anime"), {
        ...newAnime,
        createdAt: serverTimestamp(),
      });
      setIsAdding(false);
      setNewAnime({
        title: "",
        description: "",
        category: "Action",
        rating: "",
        releaseYear: new Date().getFullYear().toString(),
        language: "Sub",
        status: "Ongoing",
        tags: [],
        posterUrl: "",
        bannerUrl: "",
      });
      fetchAnimes();
    } catch (err) {
      console.error(err);
      alert("Failed to add anime.");
      setLoading(false);
    }
  }

  if (user?.role !== "admin") {
    return <div className="pt-24 text-center">Access Denied</div>;
  }

  return (
    <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand/20 flex items-center justify-center border border-brand">
          <ShieldAlert className="text-brand w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display text-3xl uppercase tracking-tighter">
            Admin Dashboard
          </h1>
          <p className="text-text-muted text-sm">
            Manage content, users, and platform settings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-6 rounded-2xl border border-gray-800">
          <div className="text-text-muted text-xs uppercase font-bold tracking-wider mb-2">
            Total Anime
          </div>
          <div className="text-4xl font-display text-white">
            {animes.length}
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-gray-800">
          <div className="text-text-muted text-xs uppercase font-bold tracking-wider mb-2">
            Total Episodes
          </div>
          <div className="text-4xl font-display text-white">
            {totalEpisodeCount}
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex items-center justify-center">
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-brand hover:text-brand-hover transition-colors"
          >
            {seeding ? (
              <RefreshCw className="w-8 h-8 animate-spin" />
            ) : (
              <LayoutDashboard className="w-8 h-8" />
            )}
            <span className="text-sm font-bold uppercase tracking-wider">
              {seeding ? "Seeding..." : "Seed Demo Data"}
            </span>
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-white/5">
          <h2 className="font-display text-xl uppercase tracking-tight">
            Content Library
          </h2>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Anime
          </button>
        </div>

        {loading && !isAdding ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 text-xs uppercase tracking-wider text-text-muted">
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Year</th>
                  <th className="p-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {animes.map((anime) => (
                  <tr
                    key={anime.id}
                    className="border-b border-gray-800/50 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={anime.posterUrl}
                          alt={anime.title}
                          className="w-10 h-14 object-cover rounded"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-semibold">{anime.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {anime.category}
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-sm bg-white/10 text-gray-300 uppercase">
                        {anime.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {anime.releaseYear}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEpisodeManager(anime)}
                          className="p-2 hover:bg-brand/20 text-brand rounded-lg transition-colors"
                          title="Epizodlarni boshqarish"
                        >
                          <Film className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(anime.id!)}
                          className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                          title="Animeni o'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {animes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No anime found. Click "Seed Demo Data" above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151619] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl uppercase tracking-tight">
                Add New Anime
              </h2>
              <button
                onClick={() => setIsAdding(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAnime} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Title
                  </label>
                  <input
                    required
                    type="text"
                    value={newAnime.title}
                    onChange={(e) =>
                      setNewAnime({ ...newAnime, title: e.target.value })
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors"
                    placeholder="e.g. Shadow Blade Academy"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Category
                  </label>
                  <select
                    value={newAnime.category}
                    onChange={(e) =>
                      setNewAnime({ ...newAnime, category: e.target.value })
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors"
                  >
                    <option value="Action">Action</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Comedy">Comedy</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-gray-400">
                  Description
                </label>
                <textarea
                  required
                  value={newAnime.description}
                  onChange={(e) =>
                    setNewAnime({ ...newAnime, description: e.target.value })
                  }
                  className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors min-h-[100px]"
                  placeholder="Anime description..."
                ></textarea>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Rating
                  </label>
                  <input
                    type="text"
                    value={newAnime.rating}
                    onChange={(e) =>
                      setNewAnime({ ...newAnime, rating: e.target.value })
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors"
                    placeholder="e.g. 4.8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Year
                  </label>
                  <input
                    type="text"
                    value={newAnime.releaseYear}
                    onChange={(e) =>
                      setNewAnime({ ...newAnime, releaseYear: e.target.value })
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors"
                    placeholder="e.g. 2024"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Language
                  </label>
                  <select
                    value={newAnime.language}
                    onChange={(e) =>
                      setNewAnime({ ...newAnime, language: e.target.value })
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors"
                  >
                    <option value="Sub">Sub</option>
                    <option value="Dub">Dub</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Status
                  </label>
                  <select
                    value={newAnime.status}
                    onChange={(e) =>
                      setNewAnime({ ...newAnime, status: e.target.value })
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Poster URL
                  </label>
                  <input
                    type="text"
                    value={newAnime.posterUrl}
                    onChange={(e) =>
                      setNewAnime({ ...newAnime, posterUrl: e.target.value })
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Banner URL
                  </label>
                  <input
                    type="text"
                    value={newAnime.bannerUrl}
                    onChange={(e) =>
                      setNewAnime({ ...newAnime, bannerUrl: e.target.value })
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 mt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white p-4 rounded-xl font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand hover:bg-brand-hover text-white p-4 rounded-xl font-bold uppercase tracking-wider transition-colors"
                >
                  {loading ? "Adding..." : "Save Anime"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {managingAnime && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#151619] border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-display text-2xl uppercase tracking-tight">
                  Epizodlar
                </h2>
                <p className="text-text-muted text-sm">{managingAnime.title}</p>
              </div>
              <button
                onClick={() => setManagingAnime(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mavjud epizodlar ro'yxati */}
            <div className="mb-8 space-y-2">
              {episodesLoading ? (
                <div className="text-center text-gray-500 py-6">
                  Yuklanmoqda...
                </div>
              ) : episodes.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  Hali epizodlar qo'shilmagan.
                </div>
              ) : (
                episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex items-center justify-between bg-black/40 border border-gray-800 rounded-xl p-3"
                  >
                    <div>
                      <div className="font-semibold text-sm">
                        {ep.episodeNumber}-qism: {ep.episodeTitle}
                      </div>
                      <div className="text-xs text-text-muted">
                        {ep.duration} · {ep.language}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEpisode(ep)}
                      className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Yangi epizod qo'shish formasi */}
            <form
              onSubmit={handleAddEpisode}
              className="space-y-4 border-t border-gray-800 pt-6"
            >
              <h3 className="font-display text-lg uppercase tracking-tight">
                Yangi epizod qo'shish
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Qism raqami
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newEpisode.episodeNumber}
                    onChange={(e) =>
                      setNewEpisode({
                        ...newEpisode,
                        episodeNumber: Number(e.target.value),
                      })
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1 col-span-2 md:col-span-2">
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Epizod nomi
                  </label>
                  <input
                    required
                    type="text"
                    value={newEpisode.episodeTitle}
                    onChange={(e) =>
                      setNewEpisode({
                        ...newEpisode,
                        episodeTitle: e.target.value,
                      })
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors"
                    placeholder="Masalan: Boshlanish"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Til
                  </label>
                  <select
                    value={newEpisode.language}
                    onChange={(e) =>
                      setNewEpisode({ ...newEpisode, language: e.target.value })
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors"
                  >
                    <option value="Sub">Sub</option>
                    <option value="Dub">Dub</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Davomiyligi
                  </label>
                  <input
                    type="text"
                    value={newEpisode.duration}
                    onChange={(e) =>
                      setNewEpisode({ ...newEpisode, duration: e.target.value })
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors"
                    placeholder="masalan: 24:00"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-gray-400">
                    Thumbnail URL (ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={newEpisode.thumbnailUrl}
                    onChange={(e) =>
                      setNewEpisode({
                        ...newEpisode,
                        thumbnailUrl: e.target.value,
                      })
                    }
                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:border-brand outline-none transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-gray-400">
                  Video fayl
                </label>
                <label className="flex items-center gap-3 w-full bg-black border border-dashed border-gray-700 rounded-lg p-4 cursor-pointer hover:border-brand transition-colors">
                  <UploadCloud className="w-5 h-5 text-brand" />
                  <span className="text-sm text-gray-300">
                    {videoFile
                      ? videoFile.name
                      : "Video faylni tanlash uchun bosing (mp4, webm, mkv...)"}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              {uploadProgress !== null && (
                <div className="w-full bg-black border border-gray-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-brand h-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              {uploadError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl">
                  {uploadError}
                </div>
              )}

              <button
                type="submit"
                disabled={uploadProgress !== null && uploadProgress < 100}
                className="w-full bg-brand hover:bg-brand-hover text-white p-4 rounded-xl font-bold uppercase tracking-wider transition-colors disabled:opacity-60"
              >
                {uploadProgress !== null
                  ? `Yuklanmoqda... ${uploadProgress}%`
                  : "Epizodni saqlash"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
