import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from "react-native-dropdown-picker";
import BotaoVoltar from './script';
import { cadastrarVeiculo } from './script.js';
import { globalStyles as styles } from './style';


export default function RegistroVeiculo() {
  const router = useRouter();

  const [tipo, setTipo] = useState('');
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cor, setCor] = useState('');
  const [passageiros_maximos, setPassageiros_maximos] = useState('');
  const [chassi, setChassi] = useState('');

  const [openTipo, setOpenTipo] = useState(false);
  const [itemsTipo, setItemsTipo] = useState([
    { label: "Van", value: "Van" },
    { label: "Ônibus", value: "Ônibus" },
  ]);

  const [openCor, setOpenCor] = useState(false);
  const [itemsCor, setItemsCor] = useState([
    { label: "Branco", value: "Branco" },
    { label: "Preto", value: "Preto" },
    { label: "Prata", value: "Prata" },
    { label: "Vermelho", value: "Vermelho" },
    { label: "Azul", value: "Azul" },
    { label: "Cinza", value: "Cinza" },
    { label: "Verde", value: "Verde" },
    { label: "Amarelo", value: "Amarelo" },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title3}>Novo Veículo</Text>
      <View style={{ gap: 10, marginTop: 50 }}>
        <DropDownPicker
          open={openTipo}
          value={tipo}
          items={itemsTipo}
          setOpen={setOpenTipo}
          setValue={(callback) => {
            const value = typeof callback === "function" ? callback(tipo) : callback;
            setTipo(value);
          }} setItems={setItemsTipo} placeholder="Selecione o tipo" style={styles.input2} dropDownContainerStyle={{ borderColor: "#ccc" }}/>
        <TextInput value={placa} onChangeText={setPlaca} placeholder="Placa" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
        <TextInput value={modelo} onChangeText={setModelo} placeholder="Modelo" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
        <DropDownPicker
          open={openCor}
          value={cor}
          items={itemsCor}
          setOpen={setOpenCor}
          setValue={(callback) => {
            const value = typeof callback === "function" ? callback(cor) : callback;
            setCor(value);
          }}
          setItems={setItemsCor}
          placeholder="Selecione a cor"
          style={styles.input2}
          dropDownContainerStyle={{ borderColor: "#ccc" }}
          placeholderStyle={{ color: "#c9c9c9"}}
        />
        <TextInput value={passageiros_maximos} keyboardType="numeric" onChangeText={setPassageiros_maximos} placeholder="Capacidade" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
        <TextInput value={chassi} onChangeText={setChassi} placeholder="Chassi" placeholderTextColor="#c9c9c9ff" style={styles.input2}></TextInput>
        <TouchableOpacity style={[styles.Button, { marginTop: 50, alignItems: 'center' }]} onPress={() =>
          cadastrarVeiculo({ tipo, placa, modelo, cor, passageiros_maximos, chassi, router })}>
          <Text style={styles.buttonText}>Cadastrar Veículo</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <BotaoVoltar />
          <Text style={{ fontSize: 15 }}>Voltar</Text>
        </View>
      </View>
    </View>
  );
}