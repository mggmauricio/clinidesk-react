// src/hooks/useViaCep.ts
import { useState, useEffect } from "react";

interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string; // Cidade
  uf: string; // Estado
  erro?: boolean;
}

export function useViaCep(cep: string) {
  const [address, setAddress] = useState<ViaCepResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length === 8) {
      setLoading(true);
      setError(null);

      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then((res) => res.json())
        .then((data: ViaCepResponse) => {
          if (data.erro) {
            setError("CEP não encontrado");
            setAddress(null);
          } else {
            // Pegando apenas os campos desejados
            setAddress({
              logradouro: data.logradouro,
              bairro: data.bairro,
              localidade: data.localidade,
              uf: data.uf,
            });
            setError(null);
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Erro ao consultar o CEP");
          setAddress(null);
          setLoading(false);
        });
    } else {
      setAddress(null);
      setError(null);
    }
  }, [cep]);

  return { address, loading, error };
}
