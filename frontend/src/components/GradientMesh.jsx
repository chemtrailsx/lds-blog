import { useEffect, useRef } from 'react';

export default function GradientMesh() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Gradient blob class
    class GradientBlob {
      constructor(x, y, radius, color, speed) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.angle = Math.random() * Math.PI * 2;
      }

      update(time) {
        this.x = this.baseX + Math.sin(time * this.speed) * 100;
        this.y = this.baseY + Math.cos(time * this.speed * 0.8) * 80;
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create blobs
    const blobs = [
      new GradientBlob(canvas.width * 0.2, canvas.height * 0.3, 300, 'rgba(201, 168, 76, 0.15)', 0.3),
      new GradientBlob(canvas.width * 0.8, canvas.height * 0.6, 350, 'rgba(201, 168, 76, 0.12)', 0.25),
      new GradientBlob(canvas.width * 0.5, canvas.height * 0.8, 280, 'rgba(201, 168, 76, 0.1)', 0.35),
    ];

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += 0.005;

      blobs.forEach(blob => {
        blob.update(time);
        blob.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, filter: 'blur(60px)' }}
    />
  );
}
