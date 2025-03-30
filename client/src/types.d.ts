import { ReactNode } from 'react';

// Define types for the Swimlane component props
interface SwimlaneProps {
  title: string;
  tickets: any[];
  deleteTicket: (ticketId: number) => Promise<ApiMessage>;
}

// Define types for the TicketCard component props
interface TicketCardProps {
  ticket: TicketData;
  deleteTicket: (ticketId: number) => Promise<ApiMessage>;
}

// Define types for Ticket data
interface TicketData {
  id: number;
  title: string;
  description: string;
  status: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // Index signature to allow any string property access
}

// Define types for API responses
interface ApiMessage {
  message: string;
  [key: string]: any;
}

// Define types for Authentication
interface AuthToken {
  username: string;
  exp: number;
  iat: number;
  [key: string]: any;
}

// Define the ProtectedRoute props
interface ProtectedRouteProps {
  children: ReactNode;
}
