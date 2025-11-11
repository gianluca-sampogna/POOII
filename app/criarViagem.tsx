import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { globalStyles as styles } from "./style";

type Veiculo = {
  id_veiculo: number;
  placa: string;
  modelo: string;
};

export default function CriarViagem() {
  const router = useRouter();
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const [veiculo, setVeiculo] = useState("");
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [open, setOpen] = useState(false);

  // const BASE_URL = "http://172.20.10.4:3000";
  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    async function buscarVeiculos() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Erro", "Usuário não autenticado.");
          return;
        }

        const response = await fetch(`${BASE_URL}/veiculo`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar veículos");

        const data = await response.json();
        setVeiculos(data);
      } catch (error) {
        console.error("Erro ao carregar veículos:", error);
        Alert.alert("Erro", "Falha ao buscar veículos");
      }
    }

    buscarVeiculos();
  }, []);

  const handleCriar = async () => {
  if (!origem || !destino || !data || !veiculo) {
    Alert.alert("Atenção", "Preencha todos os campos antes de continuar.");
    return;
  }

  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    // Converte data tipo "10/11/2025" para "2025-11-10T08:00:00"
    const [dia, mes, ano] = data.split("/");
    const horario_partida = `${ano}-${mes}-${dia}T08:00:00`; // 08h fixo por enquanto

    const body = {
      horario_partida,
      local_saida: origem,
      local_chegada: destino,
      placa_veiculo: veiculo,
    };

    const response = await fetch(`${BASE_URL}/viagens`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    console.log(result);

    if (!response.ok) throw new Error(result.error || "Erro ao criar viagem");

    if (Platform.OS === "web") {
      alert("Viagem criada com sucesso!");
    } else {
      Alert.alert("Sucesso", "Viagem criada com sucesso!");
    }

    router.push("/viagens");
    setOrigem("");
    setDestino("");
    setData("");
    setVeiculo("");
  } catch (error) {
    console.error("Erro ao criar viagem:", error);
    if (Platform.OS === "web") {
      alert("Erro ao criar viagem.");
    } else {
      Alert.alert("Erro", "Erro ao criar viagem.");
    }
  }
};

  return (
    <View style={styles.container}>
      <Text style={[styles.title3, {marginBottom: 50}]}>Criar Viagem</Text>

      <TextInput
        placeholder="Origem"
        value={origem}
        onChangeText={setOrigem}
        placeholderTextColor="#c9c9c9ff"
        style={styles.input2}
      />

      <TextInput
        placeholder="Destino"
        value={destino}
        onChangeText={setDestino}
        placeholderTextColor="#c9c9c9ff"
        style={styles.input2}
      />

      <TextInput
        placeholder="Data (ex: 10/11/2025)"
        value={data}
        onChangeText={setData}
        placeholderTextColor="#c9c9c9ff"
        style={styles.input2}
      />

      <View style={{ width: "100%", alignSelf: "center" }}>
        <DropDownPicker
          open={open}
          value={veiculo}
          items={veiculos.map((v) => ({
            label: `${v.modelo} - ${v.placa}`,
            value: v.placa,
          }))}
          setOpen={setOpen}
          setValue={setVeiculo}
          placeholder="Selecione o veículo"
          style={{
            ...styles.input2,
            alignSelf: "center",
          }}
          dropDownContainerStyle={{
            borderColor: "#ccc",
            width: '25%',
            alignSelf: "center",
          }}
          textStyle={{
            color: "#000",
          }}
          placeholderStyle={{
            color: "#c9c9c9",
          }}
        />
      </View>

      <TouchableOpacity
        style={[styles.Button, { marginTop: 50, alignItems: "center" }]}
        onPress={handleCriar}
      >
        <Text style={styles.buttonText}>Criar Viagem</Text>
      </TouchableOpacity>
    </View>
  );
}
