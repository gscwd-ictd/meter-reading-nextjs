export interface I_Crud<T> {
  create(dto: T): Promise<T>;
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
  update(id: string, dto: Omit<Partial<T>, "id">): Promise<T>;
  delete(id: string): Promise<{ status: string }>;
}
