import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { globalStyles as styles } from "./style";

type Viagem = {
  id_viagem: number;
  local_saida: string;
  local_chegada: string;
  horario_partida: string;
  valor_por_km: number;
  vagas_maximas: number;
  placa_veiculo: string;
  modelo: string;
  km: number;
  valor_total: number;
};

export default function MinhasViagens() {
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    async function carregarViagens() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado.");
          return;
        }

        const response = await fetch(`${BASE_URL}/viagens`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Erro ao buscar viagens");

        setViagens(data);
      } catch (error) {
        console.error("Erro ao carregar viagens:", error);
        Alert.alert("Erro", "Falha ao buscar viagens");
      } finally {
        setLoading(false);
      }
    }

    carregarViagens();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (viagens.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title3}>Nenhuma viagem encontrada</Text>
      </View>
    );
  }

  // função pra formatar a data/hora do ISO pro formato mais legível
  const formatarDataHora = (iso: string) => {
    const data = new Date(iso);
    return `${data.toLocaleDateString()} ${data.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title3}>Minhas Viagens</Text>

      <FlatList
        data={viagens}
        keyExtractor={(item) => item.id_viagem.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              borderRadius: 15,
              marginVertical: 8,
              borderWidth: 1,
              borderColor: "#E6EEF8",
              gap: 5,
              flexDirection: "row",
            }}
          >
            <View>
              <Image source={require('../assets/images/icon-van.png')} style={styles.icon} resizeMode="contain" />
            </View>
            <View>
              <Text style={{ fontWeight: "bold" }}>{item.local_saida} → {item.local_chegada}</Text>
              <Text>{formatarDataHora(item.horario_partida)}</Text>
              <Text>{item.vagas_maximas} vagas</Text>
              <Text>{item.km} km - R$ {item.valor_total ? item.valor_total.toFixed(2) : "0.00"}</Text>
            </View>

          </View>
        )}
      />
      <TouchableOpacity
        onPress={() => router.push("/criarViagem")}
        style={{
          backgroundColor: "#007bff",
          padding: 12,
          borderRadius: 10,
          marginVertical: 15,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Nova Viagem</Text>
      </TouchableOpacity>
    </View>
  );
}
