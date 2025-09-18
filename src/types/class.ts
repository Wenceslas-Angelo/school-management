export type Class = {
  id: number;
  name: string;               // Ex: "Petite Section", "Moyenne Section", ..., "7ème"
  section?: "A" | "B" | null;  // null pour le collège du 6ème au 3ème
};
