'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;
}

export function SparklingSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const size = Math.min(window.innerWidth * 0.25, 300);
      canvas.width = size;
      canvas.height = size;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles in a sphere
    const particleCount = 600;
    const radius = canvas.width * 0.4;
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      particlesRef.current.push({
        x,
        y,
        z,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        vz: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      rotationRef.current.y += 0.003;
      rotationRef.current.x += 0.002;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Sort particles by z-depth for proper rendering
      const sortedParticles = [...particlesRef.current].sort((a, b) => a.z - b.z);

      sortedParticles.forEach((particle) => {
        // Rotate particles
        const cosY = Math.cos(rotationRef.current.y);
        const sinY = Math.sin(rotationRef.current.y);
        const cosX = Math.cos(rotationRef.current.x);
        const sinX = Math.sin(rotationRef.current.x);

        // Rotate around Y axis
        let x = particle.x * cosY - particle.z * sinY;
        let z = particle.x * sinY + particle.z * cosY;
        
        // Rotate around X axis
        let y = particle.y * cosX - z * sinX;
        z = particle.y * sinX + z * cosX;

        // Project 3D to 2D
        const scale = 300 / (300 + z);
        const x2d = centerX + x * scale;
        const y2d = centerY + y * scale;

        // Calculate opacity based on depth
        const depthOpacity = (z + radius) / (radius * 2);
        const finalOpacity = particle.opacity * depthOpacity;

        // Draw particle
        ctx.beginPath();
        ctx.arc(x2d, y2d, particle.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110, 86, 207, ${finalOpacity})`;
        ctx.fill();

        // Add glow effect for brighter particles
        if (particle.opacity > 0.7) {
          ctx.shadowBlur = 10 * scale;
          ctx.shadowColor = `rgba(110, 86, 207, ${finalOpacity * 0.5})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Subtle particle movement
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Keep particles within sphere
        const dist = Math.sqrt(particle.x ** 2 + particle.y ** 2 + particle.z ** 2);
        if (dist > radius) {
          const factor = radius / dist;
          particle.x *= factor;
          particle.y *= factor;
          particle.z *= factor;
          particle.vx *= -0.5;
          particle.vy *= -0.5;
          particle.vz *= -0.5;
        }

        // Opacity pulsing
        particle.opacity += (Math.random() - 0.5) * 0.02;
        particle.opacity = Math.max(0.3, Math.min(1, particle.opacity));
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full"
      />
    </div>
  );
}

