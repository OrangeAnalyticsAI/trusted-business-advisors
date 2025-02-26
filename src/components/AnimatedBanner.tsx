
import React from 'react';

export const AnimatedBanner = () => {
  return (
    <div className="h-[400px] w-full relative bg-background overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-background to-primary/20 animate-[gradient_8s_ease_infinite]" />
      
      {/* Floating circles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`
            absolute rounded-full mix-blend-multiply filter blur-xl
            animate-float-slow
          `}
          style={{
            width: `${Math.random() * 200 + 100}px`,
            height: `${Math.random() * 200 + 100}px`,
            background: `hsla(${Math.random() * 360}, 70%, 70%, 0.4)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 10}s`,
          }}
        />
      ))}

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
