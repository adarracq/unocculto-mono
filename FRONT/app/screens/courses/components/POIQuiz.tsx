import BodyText from '@/app/components/atoms/BodyText';
import Button from '@/app/components/atoms/Button';
import SmallText from '@/app/components/atoms/SmallText';
import Title0 from '@/app/components/atoms/Title0';
import Title2 from '@/app/components/atoms/Title2';
import Colors from '@/app/constants/Colors';
import { UserContext } from '@/app/contexts/UserContext';
import { useApi } from '@/app/hooks/useApi';
import { userService } from '@/app/services/user.service';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// Types
type Answer = { text: string; isCorrect: boolean };
type Question = { question: string; answers: Answer[]; explanation: string };
type Props = {
    quizData: Question[];
    onQuizComplete: (nbGoodAnswers: number) => void; // Fonction déclenchée au clic sur le bouton final
};

export default function POIQuiz({ quizData, onQuizComplete }: Props) {
    // État pour suivre le nombre de questions répondues
    const [answeredCount, setAnsweredCount] = useState(0);
    const [goodAnsweredCount, setGoodAnsweredCount] = useState(0);
    const [userContext, setUserContext] = useContext(UserContext);

    const { execute: loseLife } = useApi(
        () => userService.loseLife(),
        'POICourseScreen - loseLife'
    );


    const handleQuestionAnswered = (isCorrect: boolean) => {
        // On incrémente le compteur de réponses
        setAnsweredCount(prev => prev + 1);
        if (isCorrect) {
            setGoodAnsweredCount(prev => prev + 1);
        } else {
            // Perdre une vie si la réponse est incorrecte
            loseLife();
            // Mettre à jour le contexte utilisateur localement
            if (userContext) {
                setUserContext({
                    ...userContext,
                    lifes: userContext.lifes > 0 ? userContext.lifes - 1 : 0
                });
            }
        }
    };

    // Est-ce que toutes les questions sont répondues ?
    const isQuizFinished = answeredCount === quizData.length;

    return (
        <View style={styles.container}>
            <Title0 title="Quiz Rapide" style={{ marginBottom: 20, color: Colors.main }} isLeft />

            {quizData.map((q, index) => (
                <QuizCard
                    key={index}
                    question={q}
                    index={index}
                    onAnswer={handleQuestionAnswered} // On passe la fonction au fils
                />
            ))}

            {/* BOUTON SUIVANT - S'affiche uniquement à la fin */}
            {isQuizFinished && (
                <Button
                    title="Continuer"
                    onPress={() => onQuizComplete(goodAnsweredCount)}
                    backgroundColor={Colors.main}
                    textColor={Colors.white}
                />
            )}
        </View>
    );
}

// --- SOUS-COMPOSANT CARD ---

function QuizCard({ question, index, onAnswer }: { question: Question, index: number, onAnswer: (isCorrect: boolean) => void }) {
    const [selected, setSelected] = useState<number | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    const handlePress = (idx: number) => {
        if (isRevealed) return; // Empêche de répondre deux fois

        const isCorrect = question.answers[idx].isCorrect;

        setSelected(idx);
        setIsRevealed(true);

        // On prévient le parent que cette question est traitée
        onAnswer(isCorrect);
    };

    return (
        <View style={styles.card}>
            <Title2 title={`${index + 1}. ${question.question}`} style={{ marginBottom: 15 }} isLeft />

            <View style={styles.answersContainer}>
                {question.answers.map((ans, idx) => {
                    let backgroundColor = '#333';
                    if (isRevealed) {
                        if (ans.isCorrect) backgroundColor = Colors.green;
                        else if (selected === idx) backgroundColor = Colors.red;
                    }

                    return (
                        <TouchableOpacity
                            key={idx}
                            style={[styles.answerBtn, { backgroundColor }]}
                            onPress={() => handlePress(idx)}
                            disabled={isRevealed}
                        >
                            <BodyText text={ans.text} style={styles.answerText} />
                        </TouchableOpacity>
                    );
                })}
            </View>

            {isRevealed && (
                <View style={styles.explanationBox}>
                    <BodyText text="💡 Le saviez-vous ?" style={{ color: Colors.main, marginBottom: 5 }} />
                    <SmallText text={question.explanation} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 30, paddingBottom: 50 },
    card: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderCurve: 'continuous', padding: 15, marginBottom: 20 },
    answersContainer: { gap: 10 },
    answerBtn: { padding: 12, borderRadius: 8, borderCurve: 'continuous', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    answerText: { color: 'white', fontSize: 16 },
    explanationBox: {
        marginTop: 15,
        padding: 10,
        backgroundColor: 'rgba(0, 200, 255, 0.1)',
        borderRadius: 8,
        borderCurve: 'continuous',
        borderLeftWidth: 3,
        borderLeftColor: Colors.main
    },
});