export type FieldType = "text" | "email" | "number" | "select" | "checkbox" | "textarea" | "date";

export interface EventField {
  label: string;
  name: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  image: {
    url: string;
    publicId: string;
  };
  fields: EventField[];
  isActive: boolean;
  deadline?: string;
  createdBy: string;
  createdAt: string;
}

export interface EventRegistration {
  _id: string;
  event: string;
  user: string;
  responses: Record<string, any>;
  createdAt: string;
}

export interface EventResponse {
  success: boolean;
  event: Event;
}

export interface AllEventsResponse {
  success: boolean;
  events: Event[];
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  registration: EventRegistration;
}