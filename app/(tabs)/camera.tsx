import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { Card } from '@/components/ui/card';
import { FadeInView } from '@/components/ui/fade-in-view';
import { LoadingDots } from '@/components/ui/loading-dots';
import { palette, spacing, typography } from '@/constants/design-system';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  if (!permission?.granted) {
    return (
      <FadeInView style={styles.permissionContainer}>
        <View style={styles.permissionContainer}>
          <Card style={styles.permissionCard}>
            <Text style={styles.permissionTitle}>Permiso de cámara</Text>
            <Text style={styles.permissionBody}>Necesitamos acceso para analizar tu comida desde una foto.</Text>
            <AppButton title="Dar permiso" onPress={requestPermission} />
          </Card>
        </View>
      </FadeInView>
    );
  }

  const tomarFoto = async () => {
    if (!cameraRef.current) return;
    setLoading(true);

    const foto = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.7 });
    const reducida = await ImageManipulator.manipulateAsync(
      foto.uri,
      [{ resize: { width: 800 } }],
      { base64: true }
    );

    try {
      const res = await fetch('http://192.168.1.13:3001/ia/analizar-imagen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: `data:image/jpeg;base64,${reducida.base64}` }),
      });

      const data = await res.json();
      setResultado(data.respuestaIA);
      Speech.speak(data.respuestaIA, { language: 'es' });
    } catch (error) {
      console.log('❌ Error IA imagen:', error);
      Speech.speak('Ocurrió un error analizando la imagen', { language: 'es' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeInView style={styles.container}>
      <View style={styles.container}>
        <CameraView ref={cameraRef} style={styles.camera} />

        <View style={styles.overlay}>
          <Card>
            <Text style={styles.overlayTitle}>Análisis por foto</Text>
            <Text style={styles.overlayBody}>Toma una imagen nítida del plato para estimar calorías y macros.</Text>
            {loading && <LoadingDots />}
            <AppButton title="Tomar foto" onPress={tomarFoto} loading={loading} />
            <AppButton title="Volver" variant="ghost" onPress={() => router.back()} />
            {resultado && <Text style={styles.result}>{resultado}</Text>}
          </Card>
        </View>
      </View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
  overlayTitle: { ...typography.subtitle },
  overlayBody: { ...typography.body },
  result: { ...typography.body, color: palette.textPrimary, fontWeight: '600' },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: palette.background,
  },
  permissionCard: { gap: spacing.md },
  permissionTitle: { ...typography.subtitle },
  permissionBody: { ...typography.body },
});
