import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Home, BarChart3, Settings, TrendingUp, Award, Target, Shield } from 'lucide-react-native';
import { useStyles } from '../../src/hooks/useStyles';
import { StatusBar } from 'expo-status-bar';
import { useProfile } from '../../src/context/ProfileContext';

type PlayerSeasonStats = { id: number; name: string; position: string; initials: string; number: string; eficiencia: number; puntos: number; bloqueos: number; saques: number; recepciones: number; destacado?: boolean; };

const clubPlayerStats: Record<string, PlayerSeasonStats[]> = {
  '1': [
    { id: 1, name: 'María González', position: 'Opuesta', initials: 'MG', number: '5', eficiencia: 72, puntos: 148, bloqueos: 18, saques: 22, recepciones: 85, destacado: true },
    { id: 6, name: 'Valentina Silva', position: 'Punta', initials: 'VS', number: '10', eficiencia: 68, puntos: 132, bloqueos: 12, saques: 19, recepciones: 79, destacado: true },
    { id: 5, name: 'Carolina López', position: 'Central', initials: 'CL', number: '7', eficiencia: 65, puntos: 110, bloqueos: 31, saques: 14, recepciones: 68 },
    { id: 2, name: 'Ana Rodríguez', position: 'Central', initials: 'AR', number: '12', eficiencia: 61, puntos: 97, bloqueos: 28, saques: 11, recepciones: 72 },
    { id: 4, name: 'Sofia Martínez', position: 'Armadora', initials: 'SM', number: '3', eficiencia: 59, puntos: 34, bloqueos: 8, saques: 27, recepciones: 88 },
    { id: 3, name: 'Laura Pérez', position: 'Punta', initials: 'LP', number: '8', eficiencia: 63, puntos: 121, bloqueos: 9, saques: 21, recepciones: 91 },
    { id: 7, name: 'Florencia Castro', position: 'Líbero', initials: 'FC', number: '1', eficiencia: 88, puntos: 0, bloqueos: 0, saques: 0, recepciones: 94 },
  ],
  '2': [ 
    { id: 11, name: 'Lucía Torres', position: 'Opuesta', initials: 'LT', number: '4', eficiencia: 70, puntos: 138, bloqueos: 15, saques: 20, recepciones: 76, destacado: true },
    { id: 12, name: 'Daniela Ramos', position: 'Central', initials: 'DR', number: '9', eficiencia: 66, puntos: 112, bloqueos: 29, saques: 13, recepciones: 70, destacado: true },
  ]
};

const teamSeasonData: Record<string, { wins: number; losses: number; setsWon: number; setsLost: number; totalPoints: number }> = {
  '1': { wins: 16, losses: 5, setsWon: 52, setsLost: 24, totalPoints: 642 },
  '2': { wins: 10, losses: 4, setsWon: 33, setsLost: 18, totalPoints: 412 },
};

export default function StatsScreen() {
  const router = useRouter();
  const { styles } = useStyles();
  
  // 📍 TODO VIENE DEL CONTEXTO AHORA
  const { activeProfile } = useProfile();
  
  // Como cambiamos las IDs de los clubes a '1' y '2' en el ProfileContext, 
  // aseguramos que la key sea string para buscar en el Record.
  const profileId = activeProfile.id.toString();

  const players = clubPlayerStats[profileId] ?? clubPlayerStats['1'];
  const season = teamSeasonData[profileId] ?? teamSeasonData['1'];
  const totalMatches = season.wins + season.losses;
  const winRate = Math.round((season.wins / Math.max(totalMatches, 1)) * 100);

  const sortedByPoints = [...players].sort((a, b) => b.puntos - a.puntos);
  const topScorer = sortedByPoints[0];
  const topBlocker = [...players].sort((a, b) => b.bloqueos - a.bloqueos)[0];
  const topRecepcion = [...players].sort((a, b) => b.recepciones - a.recepciones)[0];

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
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.55)' }}>ESTADÍSTICAS</Text>
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: '700', color: '#fff', lineHeight: 26 }}>{activeProfile.clubName}</Text>
          </View>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: activeProfile.color }} />
        </View>

        {/* Season overview row */}
        <View style={styles`flex-row justify-between gap-1`}>
          {[
            { label: 'PARTIDOS', value: totalMatches, color: '#fff' },
            { label: 'GANADOS', value: season.wins, color: '#4ADE80' },
            { label: 'PERDIDOS', value: season.losses, color: '#F87171' },
            { label: 'EFECT.', value: `${winRate}%`, color: '#3D8EF5' },
          ].map(({ label, value, color }) => (
            <View key={label} style={[styles`w-1/4 rounded-xl py-3 items-center`, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
              <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: '700', color, lineHeight: 22 }}>{value}</Text>
              <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 9, letterSpacing: 0.8, color: 'rgba(255,255,255,0.6)', marginTop: 3 }}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles`px-4 pt-5 pb-24 gap-5`}>

        {/* Líderes de temporada */}
        <View>
          <View style={styles`flex-row items-center gap-1.5 mb-3 px-0.5`}>
            <Award size={16} color="#64748B" />
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 12, letterSpacing: 1.5, color: '#64748B', fontWeight: '600' }}>LÍDERES DE TEMPORADA</Text>
          </View>
          
          <View style={styles`flex-row justify-between gap-2`}>
            {[
              { label: 'PUNTOS', player: topScorer, value: topScorer?.puntos, icon: <TrendingUp size={16} color="#1E6FD9" />, color: '#1E6FD9' },
              { label: 'BLOQUEOS', player: topBlocker, value: topBlocker?.bloqueos, icon: <Shield size={16} color="#7C3AED" />, color: '#7C3AED' },
              { label: 'RECEP.', player: topRecepcion, value: topRecepcion ? `${topRecepcion.recepciones}%` : '-', icon: <Target size={16} color="#16A34A" />, color: '#16A34A' },
            ].map(({ label, player, value, icon, color }) => (
              <View key={label} style={[styles`w-1/3 bg-white p-3 items-center rounded-xl`, { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' }]}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: `${color}18`, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
                  {icon}
                </View>
                <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 9, letterSpacing: 0.8, color: '#94A3B8', marginBottom: 4 }}>{label}</Text>
                <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: '700', color, lineHeight: 22 }}>{value}</Text>
                <Text style={{ fontSize: 10, color: '#0D1F33', marginTop: 4, fontWeight: '500' }}>{player?.name.split(' ')[0] ?? '-'}</Text>
                <Text style={{ fontSize: 9, color: '#94A3B8' }}>{player?.position ?? '-'}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Ranking de jugadores */}
        <View>
          <View style={styles`flex-row items-center gap-1.5 mb-3 px-0.5`}>
            <BarChart3 size={16} color="#64748B" />
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 12, letterSpacing: 1.5, color: '#64748B', fontWeight: '600' }}>RENDIMIENTO INDIVIDUAL</Text>
          </View>
          
          <View style={styles`gap-2`}>
            {sortedByPoints.map((player, idx) => (
              <View key={player.id} style={[styles`bg-white rounded-xl overflow-hidden`, { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' }]}>
                <View style={styles`flex-row items-center gap-3 px-4 py-3`}>
                  
                  <MedalIcon rank={idx + 1} />
                  
                  {idx >= 3 && (
                    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#F4F7FB', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 10, color: '#94A3B8', fontWeight: '600' }}>{idx + 1}</Text>
                    </View>
                  )}

                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: activeProfile.color, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 13, fontWeight: '700', color: '#fff' }}>{player.initials}</Text>
                  </View>
                  
                  <View style={styles`flex-1 min-w-0`}>
                    <View style={styles`flex-row items-center gap-2`}>
                      <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: '600', color: '#0D1F33' }}>
                        #{player.number} {player.name.split(' ')[0]}
                      </Text>
                      {player.destacado && (
                        <View style={{ backgroundColor: activeProfile.color, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
                          <Text style={{ fontSize: 10, color: '#fff', lineHeight: 10 }}>★</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ fontSize: 11, color: '#94A3B8' }}>{player.position}</Text>
                  </View>

                  {/* KPIs */}
                  <View style={styles`flex-row gap-4 flex-shrink-0`}>
                    <StatKpi label="PTS" value={player.puntos} color="#1E6FD9" />
                    <StatKpi 
                      label="EFC" 
                      value={player.eficiencia} 
                      unit="%" 
                      color={player.eficiencia >= 65 ? '#16A34A' : player.eficiencia >= 55 ? '#F59E0B' : '#EF4444'} 
                    />
                    {player.position !== 'Líbero' && player.position !== 'Armadora' && (
                      <StatKpi label="BLQ" value={player.bloqueos} color="#7C3AED" />
                    )}
                    {(player.position === 'Líbero' || player.position === 'Armadora') && (
                      <StatKpi label="REC" value={player.recepciones} unit="%" color="#16A34A" />
                    )}
                  </View>
                </View>

                {/* mini bar eficiencia */}
                <View style={styles`h-1 mx-4 mb-3 bg-screen rounded-full overflow-hidden`}>
                  <View
                    style={{
                      height: '100%',
                      borderRadius: 9999,
                      width: `${player.eficiencia}%`,
                      backgroundColor: player.eficiencia >= 65 ? '#16A34A' : player.eficiencia >= 55 ? '#F59E0B' : '#EF4444',
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Sets stats */}
        <View>
          <View style={styles`flex-row items-center gap-1.5 mb-3 px-0.5`}>
            <Target size={16} color="#64748B" />
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 12, letterSpacing: 1.5, color: '#64748B', fontWeight: '600' }}>TEMPORADA</Text>
          </View>
          
          <View style={[styles`bg-white px-4 py-4 rounded-xl`, { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)' }]}>
            <View style={styles`flex-row justify-between items-center`}>
              
              <View style={styles`flex-1 items-center`}>
                <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 11, color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 }}>SETS WON</Text>
                <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: '700', color: '#1E6FD9', lineHeight: 28 }}>{season.setsWon}</Text>
                <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>de {season.setsWon + season.setsLost}</Text>
              </View>
              
              <View style={[styles`flex-1 items-center border-x`, { borderColor: '#F4F7FB' }]}>
                <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 11, color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 }}>PUNTOS</Text>
                <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: '700', color: '#0D1F33', lineHeight: 28 }}>{season.totalPoints}</Text>
                <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>en total</Text>
              </View>
              
              <View style={styles`flex-1 items-center`}>
                <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 11, color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 }}>SETS %</Text>
                <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 28, fontWeight: '700', color: '#16A34A', lineHeight: 28 }}>
                  {Math.round((season.setsWon / Math.max(season.setsWon + season.setsLost, 1)) * 100)}%
                </Text>
                <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>efectividad</Text>
              </View>
              
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, paddingBottom: 24 }}>
        <TouchableOpacity style={styles`items-center`} onPress={() => router.replace('/home')}>
          <Home size={24} color="#64748B" />
          <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 12, color: '#64748B', marginTop: 4 }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles`items-center`}>
          <BarChart3 size={24} color={activeProfile.color} />
          <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 12, color: activeProfile.color, marginTop: 4 }}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles`items-center`} onPress={() => router.push('/settings')}>
          <Settings size={24} color="#64748B" />
          <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 12, color: '#64748B', marginTop: 4 }}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ── Sub-components Native ── */

function StatKpi({ label, value, unit, color }: { label: string; value: number | string; unit?: string; color: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 11, color: '#94A3B8', letterSpacing: 0.5, marginBottom: 2 }}>{label}</Text>
      <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: '700', color, lineHeight: 22 }}>
        {value}{unit && <Text style={{ fontSize: 13, fontWeight: '500' }}>{unit}</Text>}
      </Text>
    </View>
  );
}

function MedalIcon({ rank }: { rank: number }) {
  const colors = ['#F59E0B', '#94A3B8', '#D97706'];
  if (rank > 3) return null;
  return (
    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors[rank - 1], justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{rank}</Text>
    </View>
  );
}