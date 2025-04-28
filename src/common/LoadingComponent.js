import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

export default function AnimationWithImperativeApi() {
  const animationRef = useRef(null); // ✅ No TypeScript typing here

  useEffect(() => {
    // Play from beginning
    animationRef.current?.play();

    // Or play a specific frame range
    animationRef.current?.play(30, 120);
  }, []);

  return (
    <LottieView
      ref={animationRef}
      source={require('./Animation.json')}
      style={{ width: 150, height: 150 }} // optional styling
      loop
    />
  );
}
