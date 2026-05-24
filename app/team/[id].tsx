import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronRight, Play, Clock, CheckCircle2 } from 'lucide-react-native';
import { useStyles } from '../../src/hooks/useStyles';
import { StatusBar } from 'expo-status-bar';

type MatchStatus = 'live' | 'upcoming' | 'finished';

type Match = {
  id: number; opponent: string; date: string; time: string; status: MatchStatus;
  location: string; result?: 'W' | 'L'; setsWon?: number; setsLost?: number;
  setScores?: string[]; liveScore?: { home: number; away: number; set: number };
};

// MOCK DE DATOS (El mismo que me pasaste)
const teamsData: Record<string, { name: string; matches: Match[] }> = {
  't1': { // Coincide con el ID del equipo 1 en el mock de Home
    name: 'Primera División',
    matches: [
      { id: 101, opponent: 'Club Náutico', date: 'HOY', time: '19:30', status: 'live', location: 'Gimnasio Central', liveScore: { home: 18, away: 15, set: 2 } },
      { id: 102, opponent: 'Atlético Belgrano', date: 'Sáb 10 May', time: '18:00', status: 'upcoming', location: 'Club Belgrano' },
      { id: 104, opponent: 'Riviera Vóley', date: 'Sáb 3 May', time: '17:00', status: 'finished', location: 'Riviera Club', result: 'W', setsWon: 3, setsLost: 1, setScores: ['25-20', '22-25', '25-18', '25-21'] },
      { id: 106, opponent: 'Club Náutico', date: 'Sáb 26 Abr', time: '16:00', status: 'finished', location: 'Club Náutico', result: 'L', setsWon: 1, setsLost: 3, setScores: ['20-25', '25-22', '19-25', '18-25'] },
    ],
  },
  't2': { // Coincide con el ID del equipo 2
    name: 'Sub 21',
    matches: [
      { id: 201, opponent: 'Colegio San Martín', date: 'Vie 9 May', time: '15:00', status: 'upcoming', location: 'San Martín Gym' },
      { id: 203, opponent: 'Deportivo Sur', date: 'Mar 5 May', time: '18:00', status: 'finished', location: 'Deportivo Sur', result: 'W', setsWon: 3, setsLost: 1, setScores: ['25-22', '21-25', '25-19', '25-20'] },
    ],
  },
};

export default function TeamMatchesScreen() {
  const router = useRouter();
  // 📍 Esto captura el ID de la URL (ej: /team/t1 -> id = "t1")
  const { id } = useLocalSearchParams<{ id: string }>(); 
  const { styles } = useStyles();
  
  const [startMatchId, setStartMatchId] = useState<number | null>(null);

  // Buscamos el equipo en el mock, si no existe usamos un fallback
  const teamData = teamsData[id ?? 't1'] ?? { name: 'Equipo Desconocido', matches: [] };
  const { name, matches } = teamData;

  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');
  const finishedMatches = matches.filter(m => m.status === 'finished');

  const startingMatch = matches.find(m => m.id === startMatchId);

  const handleMatchPress = (match: Match) => {
    if (match.status === 'live') {
      router.push(`/match/${match.id}?teamId=${id}`); // Pasamos parámetros por URL
    } else if (match.status === 'finished') {
      router.push(`/match-summary/${match.id}`);
    } else {
      setStartMatchId(match.id);
    }
  };

  return (
    <View style={styles`flex-1 bg-screen`}>
      <StatusBar style="light" />

      {/* ── Header ── */}
      <View style={[styles`bg-header`, { paddingTop: 60, paddingBottom: 0 }]}>
        <View style={styles`flex-row items-center gap-4 px-4 pb-5`}>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.navigate('/home')} // Vuelve a la Home automáticamente
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' }}
          >
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles`flex-1`}>
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.55)' }}>MIS EQUIPOS</Text>
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: '700', color: '#fff' }}>{name}</Text>
          </View>
          
          <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 18, fontWeight: '700', color: '#fff' }}>
              {matches.filter(m => m.status === 'finished' && m.result === 'W').length}-
              {matches.filter(m => m.status === 'finished' && m.result === 'L').length}
            </Text>
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 }}>RÉCORD</Text>
          </View>
        </View>

        {/* Stats strip */}
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' }}>
          {[
            { label: 'EN CURSO', value: liveMatches.length, highlight: liveMatches.length > 0 },
            { label: 'PRÓXIMOS', value: upcomingMatches.length, highlight: false },
            { label: 'JUGADOS', value: finishedMatches.length, highlight: false },
          ].map(({ label, value, highlight }) => (
            <View key={label} style={{ flex: 1, alignItems: 'center', paddingVertical: 12 }}>
              <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: '700', color: highlight ? '#EF4444' : '#fff' }}>{value}</Text>
              <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 10, letterSpacing: 1, color: 'rgba(255,255,255,0.5)' }}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}>
        
        {/* EN CURSO */}
        {liveMatches.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <SectionTitle label="EN CURSO" color="#EF4444" dot />
            {liveMatches.map(match => (
              <LiveCard key={match.id} match={match} onPress={() => handleMatchPress(match)} />
            ))}
          </View>
        )}

        {/* PRÓXIMOS */}
        {upcomingMatches.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <SectionTitle label="PRÓXIMOS PARTIDOS" color="#1E6FD9" />
            <View style={{ gap: 8 }}>
              {upcomingMatches.map(match => (
                <UpcomingCard key={match.id} match={match} onPress={() => handleMatchPress(match)} />
              ))}
            </View>
          </View>
        )}

        {/* FINALIZADOS */}
        {finishedMatches.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <SectionTitle label="FINALIZADOS" color="#64748B" />
            <View style={{ gap: 8 }}>
              {finishedMatches.map(match => (
                <FinishedCard key={match.id} match={match} onPress={() => handleMatchPress(match)} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Start Match Modal */}
      <Modal visible={startMatchId !== null} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 24 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(30,111,217,0.1)', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16 }}>
              <Play size={28} color="#1E6FD9" fill="#1E6FD9" />
            </View>
            
            <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: '700', color: '#0D1F33', textAlign: 'center' }}>Iniciar Partido</Text>
            <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 4 }}>{name}</Text>

            {startingMatch && (
              <View style={{ backgroundColor: '#F4F7FB', borderRadius: 16, padding: 16, marginTop: 20, marginBottom: 20, gap: 12 }}>
                <Row label="Rival" value={startingMatch.opponent} />
                <Row label="Fecha" value={startingMatch.date} />
                <Row label="Hora" value={startingMatch.time} />
                <Row label="Sede" value={startingMatch.location} />
              </View>
            )}

            <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20 }}>¿Confirmás que querés iniciar este partido?</Text>
            
            <View style={styles`flex-row gap-4`}>
              <TouchableOpacity onPress={() => setStartMatchId(null)} style={{ flex: 1, borderWidth: 1, borderColor: '#E2E8F0', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: '600' }}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ flex: 1, backgroundColor: '#1E6FD9', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
                onPress={() => {
                  setStartMatchId(null);
                  router.push(`/match/${startMatchId}?teamId=${id}`);
                }}
              >
                <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: '600', color: '#fff' }}>INICIAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ── Sub-components Native ── */

function SectionTitle({ label, color, dot }: { label: string; color: string; dot?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      {dot && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />}
      <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 14, fontWeight: '700', letterSpacing: 1.5, color }}>{label}</Text>
    </View>
  );
}

function LiveCard({ match, onPress }: { match: Match; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={{ backgroundColor: '#0D1F33', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' }} />
          <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 12, letterSpacing: 1, color: '#EF4444' }}>EN VIVO · SET {match.liveScore?.set}</Text>
        </View>
        <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 20, fontWeight: '700', color: '#fff' }}>{match.opponent}</Text>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{match.location}</Text>
      </View>
      
      <View style={{ alignItems: 'flex-end', marginRight: 12 }}>
        <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: '700', color: '#3D8EF5' }}>
          {match.liveScore?.home} <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 24 }}>-</Text> <Text style={{ color: '#fff' }}>{match.liveScore?.away}</Text>
        </Text>
      </View>
      <ChevronRight size={24} color="rgba(255,255,255,0.3)" />
    </TouchableOpacity>
  );
}

function UpcomingCard({ match, onPress }: { match: Match; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 1, borderColor: '#E2E8F0' }}>
      <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(30,111,217,0.1)', justifyContent: 'center', alignItems: 'center' }}>
        <Clock size={20} color="#1E6FD9" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 18, fontWeight: '600', color: '#0D1F33' }}>{match.opponent}</Text>
        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{match.date} · {match.time} · {match.location}</Text>
      </View>
      <View style={{ backgroundColor: '#1E6FD9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
        <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 12, fontWeight: '700', color: '#fff', letterSpacing: 1 }}>INICIAR</Text>
      </View>
    </TouchableOpacity>
  );
}

function FinishedCard({ match, onPress }: { match: Match; onPress: () => void }) {
  const isWin = match.result === 'W';
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, borderWidth: 1, borderColor: '#E2E8F0' }}>
      <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: isWin ? '#F0FDF4' : '#FEF2F2', justifyContent: 'center', alignItems: 'center' }}>
        <CheckCircle2 size={24} color={isWin ? '#16A34A' : '#EF4444'} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 18, fontWeight: '600', color: '#0D1F33' }}>{match.opponent}</Text>
        <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{match.date} · {match.setScores?.join('  ')}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', marginRight: 4 }}>
        <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: '700', color: isWin ? '#16A34A' : '#EF4444' }}>
          {match.setsWon}-{match.setsLost}
        </Text>
        <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 10, color: '#64748B', letterSpacing: 0.5 }}>SETS</Text>
      </View>
      <ChevronRight size={16} color="#CBD5E1" />
    </TouchableOpacity>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 14, color: '#64748B', letterSpacing: 0.5 }}>{label}</Text>
      <Text style={{ fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: '600', color: '#0D1F33' }}>{value}</Text>
    </View>
  );
}