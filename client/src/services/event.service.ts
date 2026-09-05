import api from "../lib/api";
import { AllEventsResponse, EventResponse, RegistrationResponse, EventRegistration } from "../types/event.types";

export const getAllEvents = async (): Promise<AllEventsResponse> => {
  const res = await api.get<AllEventsResponse>("/event/all");
  return res.data;
};

export const getActiveEvents = async (): Promise<AllEventsResponse> => {
  const res = await api.get<AllEventsResponse>("/event/active");
  return res.data;
};

export const getEventById = async (id: string): Promise<EventResponse> => {
  const res = await api.get<EventResponse>(`/event/${id}`);
  return res.data;
};

export const createEvent = async (formData: FormData): Promise<EventResponse> => {
  const res = await api.post<EventResponse>("/event/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const registerForEvent = async (id: string, responses: Record<string, any>): Promise<RegistrationResponse> => {
  const res = await api.post<RegistrationResponse>(`/event/register/${id}`, { responses });
  return res.data;
};

export const deleteEvent = async (id: string) => {
  const res = await api.delete(`/event/delete/${id}`);
  return res.data;
};

export const getEventResponses = async (id: string): Promise<{ success: boolean; responses: EventRegistration[] }> => {
  const res = await api.get(`/event/responses/${id}`);
  return res.data;
};

export const getMyRegistration = async (eventId: string): Promise<{ success: boolean; registration: any }> => {
  const res = await api.get(`/event/my-registration/${eventId}`);
  return res.data;
};

export const updateEvent = async (id: string, formData: FormData): Promise<EventResponse> => {
  const res = await api.put<EventResponse>(`/event/update/${id}`, formData);
  return res.data;
};