import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';

type Props = StackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');

    const handleReset = () => {
        if (!email) {
            Alert.alert('Erreur', 'Veuillez entrer votre adresse email');
            return;
        }
        Alert.alert('Succès', 'Un lien de réinitialisation a été envoyé à votre adresse email.', [
            { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mot de passe oublié</Text>
            <Text style={styles.description}>
                Entrez votre adresse email ci-dessous. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Adresse Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <TouchableOpacity style={styles.button} onPress={handleReset}>
                <Text style={styles.buttonText}>Envoyer le lien</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
                <Text style={styles.link}>Retour à la connexion</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' },
    description: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
    button: { backgroundColor: '#2e64e5', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    linkContainer: { marginTop: 20, alignItems: 'center' },
    link: { color: '#2e64e5', fontSize: 16 },
});
