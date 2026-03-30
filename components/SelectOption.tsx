import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, radius, spacing, typography } from '@/constants/design-system';

type SelectOptionProps = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

export function SelectOption({ label, description, selected, onPress }: SelectOptionProps) {
  return (
    <Pressable style={[styles.option, selected && styles.optionSelected]} onPress={onPress}>
      <View style={styles.textWrap}>
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
        {description ? <Text style={[styles.description, selected && styles.descriptionSelected]}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flex: 1,
    minWidth: '30%',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: '#101C35',
    padding: spacing.sm + 2,
  },
  optionSelected: {
    borderColor: palette.primary,
    backgroundColor: '#163A2B',
  },
  textWrap: {
    gap: 4,
  },
  label: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: '700',
  },
  labelSelected: {
    color: '#E8FFF0',
  },
  description: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  descriptionSelected: {
    color: '#B6F4C9',
  },
});
