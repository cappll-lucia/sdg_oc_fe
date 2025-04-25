import { AxiosError } from "axios";
import { CuentaCorriente } from "../entities/cuentaCorriente";
import { NewMovimientoType } from "../entities/movimiento";
import { http } from "../http";

interface CtaCteFilers {
  filtro?: string | null;
  estado?: string | null;
  limit?: number | string;
  offset?: number | string;
}

const getAll = async (filters: CtaCteFilers) => {
  try {
    const params = new URLSearchParams();

    if (filters.filtro) params.append("filtro", filters.filtro);
    if (filters.estado) params.append("estado", filters.estado);

    params.append("limit", filters.limit?.toString() || "10");
    params.append("offset", filters.offset?.toString() || "0");

    const url = `/cuenta-corriente?${params.toString()}`;
    const resp = await http.get(url);
    return resp.data.data as {
      items: CuentaCorriente[];
      nextPage: number | null;
      previousPage: number | null;
    };
  } catch (error) {
    throw error instanceof AxiosError
      ? new Error(error?.response?.data?.message)
      : new Error("Algo salió mal");
  }
};

const getOneByCliente = async (_idCliente: number) => {
  try {
    const resp = await http.get(`/cuenta-corriente/cliente/${_idCliente}`);
    return resp.data.data as CuentaCorriente;
  } catch (error) {
    throw error instanceof AxiosError
      ? new Error(error?.response?.data?.message)
      : new Error("Algo salió mal");
  }
};

const updateSaldo = async (
  _idCliente: number,
  _newMovimeinto: NewMovimientoType
) => {
  try {
    const resp = await http.patch(
      `/cuenta-corriente/cliente/${_idCliente}`,
      _newMovimeinto
    );
    return resp.data.data as CuentaCorriente;
  } catch (error) {
    throw error instanceof AxiosError
      ? new Error(error?.response?.data?.message)
      : new Error("Algo salió mal");
  }
};

export const cuentaCorrienteApi = {
  getAll: (_filters: CtaCteFilers) => getAll(_filters),
  getOneByCliente: (_id: number) => getOneByCliente(_id),
  updateSaldo: (_id: number, _newMovimeinto: NewMovimientoType) =>
    updateSaldo(_id, _newMovimeinto),
};
