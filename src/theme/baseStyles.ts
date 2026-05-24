import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type RNStyle = ViewStyle | TextStyle | ImageStyle;

export const baseStyles: Record<string, RNStyle> = {
  // Flexbox y Layout
  'flex-1': { flex: 1 },
  'flex-row': { flexDirection: 'row' },
  'items-center': { alignItems: 'center' },
  'justify-center': { justifyContent: 'center' },
  'justify-between': { justifyContent: 'space-between' },
  
  // Espaciados (Paddings y Margins)
  'p-4': { padding: 16 },
  'p-6': { padding: 24 },
  'px-4': { paddingHorizontal: 16 },
  'px-6': { paddingHorizontal: 24 },
  'py-3': { paddingVertical: 12 },
  'm-4': { margin: 16 },
  'mb-2': { marginBottom: 8 },
  'mb-4': { marginBottom: 16 },
  
  // Bordes
  'border': { borderWidth: 1 },
  'rounded-xl': { borderRadius: 12 },
  'rounded-2xl': { borderRadius: 16 },
  'rounded-full': { borderRadius: 9999 },
  
  // Tipografía
  'text-xs': { fontSize: 12 },
  'text-sm': { fontSize: 14 },
  'text-base': { fontSize: 16 },
  'text-xl': { fontSize: 20 },
  'text-2xl': { fontSize: 24 },
  'text-bold': { fontWeight: 'bold' },
  'text-black': { fontWeight: '900' },
  'text-italic': { fontStyle: 'italic' },
  'text-center': { textAlign: 'center' },

  'w-full': { width: '100%' },
  'h-12': { height: 48 },
  'max-w-sm': { maxWidth: 384, width: '100%' },
  'gap-4': { gap: 16 },
  'mb-8': { marginBottom: 32 },
  'mt-4': { marginTop: 16 },
  'rounded-lg': { borderRadius: 8 },
};