import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/context/ThemeContext';
import { ProfileProvider } from '../src/context/ProfileContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        {/* El Stack maneja la navegación nativa automáticamente */}
        <Stack screenOptions={{ headerShown: false }} />
      </ProfileProvider>
    </ThemeProvider>
  );
}