import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type ReminderType = 'breakfast' | 'lunch' | 'dinner' | 'hydration';

type NotificationModule = {
  AndroidImportance: { HIGH: number };
  SchedulableTriggerInputTypes: { DAILY: string };
  setNotificationHandler: (handler: unknown) => void;
  setNotificationChannelAsync: (id: string, channel: Record<string, unknown>) => Promise<void>;
  getPermissionsAsync: () => Promise<{ status: string }>;
  requestPermissionsAsync: () => Promise<{ status: string }>;
  cancelScheduledNotificationAsync: (id: string) => Promise<void>;
  scheduleNotificationAsync: (input: Record<string, unknown>) => Promise<string>;
};

let notificationsModule: NotificationModule | null | undefined;

function getNotificationsModule() {
  if (notificationsModule !== undefined) {
    return notificationsModule;
  }

  try {
    notificationsModule = require('expo-notifications') as NotificationModule;
  } catch {
    notificationsModule = null;
  }

  return notificationsModule;
}

const SETTINGS_KEY = '@calorie_app_reminder_settings';

const reminderConfig: Record<
  ReminderType,
  {
    label: string;
    schedules: Array<{ hour: number; minute: number }>;
    title: string;
    body: string;
  }
> = {
  breakfast: {
    label: 'Recordatorio de desayuno',
    schedules: [{ hour: 8, minute: 0 }],
    title: 'Hora del desayuno 🍳',
    body: 'Empieza tu día con energía y registra tu desayuno.',
  },
  lunch: {
    label: 'Recordatorio de almuerzo',
    schedules: [{ hour: 13, minute: 0 }],
    title: 'Hora del almuerzo 🥗',
    body: 'No olvides tu almuerzo y guarda tus calorías.',
  },
  dinner: {
    label: 'Recordatorio de cena',
    schedules: [{ hour: 20, minute: 0 }],
    title: 'Hora de la cena 🍽️',
    body: 'Cierra el día con una cena balanceada.',
  },
  hydration: {
    label: 'Recordatorio de hidratación',
    schedules: [
      { hour: 10, minute: 0 },
      { hour: 12, minute: 0 },
      { hour: 14, minute: 0 },
      { hour: 16, minute: 0 },
      { hour: 18, minute: 0 },
    ],
    title: 'Momento de hidratarte 💧',
    body: 'Toma un vaso de agua para mantenerte hidratado.',
  },
};

export const reminderTypes = Object.keys(reminderConfig) as ReminderType[];

export const getReminderLabel = (type: ReminderType) => reminderConfig[type].label;

function setupNotificationHandler() {
  const Notifications = getNotificationsModule();

  if (!Notifications) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

setupNotificationHandler();

export async function configureNotificationChannel() {
  const Notifications = getNotificationsModule();

  if (!Notifications) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Recordatorios',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4ADE80',
    });
  }
}

export async function ensureReminderPermission() {
  const Notifications = getNotificationsModule();

  if (!Notifications) {
    return false;
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;

  const permission = await Notifications.requestPermissionsAsync();
  return permission.status === 'granted';
}

type ReminderSettings = Record<ReminderType, string[]>;

const defaultSettings = (): ReminderSettings => ({
  breakfast: [],
  lunch: [],
  dinner: [],
  hydration: [],
});

export async function getReminderSettings(): Promise<ReminderSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings();

  const parsed = JSON.parse(raw) as Partial<ReminderSettings>;
  return {
    breakfast: parsed.breakfast ?? [],
    lunch: parsed.lunch ?? [],
    dinner: parsed.dinner ?? [],
    hydration: parsed.hydration ?? [],
  };
}

async function saveReminderSettings(settings: ReminderSettings) {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function updateReminder(type: ReminderType, enabled: boolean) {
  const current = await getReminderSettings();
  const Notifications = getNotificationsModule();

  if (!enabled || !Notifications) {
    if (Notifications) {
      await Promise.all(current[type].map(id => Notifications.cancelScheduledNotificationAsync(id)));
    }
    current[type] = [];
    await saveReminderSettings(current);
    return;
  }

  await configureNotificationChannel();

  const config = reminderConfig[type];
  const ids = await Promise.all(
    config.schedules.map(({ hour, minute }) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.body,
          sound: 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
          channelId: 'reminders',
        },
      })
    )
  );

  current[type] = ids;
  await saveReminderSettings(current);
}

export function isReminderEnabled(ids: string[]) {
  return ids.length > 0;
}
