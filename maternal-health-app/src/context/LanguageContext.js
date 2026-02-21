import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../i18n/translations';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('en');

    useEffect(() => {
        const loadLang = async () => {
            try {
                const storedLang = await AsyncStorage.getItem('appLanguage');
                if (storedLang) {
                    setLang(storedLang);
                }
            } catch (error) {
                console.error('Failed to load language', error);
            }
        };
        loadLang();
    }, []);

    const changeLanguage = async (newLang) => {
        try {
            setLang(newLang);
            await AsyncStorage.setItem('appLanguage', newLang);
        } catch (error) {
            console.error('Failed to save language', error);
        }
    };

    const t = (key) => {
        return translations[lang]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
