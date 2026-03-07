// services/requisitions.service.ts
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export const RequisitionLinesService = {
  getByRequisitionId: async (id: Number) => {
    const response = await axios.get(`${apiUrl}/requisition-lines/${id}/requisition`, {
        headers: authHeaders(),
    });
    console.log(response.data);
    return response.data;
  },
};
