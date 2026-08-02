import { useEffect, useRef, useState, useCallback } from 'react';

// Lenis smooth scroll — caricato dinamicamente per evitare problemi SSR
export function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lenis: { destroy: () => void; raf: (t: number) => void } | null = null;
    let rafId: number;

    import('lenis').then((mod) => {
      const Lenis = mod.default;
      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });
      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      if (lenis) lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);
}

// Reveal all'ingresso in viewport con IntersectionObserver
export function useInView<T extends HTMLElement = HTMLDivElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px', ...options },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

// Numeri che si incrementano quando entrano in vista
export function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  // Memorizziamo il target già animato invece di un semplice "fatto": i numeri
  // arrivano dal catalogo in modo asincrono e possono cambiare dopo il primo
  // ingresso in viewport, che altrimenti congelerebbe il conteggio a zero.
  const animatedFor = useRef<number | null>(null);

  useEffect(() => {
    if (!start || animatedFor.current === target) return;
    animatedFor.current = target;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target);
      return;
    }
    const startTime = performance.now();
    let rafId: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, start]);

  return count;
}

// Hook per rilevare dispositivi mobili / WebGL non supportato
export function useDeviceCapabilities() {
  const [isMobile, setIsMobile] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(mobile);

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(!!gl);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  return { isMobile, webglSupported };
}

// Parallasse legato al mouse
export function useMouseParallax(strength = 0.02) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const handle = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setOffset({ x: x * strength * 100, y: y * strength * 100 });
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [strength]);

  return offset;
}

// Hook per nascondere/mostrare la navbar in base allo scroll
export function useScrollDirection() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handle = () => {
      const current = window.scrollY;
      setScrolled(current > 50);
      if (current > lastScroll.current && current > 200) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScroll.current = current;
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  return { hidden, scrolled };
}

// Cursore personalizzato
export function useCustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [variant, setVariant] = useState<'default' | 'view' | 'drag' | 'link'>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor="view"]')) setVariant('view');
      else if (target.closest('[data-cursor="drag"]')) setVariant('drag');
      else if (target.closest('a, button, [data-cursor="link"]')) setVariant('link');
      else setVariant('default');
    };
    const leave = () => setVisible(false);
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
    };
  }, []);

  return { pos, variant, visible };
}

// Hook per il 360° spin con drag
export function use360Spin(frames: string[], autoRotate = true) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [loaded, setLoaded] = useState<boolean[]>(new Array(frames.length).fill(false));
  const dragStart = useRef(0);
  const dragStartFrame = useRef(0);
  const autoRef = useRef<number | null>(null);

  // Preload
  useEffect(() => {
    frames.forEach((src, i) => {
      const img = new Image();
      img.onload = () => setLoaded((prev) => {
        const next = [...prev];
        next[i] = true;
        return next;
      });
      img.src = src;
    });
  }, [frames]);

  // Auto-rotate
  useEffect(() => {
    if (!autoRotate) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (isDragging) return;

    autoRef.current = window.setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 2500);

    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [autoRotate, isDragging, frames.length]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = e.clientX;
    dragStartFrame.current = frameIndex;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [frameIndex]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStart.current;
    const framesDelta = Math.round(delta / 40);
    setFrameIndex(((dragStartFrame.current + framesDelta) % frames.length + frames.length) % frames.length);
  }, [isDragging, frames.length]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  return { frameIndex, isDragging, loaded, onPointerDown, onPointerMove, onPointerUp };
}
