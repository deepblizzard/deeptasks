import { createClient } from "@liveblocks/client";
import { LiveList, LiveObject } from "@liveblocks/core";
import { createRoomContext } from "@liveblocks/react";

// --------------------
// 👥 Presence (live user state)
export type Presence = {
  boardId?: string | null;
  cardId?: string | null;
};

// 📦 Column and Card structure
export type Column = {
  name: string;
  id: string;
  index: number;
};

export type Card = {
  name: string;
  id: string;
  index: number;
  columnId: string;
};

// 💾 Shared storage
type Storage = {
  columns: LiveList<LiveObject<Column>>;
  cards: LiveList<LiveObject<Card>>;
};

// 🧑‍💼 User metadata
type UserMeta = {
  id: string;
  info: {
    name: string;
    email: string;
    image: string;
  };
};

// 📢 Room events (extend as needed)
type RoomEvent = {};

// 🧵 Thread metadata
type ThreadMetadata = {
  cardId: string;
};

// --------------------
// 🔗 Create Liveblocks client
const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
  throttle: 100,

  // ✅ Moved here in v1.10+
  resolveUsers: async ({ userIds }) => {
    const response = await fetch(`/api/users?ids=${userIds.join(",")}`);
    return await response.json();
  },

  resolveMentionSuggestions: async ({ text }) => {
    const response = await fetch(`/api/users?search=${text}`);
    const users: UserMeta[] = await response.json();
    return users.map((user) => user.id);
  },
});

// --------------------
// 🧩 Create context with client + types
export const {
  RoomProvider,
  useMyPresence,
  useUpdateMyPresence,
  useStorage,
  useMutation,
  useRoom,
  useSelf,
  useOthers,
  useThreads,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(
  client
);
