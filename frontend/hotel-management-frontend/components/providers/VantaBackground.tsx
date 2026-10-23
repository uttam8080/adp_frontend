// components/providers/VantaBackground.tsx
'use client';

import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    THREE: any;
    VANTA: any;
  }
}

export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    let scriptThree: HTMLScriptElement | null = null;
    let scriptVanta: HTMLScriptElement | null = null;

    const initVanta = () => {
      if (window.VANTA && window.VANTA.NET && vantaRef.current && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          // Customizing with Royal Crimson (#7F011F) & Warm Ivory Cream (#F5EBD0)
          color: 0x7F011F,
          backgroundColor: 0xF5EBD0,
          points: 10.0,
          maxDistance: 20.0,
          spacing: 16.0,
          showDots: true,
        });
      }
    };

    const loadScripts = () => {
      // 1. Load Three.js r134
      if (!window.THREE) {
        scriptThree = document.createElement('script');
        scriptThree.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
        scriptThree.async = true;
        scriptThree.onload = () => {
          // 2. Load Vanta.NET
          loadVantaNet();
        };
        document.body.appendChild(scriptThree);
      } else {
        loadVantaNet();
      }
    };

    const loadVantaNet = () => {
      if (!window.VANTA || !window.VANTA.NET) {
        scriptVanta = document.createElement('script');
        scriptVanta.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
        scriptVanta.async = true;
        scriptVanta.onload = () => {
          initVanta();
        };
        document.body.appendChild(scriptVanta);
      } else {
        initVanta();
      }
    };

    loadScripts();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}
