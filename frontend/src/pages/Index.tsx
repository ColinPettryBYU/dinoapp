import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CamperCard from "@/components/CamperCard";

interface Camper {
  id: number;
  name: string;
  username: string;
  emoji: string;
}

interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  username?: string | null;
}

const emojis = ["🦕", "🦖", "🦴", "🌋"];
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

const Index = () => {
  const [saveError, setSaveError] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<ApiUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/users`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });

  const updateUsernameMutation = useMutation({
    mutationFn: async ({ id, username }: { id: number; username: string }) => {
      const response = await fetch(`${apiBaseUrl}/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Failed to save username");
      }

      return (await response.json()) as ApiUser;
    },
    onSuccess: (updatedUser) => {
      setSaveError("");
      queryClient.setQueryData<ApiUser[]>(["users"], (current) => {
        if (!current) return current;
        return current.map((user) =>
          user.id === updatedUser.id ? { ...user, username: updatedUser.username } : user
        );
      });
    },
    onError: () => {
      setSaveError("Could not save username. Please try again.");
    },
  });

  const campers = useMemo<Camper[]>(() => {
    if (!data) return [];
    return data.map((user, index) => {
      const defaultUsername = `${user.first_name}${user.last_name}`.replace(/\s+/g, "");
      return {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        username: user.username?.trim() || defaultUsername,
        emoji: emojis[index % emojis.length],
      };
    });
  }, [data]);

  const updateUsername = (id: number, newUsername: string) => {
    updateUsernameMutation.mutate({ id, username: newUsername });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="py-10 text-center">
        <p className="text-4xl mb-2">🦕</p>
        <h1 className="font-display text-4xl font-bold text-foreground">
          Dino Discovery Camp
        </h1>
        <p className="mt-2 text-muted-foreground text-lg">
          Summer 2026 · Enrolled Campers
        </p>
      </header>

      <main className="mx-auto max-w-xl px-4 pb-16 space-y-4">
        {isLoading && <p className="text-muted-foreground">Loading campers...</p>}
        {isError && (
          <p className="text-destructive">
            Could not load campers from the backend. Make sure `backend` is running on port
            3001.
          </p>
        )}
        {saveError && <p className="text-destructive">{saveError}</p>}
        {campers.map((c) => (
          <CamperCard
            key={c.id}
            name={c.name}
            username={c.username}
            emoji={c.emoji}
            onSave={(newUsername) => updateUsername(c.id, newUsername)}
          />
        ))}
      </main>
    </div>
  );
};

export default Index;
