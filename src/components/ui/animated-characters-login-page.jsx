import { useEffect, useRef, useState } from 'react';
import { BadgeCheck, Coins, ShieldCheck, Sparkles } from 'lucide-react';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function useRandomBlink() {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    let blinkTimer;
    let resetTimer;

    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        setIsBlinking(true);
        resetTimer = window.setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 160);
      }, Math.random() * 3200 + 2800);
    };

    scheduleBlink();

    return () => {
      window.clearTimeout(blinkTimer);
      window.clearTimeout(resetTimer);
    };
  }, []);

  return isBlinking;
}

function resolveEyeOffset(element, mousePosition, maxDistance, forcedLook) {
  if (forcedLook) {
    return forcedLook;
  }

  if (!element) {
    return { x: 0, y: 0 };
  }

  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const deltaX = mousePosition.x - centerX;
  const deltaY = mousePosition.y - centerY;
  const distance = Math.min(Math.hypot(deltaX, deltaY), maxDistance);

  if (!distance) {
    return { x: 0, y: 0 };
  }

  const angle = Math.atan2(deltaY, deltaX);

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance
  };
}

function EyeBall({
  mousePosition,
  size = 18,
  pupilSize = 7,
  maxDistance = 5,
  isBlinking = false,
  eyeColor = '#ffffff',
  pupilColor = '#201813',
  forcedLook = null
}) {
  const eyeRef = useRef(null);
  const { x, y } = resolveEyeOffset(eyeRef.current, mousePosition, maxDistance, forcedLook);

  return (
    <div
      ref={eyeRef}
      className="animatedAuthEyeBall"
      style={{
        width: `${size}px`,
        height: isBlinking ? '3px' : `${size}px`,
        background: eyeColor
      }}
    >
      {!isBlinking ? (
        <div
          className="animatedAuthEyePupil"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            background: pupilColor,
            transform: `translate(${x}px, ${y}px)`
          }}
        />
      ) : null}
    </div>
  );
}

function PupilDot({
  mousePosition,
  size = 12,
  maxDistance = 5,
  color = '#201813',
  forcedLook = null
}) {
  const dotRef = useRef(null);
  const { x, y } = resolveEyeOffset(dotRef.current, mousePosition, maxDistance, forcedLook);

  return (
    <div
      ref={dotRef}
      className="animatedAuthDotPupil"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        transform: `translate(${x}px, ${y}px)`
      }}
    />
  );
}

function HighlightIcon({ index }) {
  const icons = [BadgeCheck, ShieldCheck, Coins];
  const Icon = icons[index % icons.length];

  return <Icon className="animatedAuthHighlightIcon" aria-hidden="true" />;
}

function calculateCharacterMotion(reference, mousePosition) {
  if (!reference.current) {
    return {
      faceX: 0,
      faceY: 0,
      bodySkew: 0
    };
  }

  const rect = reference.current.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 3;
  const deltaX = mousePosition.x - centerX;
  const deltaY = mousePosition.y - centerY;

  return {
    faceX: clamp(deltaX / 20, -15, 15),
    faceY: clamp(deltaY / 28, -10, 10),
    bodySkew: clamp(-deltaX / 120, -6, 6)
  };
}

export default function AnimatedCharactersLoginPage({
  shellClassName = '',
  stageClassName = '',
  panelShellClassName = '',
  panelClassName = '',
  topBar = null,
  brand = null,
  eyebrow = '',
  title = '',
  subtitle = '',
  notice = null,
  alert = null,
  children = null,
  footer = null,
  heroBrand = null,
  heroEyebrow = '',
  heroTitle = '',
  heroDescription = '',
  heroHighlights = [],
  heroPanelEyebrow = '',
  heroPanelTitle = '',
  heroPanelStatus = '',
  heroPanelDescription = '',
  isTyping = false,
  isPasswordVisible = false,
  hasPasswordValue = false
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isOrangePeeking, setIsOrangePeeking] = useState(false);
  const amberRef = useRef(null);
  const darkRef = useRef(null);
  const peachRef = useRef(null);
  const creamRef = useRef(null);
  const amberBlink = useRandomBlink();
  const darkBlink = useRandomBlink();

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!isTyping) {
      setIsLookingAtEachOther(false);
      return undefined;
    }

    setIsLookingAtEachOther(true);

    const timeoutId = window.setTimeout(() => {
      setIsLookingAtEachOther(false);
    }, 900);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isTyping]);

  useEffect(() => {
    if (!(isPasswordVisible && hasPasswordValue)) {
      setIsOrangePeeking(false);
      return undefined;
    }

    let peekTimer;
    let resetTimer;

    const schedulePeek = () => {
      peekTimer = window.setTimeout(() => {
        setIsOrangePeeking(true);
        resetTimer = window.setTimeout(() => {
          setIsOrangePeeking(false);
          schedulePeek();
        }, 700);
      }, Math.random() * 2400 + 1800);
    };

    schedulePeek();

    return () => {
      window.clearTimeout(peekTimer);
      window.clearTimeout(resetTimer);
    };
  }, [isPasswordVisible, hasPasswordValue]);

  const amberMotion = calculateCharacterMotion(amberRef, mousePosition);
  const darkMotion = calculateCharacterMotion(darkRef, mousePosition);
  const peachMotion = calculateCharacterMotion(peachRef, mousePosition);
  const creamMotion = calculateCharacterMotion(creamRef, mousePosition);
  const isPasswordVisibleScene = isPasswordVisible && hasPasswordValue;
  const isPasswordHiddenScene = hasPasswordValue && !isPasswordVisible;
  const shellClasses = ['animatedAuthShell', shellClassName].filter(Boolean).join(' ');
  const stageClasses = ['animatedAuthStage', stageClassName].filter(Boolean).join(' ');
  const panelShellClasses = ['animatedAuthPanelShell', panelShellClassName].filter(Boolean).join(' ');
  const panelClasses = ['animatedAuthPanel', 'fadeUp', panelClassName].filter(Boolean).join(' ');
  const hasHeroCopy = Boolean(heroEyebrow || heroTitle || heroDescription || heroHighlights.length);
  const hasHeroPanel = Boolean(heroPanelEyebrow || heroPanelTitle || heroPanelStatus || heroPanelDescription || heroHighlights.length);

  return (
    <div className={shellClasses}>
      <aside className={stageClasses}>
        <div className="animatedAuthStageGlow animatedAuthStageGlowPrimary" />
        <div className="animatedAuthStageGlow animatedAuthStageGlowSecondary" />

        <div className="animatedAuthStageHeader">
          {heroBrand}
        </div>

        {hasHeroCopy ? (
          <div className="animatedAuthStageCopy">
            {heroEyebrow ? <span className="animatedAuthStageEyebrow">{heroEyebrow}</span> : null}
            {heroTitle ? <h1>{heroTitle}</h1> : null}
            {heroDescription ? <p>{heroDescription}</p> : null}

            {heroHighlights.length ? (
              <div className="animatedAuthStageHighlights">
                {heroHighlights.map((item, index) => (
                  <div key={`${item}-${index}`} className="animatedAuthHighlightItem">
                    <HighlightIcon index={index} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {hasHeroPanel ? (
          <div className="animatedAuthStageMetaCard">
            {heroPanelEyebrow ? (
              <div className="animatedAuthMetaEyebrow">
                <Sparkles className="animatedAuthMetaEyebrowIcon" aria-hidden="true" />
                <span>{heroPanelEyebrow}</span>
              </div>
            ) : null}

            <div className="animatedAuthMetaHeader">
              <div>
                <span className="animatedAuthMetaTitle">{heroPanelTitle}</span>
                <strong>{heroPanelStatus}</strong>
              </div>
              <span className="animatedAuthMetaPulse" />
            </div>

            <p>{heroPanelDescription}</p>

            <div className="animatedAuthMetaList">
              {heroHighlights.slice(0, 3).map((item, index) => (
                <div key={`${item}-meta-${index}`} className="animatedAuthMetaListItem">
                  <HighlightIcon index={index} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="animatedAuthScene">
          <div
            ref={amberRef}
            className="animatedAuthCharacter animatedAuthCharacterAmber"
            style={{
              transform: isPasswordVisibleScene
                ? 'skewX(0deg)'
                : isTyping || isPasswordHiddenScene
                  ? `translateX(26px) skewX(${amberMotion.bodySkew - 10}deg)`
                  : `skewX(${amberMotion.bodySkew}deg)`
            }}
          >
            <div
              className="animatedAuthCharacterEyes"
              style={{
                left: isPasswordVisibleScene ? '20px' : isLookingAtEachOther ? '55px' : `${44 + amberMotion.faceX}px`,
                top: isPasswordVisibleScene ? '35px' : isLookingAtEachOther ? '65px' : `${42 + amberMotion.faceY}px`
              }}
            >
              <EyeBall
                mousePosition={mousePosition}
                isBlinking={amberBlink}
                forcedLook={
                  isPasswordVisibleScene
                    ? { x: isOrangePeeking ? 3 : -4, y: isOrangePeeking ? 5 : -4 }
                    : isLookingAtEachOther
                      ? { x: 3, y: 3 }
                      : null
                }
              />
              <EyeBall
                mousePosition={mousePosition}
                isBlinking={amberBlink}
                forcedLook={
                  isPasswordVisibleScene
                    ? { x: isOrangePeeking ? 3 : -4, y: isOrangePeeking ? 5 : -4 }
                    : isLookingAtEachOther
                      ? { x: 3, y: 3 }
                      : null
                }
              />
            </div>
          </div>

          <div
            ref={darkRef}
            className="animatedAuthCharacter animatedAuthCharacterDark"
            style={{
              transform: isPasswordVisibleScene
                ? 'skewX(0deg)'
                : isLookingAtEachOther
                  ? `translateX(14px) skewX(${darkMotion.bodySkew + 8}deg)`
                  : isTyping || isPasswordHiddenScene
                    ? `skewX(${darkMotion.bodySkew * 1.5}deg)`
                    : `skewX(${darkMotion.bodySkew}deg)`
            }}
          >
            <div
              className="animatedAuthCharacterEyes"
              style={{
                left: isPasswordVisibleScene ? '10px' : isLookingAtEachOther ? '32px' : `${26 + darkMotion.faceX}px`,
                top: isPasswordVisibleScene ? '28px' : isLookingAtEachOther ? '12px' : `${30 + darkMotion.faceY}px`
              }}
            >
              <EyeBall
                mousePosition={mousePosition}
                size={16}
                pupilSize={6}
                maxDistance={4}
                isBlinking={darkBlink}
                forcedLook={
                  isPasswordVisibleScene
                    ? { x: -4, y: -4 }
                      : isLookingAtEachOther
                        ? { x: 0, y: -4 }
                        : null
                }
              />
              <EyeBall
                mousePosition={mousePosition}
                size={16}
                pupilSize={6}
                maxDistance={4}
                isBlinking={darkBlink}
                forcedLook={
                  isPasswordVisibleScene
                    ? { x: -4, y: -4 }
                      : isLookingAtEachOther
                        ? { x: 0, y: -4 }
                        : null
                }
              />
            </div>
          </div>

          <div
            ref={peachRef}
            className="animatedAuthCharacter animatedAuthCharacterPeach"
            style={{
              transform: isPasswordVisibleScene
                ? 'skewX(0deg)'
                : `skewX(${peachMotion.bodySkew}deg)`
            }}
          >
            <div
              className="animatedAuthCharacterEyes animatedAuthCharacterDotEyes"
              style={{
                left: isPasswordVisibleScene ? '56px' : `${86 + peachMotion.faceX}px`,
                top: isPasswordVisibleScene ? '88px' : `${90 + peachMotion.faceY}px`
              }}
            >
              <PupilDot
                mousePosition={mousePosition}
                forcedLook={isPasswordVisibleScene ? { x: -5, y: -4 } : null}
              />
              <PupilDot
                mousePosition={mousePosition}
                forcedLook={isPasswordVisibleScene ? { x: -5, y: -4 } : null}
              />
            </div>
          </div>

          <div
            ref={creamRef}
            className="animatedAuthCharacter animatedAuthCharacterCream"
            style={{
              transform: isPasswordVisibleScene
                ? 'skewX(0deg)'
                : `skewX(${creamMotion.bodySkew}deg)`
            }}
          >
            <div
              className="animatedAuthCharacterEyes animatedAuthCharacterDotEyes"
              style={{
                left: isPasswordVisibleScene ? '20px' : `${54 + creamMotion.faceX}px`,
                top: isPasswordVisibleScene ? '35px' : `${44 + creamMotion.faceY}px`
              }}
            >
              <PupilDot
                mousePosition={mousePosition}
                forcedLook={isPasswordVisibleScene ? { x: -5, y: -4 } : null}
              />
              <PupilDot
                mousePosition={mousePosition}
                forcedLook={isPasswordVisibleScene ? { x: -5, y: -4 } : null}
              />
            </div>

            <div
              className="animatedAuthCharacterMouth"
              style={{
                left: isPasswordVisibleScene ? '10px' : `${42 + creamMotion.faceX}px`,
                top: isPasswordVisibleScene ? '88px' : `${92 + creamMotion.faceY}px`
              }}
            />
          </div>
        </div>
      </aside>

      <section className={panelShellClasses}>
        <div className={panelClasses}>
          {topBar ? <div className="animatedAuthTopBar">{topBar}</div> : null}
          {brand ? <div className="animatedAuthBrandSlot">{brand}</div> : null}

          <div className="animatedAuthHeadingGroup">
            {eyebrow ? <span className="animatedAuthPanelEyebrow">{eyebrow}</span> : null}
            {title ? <h2>{title}</h2> : null}
            {subtitle ? <p>{subtitle}</p> : null}
          </div>

          {notice}
          {alert}
          {children}
          {footer}
        </div>
      </section>
    </div>
  );
}

export { AnimatedCharactersLoginPage };
