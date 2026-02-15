import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  grams: number;
  percent: number;
  color: string;
};

export default function MacroBar({ label, grams, percent, color }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.grams}>{grams} g</Text>
      </View>

      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            {
              width: `${percent}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#e5e7eb',
    fontWeight: 'bold',
  },
  grams: {
    color: '#c7d2fe',
  },
  barBackground: {
    height: 12,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
});
