import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>Necesitamos permiso para la cámara</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={{ color: "blue" }}>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tomarFoto = async () => {
    if (!cameraRef.current) return;

    setLoading(true);

    const foto = await cameraRef.current.takePictureAsync({
      base64: true,
      quality: 0.7,
    });

    const reducida = await ImageManipulator.manipulateAsync(
      foto.uri,
      [{ resize: { width: 800 } }],
      { base64: true }
    );

    await enviarImagen(reducida.base64!);
  };

  const enviarImagen = async (base64: string) => {
    try {
      const res = await fetch(
        "http://192.168.1.13:3001/ia/analizar-imagen",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: `data:image/jpeg;base64,${base64}`,
          }),
        }
      );

      const data = await res.json();
      setResultado(data.respuestaIA);

      Speech.speak(data.respuestaIA, { language: "es" });
    } catch (error) {
      console.log("❌ Error IA imagen:", error);
      Speech.speak("Ocurrió un error analizando la imagen", {
        language: "es",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={tomarFoto}>
          <Text style={styles.buttonText}>
            {loading ? "Analizando..." : "📸 Tomar foto"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#444" }]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>⬅ Volver</Text>
        </TouchableOpacity>

        {resultado && (
          <Text style={styles.resultado}>{resultado}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  controls: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  button: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  resultado: { color: "#fff", textAlign: "center", marginTop: 10 },
});
