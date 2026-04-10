import { motion } from 'framer-motion';
import { Button } from './button.jsx';
import { cn } from '../../lib/utils.js';

function FloatingPaths({ position = 1, className = '' }) {
  const paths = Array.from({ length: 28 }, (_, index) => ({
    id: `${position}-${index}`,
    d: `M-${360 - index * 4.5 * position} -${176 + index * 6}C-${
      360 - index * 4.5 * position
    } -${176 + index * 6} -${292 - index * 4.5 * position} ${206 - index * 5.4} ${
      146 - index * 4.5 * position
    } ${332 - index * 5.2}C${592 - index * 4.5 * position} ${456 - index * 5.2} ${
      664 - index * 4.5 * position
    } ${846 - index * 5.2} ${664 - index * 4.5 * position} ${846 - index * 5.2}`,
    opacity: 0.05 + index * 0.014,
    width: 0.5 + index * 0.025,
    duration: 20 + index * 0.45
  }));

  return (
    <div className={cn('backgroundPathsLayer', className)}>
      <svg className="backgroundPathsSvg" viewBox="0 0 696 316" fill="none" aria-hidden="true">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.24, opacity: 0.22 }}
            animate={{
              pathLength: 1,
              opacity: [path.opacity * 0.55, path.opacity, path.opacity * 0.55],
              pathOffset: [0, 1, 0]
            }}
            transition={{
              duration: path.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear'
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths({
  title = 'Background Paths',
  actionLabel = 'Discover Excellence',
  className = '',
  decorative = false,
  onAction
}) {
  const words = String(title).split(' ').filter(Boolean);

  if (decorative) {
    return (
      <div className={cn('backgroundPathsBackdrop', className)} aria-hidden="true">
        <div className="backgroundPathsGlow backgroundPathsGlowLeft" />
        <div className="backgroundPathsGlow backgroundPathsGlowRight" />
        <FloatingPaths position={1} className="backgroundPathsPrimary" />
        <FloatingPaths position={-1} className="backgroundPathsSecondary" />
      </div>
    );
  }

  return (
    <section className={cn('backgroundPathsHero', className)}>
      <BackgroundPaths decorative />
      <div className="backgroundPathsContent">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="backgroundPathsContentInner"
        >
          <h1 className="backgroundPathsTitle">
            {words.map((word, wordIndex) => (
              <span key={`${word}-${wordIndex}`} className="backgroundPathsWord">
                {word.split('').map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.12 + letterIndex * 0.025,
                      type: 'spring',
                      stiffness: 140,
                      damping: 22
                    }}
                    className="backgroundPathsLetter"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <div className="backgroundPathsActionWrap">
            <Button variant="ghost" size="lg" className="backgroundPathsActionButton" onClick={onAction}>
              <span>{actionLabel}</span>
              <span className="backgroundPathsArrow">→</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default BackgroundPaths;
