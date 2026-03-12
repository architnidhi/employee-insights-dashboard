export interface User {
  username: string;
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  salary: number;
  city: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface CitySalary {
  city: string;
  totalSalary: number;
  count: number;
  coordinates?: [number, number];
}
