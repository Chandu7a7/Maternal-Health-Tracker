// Fallback voice service that does not use native recording.
// This avoids native permission issues on some Android devices.

export const requestPermissions = async () => true;

export const startRecording = async () => ({ success: true });

export const stopRecording = async () => ({
  success: true,
  uri: null,
  mimeType: null,
});

export const cancelRecording = async () => {};
