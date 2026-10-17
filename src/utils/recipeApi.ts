import { authHeader } from "./auth";
import type { RecipeDraft, SavedRecipe } from "../types/recipes";

// const API_BASE = "https://rps9.net";
const API_BASE = "http://localhost:8000";

export class RecipeApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...authHeader(),
      ...init?.headers,
    },
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new RecipeApiError(
      data?.detail || "The recipe request could not be completed.",
      response.status,
    );
  }
  return data as T;
}

export async function listRecipes(): Promise<SavedRecipe[]> {
  const data = await request<{ recipes: SavedRecipe[] }>("/api/recipes");
  return data.recipes;
}

export function createRecipe(recipe: RecipeDraft): Promise<SavedRecipe> {
  return request<SavedRecipe>("/api/recipes", {
    method: "POST",
    body: JSON.stringify(recipe),
  });
}

export function updateRecipe(id: number, recipe: RecipeDraft): Promise<SavedRecipe> {
  return request<SavedRecipe>(`/api/recipes/${id}`, {
    method: "PUT",
    body: JSON.stringify(recipe),
  });
}

export function deleteRecipe(id: number): Promise<{ ok: boolean; id: number }> {
  return request<{ ok: boolean; id: number }>(`/api/recipes/${id}`, {
    method: "DELETE",
  });
}
