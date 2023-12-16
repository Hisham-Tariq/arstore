export interface ReflectionUser {
  id: string;
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: 'admin' | 'user';
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  createdAt: string;
}

