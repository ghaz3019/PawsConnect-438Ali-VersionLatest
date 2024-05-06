import React, { useState, useEffect } from 'react';
import {
    Form,
    TextArea,
    Button,
    Icon
} from 'semantic-ui-react';
import axios from 'axios';

export default function Translate() {
    const [inputText, setInputText] = useState('');
    const [resultText, setResultText] = useState('');
    const [selectedLanguageKey, setLanguageKey] = useState('');
    const [languagesList, setLanguagesList] = useState([]);
    const [detectLanguageKey, setDetectedLanguageKey] = useState('');

    const getLanguageSource = () => {
        axios.post(`https://libretranslate.de/detect`, {
            q: inputText
        })
            .then((response) => {
                setDetectedLanguageKey(response.data[0].language);
            })
            .catch(error => {
                console.error('Error detecting language:', error);
            });
    };

    const translateText = () => {
        setResultText(inputText);
        getLanguageSource(); // Trigger language detection

        // Wait for language detection to finish before translating
        setTimeout(() => {
            const data = {
                q: inputText,
                source: detectLanguageKey,
                target: selectedLanguageKey
            };
            axios.post(`https://libretranslate.de/translate`, data)
                .then((response) => {
                    setResultText(response.data.translatedText);
                })
                .catch(error => {
                    console.error('Error translating text:', error);
                });
        }, 1000); // Adjust this timeout as needed
    };

    const languageKey = (selectedLanguage) => {
        setLanguageKey(selectedLanguage.target.value);
    };

    useEffect(() => {
        axios.get(`https://libretranslate.de/languages`)
            .then((response) => {
                setLanguagesList(response.data);
            })
            .catch(error => {
                console.error('Error fetching languages:', error);
            });

        getLanguageSource();
    }, [inputText]);

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-center text-3xl font-bold mb-8">API TRANSLATION</h2>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <Form>
                        <Form.Field>
                            <label htmlFor="inputText" className="block text-gray-700 font-bold mb-2">Type Text to Translate</label>
                            <TextArea
                                id="inputText"
                                placeholder='Type Text to Translate..'
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="w-full border rounded p-2"
                            />
                        </Form.Field>

                        <Form.Field>
                            <label htmlFor="languageSelect" className="block text-gray-700 font-bold mb-2">Select Language</label>
                            <select
                                id="languageSelect"
                                className="w-full border rounded p-2"
                                onChange={languageKey}
                            >
                                <option>Please Select Language..</option>
                                {languagesList.map((language, index) => (
                                    <option key={index} value={language.code}>
                                        {language.name}
                                    </option>
                                ))}
                            </select>
                        </Form.Field>

                        <Form.Field>
                            <label htmlFor="resultText" className="block text-gray-700 font-bold mb-2">Result Translation</label>
                            <TextArea
                                id="resultText"
                                placeholder='Your Result Translation..'
                                value={resultText}
                                className="w-full border rounded p-2"
                                readOnly
                            />
                        </Form.Field>

                        <Button
                            color="orange"
                            size="large"
                            onClick={translateText}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                            Translate
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}
