import { useCallback, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import {
  LocationRecord,
  abrirBanco,
  deletarLocalizacao,
  listarLocalizacoes,
  salvarLocalizacao,
} from '../utils/locationStorage';

interface UseLocationDatabaseReturn {
  localizacoes: LocationRecord[];
  carregando: boolean;
  salvar: (latitude: number, longitude: number, accuracy: number | null, descricao?: string) => Promise<void>;
  deletar: (id: number) => Promise<void>;
  recarregar: () => Promise<void>;
}

export function useLocationDatabase(): UseLocationDatabaseReturn {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [localizacoes, setLocalizacoes] = useState<LocationRecord[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    abrirBanco()
      .then(async (banco) => {
        setDb(banco);
        const lista = await listarLocalizacoes(banco);
        setLocalizacoes(lista);
      })
      .finally(() => setCarregando(false));
  }, []);

  const recarregar = useCallback(async () => {
    if (!db) return;
    const lista = await listarLocalizacoes(db);
    setLocalizacoes(lista);
  }, [db]);

  const salvar = useCallback(
    async (
      latitude: number,
      longitude: number,
      accuracy: number | null,
      descricao = ''
    ) => {
      if (!db) return;
      await salvarLocalizacao(db, latitude, longitude, accuracy, descricao);
      await recarregar();
    },
    [db, recarregar]
  );

  const deletar = useCallback(
    async (id: number) => {
      if (!db) return;
      await deletarLocalizacao(db, id);
      await recarregar();
    },
    [db, recarregar]
  );

  return { localizacoes, carregando, salvar, deletar, recarregar };
}
