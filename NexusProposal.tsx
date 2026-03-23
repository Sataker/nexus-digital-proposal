import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  Audio,
  Img,
} from 'remotion';

// ============ COLOR PALETTE ============
const COLORS = {
  primary: '#0066FF',
  cyan: '#00D4FF',
  background: '#050508',
  backgroundAlt: '#0A1628',
  success: '#00FF88',
  warning: '#FF3333',
  white: '#FFFFFF',
};

// ============ PARTICLE COMPONENT ============
const Particle: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}> = ({ x, y, size, color, delay }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame - delay,
    [0, 20, 60, 80],
    [0, 0.8, 0.8, 0],
    { extrapolateRight: 'clamp' }
  );
  
  const yOffset = interpolate(frame - delay, [0, 100], [0, -50]);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + yOffset,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        opacity,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
    />
  );
};

// ============ PARTICLES FIELD ============
const ParticlesField: React.FC<{ count: number }> = ({ count }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    x: Math.random() * 1080,
    y: Math.random() * 1920,
    size: 2 + Math.random() * 4,
    color: Math.random() > 0.5 ? COLORS.primary : COLORS.cyan,
    delay: Math.random() * 30,
  }));

  return (
    <>
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
    </>
  );
};

// ============ SLAM TEXT ============
const SlamText: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  glowColor?: string;
}> = ({ text, fontSize = 100, color = COLORS.white, glowColor = COLORS.primary }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    from: 2,
    to: 1,
    config: { damping: 10, stiffness: 100 },
  });

  const shake = frame < 10 ? (Math.random() - 0.5) * 8 : 0;
  const flash = interpolate(frame, [0, 3, 6], [1, 0.3, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'relative',
        transform: `scale(${scale}) translate(${shake}px, ${shake}px)`,
      }}
    >
      {/* White flash overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: COLORS.white,
          opacity: flash,
          pointerEvents: 'none',
        }}
      />
      <h1
        style={{
          fontSize,
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 900,
          color,
          textAlign: 'center',
          textShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor}`,
          margin: 0,
          padding: '0 40px',
        }}
      >
        {text}
      </h1>
    </div>
  );
};

// ============ SCENE 1: HOOK ============
const HookScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ParticlesField count={50} />
      <SlamText text="AINDA FAZ TUDO MANUAL?" fontSize={90} />
    </AbsoluteFill>
  );
};

// ============ SCENE 2: PROBLEM ============
const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  
  const icons = ['📧', '📊', '⏰', '💸', '📝', '🔄'];
  
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Floating chaotic icons */}
      {icons.map((icon, i) => {
        const angle = (frame * 2 + i * 60) * (Math.PI / 180);
        const radius = 200 + Math.sin(frame * 0.1 + i) * 50;
        const x = 540 + Math.cos(angle) * radius;
        const y = 960 + Math.sin(angle) * radius;
        const rotation = frame * (i % 2 === 0 ? 3 : -3);
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              fontSize: 60,
              transform: `rotate(${rotation}deg)`,
              opacity: 0.6,
              filter: 'grayscale(100%)',
            }}
          >
            {icon}
          </div>
        );
      })}
      
      {/* Warning pulse */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `4px solid ${COLORS.warning}`,
          opacity: interpolate(Math.sin(frame * 0.3), [-1, 1], [0.2, 0.5]),
        }}
      />
      
      {/* Problem text */}
      <Sequence from={30}>
        <div
          style={{
            position: 'absolute',
            bottom: 400,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 48,
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              color: COLORS.warning,
              textShadow: `0 0 20px ${COLORS.warning}`,
            }}
          >
            HORAS PERDIDAS. DINHEIRO JOGADO FORA.
          </h2>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

// ============ SCENE 3: SOLUTION REVEAL ============
const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12, stiffness: 80 },
  });

  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [40, 80]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Particle explosion */}
      <ParticlesField count={100} />
      
      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 140,
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 900,
            color: COLORS.primary,
            textShadow: `0 0 ${glowIntensity}px ${COLORS.primary}, 0 0 ${glowIntensity * 2}px ${COLORS.cyan}`,
            margin: 0,
          }}
        >
          NEXUS
        </h1>
        <h2
          style={{
            fontSize: 60,
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 300,
            color: COLORS.cyan,
            letterSpacing: 20,
            margin: 0,
          }}
        >
          DIGITAL
        </h2>
      </div>
      
      {/* Subtitle */}
      <Sequence from={45}>
        <div
          style={{
            position: 'absolute',
            bottom: 500,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: 36,
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              color: COLORS.white,
              opacity: 0.9,
            }}
          >
            AUTOMAÇÃO INTELIGENTE COM IA
          </p>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

// ============ BENEFIT CARD ============
const BenefitCard: React.FC<{
  icon: string;
  title: string;
  value: string;
  color: string;
}> = ({ icon, title, value, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    frame,
    fps,
    from: 200,
    to: 0,
    config: { damping: 15 },
  });

  const opacity = interpolate(frame, [0, 10], [0, 1]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        padding: '30px 50px',
        backgroundColor: 'rgba(10, 22, 40, 0.8)',
        borderRadius: 20,
        border: `2px solid ${color}`,
        transform: `translateX(${slideIn}px)`,
        opacity,
        boxShadow: `0 0 30px ${color}40`,
      }}
    >
      <span style={{ fontSize: 60 }}>{icon}</span>
      <div>
        <h3
          style={{
            fontSize: 32,
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            color: COLORS.white,
            margin: 0,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 48,
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 900,
            color,
            margin: 0,
            textShadow: `0 0 20px ${color}`,
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

// ============ SCENE 4: BENEFITS ============
const BenefitsScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
        flexDirection: 'column',
      }}
    >
      <ParticlesField count={30} />
      
      <Sequence from={0} durationInFrames={120}>
        <BenefitCard
          icon="🤖"
          title="AGENTES 24/7"
          value="19 ATIVOS"
          color={COLORS.primary}
        />
      </Sequence>
      
      <Sequence from={40} durationInFrames={120}>
        <BenefitCard
          icon="⚡"
          title="TRABALHO MANUAL"
          value="-80%"
          color={COLORS.cyan}
        />
      </Sequence>
      
      <Sequence from={80} durationInFrames={120}>
        <BenefitCard
          icon="📈"
          title="RESULTADOS"
          value="3X MAIS"
          color={COLORS.success}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// ============ PRICING CARD ============
const PricingCard: React.FC<{
  name: string;
  price: string;
  highlighted?: boolean;
  delay: number;
}> = ({ name, price, highlighted = false, delay }) => {
  const frame = useCurrentFrame();
  const adjustedFrame = frame - delay;
  
  const scale = interpolate(
    adjustedFrame,
    [0, 15],
    [0.8, highlighted ? 1.1 : 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  
  const opacity = interpolate(adjustedFrame, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
  });

  const glowPulse = highlighted
    ? interpolate(Math.sin(frame * 0.15), [-1, 1], [20, 40])
    : 0;

  return (
    <div
      style={{
        padding: '40px 60px',
        backgroundColor: highlighted
          ? 'rgba(0, 102, 255, 0.2)'
          : 'rgba(10, 22, 40, 0.6)',
        borderRadius: 20,
        border: `3px solid ${highlighted ? COLORS.primary : COLORS.backgroundAlt}`,
        transform: `scale(${scale})`,
        opacity,
        boxShadow: highlighted
          ? `0 0 ${glowPulse}px ${COLORS.primary}`
          : 'none',
        textAlign: 'center',
        minWidth: 300,
      }}
    >
      {highlighted && (
        <div
          style={{
            fontSize: 18,
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            color: COLORS.cyan,
            marginBottom: 10,
          }}
        >
          ★ MAIS POPULAR ★
        </div>
      )}
      <h3
        style={{
          fontSize: 32,
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 700,
          color: COLORS.white,
          margin: 0,
        }}
      >
        {name}
      </h3>
      <p
        style={{
          fontSize: 48,
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 900,
          color: highlighted ? COLORS.primary : COLORS.cyan,
          margin: '10px 0 0',
          textShadow: highlighted ? `0 0 20px ${COLORS.primary}` : 'none',
        }}
      >
        {price}
      </p>
      <p
        style={{
          fontSize: 20,
          fontFamily: 'Montserrat, sans-serif',
          color: COLORS.white,
          opacity: 0.7,
          margin: 0,
        }}
      >
        /mês
      </p>
    </div>
  );
};

// ============ SCENE 5: PRICING ============
const PricingScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
        flexDirection: 'column',
      }}
    >
      <ParticlesField count={40} />
      
      <h2
        style={{
          fontSize: 48,
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 900,
          color: COLORS.white,
          marginBottom: 40,
        }}
      >
        PLANOS
      </h2>
      
      <PricingCard name="STARTER" price="R$1.497" delay={0} />
      <PricingCard name="PROFESSIONAL" price="R$2.997" highlighted delay={15} />
      <PricingCard name="ENTERPRISE" price="R$5.997" delay={30} />
    </AbsoluteFill>
  );
};

// ============ SCENE 6: CTA ============
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const buttonScale = spring({
    frame: frame - 30,
    fps,
    from: 0,
    to: 1,
    config: { damping: 8, stiffness: 100 },
  });

  const pulse = interpolate(
    Math.sin(frame * 0.2),
    [-1, 1],
    [1, 1.05]
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 50,
      }}
    >
      <ParticlesField count={80} />
      
      {/* Main CTA text */}
      <SlamText
        text="AUTOMATIZE SEU NEGÓCIO"
        fontSize={70}
        glowColor={COLORS.cyan}
      />
      
      {/* CTA Button */}
      <Sequence from={30}>
        <div
          style={{
            transform: `scale(${buttonScale * pulse})`,
          }}
        >
          <button
            style={{
              padding: '30px 60px',
              fontSize: 36,
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              color: COLORS.white,
              backgroundColor: COLORS.primary,
              border: `3px solid ${COLORS.cyan}`,
              borderRadius: 60,
              cursor: 'pointer',
              boxShadow: `0 0 40px ${COLORS.primary}, 0 0 80px ${COLORS.primary}40`,
            }}
          >
            AGENDAR DEMO GRÁTIS →
          </button>
        </div>
      </Sequence>
      
      {/* Logo small */}
      <Sequence from={50}>
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            opacity: 0.8,
          }}
        >
          <p
            style={{
              fontSize: 24,
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 700,
              color: COLORS.cyan,
              letterSpacing: 10,
            }}
          >
            NEXUS DIGITAL
          </p>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

// ============ MAIN COMPOSITION ============
export const NexusProposal: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: Hook (0-3s = 0-90 frames) */}
      <Sequence from={0} durationInFrames={90}>
        <HookScene />
      </Sequence>

      {/* Scene 2: Problem (3-6s = 90-180 frames) */}
      <Sequence from={90} durationInFrames={90}>
        <ProblemScene />
      </Sequence>

      {/* Scene 3: Solution (6-10s = 180-300 frames) */}
      <Sequence from={180} durationInFrames={120}>
        <SolutionScene />
      </Sequence>

      {/* Scene 4: Benefits (10-14s = 300-420 frames) */}
      <Sequence from={300} durationInFrames={120}>
        <BenefitsScene />
      </Sequence>

      {/* Scene 5: Pricing (14-17s = 420-510 frames) */}
      <Sequence from={420} durationInFrames={90}>
        <PricingScene />
      </Sequence>

      {/* Scene 6: CTA (17-20s = 510-600 frames) */}
      <Sequence from={510} durationInFrames={90}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export default NexusProposal;
