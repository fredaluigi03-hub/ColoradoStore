import { useCustomCursor } from '@/lib/hooks';

/**
 * Cursore: solo un pallino arancione. Niente etichette "Guarda"/"Trascina" e
 * niente ingrandimento: coprivano il contenuto e distraevano dai prodotti.
 */
export default function CustomCursor() {
  const { pos, visible } = useCustomCursor();

  return (
    <div
      className="pointer-events-none fixed z-[9999] hidden md:block"
      style={{
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s',
      }}
    >
      <div
        className="rounded-full"
        style={{ width: 10, height: 10, backgroundColor: '#C4633A' }}
      />
    </div>
  );
}
