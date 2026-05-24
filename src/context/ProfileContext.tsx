import React, { createContext, useState, useContext, ReactNode } from 'react';

export type AccessRole = 'admin' | 'coach' | 'assistant';
export type Team = { id: string; name: string; players: number; matches: number; record: string; };
export type ClubProfile = { id: string; clubName: string; city: string; role: AccessRole; color: string; teams: Team[]; };
export type Coach = { name: string; email: string; avatarSrc: string | null; };

interface ProfileContextType {
  coach: Coach;
  profiles: ClubProfile[];
  activeProfile: ClubProfile;
  activeProfileId: string;
  updateCoach: (data: Partial<Coach>) => void;
  switchProfile: (id: string) => void;
  addProfile: (data: Omit<ClubProfile, 'id' | 'teams'>) => void;
  updateProfile: (id: string, data: Partial<Omit<ClubProfile, 'id' | 'teams'>>) => void;
  deleteProfile: (id: string) => void;
  addTeam: (profileId: string, teamData: Omit<Team, 'id'>) => void;
}

const INITIAL_PROFILES: ClubProfile[] = [
  {
    id: '1',
    clubName: 'Club Atlético Lanús',
    city: 'Lanús',
    role: 'coach',
    color: '#800000',
    teams: [
      { id: 't1', name: 'Primera División', players: 14, matches: 12, record: '9-3' },
      { id: 't2', name: 'Sub 21', players: 12, matches: 8, record: '5-3' },
    ]
  },
  {
    id: '2',
    clubName: 'UADE Vóley',
    city: 'CABA',
    role: 'admin',
    color: '#1E6FD9',
    teams: [
      { id: 't3', name: 'UADE Universitario', players: 16, matches: 6, record: '4-2' },
      { id: 't4', name: 'Interfacultades', players: 10, matches: 4, record: '3-1' },
    ]
  }
];

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [coach, setCoach] = useState<Coach>({ name: 'Gabriel Gerez', email: 'gabriel@vstats.com', avatarSrc: null });
  const [profiles, setProfiles] = useState<ClubProfile[]>(INITIAL_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>('1');

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

  return (
    <ProfileContext.Provider value={{ coach, profiles, activeProfile, activeProfileId, updateCoach, switchProfile, addProfile, updateProfile, deleteProfile, addTeam }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile debe usarse dentro de ProfileProvider');
  return context;
};