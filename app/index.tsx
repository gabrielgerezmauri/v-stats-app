import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useStyles } from '../src/hooks/useStyles';

export default function LoginScreen() {
  const { styles } = useStyles();
  const router = useRouter();

  // Función dummy de navegación
  const handleAccess = () => {
    // Te lleva a la ruta app/home.tsx (que crearemos después)
    router.replace('/home');
  };

  return (
    <View style={styles`flex-1 bg-main justify-center items-center px-6`}>
      
      {/* Logo y Header */}
      <View style={styles`mb-8 items-center`}>
        <Text style={[
          styles`text-brand`, 
          { fontFamily: 'Barlow Condensed', fontSize: 56, fontWeight: '700', lineHeight: 60 }
        ]}>
          V-STATS
        </Text>
        <Text style={[
          styles`text-brand`, 
          { fontFamily: 'Barlow Condensed', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }
        ]}>
          Datos que ganan partidos
        </Text>
      </View>

      {/* Formulario */}
      <View style={styles`w-full max-w-sm gap-4`}>
        
        <TextInput
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          style={styles`w-full h-12 bg-surface border border-gray rounded-lg px-4 text-main`}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          style={styles`w-full h-12 bg-surface border border-gray rounded-lg px-4 text-main`}
          secureTextEntry
        />

        {/* Botón Principal */}
        <TouchableOpacity
          onPress={handleAccess}
          activeOpacity={0.8}
          style={styles`w-full h-12 bg-brand rounded-lg justify-center items-center`}
        >
          <Text style={[
            styles`text-white text-bold`, 
            { fontFamily: 'Barlow Condensed', letterSpacing: 1 }
          ]}>
            INICIAR SESIÓN
          </Text>
        </TouchableOpacity>

        {/* Botón Secundario (Outline) */}
        <TouchableOpacity
          onPress={handleAccess}
          activeOpacity={0.8}
          style={styles`w-full h-12 border border-brand rounded-lg justify-center items-center`}
        >
          <Text style={[
            styles`text-brand text-bold`, 
            { fontFamily: 'Barlow Condensed', letterSpacing: 1 }
          ]}>
            CONTINUAR SIN CUENTA
          </Text>
        </TouchableOpacity>

        {/* Link inferior */}
        <View style={styles`mt-4 items-center`}>
          <Text style={styles`text-muted text-sm`}>
            ¿No tenés cuenta? <Text style={styles`text-brand text-bold`}>Registrate</Text>
          </Text>
        </View>
        
      </View>
    </View>
  );
}