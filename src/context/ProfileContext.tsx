import React, { createContext, useState, useContext, ReactNode } from 'react';

export type AccessRole = 'admin' | 'coach' | 'assistant';

export type Player = {
  id: string;
  name: string;
  number: number;
};

export type Team = {
  id: string;
  name: string;
  roster: Player[];
  matches: number;
  record: string;
};

export type ClubProfile = {
  id: string;
  clubName: string;
  city: string;
  role: AccessRole;
  color: string;
  teams: Team[];
};

export type Coach = {
  name: string;
  email: string;
  avatarSrc: string | null;
};

export type MatchStatus = 'live' | 'upcoming' | 'finished';

export type MatchItem = {
  id: string;
  opponent: string;
  date: string;
  time: string;
  tournament: string;
  location: string;
  status: MatchStatus;
  roster: string[];
  result?: 'W' | 'L';
  setsWon?: number;
  setsLost?: number;
  setScores?: string[];
  liveScore?: { home: number; away: number; set: number };
};

interface ProfileContextType {
  coach: Coach;
  profiles: ClubProfile[];
  activeProfile: ClubProfile;
  activeProfileId: string;
  matches: Record<string, MatchItem[]>;
  updateCoach: (data: Partial<Coach>) => void;
  switchProfile: (id: string) => void;
  addProfile: (data: Omit<ClubProfile, 'id' | 'teams'>) => void;
  updateProfile: (id: string, data: Partial<Omit<ClubProfile, 'id' | 'teams'>>) => void;
  deleteProfile: (id: string) => void;
  addTeam: (profileId: string, teamData: Omit<Team, 'id'>) => void;
  addMatch: (teamId: string, matchData: Omit<MatchItem, 'id'>) => void;
}

const INITIAL_ROSTERS: Record<string, Player[]> = {
  t1: [
    { id: 'p1', name: 'María González', number: 5 },
    { id: 'p2', name: 'Ana Rodríguez', number: 12 },
    { id: 'p3', name: 'Laura Pérez', number: 8 },
    { id: 'p4', name: 'Sofía Martínez', number: 3 },
    { id: 'p5', name: 'Carolina López', number: 7 },
    { id: 'p6', name: 'Valentina Silva', number: 10 },
    { id: 'p7', name: 'Florencia Castro', number: 1 },
    { id: 'p8', name: 'Micaela Fernández', number: 4 },
    { id: 'p9', name: 'Julieta Morales', number: 9 },
    { id: 'p10', name: 'Camila Ruiz', number: 11 },
    { id: 'p11', name: 'Lucía Medina', number: 6 },
    { id: 'p12', name: 'Agustina Paz', number: 2 },
    { id: 'p13', name: 'Martina Ríos', number: 14 },
    { id: 'p14', name: 'Josefina Arias', number: 15 },
  ],
  t2: [
    { id: 'p21', name: 'Sofía Acosta', number: 5 },
    { id: 'p22', name: 'Emilia Vega', number: 7 },
    { id: 'p23', name: 'Valentina Luna', number: 9 },
    { id: 'p24', name: 'Catalina Sosa', number: 2 },
    { id: 'p25', name: 'Julieta Méndez', number: 10 },
    { id: 'p26', name: 'Isabella Rojas', number: 4 },
    { id: 'p27', name: 'Camila Peralta', number: 8 },
    { id: 'p28', name: 'Luciana Campos', number: 6 },
    { id: 'p29', name: 'Martina Delgado', number: 1 },
    { id: 'p30', name: 'Brunela Agüero', number: 3 },
    { id: 'p31', name: 'Ana Cruz', number: 11 },
    { id: 'p32', name: 'Rocío Ibarra', number: 12 },
  ],
};

const INITIAL_PROFILES: ClubProfile[] = [
  {
    id: '1',
    clubName: 'Club Atlético Lanús',
    city: 'Lanús',
    role: 'coach',
    color: '#800000',
    teams: [
      { id: 't1', name: 'Primera División', roster: INITIAL_ROSTERS.t1, matches: 12, record: '9-3' },
      { id: 't2', name: 'Sub 21', roster: INITIAL_ROSTERS.t2, matches: 8, record: '5-3' },
    ]
  },
  {
    id: '2',
    clubName: 'UADE Vóley',
    city: 'CABA',
    role: 'admin',
    color: '#1E6FD9',
    teams: [
      { id: 't3', name: 'UADE Universitario', roster: [], matches: 6, record: '4-2' },
      { id: 't4', name: 'Interfacultades', roster: [], matches: 4, record: '3-1' },
    ]
  }
];

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [coach, setCoach] = useState<Coach>({ name: 'Gabriel Gerez', email: 'gabriel@vstats.com', avatarSrc: null });
  const [profiles, setProfiles] = useState<ClubProfile[]>(INITIAL_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>('1');
  const [matches, setMatches] = useState<Record<string, MatchItem[]>>({});

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const updateCoach = (data: Partial<Coach>) => setCoach(prev => ({ ...prev, ...data }));
  const switchProfile = (id: string) => setActiveProfileId(id);

  const addProfile = (data: Omit<ClubProfile, 'id' | 'teams'>) => {
    const newProfile: ClubProfile = { id: Date.now().toString(), ...data, teams: [] };
    setProfiles(prev => [...prev, newProfile]);
  };

  const updateProfile = (id: string, data: Partial<Omit<ClubProfile, 'id' | 'teams'>>) => {
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (activeProfileId === id) setActiveProfileId('1');
  };

  const addTeam = (profileId: string, teamData: Omit<Team, 'id'>) => {
    setProfiles(prev => prev.map(profile => {
      if (profile.id === profileId) {
        return {
          ...profile,
          teams: [...profile.teams, { id: `t_${Date.now()}`, ...teamData }]
        };
      }
      return profile;
    }));
  };

  const addMatch = (teamId: string, matchData: Omit<MatchItem, 'id'>) => {
    const newMatch: MatchItem = { id: `m_${Date.now()}`, ...matchData };
    setMatches(prev => ({
      ...prev,
      [teamId]: [...(prev[teamId] || []), newMatch]
    }));
  };

  return (
    <ProfileContext.Provider value={{
      coach, profiles, activeProfile, activeProfileId, matches,
      updateCoach, switchProfile, addProfile, updateProfile, deleteProfile, addTeam, addMatch
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile debe usarse dentro de ProfileProvider');
  return context;
};
