import { ThesisFormData, Thesis } from "../types/thesis";
import { Request } from "../types/request";

const API_URL = "http://localhost:3000";

interface ThesesQueryParams {
  degree?: string;
  field?: string;
  status?: string;
  tags?: string[];
  supervisor?: string;
}

export const createThesisRequest = async (thesis: Thesis, token: string) => {
  const response = await fetch(`${API_URL}/requests/Requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      supervisor: thesis.supervisor._id,
      thesisTitle: thesis.title,
      description: `Prośba o dołączenie do pracy dyplomowej "${thesis.title}"`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Wystąpił błąd podczas wysyłania prośby o dołączenie."
    );
  }

  return response.json();
};

export const getTheses = async (token: string, params?: ThesesQueryParams) => {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, value);
        }
      }
    });
  }

  const url = `${API_URL}/theses${params ? `?${searchParams}` : ""}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Wystąpił błąd podczas pobierania prac dyplomowych."
    );
  }

  return response.json();
};

export const getThesisById = async (id: string, token: string) => {
  const response = await fetch(`${API_URL}/theses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Wystąpił błąd podczas pobierania pracy dyplomowej."
    );
  }

  return response.json();
};

export const createThesis = async (data: ThesisFormData, token: string) => {
  // Get the current user's ID (supervisor ID) from localStorage or context
  const userData = localStorage.getItem("user");
  if (!userData) {
    throw new Error("Brak danych użytkownika. Zaloguj się ponownie.");
  }

  let user;
  try {
    user = JSON.parse(userData);
  } catch (e) {
    throw new Error("Nieprawidłowe dane użytkownika. Zaloguj się ponownie.");
  }

  if (!user || !user._id || !user.supervisor) {
    throw new Error("Brak uprawnień do dodawania pracy dyplomowej.");
  }

  const supervisorId = user.supervisor;

  const response = await fetch(`${API_URL}/theses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...data,
      status: "FREE",
      supervisor: supervisorId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Wystąpił błąd podczas dodawania pracy.");
  }

  return response.json();
};

export const getSupervisorTheses = async (
  supervisorId: string,
  token: string
) => {
  const response = await fetch(
    `${API_URL}/supervisors/${supervisorId}/theses`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Wystąpił błąd podczas pobierania prac dyplomowych."
    );
  }

  return response.json();
};

export const getSupervisorRequests = async (
  supervisorId: string,
  token: string
) => {
  const response = await fetch(
    `${API_URL}/supervisors/${supervisorId}/requests`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Wystąpił błąd podczas pobierania próśb o dołączenie."
    );
  }

  return response.json();
};

export const updateRequestStatus = async (
  requestId: string,
  status: string,
  token: string
) => {
  const response = await fetch(`${API_URL}/requests/${requestId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.message || "Wystąpił błąd podczas aktualizacji statusu prośby."
    );
  }

  return response.json();
};
