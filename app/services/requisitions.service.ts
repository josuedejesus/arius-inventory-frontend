// services/requisitions.service.ts
import axios from "axios";
import { toast } from "sonner";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const RequisitionsService = {
  getAll: async () => {
    const response = await axios.get(`${apiUrl}/requisitions`, {
      headers: authHeaders(),
    });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axios.get(`${apiUrl}/requisitions/${id}`, {
      headers: authHeaders(),
    });
    return response.data;
  },

  create: async (dto: any) => {
    const response = await axios.post(`${apiUrl}/requisitions`, dto, {
      headers: authHeaders(),
    })
  },

  update: async (id: Number, dto: any) => {
    const response = await axios.put(`${apiUrl}/requisitions/${id}`, dto, {
      headers: authHeaders(),
    });
  },

  approve: async (id: number) => {
    const response = await axios.post(
      `${apiUrl}/requisitions/${id}/approve`,
      {},
      {
        headers: authHeaders(),
      },
    );
  },

  execute: async (id: number) => {
    const response = await axios.post(
      `${apiUrl}/requisitions/${id}/execute`,
      {},
      {
        headers: authHeaders(),
      },
    );
  },

  receive: async (id: number) => {
    const response = await axios.post(
      `${apiUrl}/requisitions/${id}/receive`,
      {},
      {
        headers: authHeaders(),
      },
    );
  },
};
