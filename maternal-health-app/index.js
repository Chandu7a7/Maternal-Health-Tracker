import { registerRootComponent } from 'expo';
import { View, Text, ScrollView } from 'react-native';

const ErrorScreen = ({ error }) => (
    <ScrollView style={{ flex: 1, padding: 40, backgroundColor: 'white' }}>
        <Text style={{ color: 'red', fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
            REAL SETUP ERROR:
        </Text>
        <Text style={{ color: 'black', fontSize: 16 }}>
            {error ? (error.message || String(error)) : "Unknown Error"}
        </Text>
        <Text style={{ marginTop: 20, fontSize: 12, color: 'gray' }}>
            {error && error.stack ? error.stack : ""}
        </Text>
    </ScrollView>
);

try {
    const App = require('./src/App').default;
    registerRootComponent(App);
} catch (e) {
    console.error("💥 CAUGHT REAL ERROR:", e);
    console.error("STACK:", e.stack);
    registerRootComponent(() => <ErrorScreen error={e} />);
}
