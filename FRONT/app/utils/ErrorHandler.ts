import { showMessage } from 'react-native-flash-message';

export enum ErrorType {
    NETWORK = 'NETWORK',
    API = 'API',
    VALIDATION = 'VALIDATION',
    AUTH = 'AUTH',
    UNKNOWN = 'UNKNOWN'
}

export interface AppError {
    type: ErrorType;
    message: string;
    originalError?: any;
    context?: string;
    timestamp: Date;
}

export class ErrorHandler {
    private static errorMessages: Record<string, string> = {
        // Messages d'erreur réseau
        'Network request failed': 'Problème de connexion internet',
        'Request timeout': 'La requête a pris trop de temps',
        'Failed to fetch': 'Impossible de se connecter au serveur',

        // Messages d'erreur API
        'User not found': 'Utilisateur introuvable',
        'Invalid credentials': 'Identifiants incorrects',
        'Unauthorized': 'Session expirée, veuillez vous reconnecter',
        'Forbidden': 'Accès refusé',
        'Server error': 'Erreur serveur, veuillez réessayer',

        // Messages d'erreur de validation
        'Email is required': 'L\'email est requis',
        'Invalid email format': 'Format d\'email invalide',
        'Password too short': 'Le mot de passe est trop court',

        // Messages par défaut
        'default': 'Une erreur inattendue s\'est produite'
    };

    /**
     * Gère une erreur et affiche un message approprié à l'utilisateur
     */
    static handle(error: any, context?: string): AppError {
        const appError = this.createAppError(error, context);

        // Log l'erreur pour le debugging
        this.logError(appError);

        // Affiche le message à l'utilisateur
        this.showUserMessage(appError);

        return appError;
    }

    /**
     * Crée un objet AppError à partir d'une erreur
     */
    private static createAppError(error: any, context?: string): AppError {
        let type = ErrorType.UNKNOWN;
        let message = '';

        if (typeof error === 'string') {
            message = error;
            type = this.determineErrorType(error);
        } else if (error?.message) {
            message = error.message;
            type = this.determineErrorType(error.message);
        } else if (error?.response?.data?.message) {
            message = error.response.data.message;
            type = ErrorType.API;
        } else if (error?.response?.status) {
            type = ErrorType.API;
            message = this.getMessageForStatusCode(error.response.status);
        } else {
            message = 'Une erreur inattendue s\'est produite';
        }

        return {
            type,
            message,
            originalError: error,
            context,
            timestamp: new Date()
        };
    }

    /**
     * Détermine le type d'erreur basé sur le message
     */
    private static determineErrorType(message: string): ErrorType {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('network') || lowerMessage.includes('fetch') || lowerMessage.includes('timeout')) {
            return ErrorType.NETWORK;
        }

        if (lowerMessage.includes('unauthorized') || lowerMessage.includes('forbidden') || lowerMessage.includes('credentials')) {
            return ErrorType.AUTH;
        }

        if (lowerMessage.includes('validation') || lowerMessage.includes('required') || lowerMessage.includes('invalid')) {
            return ErrorType.VALIDATION;
        }

        return ErrorType.API;
    }

    /**
     * Retourne un message utilisateur basé sur le code de statut HTTP
     */
    private static getMessageForStatusCode(status: number): string {
        switch (status) {
            case 400:
                return 'Données invalides';
            case 401:
                return 'Session expirée, veuillez vous reconnecter';
            case 403:
                return 'Accès refusé';
            case 404:
                return 'Ressource introuvable';
            case 500:
                return 'Erreur serveur, veuillez réessayer';
            case 503:
                return 'Service temporairement indisponible';
            default:
                return 'Une erreur s\'est produite';
        }
    }

    /**
     * Affiche un message à l'utilisateur
     */
    private static showUserMessage(appError: AppError): void {
        const userMessage = this.getUserFriendlyMessage(appError.message);

        showMessage({
            message: this.getErrorTitle(appError.type),
            description: userMessage,
            type: 'danger',
            icon: 'danger',
            duration: 4000,
        });
    }

    /**
     * Retourne un message convivial pour l'utilisateur
     */
    private static getUserFriendlyMessage(originalMessage: string): string {
        return this.errorMessages[originalMessage] || this.errorMessages['default'];
    }

    /**
     * Retourne un titre d'erreur basé sur le type
     */
    private static getErrorTitle(type: ErrorType): string {
        switch (type) {
            case ErrorType.NETWORK:
                return 'Problème de connexion';
            case ErrorType.AUTH:
                return 'Problème d\'authentification';
            case ErrorType.VALIDATION:
                return 'Données invalides';
            case ErrorType.API:
                return 'Erreur serveur';
            default:
                return 'Erreur';
        }
    }

    /**
     * Log l'erreur pour le debugging
     */
    private static logError(appError: AppError): void {
        const logMessage = `[${appError.type}${appError.context ? ` - ${appError.context}` : ''}] ${appError.message}`;

        console.error(logMessage, {
            timestamp: appError.timestamp,
            originalError: appError.originalError
        });

        // En production, on pourrait envoyer à un service de monitoring
        // if (process.env.NODE_ENV === 'production') {
        //   Sentry.captureException(appError.originalError || new Error(appError.message));
        // }
    }

    /**
     * Gère les erreurs silencieusement (sans afficher de message à l'utilisateur)
     */
    static handleSilently(error: any, context?: string): AppError {
        const appError = this.createAppError(error, context);
        this.logError(appError);
        return appError;
    }

    /**
     * Wrapper pour les appels d'API avec gestion d'erreur automatique
     */
    static async withErrorHandling<T>(
        apiCall: () => Promise<T>,
        context?: string,
        silent = false
    ): Promise<{ data: T | null; error: AppError | null }> {
        try {
            const data = await apiCall();
            return { data, error: null };
        } catch (error) {
            const appError = silent
                ? this.handleSilently(error, context)
                : this.handle(error, context);

            return { data: null, error: appError };
        }
    }
}
