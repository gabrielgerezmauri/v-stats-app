import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      {/* El Stack maneja la navegación nativa automáticamente */}
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}