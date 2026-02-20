// Voice recording disabled to avoid native module issues with Expo Go
// Integrate expo-av / Whisper API when using development build
export const requestPermissions = async () => true;
export const startRecording = async () => ({ success: false });
export const stopRecording = async () => ({ success: false, uri: null });
export const cancelRecording = async () => {};
