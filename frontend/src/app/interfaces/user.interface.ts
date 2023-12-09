// User Interface with id, first name, last name, email, and type['user', 'admin']
export interface ReflectionUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: ReflectionUserType;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  createdAt: any;
}

type ReflectionUserType = 'user' | 'admin';

