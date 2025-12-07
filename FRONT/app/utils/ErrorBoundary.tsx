import React, { Component, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import BodyText from '../components/atoms/BodyText';
import Button from '../components/atoms/Button';
import Title0 from '../components/atoms/Title0';
import Colors from '../constants/Colors';
import { ErrorHandler } from '../utils/ErrorHandler';

interface Props {
    children: ReactNode;
    fallback?: (error: Error, retry: () => void) => ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Composant Error Boundary pour capturer les erreurs React non gérées
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log l'erreur avec notre système centralisé
        ErrorHandler.handleSilently(error, `ErrorBoundary - ${errorInfo.componentStack}`);
    }

    retry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            // Si un fallback personnalisé est fourni, l'utiliser
            if (this.props.fallback && this.state.error) {
                return this.props.fallback(this.state.error, this.retry);
            }

            // Fallback par défaut
            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Title0 title="Oups ! Une erreur s'est produite" />
                        <BodyText
                            text="Nous nous excusons pour ce désagrément. L'équipe technique a été informée du problème."
                            color={Colors.darkGrey}
                            centered
                            style={styles.description}
                        />
                        <Button
                            title="Réessayer"
                            backgroundColor={Colors.main}
                            textColor={Colors.white}
                            onPress={this.retry}
                            style={styles.retryButton}
                        />
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        maxWidth: 300,
    },
    description: {
        marginVertical: 20,
        lineHeight: 22,
    },
    retryButton: {
        marginTop: 10,
        paddingHorizontal: 40,
    },
});

/**
 * Hook pour déclencher une re-render en cas d'erreur
 */
export const useErrorHandler = () => {
    const [, setError] = React.useState();

    return React.useCallback((error: Error) => {
        setError(() => {
            throw error;
        });
    }, []);
};
