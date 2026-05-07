import { create } from "zustand";

type Challenge = {
  id: number;
  progress: number;
  joined: boolean;
};

type UserState = {
  points: number;
  completedWorkouts: number[];
  challenges: Challenge[];

  completeWorkout: (id: number) => void;
  joinChallenge: (id: number) => void;
  updateChallengeProgress: (id: number) => void;

  loadFromStorage: () => void;
};

export const useAppStore = create<UserState>((set, get) => ({
  points: 0,
  completedWorkouts: [],
  challenges: [],

  completeWorkout: (id) => {
    const state = get();

    if (!state.completedWorkouts.includes(id)) {
      const updated = {
        ...state,
        completedWorkouts: [...state.completedWorkouts, id],
        points: state.points + 10,
      };

      localStorage.setItem("user", JSON.stringify(updated));
      set(updated);
    }
  },

  joinChallenge: (id) => {
    const state = get();

    const exists = state.challenges.find((c) => c.id === id);

    if (!exists) {
      const updatedChallenges = [
        ...state.challenges,
        { id, progress: 0, joined: true },
      ];

      const updated = {
        ...state,
        challenges: updatedChallenges,
      };

      localStorage.setItem("user", JSON.stringify(updated));
      set(updated);
    }
  },

  updateChallengeProgress: (id) => {
    const state = get();

    const updatedChallenges = state.challenges.map((c) =>
      c.id === id ? { ...c, progress: c.progress + 1 } : c,
    );

    const updated = {
      ...state,
      challenges: updatedChallenges,
      points: state.points + 5,
    };

    localStorage.setItem("user", JSON.stringify(updated));
    set(updated);
  },

  loadFromStorage: () => {
    const data = localStorage.getItem("user");

    if (data) {
      set(JSON.parse(data));
    }
  },
}));
