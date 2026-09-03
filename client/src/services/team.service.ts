import api from "../lib/api";

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  batchYear: number;

  photo: {
    url: string;
    publicId: string;
  };

  linkedin?: string;
  github?: string;
  order: number;

  createdAt?: string;
  updatedAt?: string;
}

export interface TeamResponse {
  success: boolean;
  count: number;
  members: TeamMember[];
}

export interface SingleTeamResponse {
  success: boolean;
  member: TeamMember;
}

export const getTeamMembers = async (
  batchYear?: number,
): Promise<TeamResponse> => {
  const res = await api.get<TeamResponse>("/team", {
    params: batchYear
      ? { batchYear }
      : undefined,
  });

  return res.data;
};

export const getTeamMemberById = async (
  id: string,
): Promise<SingleTeamResponse> => {
  const res = await api.get<SingleTeamResponse>(
    `/team/${id}`,
  );

  return res.data;
};

export const createTeamMember = async (
  formData: FormData,
): Promise<SingleTeamResponse> => {
  const res =
    await api.post<SingleTeamResponse>(
      "/team/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

  return res.data;
};

export const updateTeamMember = async (
  id: string,
  formData: FormData,
): Promise<SingleTeamResponse> => {
  const res =
    await api.put<SingleTeamResponse>(
      `/team/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

  return res.data;
};

export const deleteTeamMember = async (
  id: string,
) => {
  const res = await api.delete(
    `/team/delete/${id}`,
  );

  return res.data;
};