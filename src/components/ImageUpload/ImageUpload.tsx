import { useState } from 'react';
import { View, Alert, Image, StyleSheet, Pressable, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { ImageUploadProps } from './types';
import { Ionicons } from '@expo/vector-icons';
import { useEzuiTheme } from '../../theme/ThemeContext';

export default function ImageUpload({
  value,
  onImageUpload,
  onImageRemove,
  onImageError,
}: ImageUploadProps) {
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const theme = useEzuiTheme();
  const displayUri = value !== undefined ? value : selectedUri;
  const handlePress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      const err = new Error('Photo library permission denied');
      onImageError?.(err);
      Alert.alert(
        'Permission needed',
        'Allow access to your photos to select an image.'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const uri = asset.uri;
    if (value === undefined) setSelectedUri(uri);
    const picked = {
      uri,
      fileName: asset.fileName ?? undefined,
      mimeType: asset.mimeType ?? 'image/jpeg',
    };
    onImageUpload?.(uri, picked);
  };

  const handleRemove = () => {
    const uri = displayUri;
    if (uri) {
      onImageRemove?.(uri);
      if (value === undefined) setSelectedUri(null);
    }
  };

  return (
    <View style={styles.container}>
      {displayUri ? (
        <View>
          <Image source={{ uri: displayUri }} style={styles.preview} />
          <Pressable style={styles.removeButton} onPress={handleRemove}>
            <Ionicons
              name="trash-outline"
              size={24}
              color={theme.colors.text}
            />
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={handlePress}
          style={[styles.uploadArea, { borderColor: theme.colors.border }]}
        >
          <Ionicons
            name="camera-outline"
            size={128}
            color={theme.colors.primary}
          />
          <Text style={styles.uploadAreaText}>Select photo</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  preview: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  uploadArea: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadAreaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 8,
  },
});
