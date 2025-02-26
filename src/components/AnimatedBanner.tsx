
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

    // Digital balls configuration with larger radius and more vibrant colors
    const balls = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, radius: 20, color: '#7C3AED' },
      { x: canvas.width * 0.4, y: canvas.height * 0.7, radius: 24, color: '#4F46E5' },
      { x: canvas.width * 0.6, y: canvas.height * 0.4, radius: 28, color: '#2563EB' },
      { x: canvas.width * 0.8, y: canvas.height * 0.6, radius: 22, color: '#1D4ED8' },
    ];

    // Animation
    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw curved lines between balls
      ctx.beginPath();
      ctx.moveTo(balls[0].x, balls[0].y);
      
      for (let i = 0; i < balls.length - 1; i++) {
        const xc = (balls[i].x + balls[i + 1].x) / 2;
        const yc = (balls[i].y + balls[i + 1].y) / 2;
        
        // Create curved paths between balls
        ctx.quadraticCurveTo(
          balls[i].x + Math.sin(Date.now() * 0.001) * 30,
          balls[i].y + Math.cos(Date.now() * 0.001) * 30,
          xc,
          yc
        );
        
        ctx.quadraticCurveTo(
          balls[i + 1].x - Math.sin(Date.now() * 0.001) * 30,
          balls[i + 1].y - Math.cos(Date.now() * 0.001) * 30,
          balls[i + 1].x,
          balls[i + 1].y
        );
      }
      
      // Enhanced line style with gradient and shadow
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#4F46E5');
      gradient.addColorStop(1, '#2563EB');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.shadowColor = '#4F46E5';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw enhanced 3D balls
      balls.forEach((ball, index) => {
        // Update ball position with smooth floating animation
        ball.y += Math.sin(Date.now() * 0.001 + index) * 0.7;
        ball.x += Math.cos(Date.now() * 0.001 + index) * 0.5;

        // Create 3D effect with multiple layers
        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          ball.x, ball.y, 0,
          ball.x, ball.y, ball.radius * 2
        );
        glowGradient.addColorStop(0, ball.color + '40');
        glowGradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        // Main ball with gradient
        const ballGradient = ctx.createRadialGradient(
          ball.x - ball.radius * 0.3,
          ball.y - ball.radius * 0.3,
          ball.radius * 0.1,
          ball.x,
          ball.y,
          ball.radius
        );
        ballGradient.addColorStop(0, '#ffffff');
        ballGradient.addColorStop(0.3, ball.color);
        ballGradient.addColorStop(1, ball.color + 'dd');

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ballGradient;
        ctx.fill();

        // Highlight for 3D effect
        ctx.beginPath();
        ctx.arc(
          ball.x - ball.radius * 0.2,
          ball.y - ball.radius * 0.2,
          ball.radius * 0.4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
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

