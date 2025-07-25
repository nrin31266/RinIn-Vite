import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RequestParams<B = unknown> {
  endpoint: string;
  body?: B;
  method?: "post" | "get" | "delete" | "put";
  isAuth?: boolean;
  params?: string | Record<string, any>;
}

interface IApiResponse<T> {
  data: T;
  message: string;
  code: number;
}

const handleAPI = async <T, B = unknown>({
  endpoint,
  body,
  method = "get",
  isAuth = false,
  params,
}: RequestParams<B>): Promise<T> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (isAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const axiosRes = await axios({
      url: endpoint,
      method,
      data: body,
      headers,
      baseURL: API_BASE_URL,
      timeout: 5000,
      params,
    });

    const apiRes: IApiResponse<T> = axiosRes.data;
    return apiRes.data;

  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      console.log(error)
      throw new Error(error.response.data.message);
    } else {
      console.error("An unexpected error occurred.", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};

export default handleAPI;
