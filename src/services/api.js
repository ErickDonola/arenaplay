// ============================================================
// src/services/api.js — Serviço de API
// Centraliza as chamadas HTTP para o json-server
// ============================================================

// 📝 CONFIGURAÇÃO: Altere o IP abaixo para o IP do seu computador
// Se estiver em localhost/web, use 'http://localhost:3000'
// Para testar em celular/emulador, use 'http://SEU_IP_LOCAL:3000'
const API_BASE_URL = 'http://localhost:3000';

// ============================================================
// Funções auxiliares
// ============================================================

/**
 * Faz uma requisição GET
 */
export const apiGet = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API GET] Erro ao buscar ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Faz uma requisição POST
 */
export const apiPost = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API POST] Erro ao criar em ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Faz uma requisição PUT
 */
export const apiPut = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API PUT] Erro ao atualizar em ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Faz uma requisição DELETE
 */
export const apiDelete = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[API DELETE] Erro ao deletar em ${endpoint}:`, error);
    throw error;
  }
};

// ============================================================
// Endpoints específicos da aplicação
// ============================================================

export const sportAPI = {
  getAll: () => apiGet('/sports'),
  getById: (id) => apiGet(`/sports/${id}`),
};

export const timesAPI = {
  getAll: () => apiGet('/availableTimes'),
  getById: (id) => apiGet(`/availableTimes/${id}`),
};

export const equipmentAPI = {
  getAll: () => apiGet('/equipments'),
  getById: (id) => apiGet(`/equipments/${id}`),
};

export const tournamentAPI = {
  getAll: () => apiGet('/tournaments'),
  getById: (id) => apiGet(`/tournaments/${id}`),
  create: (data) => apiPost('/tournaments', data),
  update: (id, data) => apiPut(`/tournaments/${id}`, data),
  delete: (id) => apiDelete(`/tournaments/${id}`),
};

export const videoAPI = {
  getAll: () => apiGet('/videoSessoes'),
  getById: (id) => apiGet(`/videoSessoes/${id}`),
  create: (data) => apiPost('/videoSessoes', data),
  update: (id, data) => apiPut(`/videoSessoes/${id}`, data),
  delete: (id) => apiDelete(`/videoSessoes/${id}`),
};

export const userAPI = {
  getAll: () => apiGet('/usuarios'),
  getById: (id) => apiGet(`/usuarios/${id}`),
  create: (data) => apiPost('/usuarios', data),
  update: (id, data) => apiPut(`/usuarios/${id}`, data),
};

export const agendamentoAPI = {
  getAll: () => apiGet('/agendamentos'),
  getById: (id) => apiGet(`/agendamentos/${id}`),
  create: (data) => apiPost('/agendamentos', data),
  update: (id, data) => apiPut(`/agendamentos/${id}`, data),
  delete: (id) => apiDelete(`/agendamentos/${id}`),
};
