import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db, doc, getDoc, collection, query, where, getDocs, orderBy, setDoc, serverTimestamp } from '../firebase';
import { Anime, Episode, User } from '../types';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoPlayerProps {
  user: User | null;
}

export default function VideoPlayer({ user }: VideoPlayerProps) {
  const { animeId, episodeId } = useParams<{ animeId: string; episodeId: string }>();
  const navigate = useNavigate();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      if (!animeId || !episodeId) return;
      setLoading(true);
      setError(null);

      try {
        const animeRef = doc(db, 'anime', animeId);
        const animeSnap = await getDoc(animeRef);

        if (isCancelled) return;

        if (animeSnap.exists()) {
          setAnime({ id: animeSnap.id, ...animeSnap.data() } as Anime);
        } else {
          setError('Anime topilmadi.');
          setLoading(false);
          return;
        }

        const epQuery = query(
          collection(db, 'episodes'),
          where('animeId', '==', animeId),
          orderBy('episodeNumber', 'asc')
        );
        const epSnap = await getDocs(epQuery);

        if (isCancelled) return;

        const epList: Episode[] = [];
        epSnap.forEach(docSnap => {
          epList.push({ id: docSnap.id, ...docSnap.data() } as Episode);
        });
        setAllEpisodes(epList);

        const currentEp = epList.find(e => e.id === episodeId);
        if (currentEp) {
          setCurrentEpisode(currentEp);
          if (user) {
            saveWatchHistory(user.userId, animeId, currentEp);
          }
        } else {
          setError('Epizod topilmadi.');
        }
      } catch (err) {
        console.error('Error loading video data:', err);
        if (!isCancelled) setError('Videoni yuklashda xatolik yuz berdi.');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    async function saveWatchHistory(userId: string, animeId: string, ep: Episode) {
      try {
        const historyId = `${userId}_${animeId}`;
        const historyRef = doc(db, `users/${userId}/watchHistory`, historyId);
        await setDoc(
          historyRef,
          {
            userId,
            animeId,
            episodeId: ep.id,
            watchedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Failed to save history', err);
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [animeId, episodeId, user?.userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !anime || !currentEpisode) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p>{error || 'Episode not found.'}</p>
        <Link to={animeId ? `/anime/${animeId}` : '/'} className="text-brand underline">
          Orqaga qaytish
        </Link>
      </div>
    );
  }

  const currentIndex = allEpisodes.findIndex(e => e.id === currentEpisode.id);
  const prevEp = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
  const nextEp = currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="p-4 flex items-center gap-4">
        <Link to={`/anime/${animeId}`} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="overflow-hidden">
          <h1 className="text-xl font-display uppercase tracking-tight line-clamp-1">{anime.title}</h1>
          <p className="text-brand text-xs font-bold uppercase tracking-widest">
            Episode {currentEpisode.episodeNumber}: {currentEpisode.episodeTitle}
          </p>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col items-center justify-center p-0 md:p-4">
        <div className="w-full aspect-video bg-gray-900 md:rounded-xl overflow-hidden shadow-2xl relative">
          <video
            key="hacker2-video"
            src="http://localhost:4000/stream/hacker2.mp4"
            className="w-full h-full"
            controls
            autoPlay
            playsInline
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 flex flex-col sm:flex-row items-center justify-between gap-4 pb-8">
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => prevEp && navigate(`/video/${animeId}/${prevEp.id}`)}
            disabled={!prevEp}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-colors ${
              prevEp ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/5 text-gray-600 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <button
            onClick={() => nextEp && navigate(`/video/${animeId}/${nextEp.id}`)}
            disabled={!nextEp}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-colors ${
              nextEp ? 'bg-brand hover:bg-brand-hover text-white' : 'bg-brand/50 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}