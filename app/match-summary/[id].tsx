import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Trophy, Target, Shield, Zap, Activity } from 'lucide-react-native';
import { useStyles } from '../../src/hooks/useStyles';
import { StatusBar } from 'expo-status-bar';
import { useProfile } from '../../src/context/ProfileContext';

// ─── MOCK DE DATOS DEL PARTIDO ──────────────────────────────────────────
// Idealmente esto vendría de tu base de datos buscando por el `id` de la ruta
const mockMatchData = {
  id: 'm1',
  date: '24 May 2026',
  time: '18:30',
  duration: '1h 45m',
  tournament: 'Liga Metropolitana - Fecha 4',
  opponent: 'Boca Juniors',
  isHome: true,
  result: 'W', // Win o Loss
  sets: [
    { teamPts: 25, oppPts: 23 },
    { teamPts: 25, oppPts: 21 },
    { teamPts: 18, oppPts: 25 },
    { teamPts: 25, oppPts: 19 },
  ],
  teamStats: {
    ataques: 42,
    bloqueos: 12,
    aces: 8,
    errores: 15,
  },
  topPerformers: [
    { name: 'Valentina Silva', stat: '18 PTS', type: 'MVP', icon: Trophy, color: '#F59E0B' },
    { name: 'Carolina López', stat: '5 BLQ', type: 'Muro', icon: Shield, color: '#7C3AED' },
    { name: 'Sofía Martínez', stat: '4 ACES', type: 'Saque', icon: Zap, color: '#16A34A' },
  ],
  rosterStats: [
    { number: '10', name: 'V. Silva', pts: 18, atk: 15, blq: 2, saq: 1 },
    { number: '7', name: 'C. López', pts: 12, atk: 7, blq: 5, saq: 0 },
    { number: '5', name: 'M. González', pts: 14, atk: 12, blq: 1, saq: 1 },
    { number: '3', name: 'S. Martínez', pts: 6, atk: 2, blq: 0, saq: 4 },
  ]
};

export default function MatchSummaryScreen() {
  const router = useRouter();
  const { styles } = useStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activeProfile } = useProfile();

  const match = mockMatchData;
  const teamSets = match.sets.filter(s => s.teamPts > s.oppPts).length;
  const oppSets = match.sets.filter(s => s.oppPts > s.teamPts).length;
  const isWinner = teamSets > oppSets;

  return (
    <View style={styles`flex-1 bg-screen`}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={[styles`bg-header px-4 pb-6`, { paddingTop: 60 }]}>
        <View style={styles`flex-row items-center gap-3 mb-5`}>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' }}
          >
            <ArrowLeft size={16} color="#fff" />
          </TouchableOpacity>
          <View style={styles`flex-1`}>
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.55)' }}>
              {match.tournament.toUpperCase()}
            </Text>
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: '700', color: '#fff', lineHeight: 26 }}>
              Resumen del Partido
            </Text>
          </View>
          <View style={{ backgroundColor: isWinner ? '#16A34A' : '#EF4444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 12, fontWeight: '700', color: '#fff', letterSpacing: 1 }}>
              {isWinner ? 'VICTORIA' : 'DERROTA'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles`px-4 pt-5 pb-12 gap-5`}>
        
        {/* ── Marcador Final ── */}
        <View style={[styles`bg-white rounded-xl overflow-hidden`, { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)' }]}>
          {/* Fila superior: Nombres de equipos y resultado global */}
          <View style={[styles`flex-row items-center justify-between px-6 py-6 border-b`, { borderColor: '#F4F7FB' }]}>
            <View style={styles`items-center flex-1`}>
              <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: `${activeProfile.color}15`, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 20, fontWeight: '700', color: activeProfile.color }}>
                  {activeProfile.clubName.substring(0, 3).toUpperCase()}
                </Text>
              </View>
              <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: '600', color: '#0D1F33', textAlign: 'center' }}>
                {activeProfile.clubName}
              </Text>
            </View>

            <View style={styles`items-center px-4`}>
              <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 40, fontWeight: '700', color: '#0D1F33', lineHeight: 40 }}>
                {teamSets} - {oppSets}
              </Text>
              <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '500' }}>FINAL</Text>
            </View>

            <View style={styles`items-center flex-1`}>
              <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 20, fontWeight: '700', color: '#64748B' }}>
                  {match.opponent.substring(0, 3).toUpperCase()}
                </Text>
              </View>
              <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: '600', color: '#0D1F33', textAlign: 'center' }}>
                {match.opponent}
              </Text>
            </View>
          </View>

          {/* Fila inferior: Progresión de sets */}
          <View style={styles`flex-row justify-center py-4 bg-screen gap-2`}>
            {match.sets.map((set, idx) => {
              const wonSet = set.teamPts > set.oppPts;
              return (
                <View key={idx} style={{ alignItems: 'center', minWidth: 44 }}>
                  <Text style={{ fontSize: 10, color: '#94A3B8', marginBottom: 4 }}>S{idx + 1}</Text>
                  <View style={{ backgroundColor: wonSet ? activeProfile.color : '#fff', borderWidth: wonSet ? 0 : 1, borderColor: '#E2E8F0', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 8, alignItems: 'center', width: '100%' }}>
                    <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: '700', color: wonSet ? '#fff' : '#0D1F33', lineHeight: 18 }}>{set.teamPts}</Text>
                    <View style={{ width: '80%', height: 1, backgroundColor: wonSet ? 'rgba(255,255,255,0.3)' : '#E2E8F0', marginVertical: 2 }} />
                    <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: '700', color: wonSet ? 'rgba(255,255,255,0.7)' : '#64748B', lineHeight: 18 }}>{set.oppPts}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Info del Partido ── */}
        <View style={styles`flex-row gap-2`}>
          <View style={[styles`flex-1 bg-white p-3 rounded-xl flex-row items-center gap-3`, { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.03)' }]}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F4F7FB', justifyContent: 'center', alignItems: 'center' }}>
              <Calendar size={16} color="#64748B" />
            </View>
            <View>
              <Text style={{ fontSize: 11, color: '#94A3B8' }}>Fecha</Text>
              <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 15, fontWeight: '600', color: '#0D1F33' }}>{match.date}</Text>
            </View>
          </View>
          <View style={[styles`flex-1 bg-white p-3 rounded-xl flex-row items-center gap-3`, { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.03)' }]}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F4F7FB', justifyContent: 'center', alignItems: 'center' }}>
              <Clock size={16} color="#64748B" />
            </View>
            <View>
              <Text style={{ fontSize: 11, color: '#94A3B8' }}>Duración</Text>
              <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 15, fontWeight: '600', color: '#0D1F33' }}>{match.duration}</Text>
            </View>
          </View>
        </View>

        {/* ── Jugadores Destacados ── */}
        <View>
          <View style={styles`flex-row items-center gap-1.5 mb-3 px-1`}>
            <Trophy size={16} color="#64748B" />
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 12, letterSpacing: 1.5, color: '#64748B', fontWeight: '600' }}>DESTACADOS DEL PARTIDO</Text>
          </View>
          <View style={styles`flex-row gap-2`}>
            {match.topPerformers.map((player, idx) => {
              const Icon = player.icon;
              return (
                <View key={idx} style={[styles`flex-1 bg-white p-3 rounded-xl items-center border-b-4`, { borderColor: player.color, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' }]}>
                  <Icon size={20} color={player.color} style={{ marginBottom: 8 }} />
                  <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 20, fontWeight: '700', color: '#0D1F33', lineHeight: 22 }}>{player.stat}</Text>
                  <Text style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{player.type}</Text>
                  <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 13, fontWeight: '600', color: '#0D1F33', marginTop: 6, textAlign: 'center' }}>
                    {player.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Estadísticas de Equipo ── */}
        <View>
          <View style={styles`flex-row items-center gap-1.5 mb-3 px-1`}>
            <Activity size={16} color="#64748B" />
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 12, letterSpacing: 1.5, color: '#64748B', fontWeight: '600' }}>RENDIMIENTO GLOBAL</Text>
          </View>
          <View style={[styles`bg-white rounded-xl p-4`, { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' }]}>
            <View style={styles`flex-row justify-between mb-4`}>
              <StatCircle label="Ataques" value={match.teamStats.ataques} color={activeProfile.color} />
              <StatCircle label="Bloqueos" value={match.teamStats.bloqueos} color="#7C3AED" />
              <StatCircle label="Aces" value={match.teamStats.aces} color="#16A34A" />
              <StatCircle label="Errores" value={match.teamStats.errores} color="#EF4444" />
            </View>
          </View>
        </View>

        {/* ── Box Score de Jugadores ── */}
        <View>
          <View style={styles`flex-row items-center gap-1.5 mb-3 px-1`}>
            <Target size={16} color="#64748B" />
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 12, letterSpacing: 1.5, color: '#64748B', fontWeight: '600' }}>PLANILLA INDIVIDUAL</Text>
          </View>
          
          <View style={[styles`bg-white rounded-xl overflow-hidden`, { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' }]}>
            {/* Header de la tabla */}
            <View style={[styles`flex-row px-4 py-3 bg-screen border-b`, { borderColor: '#E2E8F0' }]}>
              <Text style={{ flex: 2, fontFamily: 'Barlow Condensed', fontSize: 11, fontWeight: '600', color: '#64748B' }}>JUGADOR</Text>
              <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'Barlow Condensed', fontSize: 11, fontWeight: '600', color: '#64748B' }}>PTS</Text>
              <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'Barlow Condensed', fontSize: 11, fontWeight: '600', color: '#64748B' }}>ATK</Text>
              <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'Barlow Condensed', fontSize: 11, fontWeight: '600', color: '#64748B' }}>BLQ</Text>
              <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'Barlow Condensed', fontSize: 11, fontWeight: '600', color: '#64748B' }}>SAQ</Text>
            </View>

            {/* Filas de la tabla */}
            {match.rosterStats.map((p, idx) => (
              <View key={idx} style={[styles`flex-row items-center px-4 py-3 border-b`, { borderColor: '#F4F7FB' }]}>
                <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 14, fontWeight: '700', color: '#94A3B8', width: 18 }}>{p.number}</Text>
                  <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 15, fontWeight: '600', color: '#0D1F33' }}>{p.name}</Text>
                </View>
                <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: '700', color: activeProfile.color }}>{p.pts}</Text>
                <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'Barlow Condensed', fontSize: 15, fontWeight: '600', color: '#0D1F33' }}>{p.atk}</Text>
                <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'Barlow Condensed', fontSize: 15, fontWeight: '600', color: '#0D1F33' }}>{p.blq}</Text>
                <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'Barlow Condensed', fontSize: 15, fontWeight: '600', color: '#0D1F33' }}>{p.saq}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

/* ── Sub-components ── */
function StatCircle({ label, value, color }: { label: string; value: number; color: string }) {
  const { styles } = useStyles();
  return (
    <View style={styles`items-center`}>
      <View style={{ width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: `${color}30`, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: '700', color }}>{value}</Text>
      </View>
      <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '500' }}>{label}</Text>
    </View>
  );
}