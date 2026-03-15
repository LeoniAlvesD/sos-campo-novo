import { useCallback, useState } from 'react';
import * as Location from 'expo-location';

export interface CoordenadaAtual {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

interface UseLocationTrackingReturn {
  coordenada: CoordenadaAtual | null;
  obtendo: boolean;
  erro: string | null;
  obterLocalizacao: () => Promise<CoordenadaAtual | null>;
}

export function useLocationTracking(): UseLocationTrackingReturn {
  const [coordenada, setCoordenada] = useState<CoordenadaAtual | null>(null);
  const [obtendo, setObtendo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const obterLocalizacao = useCallback(async (): Promise<CoordenadaAtual | null> => {
    setObtendo(true);
    setErro(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErro('Permissão de localização negada. Ative o GPS nas configurações do dispositivo.');
        return null;
      }

      const posicao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const nova: CoordenadaAtual = {
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
        accuracy: posicao.coords.accuracy,
      };

      setCoordenada(nova);
      return nova;
    } catch (error) {
      console.warn('[useLocationTracking] Erro ao obter localização:', error);
      setErro('Não foi possível obter a localização. Verifique se o GPS está ativado.');
      return null;
    } finally {
      setObtendo(false);
    }
  }, []);

  return { coordenada, obtendo, erro, obterLocalizacao };
}
