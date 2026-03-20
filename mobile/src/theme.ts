export const theme = {
    colors: {
        primary: '#1B4332',      // Dark Green
        secondary: '#FF7043',    // Promo Orange
        accent: '#2E7D32',       // Vibrant Green for buttons
        background: '#F9FAFB',   // Off-white
        surface: '#FFFFFF',      // White for cards
        text: {
            primary: '#111827',  // Black
            secondary: '#4B5563',// Gray
            muted: '#9CA3AF',    // Light Gray
        },
        border: '#E5E7EB',
        error: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
        badge: '#FF4D4D',       // Red for badges
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 10,
        md: 16,
        lg: 24,
        xl: 32,
    },
    typography: {
        h1: {
            fontSize: 24,
            fontWeight: '700' as const,
            lineHeight: 32,
        },
        h2: {
            fontSize: 20,
            fontWeight: '600' as const,
            lineHeight: 28,
        },
        body: {
            fontSize: 16,
            fontWeight: '400' as const,
            lineHeight: 24,
        },
        caption: {
            fontSize: 12,
            fontWeight: '400' as const,
            lineHeight: 16,
        },
        button: {
            fontSize: 16,
            fontWeight: '600' as const,
        }
    }
};
