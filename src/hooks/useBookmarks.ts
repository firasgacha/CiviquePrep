import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";

export interface BookmarkedQuestion {
  questionId: string;
  bookmarkedAt: string;
  notes?: string;
}

export interface UserBookmarks {
  [questionId: string]: BookmarkedQuestion;
}

const STORAGE_KEY = "civique-bookmarks";
const FLASH_CARDS_KEY = "civique-flashcard-bookmarks";

export function useBookmarks(type: "questions" | "flashcards" = "questions") {
  const storageKey = type === "flashcards" ? FLASH_CARDS_KEY : STORAGE_KEY;

  const [bookmarks, setBookmarks] = useLocalStorage<UserBookmarks>(
    storageKey,
    {},
  );

  const isBookmarked = useCallback(
    (questionId: string): boolean => {
      return !!bookmarks[questionId];
    },
    [bookmarks],
  );

  const toggleBookmark = useCallback(
    (questionId: string) => {
      setBookmarks((prev) => {
        if (prev[questionId]) {
          // Remove bookmark
          const keysToRemove = [questionId];
          return Object.fromEntries(
            Object.entries(prev).filter(([key]) => !keysToRemove.includes(key)),
          );
        } else {
          // Add bookmark
          return {
            ...prev,
            [questionId]: {
              questionId,
              bookmarkedAt: new Date().toISOString(),
            },
          };
        }
      });
    },
    [setBookmarks],
  );

  const addNote = useCallback(
    (questionId: string, note: string) => {
      setBookmarks((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          questionId,
          bookmarkedAt:
            prev[questionId]?.bookmarkedAt || new Date().toISOString(),
          notes: note,
        },
      }));
    },
    [setBookmarks],
  );

  const removeBookmark = useCallback(
    (questionId: string) => {
      setBookmarks((prev) => {
        const keysToRemove = [questionId];
        return Object.fromEntries(
          Object.entries(prev).filter(([key]) => !keysToRemove.includes(key)),
        );
      });
    },
    [setBookmarks],
  );

  const bookmarkCount = useMemo(
    () => Object.keys(bookmarks).length,
    [bookmarks],
  );

  const bookmarkedIds = useMemo(() => Object.keys(bookmarks), [bookmarks]);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    addNote,
    removeBookmark,
    bookmarkCount,
    bookmarkedIds,
  };
}
