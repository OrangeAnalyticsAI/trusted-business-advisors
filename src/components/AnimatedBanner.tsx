
import React, { useEffect, useRef } from 'react';

export const AnimatedBanner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Digital balls configuration
    const balls = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, radius: 8, color: '#9b87f5' },
      { x: canvas.width * 0.4, y: canvas.height * 0.7, radius: 8, color: '#8B5CF6' },
      { x: canvas.width * 0.6, y: canvas.height * 0.4, radius: 8, color: '#1EAEDB' },
      { x: canvas.width * 0.8, y: canvas.height * 0.6, radius: 8, color: '#D3E4FD' },
    ];

    // Animation
    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw lines between balls
      ctx.beginPath();
      ctx.moveTo(balls[0].x, balls[0].y);
      for (let i = 1; i < balls.length; i++) {
        ctx.lineTo(balls[i].x, balls[i].y);
      }
      ctx.strokeStyle = '#8E9196';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw balls
      balls.forEach((ball, index) => {
        // Update ball position with subtle floating animation
        ball.y += Math.sin(Date.now() * 0.001 + index) * 0.5;
        ball.x += Math.cos(Date.now() * 0.001 + index) * 0.3;

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();

        // Add glow effect
        const gradient = ctx.createRadialGradient(
          ball.x, ball.y, 0,
          ball.x, ball.y, ball.radius * 2
        );
        gradient.addColorStop(0, ball.color + '40');
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="h-[400px] w-full relative bg-background overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      
      {/* Content container to ensure text is readable */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-xl mx-auto px-4">
          <div className="bg-background/50 backdrop-blur-sm p-6 rounded-lg shadow-lg animate-in">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome to Our Platform
            </h2>
            <p className="text-muted-foreground">
              Discover amazing content and resources
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
