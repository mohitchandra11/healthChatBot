import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

// --- Floating Sticker Component ---
const Sticker = ({ children, className }) => (
  <motion.div
    className={`absolute text-white/10 ${className}`}
    initial={{ opacity: 0, scale: 0.5, rotate: Math.random() * 40 - 20 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: Math.random() * 0.5 }}
    drag
    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
    whileDrag={{ scale: 1.1, rotate: 0 }}
    whileHover={{ scale: 1.05 }}
  >
    {children}
  </motion.div>
);

// --- Particle Animation Component ---
const ParticleCanvas = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        let particles = [];
        const particle = (x, y, dirX, dirY, size, color) => ({ x, y, dirX, dirY, size, color });
        const init = () => {
            particles = [];
            for (let i = 0; i < 100; i++) {
                let size = Math.random() * 0.4;
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let dirX = (Math.random() * 0.4) - 0.2;
                let dirY = (Math.random() * 0.4) - 0.2;
                particles.push(particle(x, y, dirX, dirY, size, 'rgba(150, 180, 255, 0.3)'));
            }
        };
        const animate = () => {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let p of particles) {
                p.x += p.dirX;
                p.y += p.dirY;
                if (p.x > canvas.width || p.x < 0) p.dirX = -p.dirX;
                if (p.y > canvas.height || p.y < 0) p.dirY = -p.dirY;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
                ctx.fillStyle = p.color;
                ctx.fill();
            }
        };
        init();
        animate();
        const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; init(); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};


// --- The Main Auth Layout Component ---
const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Link to="/" className="absolute top-6 left-6 z-30 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition">
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Home
      </Link>
      
      <ParticleCanvas />
      
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -50, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-blue-900/40 rounded-full filter blur-3xl opacity-50"
      />
      <motion.div
        animate={{ x: [0, -100, 0], y: [0, 50, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 50, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-purple-900/40 rounded-full filter blur-3xl opacity-50"
      />

      <Sticker className="top-[10%] left-[5%] text-blue-500"><svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 3.5c1.474-1.474 3.86-1.474 5.334 0L17.5 7.666a3.75 3.75 0 010 5.334L13.334 17.5a3.75 3.75 0 01-5.334 0L3.5 13.334a3.75 3.75 0 010-5.334L7.666 3.5c.737-.737 1.706-1.082 2.667-1.045" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" /></svg></Sticker>
      <Sticker className="top-[20%] right-[10%] text-pink-500"><svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21.75l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg></Sticker>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;