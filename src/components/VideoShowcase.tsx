import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, MapPin, Sparkles } from 'lucide-react';
import { VIDEOS } from '../data/secData';
import { ScrollReveal } from './ScrollReveal';

interface VideoShowcaseProps {
  activeVideoId?: string;
  onSelectVideo?: (id: string) => void;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  activeVideoId: externalActiveId,
  onSelectVideo: externalOnSelect,
}) => {
  const [selectedId, setSelectedId] = useState<string>(VIDEOS[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync with external selected video if triggered from Hero
  useEffect(() => {
    if (externalActiveId) {
      setSelectedId(externalActiveId);
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [externalActiveId]);

  const currentVideo = VIDEOS.find((v) => v.id === selectedId) || VIDEOS[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setIsPlaying(true);
    if (externalOnSelect) {
      externalOnSelect(id);
    }
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setTimeout(() => {
        videoRef.current?.play().catch(() => {});
      }, 50);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section id="videos" className="py-20 bg-[#0E0F14] border-t border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#12B886] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Project Showcase · Newcastle</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Rough-In to Handover
            </h2>
            <p className="text-base text-[#9E9EB0] leading-relaxed">
              Tap through the stages of a typical Northlight job, from pre-sheet rough-in cabling to the final architectural lighting handover.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#9E9EB0] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Select a stage to see it</span>
          </div>
        </ScrollReveal>

        {/* Video Player & Selector Grid */}
        <ScrollReveal delay={0.1} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Video Player Container (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden bg-black border border-white/15 aspect-[9/16] sm:aspect-[16/10] max-h-[580px] shadow-2xl flex items-center justify-center group">
              <img key={currentVideo.src} src={currentVideo.src} alt={currentVideo.title} className="w-full h-full object-cover nl-kenburns" />

              {/* Custom Top Pill (Title & Location) */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                <div className="bg-[#08090C]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-[#12B886]" />
                  <span>{currentVideo.location}</span>
                </div>
              </div>

              {/* Custom Bottom Video Controls Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between gap-4 z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    type="button"
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    type="button"
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                    title={isMuted ? 'Unmute audio' : 'Mute audio'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-white/80" /> : <Volume2 className="w-4 h-4 text-[#12B886]" />}
                    <span className="text-xs font-medium hidden sm:inline">
                      {isMuted ? 'Muted' : 'Audio On'}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/70 font-mono tabular-nums">
                    {currentVideo.duration}
                  </span>
                  <button
                    onClick={handleFullscreen}
                    type="button"
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Context Info */}
            <div className="p-4 rounded-xl bg-[#14151A] border border-white/10 flex flex-col gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {currentVideo.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#C8C8D4] leading-relaxed">
                {currentVideo.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {currentVideo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium text-[#9E9EB0] bg-[#1C1E26] px-2.5 py-1 rounded-md border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Video Playlist / Tabs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <span className="text-xs font-bold text-[#9E9EB0] uppercase tracking-wider px-1">
              Project Stages ({VIDEOS.length})
            </span>

            <div className="flex flex-col gap-2.5 max-h-[580px] overflow-y-auto pr-1">
              {VIDEOS.map((video) => {
                const isCurrent = video.id === selectedId;
                return (
                  <button
                    key={video.id}
                    onClick={() => handleSelect(video.id)}
                    type="button"
                    className={`w-full p-3.5 rounded-xl text-left transition-all border flex items-start gap-3.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#1C1E26] border-[#12B886]/60 shadow-md shadow-[#12B886]/10'
                        : 'bg-[#14151A] border-white/10 hover:border-white/20 hover:bg-[#181920]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-[#12B886] text-white shadow-sm shadow-[#12B886]/30'
                          : 'bg-[#08090C] text-[#9E9EB0] border border-white/10'
                      }`}
                    >
                      <Play className={`w-4 h-4 ${isCurrent ? 'fill-white' : ''}`} />
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-[#12B886] truncate">
                          {video.location}
                        </span>
                        <span className="text-[11px] font-mono text-[#9E9EB0] shrink-0 tabular-nums">
                          {video.duration}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-white truncate leading-snug">
                        {video.title}
                      </span>
                      <span className="text-xs text-[#9E9EB0] line-clamp-1 mt-0.5">
                        {video.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
