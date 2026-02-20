import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { sendChatMessage } from '../services/chatService';

const PRIMARY = '#ec135b';
const BG_LIGHT = '#f8f6f6';

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  const scrollViewRef = useRef();

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;

    // Add user message to UI
    const newUserMsg = { id: Date.now().toString(), sender: 'user', text };
    setMessages((prev) => [...prev, newUserMsg]);

    // Clear input
    setInputText('');
    setSending(true);

    try {
      const data = await sendChatMessage(text);
      const botReply = data.reply || 'Sorry, I have no reply.';

      const newBotMsg = { id: (Date.now() + 1).toString(), sender: 'bot', text: botReply };
      setMessages((prev) => [...prev, newBotMsg]);
    } catch (err) {
      const errorReply = err.response?.data?.reply || err.response?.data?.message || 'Could not get a response. Please try again.';
      const newBotMsg = { id: (Date.now() + 1).toString(), sender: 'bot', text: errorReply };
      setMessages((prev) => [...prev, newBotMsg]);
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Maternal Health Chatbot</Text>
        <Text style={styles.subtitle}>Ask questions about your symptoms, diet, or when to see a doctor.</Text>

        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length > 0 ? (
            messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.bubble,
                  msg.sender === 'user' ? styles.userBubble : styles.botBubble
                ]}
              >
                <Text style={styles.bubbleLabel}>
                  {msg.sender === 'user' ? 'You' : 'Care Assistant'}
                </Text>
                <Text style={styles.bubbleText}>{msg.text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.placeholderText}>
              Type your question below, for example:{"\n"}
              "Mujhe chakkar aa rahe hai"{"\n"}
              "Kya baby movement kam hona normal hai?"
            </Text>
          )}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type your question..."
            placeholderTextColor="#94a3b8"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, (sending || !inputText.trim()) && styles.sendDisabled]}
            onPress={handleSend}
            disabled={sending || !inputText.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.sendText}>{sending ? '...' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  chatArea: {
    flex: 1,
    marginBottom: 12,
  },
  chatContent: {
    paddingVertical: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  bubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: '100%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#e0f2fe',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fee2e2',
  },
  bubbleLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bubbleText: {
    fontSize: 15,
    color: '#0f172a',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#0f172a',
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.6,
  },
  sendText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

